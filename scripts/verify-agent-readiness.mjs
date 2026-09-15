#!/usr/bin/env node
// verify-agent-readiness.mjs — the two agent-facing signals still work in production.
//
// UNLIKE EVERY OTHER verify-* SCRIPT, THIS ONE CHECKS PRODUCTION, NOT dist/.
// That is the point. Markdown negotiation is not in this repo at all — it is Cloudflare's
// Markdown for Agents, converting HTML at the edge, and it **requires a Pro (or above)
// zone plan**. A billing change, an expired card, or someone tidying the AI Crawl Control
// settings would switch it off silently, and nothing in the build would notice. There is
// no code here to break, which is exactly why it needs a check that leaves the repo.
//
// Content signals ARE in the repo (public/robots.txt), but they are checked here too
// because Cloudflare has a managed robots.txt feature that can inject a second,
// conflicting block at the edge — so the served file is the only one that counts.
//
// No dependencies, no browser. Run against production, or any deployed preview:
//   node scripts/verify-agent-readiness.mjs
//   BASE=https://claude-my-branch.riverrecords-marketing-site.pages.dev node scripts/verify-agent-readiness.mjs

const BASE = process.env.BASE || 'https://www.riverrecords.ai';
const BROWSER_ACCEPT =
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8';

let fails = 0;
const check = (name, cond, detail) => {
  console.log((cond ? '  PASS  ' : '  FAIL  ') + name + (detail ? '\n          ' + detail : ''));
  if (!cond) fails++;
};

/* ------------------------------------------------------ markdown negotiation */

console.log(`\nMarkdown for Agents — ${BASE}`);

// One page of each kind: a config-driven page, the FAQ, a built pillar page, and a post
// whose source is already markdown. If the converter breaks it tends to break by shape.
const PAGES = ['/pricing/', '/faq/', '/clinical-documentation-automation/', '/blog/lost-diagnoses-and-chart-lore/'];

for (const path of PAGES) {
  let res, body;
  try {
    res = await fetch(BASE + path, { headers: { Accept: 'text/markdown' } });
    body = await res.text();
  } catch (err) {
    check(`${path} reachable`, false, err.message);
    continue;
  }

  const type = res.headers.get('content-type') || '';
  const mdTokens = Number(res.headers.get('x-markdown-tokens') || 0);
  const htmlTokens = Number(res.headers.get('x-original-tokens') || 0);
  const saved = htmlTokens ? Math.round((1 - mdTokens / htmlTokens) * 100) : 0;

  check(`${path} returns markdown`, type.includes('text/markdown'), `content-type: ${type}`);
  check(`${path} is not HTML`, !body.trimStart().startsWith('<'), body.slice(0, 60));
  check(`${path} reports token counts`, mdTokens > 0 && htmlTokens > 0,
    mdTokens && htmlTokens ? `${htmlTokens} → ${mdTokens} tokens, ${saved}% saved` : 'headers missing');
  // Without Vary, an edge or intermediary cache can hand a markdown response to a
  // browser. That is the failure mode that would be visible to real people.
  check(`${path} sets Vary: Accept`,
    (res.headers.get('vary') || '').toLowerCase().includes('accept'),
    `vary: ${res.headers.get('vary')}`);
}

console.log('\nHTML is still the default for browsers');
const html = await fetch(BASE + '/pricing/', { headers: { Accept: BROWSER_ACCEPT } });
check('a browser Accept header gets HTML',
  (html.headers.get('content-type') || '').includes('text/html'),
  `content-type: ${html.headers.get('content-type')}`);

console.log('\nThe markdown carries the facts, not just the shape');
const md = await (await fetch(BASE + '/pricing/', { headers: { Accept: 'text/markdown' } })).text();
check('frontmatter present', md.trimStart().startsWith('---'), md.slice(0, 40));
// If the converter ever drops the numbers, an agent quoting this page quotes nothing —
// worse than HTML, because it looks authoritative.
for (const fact of ['149', '99', '1,188']) {
  check(`price "${fact}" survives conversion`, md.includes(fact));
}

/* ----------------------------------------------------------- content signals */

console.log('\nContent signals in the served robots.txt');
const robots = await (await fetch(BASE + '/robots.txt')).text();
const lines = robots.split('\n').filter((l) => /^Content-Signal:/i.test(l.trim()));

check('exactly one Content-Signal line', lines.length === 1,
  lines.length ? lines.join(' | ') : 'none found');
const signal = lines[0] || '';
check('search=yes', /search\s*=\s*yes/.test(signal));
// Deliberately yes — this site is written to be quoted. See the reasoning in robots.txt.
check('ai-input=yes', /ai-input\s*=\s*yes/.test(signal), signal);
check('ai-train=no', /ai-train\s*=\s*no/.test(signal));
check('crawling still allowed', /^Allow:\s*\/$/m.test(robots));
check('no Disallow rules crept in', !/^Disallow:\s*\S/m.test(robots));

/* ---------------------------------------------- RFC 8288 Link header discovery */

console.log('\nLink header on the homepage');
const home = await fetch(BASE + '/', { redirect: 'follow' });
const link = home.headers.get('link') || '';

check('homepage returns a Link header', !!link, link || 'none');
check('advertises rel="describedby"', /rel="?describedby"?/.test(link), link);
check('points at /organization.jsonld', link.includes('/organization.jsonld'), link);

// Setting Link in _headers REPLACES Cloudflare's Early Hints header rather than adding
// to it, so the font preconnects have to be carried explicitly. Dropping them costs real
// visitors a round trip on first paint and nothing else would notice.
check('font preconnects survive alongside describedby',
  link.includes('fonts.googleapis.com') && link.includes('fonts.gstatic.com'), link);

// The header is worthless if the target 404s, and a Link header pointing at nothing is
// worse than no Link header — an agent spends a request to learn we lied.
const doc = await fetch(BASE + '/organization.jsonld');
check('the target actually resolves', doc.ok, `HTTP ${doc.status}`);
check('served as JSON-LD, not a download',
  (doc.headers.get('content-type') || '').includes('application/ld+json'),
  `content-type: ${doc.headers.get('content-type')}`);

let parsed = null;
try {
  parsed = JSON.parse(await doc.text());
} catch (err) {
  check('the target is valid JSON', false, err.message);
}
if (parsed) {
  check('the target is valid JSON', true);
  check('describes this organization',
    parsed['@type'] === 'Organization' && parsed.name === 'River Records',
    `${parsed['@type']} / ${parsed.name}`);
  // The standalone document must not be a worse answer than parsing the page.
  check('is a superset of the inline schema, not a different shape',
    !!parsed.description && !!parsed.url && !!parsed.makesOffer);
}

// Deliberately absent, and asserted so nobody adds them to chase a scorecard. All three
// describe APIs; this site has none, and an empty catalogue is a broken promise.
console.log('\nAPI relation types stay unclaimed (no public API exists)');
for (const rel of ['api-catalog', 'service-desc', 'service-doc']) {
  check(`does not advertise rel="${rel}"`, !link.includes(rel), link);
}

console.log('\n' + (fails ? `${fails} CHECK(S) FAILED` : 'ALL CHECKS PASSED'));
process.exit(fails ? 1 : 0);
