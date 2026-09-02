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
  check('competitor pricing is dated', /19 August 2026/.test(text));
  check('links to the competitor pricing page', (await p.locator('.vs-price-note a[href^="http"]').count()) === 1);

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
