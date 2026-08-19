// Renders gtm/battle-cards/battle-cards.html to PDF.
// Usage: node gtm/battle-cards/render.cjs   (needs playwright available)
const fs = require('fs');
const path = require('path');

const HERE = __dirname;
const SRC = path.join(HERE, 'battle-cards.html');
const OUT = path.join(HERE, 'stream-battle-cards.pdf');

// Resolve playwright from wherever it's installed (this repo, or a sibling checkout).
const CANDIDATES = [
  'playwright',
  path.join(HERE, '../../node_modules/playwright'),
  path.join(process.env.HOME || '', 'RiverRecords/Stream/ai-scribe/frontend/node_modules/playwright'),
];
let chromium;
for (const c of CANDIDATES) {
  try { ({ chromium } = require(c)); break } catch (e) { /* try next */ }
}
if (!chromium) {
  console.error('playwright not found. Try: npm i -D playwright && npx playwright install chromium');
  process.exit(1);
}

// Mirrors the minimal reset the Artifact host applies, so PDF matches the web page.
const RESET = `
*,*::before,*::after{box-sizing:border-box}
body,h1,h2,h3,h4,h5,h6,p,ul,ol,figure,table,blockquote{margin:0;padding:0}
ul,ol{list-style:none}
table{border-collapse:collapse}
img,svg{max-width:100%;display:block}
a{color:inherit}
`;

(async () => {
  const fragment = fs.readFileSync(SRC, 'utf8');
  const doc = `<!doctype html><html lang="en" data-theme="light"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>${RESET}</style></head><body>${fragment}</body></html>`;

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(doc, { waitUntil: 'load' });
  await page.emulateMedia({ media: 'print', colorScheme: 'light' });
  await page.pdf({
    path: OUT,
    format: 'Letter',
    printBackground: true,
    margin: { top: '0.55in', bottom: '0.55in', left: '0.65in', right: '0.65in' },
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate:
      '<div style="width:100%;font-family:-apple-system,system-ui,sans-serif;font-size:7.5pt;color:#8A918D;padding:0 0.65in;display:flex;justify-content:space-between;">' +
      '<span>Stream — competitor battle cards. Internal; not for distribution to prospects.</span>' +
      '<span class="pageNumber"></span></div>',
  });
  await browser.close();
  console.log(`${path.basename(OUT)}  ${(fs.statSync(OUT).size / 1024).toFixed(0)}KB`);
})();
