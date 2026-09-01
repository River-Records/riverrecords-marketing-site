// verify-hubspot-events.mjs — checks high-intent behaviour reaches HubSpot.
//
// HubSpot's real library REPLACES window._hsq with its own object once it loads, so a
// test that grabs a reference to the queue up front ends up reading a dead array and
// every check fails for the wrong reason. This blocks HubSpot's scripts instead, which
// leaves _hsq as the plain queue our code pushes into — exactly what we want to assert
// on. What HubSpot then does with the queue is HubSpot's business, not ours.
//
// This repo has no test runner and no devDependencies; keeping it that way.
//   npm run build && npx --yes http-server dist -p 4321 --silent &
//   CHROME_PATH=... node scripts/verify-hubspot-events.mjs

import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:4321';
let fails = 0;
const check = (n, c, d) => {
  console.log((c ? '  PASS  ' : '  FAIL  ') + n + (d ? '\n          ' + d : ''));
  if (!c) fails++;
};

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });

async function page() {
  const ctx = await browser.newContext();
  const p = await ctx.newPage();
  await p.route('**/js.hs-scripts.com/**', (r) => r.abort());
  await p.route('**/js.hs-analytics.net/**', (r) => r.abort());
  return p;
}
const queue = (p) => p.evaluate(() => (window._hsq || []).map((c) => (Array.isArray(c) ? c : String(c))));

console.log('\nWatching a walkthrough lands on the timeline');
let p = await page();
await p.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await p.locator('#see-it-work').scrollIntoViewIfNeeded();
await p.waitForTimeout(1800);
check('nothing sent before any interaction', (await queue(p)).length === 0);

await p.locator('.loom-frame').first().click();
await p.waitForTimeout(1600);
let q = await queue(p);
const paths = q.filter((c) => c[0] === 'setPath').map((c) => c[1]);
check('event sent on play', q.length > 0, JSON.stringify(q));
check('path is namespaced and names the video', paths.includes('/engagement/video/intake'), paths.join(' → '));
check('trackPageView fired', q.some((c) => c[0] === 'trackPageView'));
// If the synthetic path is left set, the visitor's NEXT genuine page view reports it
// instead — one extra row becomes corrupted page data.
check('real path restored afterwards', paths[paths.length - 1] === '/', 'last setPath = ' + paths[paths.length - 1]);

await p.waitForTimeout(2200);
const engagementCalls = (await queue(p)).filter((c) => c[0] === 'setPath' && String(c[1]).startsWith('/engagement/'));
check('sent exactly once despite the 500ms poll', engagementCalls.length === 1, engagementCalls.length + ' call(s)');
await p.close();

console.log('\nA demo CTA click is worth a timeline entry too');
p = await page();
await p.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(1200);
// Block the navigation WITHOUT removing the href: attribution.js identifies a demo
// link by reading its href, so stripping it removes the very thing being tested.
// Registered after attribution.js's own capture listener, so that one still runs first.
await p.evaluate(() => {
  document.addEventListener('click', (e) => e.preventDefault(), true);
  const a = document.querySelector('a[href^="/book-demo"]');
  if (!a) throw new Error('no /book-demo link found on the homepage');
  a.click();
});
await p.waitForTimeout(1400);
const demoPaths = (await queue(p)).filter((c) => c[0] === 'setPath').map((c) => c[1]);
check('demo CTA click recorded', demoPaths.includes('/engagement/demo-cta'), demoPaths.join(' → ') || '(none)');
await p.close();

console.log('\nThe contact form says who the visitor is');
p = await page();
await p.goto(BASE + '/contact/', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(1200);
await p.fill('#name', 'Test'); await p.fill('#email', 'doctor@practice.com'); await p.fill('#message', 'hi');
await p.evaluate(() => document.getElementById('contact-form').addEventListener('submit', (e) => e.preventDefault(), false));
await p.click('button[type="submit"]');
await p.waitForTimeout(700);
const ids = (await queue(p)).filter((c) => c[0] === 'identify');
check('identify sent with the email', ids.length === 1 && ids[0][1].email === 'doctor@practice.com', JSON.stringify(ids));
// Google prohibits personal data in GA4, and everything in the dataLayer can reach it.
const dl = await p.evaluate(() => JSON.stringify(window.dataLayer || []));
check('email NOT placed in the dataLayer', !dl.includes('doctor@practice.com'));
await p.close();

console.log('\nA visitor who just reads is left alone');
p = await page();
await p.goto(BASE + '/blog/', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(3000);
check('no engagement events without interaction', (await queue(p)).length === 0, JSON.stringify(await queue(p)));
await p.close();

await browser.close();
console.log('\n' + (fails ? `${fails} CHECK(S) FAILED` : 'ALL CHECKS PASSED'));
process.exit(fails ? 1 : 0);
