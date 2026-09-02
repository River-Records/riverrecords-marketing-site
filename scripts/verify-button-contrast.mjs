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

const lum = (c) => {
  const m = (c.match(/[\d.]+/g) || []).map(Number);
  const [r, g, b] = m.slice(0, 3).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
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
    const l1 = lum(b.color), l2 = lum(b.bg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
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
