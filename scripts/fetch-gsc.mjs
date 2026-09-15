#!/usr/bin/env node
/*
 * fetch-gsc.mjs — snapshot Search Console into the repo.
 *
 * WHY
 * Search Console is the one rich, historical, per-page dataset the site already has, and
 * it is only reachable by logging in and clicking around. Committing snapshots makes it
 * queryable by anything — a script, a scheduled job, or a person reading a diff — and
 * gives the site a memory of its own performance that survives the 16-month window
 * Google keeps.
 *
 * NO DEPENDENCIES
 * This repo has no devDependencies and keeps it that way. The service-account JWT is
 * signed with node:crypto, and the API is plain fetch. Node 22+.
 *
 * AUTH — see docs/DATA-PIPELINE.md for the one-time setup
 *   GSC_SERVICE_ACCOUNT_JSON   the whole service-account key file, as a string
 *   GSC_SITE_URL               optional; defaults to the domain property
 *
 * The service account must be added as a user on the property in Search Console.
 * Creating the key is not enough and fails with 403 — which this script reports by
 * listing the properties the account *can* see, since that is invariably the answer.
 *
 * RUN
 *   GSC_SERVICE_ACCOUNT_JSON="$(cat key.json)" node scripts/fetch-gsc.mjs
 *   node scripts/fetch-gsc.mjs --days 90 --out data/gsc
 *   node scripts/fetch-gsc.mjs --series --days 480    (daily time series, see below)
 *
 * SERIES MODE
 * The default snapshot aggregates the whole window, so it can say what ranked but not
 * *when*. `--series` writes a second file keyed by day — site totals, per-page and the
 * brand queries — over as much history as Google still holds (16 months). It answers
 * "when did that happen": a brand-search lift, a page falling out of the index, the
 * weeks a campaign was running. The regular snapshot cannot, however many are kept,
 * because each one covers a window rather than a day.
 */

import { createSign } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const API = 'https://searchconsole.googleapis.com/webmasters/v3';

/*
 * Search Console finalises data on a lag — typically two days, occasionally three. Ending
 * the window at today would append a partial day that looks like a cliff in every chart
 * built on these files, and the cliff would move each run.
 */
const LAG_DAYS = 3;

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};

const DAYS = Number(arg('days', '28'));
const SERIES = process.argv.includes('--series');
const OUT_DIR = arg('out', 'data/gsc');
const SITE_URL = process.env.GSC_SITE_URL || 'sc-domain:riverrecords.ai';

const iso = (d) => d.toISOString().slice(0, 10);
const daysAgo = (n) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d;
};

function die(message, detail) {
  console.error(`\n${message}`);
  if (detail) console.error(detail);
  process.exit(1);
}

/* ---------------------------------------------------------------- auth */

function buildJwt(sa) {
  const now = Math.floor(Date.now() / 1000);
  const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const unsigned =
    b64({ alg: 'RS256', typ: 'JWT' }) +
    '.' +
    b64({
      iss: sa.client_email,
      scope: SCOPE,
      aud: TOKEN_URL,
      exp: now + 3600,
      iat: now,
    });
  const signature = createSign('RSA-SHA256').update(unsigned).sign(sa.private_key, 'base64url');
  return `${unsigned}.${signature}`;
}

async function accessToken(sa) {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: buildJwt(sa),
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    die(
      `Could not exchange the service-account key for a token (HTTP ${res.status}).`,
      JSON.stringify(body, null, 2),
    );
  }
  return body.access_token;
}

/* ---------------------------------------------------------------- api */

