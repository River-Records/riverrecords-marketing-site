#!/usr/bin/env node
/*
 * weekly-signal.mjs — the Monday read, computed rather than remembered.
 *
 * WHY THIS EXISTS
 * The snapshots in data/gsc/ have been collected automatically since September 2026, and
 * reading them correctly turned out to depend on half a dozen corrections that are not
 * obvious and that I got wrong first. Those live in docs/READING-THE-SIGNAL.md. This
 * script applies them so the numbers in the weekly report are right without anyone having
 * to remember why.
 *
 * It reports. It does not recommend. At this traffic level a tool that proposed content
 * changes every week would mostly generate noise, and the interesting question — WHY a
 * number moved — needs a person or an LLM looking at context this script does not have.
 * The workflow hands that part to @claude.
 *
 * No dependencies. Reads committed JSON only.
 *   node scripts/weekly-signal.mjs            # human-readable
 *   node scripts/weekly-signal.mjs --markdown # for the issue body
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = process.env.GSC_DIR || 'data/gsc';
const MD = process.argv.includes('--markdown');

/* ---- the corrections, in one place. See docs/READING-THE-SIGNAL.md for why each. ---- */

/** Our own name, our people, and phrases only we use. */
const OURS = /river ?records|riverrecords|riverstream|\bstream\b|kantrowitz|steinkamp|chart lore|pippin|smyrniotis|abhinav|derrick chu/i;
/** A DIFFERENT product called RecordsAI. These impressions are not ours to win. */
const WRONG_BRAND = /records ?ai|recordsai|stream record|stream medical/i;

const isWrongBrand = (q) => WRONG_BRAND.test(q);
const isBrand = (q) => OURS.test(q) && !isWrongBrand(q);
const isNonBrand = (q) => !OURS.test(q) && !isWrongBrand(q);

const norm = (u) =>
  u.replace(/^https:\/\/www\.riverrecords\.ai/, '')
   .replace(/^https:\/\/stream\.riverrecords\.ai/, '[APP]')
   .replace(/\/+$/, '') || '/';

/** Slash and no-slash were indexed separately for months; merge or every page looks halved. */
function mergePages(pages) {
  const m = new Map();
  for (const p of pages) {
    const k = norm(p.page);
    const e = m.get(k) || { page: k, clicks: 0, impressions: 0, w: 0 };
    e.clicks += p.clicks;
    e.impressions += p.impressions;
    e.w += p.position * p.impressions;
    m.set(k, e);
  }
  return new Map([...m].map(([k, e]) => [k, { ...e, position: e.impressions ? e.w / e.impressions : 0 }]));
}

const sum = (rows, f) => rows.reduce((s, r) => s + f(r), 0);
const pct = (c, i) => (i ? (100 * c) / i : 0);

/* ----------------------------------------------------------------- load */

const files = readdirSync(DIR).filter((f) => /^\d{4}-\d{2}-\d{2}-28d\.json$/.test(f)).sort();
if (files.length < 2) {
  console.error(`Need at least two 28-day snapshots in ${DIR}; found ${files.length}.`);
  process.exit(1);
}
const snaps = files.map((f) => JSON.parse(readFileSync(join(DIR, f), 'utf8')));
const latest = snaps.at(-1);
const prev = snaps.at(-2);

const out = [];
const say = (s = '') => out.push(s);
const h = (s) => say(MD ? `\n## ${s}\n` : `\n=== ${s} ===`);
const table = (rows) => {
  if (!MD) return rows.forEach((r) => say('  ' + r.join('  ')));
  say('| ' + rows[0].join(' | ') + ' |');
  say('|' + rows[0].map(() => '---').join('|') + '|');
  rows.slice(1).forEach((r) => say('| ' + r.join(' | ') + ' |'));
};

/* ------------------------------------------------------------- headline */

say(MD ? `**Window:** ${latest.startDate} → ${latest.endDate} · ${snaps.length} snapshots on file` : `Window ${latest.startDate} → ${latest.endDate}`);

h('Totals');
{
  const rows = [['window', 'clicks', 'impressions', 'CTR']];
  snaps.slice(-6).forEach((d) =>
    rows.push([d.endDate, String(d.totals.clicks), String(d.totals.impressions), pct(d.totals.clicks, d.totals.impressions).toFixed(2) + '%']));
  table(rows);
}

/* --------------------------------------------- the three traffic streams */

