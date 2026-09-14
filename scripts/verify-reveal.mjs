// verify-reveal.mjs — nothing with `.reveal` on it stays invisible.
//
// shared.css sets `.reveal { opacity: 0 }` and only `.reveal.visible` restores it. That
// class used to be added by a per-page inline IntersectionObserver, so a page that
// forgot one rendered the element invisible — and CtaDark hardcodes `reveal`, so the
// failure mode was a page with no visible call to action. /research/ shipped that way.
//
// It is a silent class of bug: the markup is present, the build passes, the link is
// clickable by a test that queries the DOM, and the internal-links check is happy.
// Only a computed opacity catches it. Same family as verify-button-contrast.mjs.
//
// No test runner, no devDependencies:
//   npm run build
//   npx --yes http-server dist -p 4321 --silent &
//   mkdir -p /tmp/pw && cd /tmp/pw && npm init -y && npm i playwright
//   DIST=/path/to/dist CHROME_PATH=... node /path/to/scripts/verify-reveal.mjs

import { chromium } from 'playwright';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const BASE = process.env.BASE || 'http://127.0.0.1:4321';
const DIST = process.env.DIST || 'dist';

let fails = 0;
const check = (name, cond, detail) => {
  console.log((cond ? '  PASS  ' : '  FAIL  ') + name + (detail ? '  — ' + detail : ''));
  if (!cond) fails++;
};

/** Every built page carrying the reveal class, so coverage tracks the site automatically. */
function pagesWithReveal(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) pagesWithReveal(full, out);
    else if (entry === 'index.html') {
      if (/class="[^"]*\breveal\b/.test(readFileSync(full, 'utf8'))) {
        out.push('/' + relative(DIST, full).replace(/index\.html$/, ''));
      }
    }
  }
  return out;
}

const pages = pagesWithReveal(DIST).sort();
console.log(`\n${pages.length} page(s) use .reveal — checking every one, no sampling\n`);

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const ctx = await browser.newContext();

for (const path of pages) {
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });

  // Walk the page so everything below the fold enters the viewport. Half-viewport steps
  // with a pause at each: the observer uses a -40px bottom margin, and scrolling faster
  // than it can settle produces failures that say more about the test than the page.
  // documentElement, not body — body.scrollHeight understates the page here.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.5;
    const height = document.documentElement.scrollHeight;
    for (let y = 0; y < height; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 200));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
  });
  // The transition is 0.6s and .reveal-delay-3 adds another 0.3s, so anything under
  // ~900ms measures elements mid-fade and reports them as hidden.
  await page.waitForTimeout(1600);

  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll('.reveal')]
      .filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.9)
      .map((el) => el.className + (el.textContent || '').trim().slice(0, 40)),
  );
  const total = await page.locator('.reveal').count();

  check(`${path} (${total} reveal element(s))`, hidden.length === 0,
    hidden.length ? `${hidden.length} still hidden: ${hidden.join(' | ')}` : '');
  await page.close();
}

// The fallback that matters most: with JS off, scroll-reveal is an enhancement that
// must not take the content with it.
console.log('\nWith JavaScript disabled');
const noJs = await browser.newContext({ javaScriptEnabled: false });
const p = await noJs.newPage();
await p.goto(BASE + '/clinical-documentation-automation/', { waitUntil: 'domcontentloaded' });
const op = await p.evaluate(() => {
  const el = document.querySelector('.reveal');
  return el ? getComputedStyle(el).opacity : 'none';
});
check('reveal content is visible without JS', op === 'none' || parseFloat(op) >= 0.9, `opacity ${op}`);
await noJs.close();

await browser.close();
console.log('\n' + (fails ? `${fails} CHECK(S) FAILED` : 'ALL CHECKS PASSED'));
process.exit(fails ? 1 : 0);