async function listSites(token) {
  const res = await fetch(`${API}/sites`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return [];
  const body = await res.json().catch(() => ({}));
  return (body.siteEntry || []).map((s) => `${s.siteUrl}  (${s.permissionLevel})`);
}

/**
 * One searchAnalytics query, paged to completion. The API caps a response at 25k rows,
 * so anything beyond that needs startRow — worth doing properly, because page+query is
 * the dimension pair that actually exceeds it and it is also the most useful one.
 */
async function query(token, { startDate, endDate, dimensions, limit, filters }) {
  const rows = [];
  const PAGE = 25000;

  while (rows.length < limit) {
    const res = await fetch(
      `${API}/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate,
          endDate,
          dimensions,
          ...(filters ? { dimensionFilterGroups: [{ filters }] } : {}),
          rowLimit: Math.min(PAGE, limit - rows.length),
          startRow: rows.length,
          dataState: 'final',
        }),
      },
    );

    if (res.status === 403) {
      const sites = await listSites(token);
      die(
        `403 for ${SITE_URL}.\n\nThe service account exists but is not a user on that property.` +
          `\nAdd it in Search Console: Settings -> Users and permissions -> Add user.`,
        sites.length
          ? `\nProperties it can currently see:\n  ${sites.join('\n  ')}`
          : '\nIt currently has access to no properties at all.',
      );
    }
    if (!res.ok) {
      die(
        `searchAnalytics failed for dimensions [${dimensions}] (HTTP ${res.status}).`,
        await res.text(),
      );
    }

    const body = await res.json();
    const batch = body.rows || [];
    rows.push(...batch);
    if (batch.length < PAGE) break; // last page
  }

  return rows.map((r) => {
    const out = {
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: Number(r.ctr.toFixed(4)),
      position: Number(r.position.toFixed(2)),
    };
    dimensions.forEach((dim, i) => {
      out[dim] = r.keys[i];
    });
    return out;
  });
}

/* ---------------------------------------------------------------- main */

const raw = process.env.GSC_SERVICE_ACCOUNT_JSON;
if (!raw) {
  die(
    'GSC_SERVICE_ACCOUNT_JSON is not set.',
    'Set it to the contents of the service-account key file. See docs/DATA-PIPELINE.md.',
  );
}

let sa;
try {
  sa = JSON.parse(raw);
} catch {
  die('GSC_SERVICE_ACCOUNT_JSON is not valid JSON.', 'Pass the whole key file, not a path to it.');
}
if (!sa.client_email || !sa.private_key) {
  die('That JSON is missing client_email or private_key.', 'It should be a service-account key.');
}

const endDate = iso(daysAgo(LAG_DAYS));
const startDate = iso(daysAgo(LAG_DAYS + DAYS - 1));

console.log(`Search Console: ${SITE_URL}`);
console.log(`Window: ${startDate} to ${endDate} (${DAYS} days, ending ${LAG_DAYS} days back)\n`);

const token = await accessToken(sa);

if (SERIES) {
  // Daily rows. Brand is any query containing the company name — the lift a campaign
  // produces shows up here first, because people who saw an ad search the name later.
  const daily = await query(token, { startDate, endDate, dimensions: ['date'], limit: 5000 });
  console.log(`  days         ${daily.length}`);
  const brand = await query(token, {
    startDate,
    endDate,
    dimensions: ['date'],
    limit: 5000,
    filters: [{ dimension: 'query', operator: 'contains', expression: 'river records' }],
  });
  console.log(`  brand days   ${brand.length}`);
  const datePages = await query(token, {
    startDate,
    endDate,
    dimensions: ['date', 'page'],
    limit: 100000,
  });
  console.log(`  date+page    ${datePages.length}`);

  const series = {
    site: SITE_URL,
    startDate,
    endDate,
    days: DAYS,
    fetchedAt: new Date().toISOString(),
    daily,
    brand,
    datePages,
  };
  await mkdir(OUT_DIR, { recursive: true });
  const out = join(OUT_DIR, `series-${endDate}-${DAYS}d.json`);
  await writeFile(out, JSON.stringify(series, null, 2) + '\n');
  console.log(`\n  wrote ${out}`);
  process.exit(0);
}

// Sequential rather than parallel: Search Console rate-limits per property, and three
// requests finishing a second later is not worth a 429 that fails the whole run.
const pages = await query(token, { startDate, endDate, dimensions: ['page'], limit: 5000 });
console.log(`  pages        ${pages.length}`);
const queries = await query(token, { startDate, endDate, dimensions: ['query'], limit: 5000 });
console.log(`  queries      ${queries.length}`);
const pageQueries = await query(token, {
  startDate,
  endDate,
  dimensions: ['page', 'query'],
  limit: 20000,
});
console.log(`  page+query   ${pageQueries.length}`);

const totals = pages.reduce(
  (acc, r) => ({ clicks: acc.clicks + r.clicks, impressions: acc.impressions + r.impressions }),
  { clicks: 0, impressions: 0 },
);

const snapshot = {
  site: SITE_URL,
  startDate,
  endDate,
  days: DAYS,
  // Stamped after collection rather than used in any query, so a re-run over the same
  // window produces the same numbers regardless of when it happens.
  fetchedAt: new Date().toISOString(),
  totals,
  pages,
  queries,
  pageQueries,
};

await mkdir(OUT_DIR, { recursive: true });

/*
 * The window length is part of the filename, and that is not cosmetic. Keying only on
 * endDate means a 365-day pull silently overwrites the 28-day snapshot taken the same
 * day — which happened on 2026-09-14 and destroyed the baseline the first data-driven
 * page was meant to be judged against. Different windows are different measurements and
 * must not collide.
 *
 * `latest-<days>d.json` is a stable pointer per window, so a weekly 28-day comparison
 * cannot accidentally end up reading a one-off annual pull.
 */
const dated = join(OUT_DIR, `${endDate}-${DAYS}d.json`);
const latest = join(OUT_DIR, `latest-${DAYS}d.json`);
const body = JSON.stringify(snapshot, null, 2) + '\n';
await writeFile(dated, body);
await writeFile(latest, body);

console.log(`\n  ${totals.clicks} clicks, ${totals.impressions} impressions`);
console.log(`  wrote ${dated}`);
console.log(`  wrote ${latest}`);
