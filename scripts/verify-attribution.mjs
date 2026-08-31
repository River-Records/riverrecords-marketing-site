// verify-attribution.mjs — end-to-end check of public/attribution.js
//
// This repo has no test runner and no devDependencies; keeping it that way.
// To run:
//   npm run build
//   npx --yes http-server dist -p 4321 --silent &
//   mkdir -p /tmp/pw && cd /tmp/pw && npm init -y && PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm i playwright
//   node /path/to/scripts/verify-attribution.mjs
//
// Set CHROME_PATH if your Chromium is elsewhere.

import { chromium } from 'playwright';
const BASE = 'http://127.0.0.1:4321';
const APP = 'stream.riverrecords.ai';
let fails = 0;
function check(name, cond, detail) {
  console.log((cond ? '  PASS  ' : '  FAIL  ') + name + (detail ? '\n          ' + detail : ''));
  if (!cond) fails++;
}
const appHref = (page) => page.evaluate((h) => {
  const a = document.querySelector('a[href*="' + h + '/onboard"]');
  return a ? a.href : null;
}, APP);
const loginHref = (page) => page.evaluate((h) => {
  const a = document.querySelector('a[href*="' + h + '/login"]');
  return a ? a.href : null;
}, APP);

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });

  // --- Scenario 1: paid click lands on a BLOG POST (previously zero attribution) ---
  let ctx = await browser.newContext();
  let page = await ctx.newPage();
  await page.goto(BASE + '/blog/the-work-before-the-work/?utm_source=google&utm_medium=cpc&utm_campaign=brand-q3&gclid=TEST123');
  await page.waitForFunction(() => window.dataLayer && window.dataLayer.some(e => e.event === 'rr_attribution_ready'));
  let href = await appHref(page);
  console.log('\nScenario 1 — paid click on a blog post');
  console.log('  href: ' + href);
  let u = new URL(href);
  check('utm_source is the real channel', u.searchParams.get('utm_source') === 'google', 'got: ' + u.searchParams.get('utm_source'));
  check('utm_campaign preserved', u.searchParams.get('utm_campaign') === 'brand-q3');
  check('gclid forwarded to app', u.searchParams.get('gclid') === 'TEST123');
  check('visitor id present', !!u.searchParams.get('rr_vid'));
  check('landing page recorded', u.searchParams.get('rr_landing') === '/blog/the-work-before-the-work/');

  // --- Scenario 2: same visitor navigates to the HOMEPAGE (the overwrite bug) ---
  await page.goto(BASE + '/');
  await page.waitForFunction(() => window.dataLayer && window.dataLayer.some(e => e.event === 'rr_attribution_ready'));
  href = await appHref(page);
  u = new URL(href);
  console.log('\nScenario 2 — same visitor now on the homepage (hardcoded utm_source=homepage)');
  console.log('  href: ' + href);
  check('first-touch google SURVIVES homepage hardcode', u.searchParams.get('utm_source') === 'google', 'got: ' + u.searchParams.get('utm_source'));
  check('rr_page records click origin', u.searchParams.get('rr_page') === '/');
  // The hero link is one that DOES carry a build-time utm_source=homepage.
  const heroHref = await page.evaluate(() => {
    const a = [...document.querySelectorAll('a[href*="stream.riverrecords.ai/onboard"]')]
      .find(x => x.getAttribute('data-rr-original-source'));
    return a ? a.href : null;
  });
  console.log('  hero: ' + heroHref);
  const h = new URL(heroHref);
  check('hardcoded utm_source=homepage OVERRIDDEN by real channel', h.searchParams.get('utm_source') === 'google', 'got: ' + h.searchParams.get('utm_source'));
  check("page's own creative label preserved in utm_content", h.searchParams.get('utm_content') === 'hero', 'got: ' + h.searchParams.get('utm_content'));

  // --- Scenario 3: organic search, no params ---
  await ctx.close();
  ctx = await browser.newContext();
  page = await ctx.newPage();
  await page.setExtraHTTPHeaders({ referer: 'https://www.google.com/' });
  await page.goto(BASE + '/for/dpc/');
  await page.waitForFunction(() => window.dataLayer && window.dataLayer.some(e => e.event === 'rr_attribution_ready'));
  href = await appHref(page);
  u = new URL(href);
  console.log('\nScenario 3 — organic, no params, on a segment page (previously bare)');
  console.log('  href: ' + href);
  check('organic classified, not "(none)"', u.searchParams.get('utm_medium') === 'organic', 'got: ' + u.searchParams.get('utm_medium'));
  check('search engine captured as source', u.searchParams.get('utm_source') === 'google.com');

  // --- Scenario 4: direct, and cta_click event fires ---
  await ctx.close();
  ctx = await browser.newContext();
  page = await ctx.newPage();
  await page.goto(BASE + '/');
  await page.waitForFunction(() => window.dataLayer && window.dataLayer.some(e => e.event === 'rr_attribution_ready'));
  const login = await loginHref(page);
  check('login link left UNdecorated', !login || login.indexOf('rr_vid') === -1, 'got: ' + login);
  await page.evaluate(() => {
    const a = document.querySelector('a[href*="stream.riverrecords.ai/onboard"]');
    a.setAttribute('target', '_blank'); // don't actually navigate off
    a.click();
  });
  const ev = await page.evaluate(() => (window.dataLayer || []).find(e => e.event === 'cta_click_signup') || null);
  console.log('\nScenario 4 — direct visit, CTA click event');
  check('cta_click_signup pushed to dataLayer', !!ev, ev ? JSON.stringify(ev) : 'no event');
  check('event carries page + label', !!(ev && ev.cta_page && ev.cta_label));
  const direct = await page.evaluate(() => JSON.parse(localStorage.getItem('rr_attr')).first.utm_source);
  check('direct traffic labelled "direct"', direct === 'direct', 'got: ' + direct);

  // --- Scenario 5: storage blocked (private mode) must not break links ---
  await ctx.close();
  ctx = await browser.newContext();
  page = await ctx.newPage();
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } });
  });
  let pageErr = null;
  page.on('pageerror', e => { pageErr = e.message; });
  await page.goto(BASE + '/?utm_source=newsletter&utm_medium=email');
  await page.waitForTimeout(600);
  href = await appHref(page);
  console.log('\nScenario 5 — localStorage throws (private mode)');
  console.log('  href: ' + href);
  check('no uncaught page error', pageErr === null, pageErr || '');
  check('link still decorated from URL params', href && new URL(href).searchParams.get('utm_source') === 'newsletter');

  // --- Scenario 6: ?rr_debug=1 reports, persists across pages, and is off by default ---
  await ctx.close();
  ctx = await browser.newContext();
  page = await ctx.newPage();
  let logs = [];
  page.on('console', m => logs.push(m.text()));
  await page.goto(BASE + '/?utm_source=linkedin&utm_medium=social&rr_debug=1');
  await page.waitForFunction(() => window.dataLayer && window.dataLayer.some(e => e.event === 'rr_attribution_ready'));
  await page.waitForTimeout(300);
  console.log('\nScenario 6 — ?rr_debug=1');
  check('debug output printed', logs.some(l => l.indexOf('[rr] attribution') !== -1), 'logs: ' + logs.length);
  check('explains how the visit was classified', logs.some(l => l.indexOf('explicit URL parameters') !== -1));
  check('warns the parent-domain cookie did not stick (localhost)', logs.some(l => l.indexOf('did not stick') !== -1));

  logs = [];
  await page.goto(BASE + '/for/pediatrics/');   // no flag in URL
  await page.waitForTimeout(300);
  check('debug persists across internal navigation', logs.some(l => l.indexOf('[rr] attribution') !== -1));

  logs = [];
  await page.goto(BASE + '/?rr_debug=0');
  await page.waitForTimeout(300);
  check('?rr_debug=0 turns it off', !logs.some(l => l.indexOf('[rr] attribution') !== -1));

  // silent for a normal visitor
  await ctx.close();
  ctx = await browser.newContext();
  page = await ctx.newPage();
  logs = [];
  page.on('console', m => logs.push(m.text()));
  await page.goto(BASE + '/');
  await page.waitForTimeout(300);
  check('silent by default for real visitors', !logs.some(l => l.indexOf('[rr]') !== -1), 'logs: ' + JSON.stringify(logs.slice(0,3)));

  await browser.close();
  console.log('\n' + (fails === 0 ? 'ALL CHECKS PASSED' : fails + ' CHECK(S) FAILED'));
  process.exit(fails === 0 ? 0 : 1);
})().catch(e => { console.error('HARNESS ERROR', e); process.exit(2); });