h('Brand, wrong-brand, non-brand');
say(MD ? '_Mixing these hides everything. "Wrong brand" is RecordsAI, a different product._' : '  (wrong-brand = RecordsAI, a different product)');
{
  const rows = [['window', 'our brand', 'wrong brand', 'non-brand', 'non-brand named clicks']];
  snaps.slice(-6).forEach((d) => {
    const q = d.queries;
    rows.push([
      d.endDate,
      String(sum(q.filter((x) => isBrand(x.query)), (x) => x.impressions)),
      String(sum(q.filter((x) => isWrongBrand(x.query)), (x) => x.impressions)),
      String(sum(q.filter((x) => isNonBrand(x.query)), (x) => x.impressions)),
      String(sum(q.filter((x) => isNonBrand(x.query)), (x) => x.clicks)),
    ]);
  });
  table(rows);
  const named = sum(latest.queries, (q) => q.clicks);
  say('');
  say(`Named queries account for ${named} of ${latest.totals.clicks} clicks — the rest are anonymised by Google and cannot be classified either way.`);
}

/* ------------------------------------------------------- zero-click top */

h('Ranked at the top, earning nothing');
say(MD ? '_Non-brand queries at position ≤2 with zero clicks. Growth here means answers are being read in place of the click._' : '  non-brand, position <=2, zero clicks');
{
  const rows = [['window', 'queries', 'impressions']];
  snaps.slice(-6).forEach((d) => {
    const r = d.queries.filter((q) => isNonBrand(q.query) && q.position <= 2 && q.clicks === 0);
    rows.push([d.endDate, String(r.length), String(sum(r, (x) => x.impressions))]);
  });
  table(rows);
}

/* ------------------------------------------------------------ movements */

const A = mergePages(prev.pages);
const B = mergePages(latest.pages);

h('Pages that moved');
{
  const rows = [['page', 'impressions', 'clicks', 'position']];
  const moved = [...B.values()]
    .filter((p) => p.impressions >= 40 && !p.page.startsWith('[APP]'))
    .map((p) => ({ ...p, was: A.get(p.page) }))
    .filter((p) => !p.was || Math.abs(p.impressions - p.was.impressions) >= 25 || Math.abs(p.clicks - (p.was?.clicks ?? 0)) >= 2)
    .sort((x, y) => (y.impressions - (y.was?.impressions ?? 0)) - (x.impressions - (x.was?.impressions ?? 0)));
  if (!moved.length) rows.push(['_nothing moved materially_', '', '', '']);
  moved.slice(0, 12).forEach((p) =>
    rows.push([
      p.page.slice(0, 44),
      p.was ? `${p.was.impressions} → ${p.impressions}` : `new: ${p.impressions}`,
      p.was ? `${p.was.clicks} → ${p.clicks}` : String(p.clicks),
      p.was ? `${p.was.position.toFixed(0)} → ${p.position.toFixed(0)}` : p.position.toFixed(0),
    ]));
  table(rows);
}

/* ---------------------------------------------------------- regressions */

h('Regressions');
say(MD ? '_Pages that lost half their impressions, or lost clicks while impressions held. Worth a look before anything else._' : '');
{
  const bad = [...A.values()]
    .filter((p) => p.impressions >= 50 && !p.page.startsWith('[APP]'))
    .map((p) => ({ ...p, now: B.get(p.page) }))
    .filter((p) => !p.now || p.now.impressions < p.impressions * 0.5 || (p.clicks >= 2 && (p.now?.clicks ?? 0) === 0));
  if (!bad.length) say(MD ? '_None._' : '  none');
  else bad.forEach((p) => say((MD ? '- ' : '  ') + `${p.page} — ${p.impressions}i ${p.clicks}c → ${p.now ? `${p.now.impressions}i ${p.now.clicks}c` : 'absent'}`));
}

/* ------------------------------------------------------ what to look at */

h('Non-brand queries worth a human eye');
say(MD ? '_Position 3–15 with real volume and no clicks. Not automatically a problem — check it is not a sitelink or an exam-prep query before acting._' : '');
{
  const rows = [['impressions', 'position', 'query']];
  const cands = latest.queries
    .filter((q) => isNonBrand(q.query) && q.position >= 3 && q.position <= 15 && q.impressions >= 15 && q.clicks === 0)
    .sort((x, y) => y.impressions - x.impressions)
    .slice(0, 10);
  if (!cands.length) rows.push(['_none_', '', '']);
  cands.forEach((q) => rows.push([String(q.impressions), q.position.toFixed(1), q.query.slice(0, 52)]));
  table(rows);
}

say('');
say(MD ? '---\n_Generated by `scripts/weekly-signal.mjs`. The corrections it applies are explained in [docs/READING-THE-SIGNAL.md](../blob/main/docs/READING-THE-SIGNAL.md)._' : 'See docs/READING-THE-SIGNAL.md for why these corrections are applied.');

console.log(out.join('\n'));
