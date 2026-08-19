// Renders gtm/field-sheets/field-sheets.html to PDFs.
// Usage: node gtm/field-sheets/render.cjs   (needs playwright available)
//
// Produces one combined deck plus one PDF per segment. Every single-segment
// PDF carries the guardrails page too — a rep with the pitch and not the
// claim rules is how "SOC 2 compliant" ends up in an email.
const fs = require('fs');
const path = require('path');

const HERE = __dirname;
const SRC = path.join(HERE, 'field-sheets.html');

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

// keep: indices of .sheet sections to retain (0=peds, 1=dpc, 2=im); guardrails always kept
const TARGETS = [
  { file: 'stream-field-sheets-all.pdf', keep: [0, 1, 2], label: null },
  { file: 'stream-pediatrics.pdf', keep: [0], label: 'Independent Pediatrics' },
  { file: 'stream-direct-primary-care.pdf', keep: [1], label: 'Direct Primary Care & Concierge' },
  { file: 'stream-internal-medicine.pdf', keep: [2], label: 'Internal Medicine & Risk-Bearing Primary Care' },
];

(async () => {
  const fragment = fs.readFileSync(SRC, 'utf8');
  const doc = `<!doctype html><html lang="en" data-theme="light"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>${RESET}</style></head><body>${fragment}</body></html>`;

  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const t of TARGETS) {
    await page.setContent(doc, { waitUntil: 'load' });
    await page.evaluate(({ keep, label }) => {
      document.querySelectorAll('.sheet').forEach((el, i) => {
        if (!keep.includes(i)) el.remove();
      });
      if (label) {
        // a single-segment sheet shouldn't advertise the other two
        const meta = document.querySelector('.masthead .meta span');
        if (meta) meta.textContent = label;
        const eyebrow = document.querySelector('.sheet .eyebrow');
        if (eyebrow) eyebrow.textContent = 'Field sheet';
      }
    }, { keep: t.keep, label: t.label });
    await page.emulateMedia({ media: 'print', colorScheme: 'light' });

    const dest = path.join(HERE, t.file);
    await page.pdf({
      path: dest,
      format: 'Letter',
      printBackground: true,
      margin: { top: '0.6in', bottom: '0.6in', left: '0.7in', right: '0.7in' },
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate:
        '<div style="width:100%;font-family:-apple-system,system-ui,sans-serif;font-size:7.5pt;color:#8A918D;padding:0 0.7in;display:flex;justify-content:space-between;">' +
        '<span>Stream — internal field sheet. Not for distribution to prospects.</span>' +
        '<span class="pageNumber"></span></div>',
    });
    console.log(`${t.file}  ${(fs.statSync(dest).size / 1024).toFixed(0)}KB`);
  }

  await browser.close();
})();
