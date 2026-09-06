// 03-acceptance-test.mjs — seed the list with practices we already know are a good fit and
// check where they land.
//
//   node gtm/target-list/03-acceptance-test.mjs
//
// This is the check the spec calls the whole point of building the list this way, and it is
// the only evidence that the scoring means anything. Risk score is a proxy for panel
// complexity; nothing guarantees it is the proxy that predicts who buys. If our current
// users and best-fit prospects come out Tier 1, the model is validated. If they scatter,
// the model is wrong and the fix belongs here, not in Bullpen's call notes.
//
// Seeds go in gtm/target-list/seeds/customers.csv — see the README in that directory.

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { readCsv } from './lib/csv.mjs';
import { normOrg, orgTokens, jaccard } from './lib/normalize.mjs';
import { OUT_DIR } from './config/sources.mjs';

const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(name); return i === -1 ? null : args[i + 1]; };
const SEEDS = args.find((a) => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--out-dir')
  || 'gtm/target-list/seeds/customers.csv';
const outDir = flag('--out-dir') || OUT_DIR;

// A seed that ends up in Tier 1 validates the model. These are the bars the spec implies:
// most of our best-fit accounts in Tier 1, and nearly all of them in Tier 1 or 2.
const TIER1_BAR = 0.6;
const TIER12_BAR = 0.85;

if (!existsSync(SEEDS)) {
  console.error(`\nNo seed file at ${SEEDS}.\n\nThe acceptance test cannot run without one. See gtm/target-list/seeds/README.md\nfor the four columns it needs.\n`);
  process.exit(2);
}
if (!existsSync(join(outDir, 'practices.csv'))) {
  console.error(`\nNo ${join(outDir, 'practices.csv')} — run 02-build.mjs first.\n`);
  process.exit(2);
}

const loadCsv = async (path) => {
  const rows = [];
  let header = null;
  await readCsv(path, {
    onHeader: (h) => { header = h; },
    onRow: (f) => { rows.push(Object.fromEntries(header.map((k, i) => [k, f[i]]))); },
  });
  return rows;
};

const practices = await loadCsv(join(outDir, 'practices.csv'));
const drops = existsSync(join(outDir, 'drop-log.csv')) ? await loadCsv(join(outDir, 'drop-log.csv')) : [];
const seeds = await loadCsv(SEEDS);

// Index the output three ways, because a seed list assembled from the CRM will have NPIs
// for some accounts, a legal name for others, and a trading name for the rest.
const byNpi = new Map();
for (const p of practices) for (const npi of (p.npi_list || '').split(';')) { const k = npi.trim(); if (k) byNpi.set(k, p); }
const byName = new Map();
for (const p of practices) {
  const k = `${normOrg(p.org_name)}|${(p.state || '').toUpperCase()}`;
  if (!byName.has(k)) byName.set(k, p);
}
const dropByName = new Map();
for (const d of drops) {
  const k = `${normOrg(d.org_name)}|${(d.state || '').toUpperCase()}`;
  if (!dropByName.has(k)) dropByName.set(k, d);
}

function locate(seed) {
  const npi = (seed.npi || '').trim();
  if (npi && byNpi.has(npi)) return { how: 'npi', practice: byNpi.get(npi) };
  const state = (seed.state || '').toUpperCase();
  const exact = byName.get(`${normOrg(seed.org_name)}|${state}`);
  if (exact) return { how: 'name+state', practice: exact };
  // Fuzzy, within state only.
  const tokens = orgTokens(seed.org_name);
  let best = null, score = 0;
  for (const p of practices) {
    if ((p.state || '').toUpperCase() !== state) continue;
    const s = jaccard(tokens, orgTokens(p.org_name));
    if (s > score) { score = s; best = p; }
  }
  if (best && score >= 0.7) return { how: `fuzzy ${score.toFixed(2)}`, practice: best };
  const dropped = dropByName.get(`${normOrg(seed.org_name)}|${state}`);
  if (dropped) return { how: 'excluded', drop: dropped };
  return { how: 'not found' };
}

const results = seeds.map((s) => ({ seed: s, ...locate(s) }));
const placed = results.filter((r) => r.practice);
const tier = (t) => placed.filter((r) => r.practice.tier === String(t)).length;

console.log(`\nAcceptance test — ${seeds.length} seed practice(s)\n`);
console.log('  seed practice'.padEnd(46) + 'tier  pctile  panel   risk   matched by');
console.log('  ' + '-'.repeat(88));
for (const r of results) {
  const name = (r.seed.org_name || '').slice(0, 42).padEnd(44);
  if (r.practice) {
    const p = r.practice;
    console.log(`  ${name}${p.tier.padEnd(6)}${String(p.risk_pctile).padEnd(8)}${String(p.panel_total).padEnd(8)}${String(p.risk_score_wtd).padEnd(7)}${r.how}`);
  } else if (r.drop) {
    console.log(`  ${name}${'—'.padEnd(29)}EXCLUDED at step 4: ${r.drop.rule} (${r.drop.matched})`);
  } else {
    console.log(`  ${name}${'—'.padEnd(29)}not in the list at all`);
  }
}

const excluded = results.filter((r) => r.drop);
const missing = results.filter((r) => !r.practice && !r.drop);
console.log(`\n  Tier 1: ${tier(1)}   Tier 2: ${tier(2)}   Tier 3: ${tier(3)}   excluded: ${excluded.length}   not found: ${missing.length}`);

// The informative failures. A seed that our own exclusion rules removed is a keyword list
// that is too aggressive; a seed that is missing entirely is usually a Medicare Advantage
// panel that source A cannot see.
if (excluded.length) {
  console.log(`\n  ${excluded.length} seed(s) were removed by our own step 4 exclusions. Each one is a false`);
  console.log('  positive in the keyword lists in config/exclusions.mjs — tune those before anything else:');
  for (const r of excluded) console.log(`    ${r.seed.org_name} -> ${r.drop.rule} matched "${r.drop.matched}"`);
}
if (missing.length) {
  console.log(`\n  ${missing.length} seed(s) are not in the list at all. Usual causes, in order: a heavy Medicare`);
  console.log('  Advantage panel (source A is fee-for-service only and cannot see it), a group larger');
  console.log('  than 10, or a name in the CRM that does not match the CMS legal business name.');
  for (const r of missing) console.log(`    ${r.seed.org_name} (${r.seed.state || 'no state'})`);
}

let verdict;
if (placed.length === 0) {
  verdict = 'INCONCLUSIVE — no seed matched a practice in the list. Fix the seed file or the exclusions first.';
} else {
  const t1 = tier(1) / placed.length;
  const t12 = (tier(1) + tier(2)) / placed.length;
  const ok = t1 >= TIER1_BAR && t12 >= TIER12_BAR;
  verdict = ok
    ? `VALIDATED — ${(t1 * 100).toFixed(0)}% of matched seeds are Tier 1 and ${(t12 * 100).toFixed(0)}% are Tier 1 or 2.`
    : `NOT VALIDATED — ${(t1 * 100).toFixed(0)}% Tier 1 (bar ${TIER1_BAR * 100}%), ${(t12 * 100).toFixed(0)}% Tier 1-2 (bar ${TIER12_BAR * 100}%).\n` +
      '  The seeds scatter across tiers, so risk_score_wtd is not separating our best-fit accounts\n' +
      '  from everyone else. Fix the scoring before this list goes to Bullpen — that is what this\n' +
      '  test is for.';
}
console.log(`\n  ${verdict}\n`);
process.exit(verdict.startsWith('VALIDATED') ? 0 : 1);
