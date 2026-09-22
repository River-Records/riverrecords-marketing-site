// verify-event-collector.mjs — the anonymous event pipeline does what it claims.
//
// The check that matters most is the allow-list one. Everything else here is about
// whether data arrives; that one is about whether data arrives that should not. An
// email address reaching this store under a durable anonymous id is the failure that
// would be worst and quietest, so it is tested by actually pushing one.
//
// This repo has no test runner and no devDependencies; keeping it that way.
//   npm run build
//   npx --yes http-server dist -p 4321 --silent &
//   mkdir -p /tmp/pw && cd /tmp/pw && npm init -y && npm i playwright
//   REPO_ROOT=/path/to/repo CHROME_PATH=... node /path/to/scripts/verify-event-collector.mjs

import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:4321';
const REPO_ROOT = process.env.REPO_ROOT || new URL('..', import.meta.url).pathname;

let fails = 0;
const check = (name, cond, detail) => {
  console.log((cond ? '  PASS  ' : '  FAIL  ') + name + (detail ? '\n          ' + detail : ''));
  if (!cond) fails++;
};

/* ------------------------------------------------- the handler, without a browser */

console.log('\nEndpoint normalisation');
const { normalise } = await import(`${REPO_ROOT}/functions/api/events.js`);
const meta = { ts: 1, country: 'US', bot: false };

check('drops a row with no visitor id', normalise({ event: 'page_view' }, meta) === null);
check('drops a row with no event name', normalise({ rr_vid: 'v1' }, meta) === null);
check('drops a non-object', normalise('nope', meta) === null);

const long = normalise({ rr_vid: 'v1', event: 'page_view', path: 'x'.repeat(9000) }, meta);
check('clips an overlong path to 512', long.path.length === 512, `${long.path.length} chars`);

const fatProps = normalise(
  { rr_vid: 'v1', event: 'page_view', props: { blob: 'x'.repeat(5000) } },
  meta,
);
check('drops props over the byte cap but keeps the event', fatProps.props === null && fatProps.event === 'page_view');

const circular = { rr_vid: 'v1', event: 'page_view', props: {} };
circular.props.self = circular.props;
check('survives unserialisable props', normalise(circular, meta)?.props === null);

check('bot flag is stored as an integer', normalise({ rr_vid: 'v1', event: 'x' }, { ...meta, bot: true }).bot === 1);

/* ------------------------------------------------------------------ the browser */

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const ctx = await browser.newContext();

/** Collect every batch posted to /api/events, answering 204 as production would. */
async function collect(page, status = 204) {
  const batches = [];
  await page.route('**/api/events', async (route) => {
    try {
      batches.push(JSON.parse(route.request().postData() || '{}'));
    } catch {
      batches.push({ unparseable: true });
    }
    await route.fulfill({ status, body: '' });
  });
  return batches;
}

console.log('\nA page view is recorded against the visitor id');
const page = await ctx.newPage();
const batches = await collect(page);
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2500);

const all = batches.flatMap((b) => b.events || []);
const pv = all.find((e) => e.event === 'page_view');
check('page_view sent', !!pv, JSON.stringify(pv));
check('carries an rr_vid', !!pv?.rr_vid && pv.rr_vid.length > 8, pv?.rr_vid);
check('carries the path', pv?.path === '/', pv?.path);
check('client does not set ts — the server does', pv && pv.ts === undefined);

console.log('\nAllow-list: anything not named in FIELDS must not leave the browser');
await page.evaluate(() => {
  window.dataLayer.push({
    event: 'contact_form_submit',
    email: 'doctor@practice.com', // the exact thing that must never be collected
    phone: '555-0100',
    rr_first_source: 'google', // allowed, and proves the push was seen at all
  });
});
await page.waitForTimeout(2200);

const posted = JSON.stringify(batches);
const submit = batches.flatMap((b) => b.events || []).find((e) => e.event === 'contact_form_submit');
check('the event itself is collected', !!submit, JSON.stringify(submit));
check('an allow-listed field survives', submit?.props?.rr_first_source === 'google');
check('email never appears anywhere in any payload', !posted.includes('doctor@practice.com'));
check('phone never appears either', !posted.includes('555-0100'));
check('email is not in props', submit && submit.props && submit.props.email === undefined);

