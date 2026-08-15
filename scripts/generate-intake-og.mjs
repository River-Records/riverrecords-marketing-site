/**
 * Generates the Stream Intake OG image (1200x630) at public/intake/og-intake.png.
 *
 * The image is the excerpt-to-source-highlight moment, drawn from the same
 * fictional demo data the page uses (src/components/demos/demo-data.js) — no real
 * practice, clinician, institution or record content ever enters this file.
 *
 * Usage: node scripts/generate-intake-og.mjs
 * Requires playwright + the preinstalled Chromium. Re-run only when the visual changes.
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { INTAKE_DOCUMENT, INTAKE_EXCERPTS, INTAKE_PAGES } from '../src/components/demos/demo-data.js';

const CHROME = process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const excerpt = INTAKE_EXCERPTS[0];
const page3 = INTAKE_PAGES[3];
const hit = 'dm-a1c';

const facts = excerpt.groups
  .map(
    (g) => `
    <div class="group">
      <div class="glabel">${g.label}</div>
      ${g.facts
        .map(
          (f) => `<div class="fact ${f.line === hit ? 'on' : ''}">
            <span>${f.text}</span><span class="pg">p.${f.page}</span>
          </div>`
        )
        .join('')}
    </div>`
  )
  .join('');

const lines = page3.lines
  .map((l) =>
    l.id === hit
      ? `<p class="dl"><mark>${l.text}</mark></p>`
      : `<p class="dl">${l.text}</p>`
  )
  .join('');

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:1200px; height:630px; background:#f5f1e8; font-family:'Inter Tight',system-ui,sans-serif; color:#0f1a14; overflow:hidden; }
  .wrap { padding:44px 52px; height:100%; display:flex; flex-direction:column; }
  .eyebrow { font-family:'JetBrains Mono',monospace; font-size:15px; letter-spacing:0.12em; text-transform:uppercase; color:#1e5a3e; margin-bottom:14px; }
  h1 { font-family:'Fraunces',Georgia,serif; font-size:46px; line-height:1.1; letter-spacing:-0.025em; margin-bottom:26px; max-width:24ch; }
  .panes { flex:1; display:grid; grid-template-columns:1fr 1fr; background:#fff; border:1px solid rgba(15,26,20,0.14); border-radius:14px; overflow:hidden; box-shadow:0 10px 34px rgba(15,26,20,0.12); }
  .pane { padding:16px 18px; min-width:0; }
  .pane + .pane { border-left:1px solid rgba(15,26,20,0.12); background:#fbfbfa; }
  .plabel { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:#566b60; margin-bottom:12px; display:flex; justify-content:space-between; }
  .stamp { font-size:12px; font-style:italic; color:#566b60; background:#f5f1e8; border-left:2px solid #c9c3b4; padding:7px 9px; border-radius:0 4px 4px 0; margin-bottom:10px; }
  .prob { font-size:15px; font-weight:700; margin-bottom:10px; }
  .group { margin-bottom:9px; }
  .glabel { font-family:'JetBrains Mono',monospace; font-size:9.5px; letter-spacing:0.09em; text-transform:uppercase; color:#8b9a92; margin-bottom:3px; }
  .fact { display:flex; justify-content:space-between; gap:10px; font-size:12.5px; border:1px solid rgba(15,26,20,0.12); border-radius:6px; padding:7px 9px; }
  .fact.on { border-color:#4a90d9; background:#e8f0fe; }
  .pg { font-size:10.5px; font-weight:700; color:#4a90d9; }
  .doc { font-family:'Times New Roman',serif; font-size:12.5px; line-height:1.7; color:#2a2a2a; }
  .lh { border-bottom:1.5px solid #333; padding-bottom:5px; margin-bottom:10px; }
  .lh b { font-size:13px; } .lh span { display:block; font-family:'Inter Tight',sans-serif; font-size:10.5px; color:#666; }
  .dl { margin-bottom:5px; }
  mark { background:#ffe9a8; box-shadow:0 0 0 3px #ffe9a8; border-radius:1px; }
  .foot { margin-top:16px; display:flex; justify-content:space-between; align-items:center; font-size:13px; color:#566b60; }
  .foot b { color:#0f1a14; }
  .badge { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.08em; text-transform:uppercase; color:#8b9a92; }
</style></head><body>
  <div class="wrap">
    <div class="eyebrow">Stream Intake</div>
    <h1>Every fact, one click from the page it came from.</h1>
    <div class="panes">
      <div class="pane">
        <div class="plabel"><span>Huddle · Excerpt</span></div>
        <div class="stamp">${INTAKE_DOCUMENT.stamp}</div>
        <div class="prob">${excerpt.problem}</div>
        ${facts}
      </div>
      <div class="pane">
        <div class="plabel"><span>Source</span><span>page 3 of ${INTAKE_DOCUMENT.pageCount}</span></div>
        <div class="doc">
          <div class="lh"><b>${INTAKE_DOCUMENT.institution}</b><span>${INTAKE_DOCUMENT.type} · ${INTAKE_DOCUMENT.date} · ${INTAKE_DOCUMENT.author}</span></div>
          ${lines}
        </div>
      </div>
    </div>
    <div class="foot">
      <span><b>Stream</b> by River Records</span>
      <span class="badge">Demo — fake patient data</span>
    </div>
  </div>
</body></html>`;

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'load' });
await page.waitForTimeout(1200); // let webfonts settle
await mkdir(new URL('../public/intake/', import.meta.url), { recursive: true });
const buf = await page.screenshot({ clip: { x: 0, y: 0, width: 1200, height: 630 } });
await writeFile(new URL('../public/intake/og-intake.png', import.meta.url), buf);
await browser.close();
console.log('wrote public/intake/og-intake.png (1200x630)');
