// verify-hubspot-tracking.mjs — checks that the HubSpot tracker in Base.astro
// actually loads, identifies the visitor, and reports page views. Being present
// in the HTML is not the same as working.
//
// This repo has no test runner and no devDependencies; keeping it that way.
// To run:
//   npm run build
//   npx --yes http-server dist -p 4321 --silent &
//   mkdir -p /tmp/pw && cd /tmp/pw && npm init -y && npm i playwright
//   CHROME_PATH=... node /path/to/scripts/verify-hubspot-tracking.mjs
//
// Note: run against a local build. HubSpot's cookies are first-party, so the
// domain differs from production, but load / identity / beacon behaviour is the same.

import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:4321';
const PORTAL = '46752060';
let fails = 0;
const check = (name, cond, detail) => {
  console.log((cond ? '  PASS  ' : '  FAIL  ') + name + (detail ? '\n          ' + detail : ''));
  if (!cond) fails++;
};

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const ctx = await browser.newContext();
const page = await ctx.newPage();

const seen = [];
page.on('response', (r) => {
  const u = r.url();
  if (/hs-scripts|hs-analytics|hubspot|__ptq/.test(u)) seen.push({ url: u, status: r.status() });
});

console.log('\nScenario 1 — the tracker loads for the right portal');
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
const loader = seen.find((r) => r.url.includes(`js.hs-scripts.com/${PORTAL}.js`));
check('loader requested for portal ' + PORTAL, !!loader, loader && `${loader.status} ${loader.url}`);
check('loader returned 200', loader?.status === 200, 'status ' + (loader?.status ?? 'n/a'));

// A wrong portal id still returns a file, but no analytics bundle follows it.
const bundle = seen.find((r) => r.url.includes('hs-analytics.net'));
check('analytics bundle followed (portal id is valid)', !!bundle,
  bundle ? `${bundle.status} ${bundle.url.slice(0, 80)}` : 'none — portal id may be wrong');

console.log('\nScenario 2 — the visitor gets a durable identity');
await page.waitForTimeout(2500);
let cookies = await ctx.cookies();
const get = (n) => cookies.find((c) => c.name === n);
const days = (c) => Math.round((c.expires - Date.now() / 1000) / 86400);

// hubspotutk is the join key: when someone clicks a link in a HubSpot email,
// HubSpot ties this cookie to their contact record. That is what turns later
// page views into a named, per-contact signal for outbound.
check('hubspotutk identity cookie set', !!get('hubspotutk'),
  get('hubspotutk') && `${get('hubspotutk').value.slice(0, 12)}… · ${days(get('hubspotutk'))}d`);
check('__hstc first/last-touch cookie set', !!get('__hstc'),
  get('__hstc') && `${days(get('__hstc'))}d`);
check('__hssc session cookie set', !!get('__hssc'));
check('identity cookie is long-lived (>90d)', get('hubspotutk') && days(get('hubspotutk')) > 90,
  get('hubspotutk') && days(get('hubspotutk')) + 'd');

console.log('\nScenario 3 — page views are reported, and identity persists');
const utkBefore = get('hubspotutk')?.value;
await page.goto(BASE + '/comparison/freedai/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
cookies = await ctx.cookies();
check('same visitor id across pages', utkBefore && get('hubspotutk')?.value === utkBefore,
  `${utkBefore?.slice(0, 12)}… → ${get('hubspotutk')?.value.slice(0, 12)}…`);
const beacons = seen.filter((r) => /__ptq|track\.hubspot|collected/.test(r.url));
check('page views beaconed to HubSpot', beacons.length >= 1, `${beacons.length} beacon(s)`);

console.log('\nScenario 4 — every page carries it, not just the homepage');
for (const p of ['/blog/', '/for/dpc/', '/book-demo/', '/contact/']) {
  await page.goto(BASE + p, { waitUntil: 'domcontentloaded' });
  const present = await page.evaluate(() => !!document.getElementById('hs-script-loader'));
  check('loader present on ' + p, present);
}

console.log('\nScenario 5 — GA4 sanity (warning only, not this script\'s remit)');
// Two _ga_<id> cookies means two GA4 config tags are firing from the GTM container,
// which double-counts sessions and page views. Nothing to do with the HubSpot tag —
// this is just where it happened to surface. Warn loudly, but do not fail the run,
// because that would make this script red for a reason it does not own.
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
const gaIds = (await ctx.cookies()).filter((c) => /^_ga_/.test(c.name)).map((c) => c.name);
if (gaIds.length > 1) {
  console.log('  WARN  ' + gaIds.length + ' GA4 properties are firing: ' + gaIds.join(', '));
  console.log('        Two config tags double-count sessions and page views, so GA4');
  console.log('        traffic numbers are inflated. Fix in the GTM container — see');
  console.log('        docs/GROWTH-DATA-AUDIT.md, Finding 9.');
} else {
  console.log('  PASS  exactly one GA4 property firing' + (gaIds.length ? ` (${gaIds[0]})` : ''));
}

await browser.close();
console.log('\n' + (fails ? `${fails} CHECK(S) FAILED` : 'ALL CHECKS PASSED'));
process.exit(fails ? 1 : 0);
