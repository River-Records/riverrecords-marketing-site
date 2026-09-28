#!/usr/bin/env node
// build-product-pdf.mjs — render /product-overview/ to a PDF for Elion and buyers.
//
// The document is an Astro page rather than a hand-built file so every number reads from
// src/config/pricing.ts. A PDF assembled by hand goes stale the first time pricing moves
// and nobody remembers it exists — which is exactly how the Elion listing came to
// advertise "starting at 30" against a real price of $149.
//
// RE-RUN AFTER ANY PRICING CHANGE. Nothing enforces that; the generated PDF carries the
// date it was built so a stale one is at least identifiable.
//
// This repo has no test runner and no devDependencies; keeping it that way.
//   npm run build
//   npx --yes http-server dist -p 4321 --silent &
//   mkdir -p /tmp/pw && cd /tmp/pw && npm init -y && npm i playwright
//   CHROME_PATH=... node /path/to/scripts/build-product-pdf.mjs [--out FILE]

import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:4321';
const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const OUT = arg('out', 'stream-product-overview.pdf');

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const page = await browser.newPage();

const res = await page.goto(BASE + '/product-overview/', { waitUntil: 'networkidle' });
if (!res || res.status() !== 200) {
  console.error(`Could not load ${BASE}/product-overview/ — HTTP ${res?.status()}`);
  process.exit(1);
}

// The page is noindex and is not linked from anywhere, so a typo in the route would
// otherwise produce a confident, empty PDF.
const heading = await page.textContent('.doc-head h1').catch(() => null);
if (heading !== 'Stream by River Records') {
  console.error(`Unexpected page content — got heading "${heading}". Refusing to write a PDF.`);
  process.exit(1);
}

// Fonts are loaded from Google Fonts; printing before they swap in produces a document
// set in the fallback stack.
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);

await page.pdf({
  path: OUT,
  format: 'Letter',
  printBackground: true,
  margin: { top: '0.7in', bottom: '0.7in', left: '0.75in', right: '0.75in' },
  displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate:
    '<div style="width:100%;font-size:8px;color:#888;padding:0 0.75in;' +
    'display:flex;justify-content:space-between;font-family:sans-serif;">' +
    '<span>Stream by River Records — Product Overview</span>' +
    '<span class="pageNumber"></span></div>',
});

const { pages } = await page.evaluate(() => ({ pages: document.body.scrollHeight }));
await browser.close();

console.log(`\n  wrote ${OUT}`);
console.log(`  source: ${BASE}/product-overview/  (${pages}px tall)`);
console.log('  Re-run after any change to src/config/pricing.ts.\n');
