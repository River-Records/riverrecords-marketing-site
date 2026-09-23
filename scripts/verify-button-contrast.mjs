// verify-button-contrast.mjs — every button must be readable.
//
// This exists because the same CSS specificity trap shipped twice. A page-scoped rule
// like `.pc a { color: var(--primary) }` is class+element, so it outranks the single
// class `.btn-primary-lg` and repaints button text in the link colour — which on a
// green button is the same green. The pricing page hit it first (invisible price line),
// then the pediatric coding guide (a 1.00:1 button, literally unreadable).
//
// Both times the build passed and every functional test passed. Only looking at the
// page caught it. So this measures instead: real computed colours from a real browser,
// walking up for the first non-transparent background, scored against WCAG AA.
//
//   npm run build && npx --yes http-server dist -p 4321 --silent &
//   CHROME_PATH=... node scripts/verify-button-contrast.mjs

import { chromium } from 'playwright';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.BASE || 'http://127.0.0.1:4321';
const AA = 4.5;          // WCAG AA for normal text
const AA_LARGE = 3.0;    // buttons are often large/bold; treated as the floor

function pages(dir = 'dist', out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) pages(p, out);
    else if (e === 'index.html') out.push('/' + dir.replace(/^dist\/?/, '') + (dir === 'dist' ? '' : '/'));
  }
  return [...new Set(out)];
}

/**
 * Parse a CSS colour to [r, g, b, a]. Alpha defaults to 1.
 *
 * This used to drop alpha and read the first three numbers, which silently flattered
 * every translucent element it measured: `rgba(255,255,255,0.5)` on a near-black ground
 * scored 17.8:1 when the composited truth is about 5.3:1. Half-opacity white text is
 * common in this codebase — the dark CTA's trust line is exactly that — so the check
 * most relied on for "is this readable" was the one least able to judge it.
 */
const parse = (c) => {
  const m = (c.match(/[\d.]+/g) || []).map(Number);
  return [m[0] || 0, m[1] || 0, m[2] || 0, m.length > 3 ? m[3] : 1];
};

/** Composite a possibly-translucent foreground over an opaque background. */
const over = (fg, bg) => {
  const [r, g, b, a] = parse(fg);
  const [br, bgc, bb] = parse(bg);
  return [a * r + (1 - a) * br, a * g + (1 - a) * bgc, a * b + (1 - a) * bb];
};

const lumOf = ([r, g, b]) => {
  const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

/** Contrast of possibly-translucent text against its background. */
const contrast = (fg, bg) => {
  const L1 = lumOf(over(fg, bg));
  const L2 = lumOf(parse(bg).slice(0, 3));
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
};

const all = pages();
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const p = await (await browser.newContext()).newPage();
let checked = 0, failures = [];

for (const path of all) {
  await p.goto(BASE + path, { waitUntil: 'domcontentloaded' });
  const btns = await p.evaluate(() =>
    [...document.querySelectorAll('a.btn, button.btn, .btn-primary-lg, .btn-secondary-lg')].map((el) => {
      const s = getComputedStyle(el);
      let bg = s.backgroundColor, n = el;
      while ((bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') && n.parentElement) {
        n = n.parentElement; bg = getComputedStyle(n).backgroundColor;
      }
      return { text: (el.textContent || '').trim().slice(0, 30), color: s.color, bg };
    }),
  );
  for (const b of btns) {
    checked++;
    const ratio = contrast(b.color, b.bg);
    if (ratio < AA_LARGE) failures.push({ path, ...b, ratio });
  }
}

console.log(`\nChecked ${checked} buttons across ${all.length} pages`);
for (const f of failures) {
  console.log(`  FAIL  ${f.path}  "${f.text}"  ${f.ratio.toFixed(2)}:1`);
  console.log(`        ${f.color} on ${f.bg}`);
}
console.log('\n' + (failures.length ? `${failures.length} UNREADABLE BUTTON(S)` : 'ALL BUTTONS READABLE'));
await browser.close();
process.exit(failures.length ? 1 : 0);
