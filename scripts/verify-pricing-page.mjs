// verify-pricing-page.mjs — the pricing page must be reachable, correct, and consistent.
//
// It replaced a 301 to a homepage anchor. Anchors cannot rank, so the highest
// commercial-intent term in the category had nowhere to land. The first check is that
// the redirect has not been restored, because that failure would be silent — the page
// would still build, and simply never be reached.
//
// Every figure is asserted against src/config/pricing.ts rather than hardcoded here.
// A pricing page that disagrees with the homepage banner is worse than no pricing page.
//
//   npm run build && npx --yes http-server dist -p 4321 --silent &
//   CHROME_PATH=... node scripts/verify-pricing-page.mjs

import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const BASE = process.env.BASE || 'http://127.0.0.1:4321';
let fails = 0;
const check = (n, c, d) => { console.log((c ? '  PASS  ' : '  FAIL  ') + n + (d ? '\n          ' + d : '')); if (!c) fails++; };

const cfg = readFileSync('src/config/pricing.ts', 'utf8');
const val = (k) => (cfg.match(new RegExp(`${k}:\\s*(\\d+)`)) || [])[1];
const monthly = val('monthly'), annual = val('annual'), trial = val('trialDays');

const b = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const p = await (await b.newContext()).newPage();

console.log('\nReachable, and not redirected back to an anchor');
const r = await p.goto(`${BASE}/pricing/`, { waitUntil: 'domcontentloaded' });
check('/pricing/ returns 200', r.status() === 200, 'HTTP ' + r.status());
check('did not land on the homepage', !p.url().endsWith('/#pricing') && p.url().includes('/pricing'), p.url());

const text = await p.textContent('.pr-wrap');

console.log('\nAgrees with src/config/pricing.ts');
check(`monthly price $${monthly} shown`, text.includes(`$${monthly}`), 'config says ' + monthly);
check(`annual price $${annual} shown`, text.includes(`$${annual}`));
check(`${trial}-day trial stated`, text.includes(`${trial}-day`));

console.log('\nAnswers what the query actually asks');
check('states the price in the H1', /\$\d/.test(await p.textContent('h1')), await p.textContent('h1'));
check('says no per-encounter fee', /per-encounter/i.test(text));
check('says no usage caps', /usage caps/i.test(text));
check('discloses the metered add-on', /Inlet/i.test(text) && /setup fee/i.test(text));
check('names the staff seat cost', /\$25\/month/.test(text));

console.log('\nHonesty carried over from the comparison pages');
check('discloses no EHR write-back and no SOC 2',
  /does not write back/i.test(text) && /not SOC 2 certified/i.test(text));
check('links to head-to-head pages', (await p.locator('a[href^="/comparison/"]').count()) >= 4);

console.log('\nStructured data for pricing queries');
const ld = await p.evaluate(() => [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent));
check('FAQPage schema present', ld.some((x) => x.includes('FAQPage')));
check('Offer schema carries the real price', ld.some((x) => x.includes('"price"') && x.includes(`"${monthly}"`)));
check('FAQ entries rendered', (await p.locator('.pr-faq details').count()) >= 8, (await p.locator('.pr-faq details').count()) + ' entries');

await b.close();
console.log('\n' + (fails ? `${fails} CHECK(S) FAILED` : 'ALL CHECKS PASSED'));
process.exit(fails ? 1 : 0);
