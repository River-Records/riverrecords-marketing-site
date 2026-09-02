// verify-internal-links.mjs — every internal link must end in a slash, and resolve.
//
// WHY THIS MATTERS
// Cloudflare 308s /path to /path/, the sitemap lists trailing slashes, and the canonical
// tag emits them. The site was nonetheless linking to the no-slash form in ~3,000 places,
// so its own internal linking contradicted every canonical signal it published. Each
// click cost a redirect hop, and Google kept rediscovering URLs it was being told not to
// index.
//
// Static analysis over dist/ — no browser, runs in about a second. Two assertions:
// every internal href ends in a slash, and every one resolves to a page that was built.
//
//   npm run build && node scripts/verify-internal-links.mjs

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const ASSET = /\.(xml|png|jpe?g|svg|js|css|pdf|ico|txt|webmanifest)$/i;

function html(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) html(p, out);
    else if (e.endsWith('.html')) out.push(p);
  }
  return out;
}

const files = html(DIST);
const noSlash = new Map();
const all = new Set();

for (const f of files) {
  const h = readFileSync(f, 'utf8');
  for (const m of h.matchAll(/href="(\/[^"#?]*)"/g)) {
    const u = m[1];
    if (ASSET.test(u)) continue;
    all.add(u);
    if (u !== '/' && !u.endsWith('/')) noSlash.set(u, (noSlash.get(u) || 0) + 1);
  }
}

const broken = [...all].filter(
  (u) => u !== '/' && !existsSync(join(DIST, u.replace(/\/$/, ''), 'index.html')) && !existsSync(join(DIST, u)),
);

let fails = 0;
const check = (n, c, d) => { console.log((c ? '  PASS  ' : '  FAIL  ') + n + (d ? '\n          ' + d : '')); if (!c) fails++; };

console.log(`\nScanned ${files.length} pages, ${all.size} distinct internal links`);
check('every internal link ends in a slash', noSlash.size === 0,
  [...noSlash.entries()].slice(0, 8).map(([u, c]) => `${c}× ${u}`).join('  '));
check('every internal link resolves to a built page', broken.length === 0, broken.slice(0, 8).join('  '));

console.log('\n' + (fails ? `${fails} CHECK(S) FAILED` : 'ALL CHECKS PASSED'));
process.exit(fails ? 1 : 0);
