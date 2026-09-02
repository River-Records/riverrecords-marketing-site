// verify-faq.mjs — FAQ schema must match what a visitor can actually see.
//
// Google requires FAQPage markup to reflect content visible on the page. Declaring more
// questions than the page renders is invalid structured data, and it is easy to
// introduce: before this, the homepage showed five questions and declared three, and a
// first attempt at fixing it declared seventeen while still showing five.
//
// Both pages now render from src/config/faqs.ts, so the assertion below is that the
// counts agree — schema entries, visible entries, and the config that feeds them.
//
//   npm run build && npx --yes http-server dist -p 4321 --silent &
//   CHROME_PATH=... node scripts/verify-faq.mjs

import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:4321';
let fails = 0;
const check = (n, c, d) => { console.log((c ? '  PASS  ' : '  FAIL  ') + n + (d ? '\n          ' + d : '')); if (!c) fails++; };

const b = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const p = await (await b.newContext()).newPage();

const schemaCount = () => p.evaluate(() => {
  const s = [...document.querySelectorAll('script[type="application/ld+json"]')]
    .map((x) => { try { return JSON.parse(x.textContent); } catch { return null; } })
    .find((x) => x && x['@type'] === 'FAQPage');
  return s ? s.mainEntity.length : 0;
});

console.log('\n/faq/ is reachable and not redirected home');
const r = await p.goto(`${BASE}/faq/`, { waitUntil: 'domcontentloaded' });
check('returns 200', r.status() === 200, 'HTTP ' + r.status());
check('stayed on /faq/', p.url().includes('/faq'), p.url());

const visible = await p.locator('.fq-item').count();
const schema = await schemaCount();
check('schema matches visible questions', visible === schema && visible > 10, `${visible} visible, ${schema} in schema`);
check('grouped into sections', (await p.locator('.fq-group').count()) >= 4);
check('has jump navigation', (await p.locator('.fq-jump a').count()) >= 4);

console.log('\nThe honest answers are present and still say no');
const text = await p.textContent('.fq-wrap');
check('no EHR write-back', /no EHR write-back/i.test(text));
check('not SOC 2 certified', /not SOC 2 certified/i.test(text));
check('no clinical decision support', /no clinical decision support/i.test(text));
check('form filling not yet available', /not available today|in development/i.test(text));
check('says who Stream is not for', /large health system/i.test(text));

console.log('\nDoes not compete with /pricing for cost queries');
check('cost answered briefly and linked, not restated',
  (await p.locator('a[href="/pricing/"]').count()) >= 1 && (text.match(/\$149/g) || []).length <= 2,
  ((text.match(/\$149/g) || []).length) + ' mentions of $149');

console.log('\nHomepage schema matches ITS visible subset, not the full list');
await p.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
const homeVisible = await p.locator('.home-faq-item').count();
const homeSchema = await schemaCount();
check('homepage schema equals homepage questions', homeVisible === homeSchema && homeVisible > 0,
  `${homeVisible} visible, ${homeSchema} in schema`);
check('homepage declares fewer than the full FAQ', homeSchema < schema, `${homeSchema} vs ${schema}`);
check('homepage links to the full page', (await p.locator('a[href="/faq/"]').count()) >= 1);

await b.close();
console.log('\n' + (fails ? `${fails} CHECK(S) FAILED` : 'ALL CHECKS PASSED'));
process.exit(fails ? 1 : 0);
