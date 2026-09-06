// 01-fetch.mjs — resolve the current CMS releases and download them into data/.
//
//   node gtm/target-list/01-fetch.mjs            download everything it can
//   node gtm/target-list/01-fetch.mjs --print    just print the URLs it resolved
//
// Dataset *identity* is stable but the download URL is not: CMS republishes these files
// annually behind a new content-hashed path, so the URLs are resolved from the catalog
// APIs each run rather than pinned. If the catalog is unreachable — an egress policy, an
// outage — this exits non-zero and prints the landing pages, because a half-downloaded
// data directory that silently builds a stale list is the worse failure.

import { mkdirSync, createWriteStream, existsSync, statSync } from 'node:fs';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { SOURCES, DATA_DIR } from './config/sources.mjs';

// Node's built-in fetch ignores HTTPS_PROXY unless this is set at startup, so re-exec once
// rather than time out mysteriously behind a corporate proxy.
if ((process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
  const r = spawnSync(process.execPath, process.argv.slice(1), {
    stdio: 'inherit', env: { ...process.env, NODE_USE_ENV_PROXY: '1' },
  });
  process.exit(r.status ?? 1);
}

const printOnly = process.argv.includes('--print');
mkdirSync(DATA_DIR, { recursive: true });

const getJson = async (url) => {
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} from ${url}`);
  return res.json();
};

// The Provider Data Catalog exposes one dataset id with a single current distribution.
async function resolveProviderData(src) {
  const meta = await getJson(`https://data.cms.gov/provider-data/api/1/metastore/schemas/dataset/items/${src.datasetId}?show-reference-ids=true`);
  const dist = (meta.distribution || []).map((d) => d.data || d);
  const csv = dist.find((d) => /csv/i.test(d.mediaType || '') || /\.csv$/i.test(d.downloadURL || ''))
           || dist.find((d) => (d.downloadURL || '').endsWith('.zip'))
           || dist[0];
  if (!csv?.downloadURL) throw new Error(`No distribution with a downloadURL for ${src.datasetId}`);
  return { url: csv.downloadURL, note: `${meta.title || src.datasetId} (modified ${meta.modified || 'unknown'})` };
}

// data.cms.gov publishes a DCAT catalogue at /data.json. Source A carries one distribution
// per calendar year, so take the newest year rather than whatever happens to be first.
let catalogCache = null;
async function resolveDataApi(src) {
  catalogCache ||= await getJson('https://data.cms.gov/data.json');
  const ds = (catalogCache.dataset || []).filter((d) => src.titleMatch.test(d.title || ''));
  if (!ds.length) throw new Error(`No dataset in data.json matching ${src.titleMatch}`);
  const year = (s) => { const m = String(s).match(/(20\d\d)/g); return m ? Math.max(...m.map(Number)) : 0; };
  const candidates = [];
  for (const d of ds) {
    for (const dist of d.distribution || []) {
      if (!dist.downloadURL) continue;
      if (!/csv/i.test(dist.mediaType || '') && !/\.csv/i.test(dist.downloadURL)) continue;
      candidates.push({ url: dist.downloadURL, year: Math.max(year(d.title), year(dist.title || ''), year(d.modified || '')), note: `${d.title} — ${dist.title || ''}`.trim() });
    }
  }
  if (!candidates.length) throw new Error(`No CSV distribution for ${src.titleMatch}`);
  candidates.sort((a, b) => b.year - a.year);
  return candidates[0];
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} downloading ${url}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
  return statSync(dest).size;
}

let failed = 0;
for (const [key, src] of Object.entries(SOURCES)) {
  if (key === 'nppes') continue; // see README — optional, and a 9GB download for one flag
  const dest = join(DATA_DIR, src.file);
  process.stdout.write(`\n${key}: `);
  if (existsSync(dest) && !printOnly) { console.log(`already at ${dest} (${(statSync(dest).size / 1e6).toFixed(0)} MB) — delete it to re-download`); continue; }
  try {
    const { url, note } = src.catalog === 'provider-data' ? await resolveProviderData(src) : await resolveDataApi(src);
    console.log(`\n  ${note}\n  ${url}`);
    if (printOnly) continue;
    if (url.endsWith('.zip')) {
      const zip = dest.replace(/\.csv$/, '.zip');
      console.log(`  downloading zip -> ${zip}`);
      await download(url, zip);
      const unzip = spawnSync('unzip', ['-o', '-j', zip, '-d', DATA_DIR], { stdio: 'inherit' });
      if (unzip.status !== 0) throw new Error(`Downloaded ${zip} but could not unzip it. Unzip it by hand and rename the CSV to ${src.file}.`);
      console.log(`  unzipped — rename the extracted CSV to ${src.file} if it is not already`);
    } else {
      const bytes = await download(url, dest);
      console.log(`  -> ${dest} (${(bytes / 1e6).toFixed(0)} MB)`);
    }
  } catch (err) {
    failed++;
    const cause = err.cause?.message ? ` (${err.cause.message})` : '';
    console.log(`  COULD NOT FETCH: ${err.message}${cause}`);
    console.log(`  Download it by hand from ${src.landing}`);
    console.log(`  and save it as ${dest}`);
  }
}

console.log(`\nNPPES is not fetched automatically — it is a ~1 GB zip for one optional flag.`);
console.log(`See the README section "What NPPES is and is not good for here" before spending the bandwidth.\n`);
process.exit(failed ? 1 : 0);
