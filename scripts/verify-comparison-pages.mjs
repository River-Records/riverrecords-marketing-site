// verify-comparison-pages.mjs — checks the head-to-head pages keep their claim rules.
//
// These pages state competitors' prices and our own limitations in public, so the
// checks here are about honesty rather than layout. They come from the guardrails page
// of gtm/battle-cards: no SOC 2 claim, no EHR write-back claim, competitor pricing
// dated and linked to source.
//
// The concession check is the load-bearing one. A comparison page that cannot name
// something the competitor does better reads as marketing and gets discarded by exactly
// the people it is meant to persuade.
//
//   npm run build && npx --yes http-server dist -p 4321 --silent &
//   CHROME_PATH=... node scripts/verify-comparison-pages.mjs

import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

/*
 * The config is TypeScript and this is plain node, so read it as text — the same trick
 * verify-pricing-page.mjs uses. Deriving these from the file means re-verifying prices
 * cannot break the test, which is what a hardcoded '19 August 2026' did here.
 */
const CONFIG = readFileSync(
  (process.env.REPO_ROOT || new URL('..', import.meta.url).pathname) + '/src/config/competitors.ts',
  'utf8',
);
const PRICING_VERIFIED = CONFIG.match(/PRICING_VERIFIED\s*=\s*'([^']+)'/)?.[1];
/** Slugs whose vendor publishes no pricing page, so the page must say so instead of linking. */
const NO_PUBLIC_PRICING = new Set(
  [...CONFIG.matchAll(/slug:\s*'([^']+)'[\s\S]*?source:\s*(null|')/g)]
    .filter((m) => m[2] === 'null')
    .map((m) => m[1]),
);
const B = process.env.BASE || 'http://127.0.0.1:4321';
const SLUGS = ['heidi', 'suki', 'doximity-scribe', 'twofold'];
let fails = 0;
const check = (n, c, d) => { console.log((c?'  PASS  ':'  FAIL  ')+n+(d?'\n          '+d:'')); if(!c) fails++; };

const b = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const p = await (await b.newContext()).newPage();

for (const slug of SLUGS) {
  console.log(`\n/comparison/${slug}/`);
  const r = await p.goto(`${B}/comparison/${slug}/`, { waitUntil: 'domcontentloaded' });
  check('page renders', r.status() === 200, 'HTTP ' + r.status());
  const text = await p.textContent('.vs-wrap');

  // Honesty, in the order that matters.
  const concessions = await p.locator('.vs-honest li').count();
  check('names what the competitor does better', concessions >= 2, concessions + ' concession(s)');
  check('concession appears BEFORE our differences',
    text.indexOf('is better') < text.indexOf('Where Stream is different'));
  check('tells the reader when to choose the competitor',
    /Choose .* if…/.test(await p.textContent('.vs-pick-them')));

  // Claim rules from the battle-card guardrails.
  check('no SOC 2 claim', !/(?<!not )SOC 2 certified/.test(text), 'must only ever appear as a disclaimer');
  check('discloses no SOC 2 and no write-back', /not SOC 2 certified/.test(text) && /does not offer EHR write-back/.test(text));
  // Read the date from config rather than hardcoding it. The literal '19 August 2026'
  // sat here and failed every page the moment prices were re-verified — a test that
  // breaks on the correct action trains people to edit the test.
  check('competitor pricing carries the verification date', text.includes(PRICING_VERIFIED),
    `expected "${PRICING_VERIFIED}"`);

  // A vendor may genuinely publish no pricing page. Suki's 404s and they quote through
  // sales, so the honest page says so instead of linking to nothing. Requiring a link
  // unconditionally would push us back toward citing a dead URL.
  const links = await p.locator('.vs-price-note a[href^="http"]').count();
  if (NO_PUBLIC_PRICING.has(slug)) {
    check('states plainly that the vendor publishes no pricing', /publishes no pricing page/.test(text), text.slice(0, 120));
    check('and does not link to a pricing page that does not exist', links === 0, `${links} link(s)`);
  } else {
    check('links to the competitor pricing page', links === 1, `${links} link(s)`);
  }

  // House style.
  check('uses "works alongside any EHR"', !/works with any EHR/i.test(text));
  check('avoids the banned word', !/narrative/i.test(text));
}

console.log('\nHub links every page');
await p.goto(`${B}/comparison/`, { waitUntil: 'domcontentloaded' });
for (const slug of SLUGS.concat('freedai')) {
  check(`links /comparison/${slug}`, (await p.locator(`a[href*="/comparison/${slug}"]`).count()) >= 1);
}

await b.close();
console.log('\n' + (fails ? `${fails} CHECK(S) FAILED` : 'ALL CHECKS PASSED'));
process.exit(fails ? 1 : 0);