console.log('\nGTM internals are not collected');
await page.evaluate(() => window.dataLayer.push({ event: 'gtm.dom' }));
await page.waitForTimeout(2200);
const internal = batches.flatMap((b) => b.events || []).filter((e) => e.event.startsWith('gtm.'));
check('no gtm.* rows', internal.length === 0, internal.map((e) => e.event).join(' '));

console.log('\nA video play reaches the store with its trigger');
const vp = await ctx.newPage();
const vpBatches = await collect(vp);
await vp.goto(BASE + '/intake/#watch', { waitUntil: 'load' });
await vp.waitForTimeout(2500);
const play = vpBatches.flatMap((b) => b.events || []).find((e) => e.event === 'video_play');
check('video_play collected', !!play, JSON.stringify(play?.props));
check('carries key and trigger', play?.props?.video_key === 'intake' && play?.props?.video_trigger === 'deeplink');

/*
 * Telling people from machines. The server-side `bot` column reads the user agent and
 * misses anything that runs JavaScript behind a browser-like UA — 40% of week-one rows
 * marked bot=0 were automated. `human_signal` is the positive test: emitted once when a
 * visitor does something a page-fetcher has no reason to do.
 */
console.log('\nhuman_signal: absent until someone actually does something');
const quiet = await ctx.newPage();
const quietBatches = await collect(quiet);
await quiet.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await quiet.waitForTimeout(2500);
const quietEvents = quietBatches.flatMap((b) => b.events || []);
check('page_view arrives without interaction', quietEvents.some((e) => e.event === 'page_view'));
check('but human_signal does NOT', !quietEvents.some((e) => e.event === 'human_signal'),
  quietEvents.map((e) => e.event).join(' '));

// Playwright sets navigator.webdriver, which is the point — this run IS automation.
const firstView = quietEvents.find((e) => e.event === 'page_view');
check('automation is flagged via navigator.webdriver', firstView?.props?.webdriver === true,
  JSON.stringify(firstView?.props));

console.log('\nhuman_signal: fires once, on real input');
await quiet.mouse.move(400, 300);
await quiet.mouse.down();
await quiet.mouse.up();
await quiet.mouse.wheel(0, 400);
await quiet.keyboard.press('ArrowDown');
await quiet.waitForTimeout(2200);
const afterInput = quietBatches.flatMap((b) => b.events || []);
const signals = afterInput.filter((e) => e.event === 'human_signal');
check('human_signal fired', signals.length >= 1, `${signals.length}`);
// Listeners remove themselves — a reader who scrolls for ten minutes must cost one
// event, not thousands.
check('and only once, despite five separate inputs', signals.length === 1, `${signals.length} signals`);
await quiet.close();

console.log('\nA failing endpoint must not break the page');
const broken = await ctx.newPage();
const errors = [];
broken.on('pageerror', (e) => errors.push(e.message));
await collect(broken, 500);
await broken.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await broken.waitForTimeout(2000);
await broken.locator('.loom-frame').first().click();
await broken.waitForTimeout(1200);
check('no uncaught page errors on a 500', errors.length === 0, errors.join(' | '));
check('the video still plays', (await broken.locator('.loom-frame iframe').count()) === 1);

console.log('\nNothing is sent before attribution publishes a visitor id');
const blocked = await ctx.newPage();
await blocked.addInitScript(() => {
  // Let attribution.js install itself normally, but hand the collector a null vid —
  // what a visitor with storage denied looks like. Replacing the object outright would
  // just break attribution.js and test the wrong thing.
  let real;
  Object.defineProperty(window, 'rrAttribution', {
    configurable: true,
    get() { return real; },
    set(value) {
      real = value;
      const original = value.whenReady;
      value.whenReady = (cb) => original.call(value, () => cb({ vid: null }));
    },
  });
});
const blockedBatches = await collect(blocked);
await blocked.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await blocked.waitForTimeout(2000);
check('no anonymous rows without an id', blockedBatches.length === 0, `${blockedBatches.length} batch(es)`);

await browser.close();
console.log('\n' + (fails ? `${fails} CHECK(S) FAILED` : 'ALL CHECKS PASSED'));
process.exit(fails ? 1 : 0);
