// verify-video-embeds.mjs — checks the click-to-play Loom facade behaves.
//
// The point of the facade is that Loom is NOT contacted until someone chooses to
// watch. That is easy to break silently by switching to a plain <iframe>, so the
// first check here is the one that matters most.
//
// This repo has no test runner and no devDependencies; keeping it that way.
// To run:
//   npm run build
//   npx --yes http-server dist -p 4321 --silent &
//   mkdir -p /tmp/pw && cd /tmp/pw && npm init -y && npm i playwright
//   CHROME_PATH=... node /path/to/scripts/verify-video-embeds.mjs

import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:4321';
const RATIO = 1280 / 828; // real video dimensions, not oEmbed's player box
let fails = 0;
const check = (name, cond, detail) => {
  console.log((cond ? '  PASS  ' : '  FAIL  ') + name + (detail ? '\n          ' + detail : ''));
  if (!cond) fails++;
};

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const ctx = await browser.newContext();
const page = await ctx.newPage();

const loomHits = [];
page.on('request', (r) => {
  if (r.url().includes('loom.com')) loomHits.push(r.url());
});

console.log('\nHomepage — facades render, Loom is not contacted');
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
check('three facades rendered', (await page.locator('.loom-frame').count()) === 3);
check('no Loom request before any click', loomHits.length === 0, loomHits.length + ' request(s)');
check('no iframe present before click', (await page.locator('.loom-frame iframe').count()) === 0);

console.log('\nThumbnails — lazy, but they do arrive');
await page.locator('#see-it-work').scrollIntoViewIfNeeded();
await page.waitForTimeout(2500);
const imgs = await page.evaluate(() =>
  [...document.querySelectorAll('.loom-frame img')].map((i) => ({
    ok: i.complete && i.naturalWidth > 0,
    src: i.getAttribute('src'),
  })),
);
check('all three thumbnails load once in view', imgs.every((i) => i.ok),
  imgs.map((i) => `${i.src}:${i.ok ? 'ok' : 'MISSING'}`).join(' '));
check('still no Loom contact after thumbnails load', loomHits.length === 0);

console.log('\nLayout — reserved box matches the real video ratio');
const box = await page.locator('.loom-frame').first().boundingBox();
check('facade sized', box.width > 100 && box.height > 100,
  `${Math.round(box.width)}x${Math.round(box.height)}`);
check('ratio matches 1280/828 (no letterboxing on play)',
  Math.abs(box.width / box.height - RATIO) < 0.02,
  `got ${(box.width / box.height).toFixed(3)}, want ${RATIO.toFixed(3)}`);

console.log('\nClick to play');
await page.locator('.loom-frame').first().click();
await page.waitForTimeout(1200);
const src = await page.locator('.loom-frame iframe').first().getAttribute('src');
check('iframe injected on click', !!src, src?.slice(0, 60));
check('autoplay requested', !!src?.includes('autoplay=1'));
check('only the clicked video loads', (await page.locator('.loom-frame iframe').count()) === 1);

const events = await page.evaluate(() =>
  (window.dataLayer || []).filter((e) => e && e.event === 'video_play'),
);
check('video_play pushed once', events.length === 1, JSON.stringify(events[0]));
check('event carries key, title and context',
  events[0]?.video_key === 'intake' && !!events[0]?.video_title && events[0]?.video_context === 'homepage');

console.log('\nKeyboard — it is a real button, not a div');
const kb = await ctx.newPage();
await kb.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await kb.locator('.loom-frame').first().focus();
await kb.keyboard.press('Enter');
await kb.waitForTimeout(900);
check('Enter starts playback', (await kb.locator('.loom-frame iframe').count()) === 1);
await kb.close();

console.log('\nDeep pages carry their own video');
for (const [url, expected] of [['/intake/', 'intake'], ['/features/huddle/', 'huddle-page']]) {
  const pg = await ctx.newPage();
  await pg.goto(BASE + url, { waitUntil: 'domcontentloaded' });
  const n = await pg.locator('.loom-frame').count();
  const c = await pg.locator('.loom-frame').first().getAttribute('data-loom-context');
  check(`${url} has exactly one embed, context="${expected}"`, n === 1 && c === expected,
    `${n} embed(s), context="${c}"`);
  await pg.close();
}

await browser.close();
console.log('\n' + (fails ? `${fails} CHECK(S) FAILED` : 'ALL CHECKS PASSED'));
process.exit(fails ? 1 : 0);
