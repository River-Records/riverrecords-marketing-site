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

/*
 * Markdown for Agents is a setting on the riverrecords.ai ZONE. A *.pages.dev preview is
 * a different zone entirely and will never have it, so running the whole script against
 * a preview reported seventeen failures for a configuration that was working perfectly.
 * A check that cries wolf on previews is worse than no check, because the next person
 * learns to ignore it.
 *
 * The Link header and robots.txt ARE in the build, so those still run everywhere — which
 * is what makes a preview run useful at all.
 */
const ZONE_ONLY = /(^|\.)riverrecords\.ai$/.test(new URL(BASE).hostname);

/* ------------------------------------------------------ markdown negotiation */

if (!ZONE_ONLY) {
  console.log(`\nMarkdown for Agents — SKIPPED`);
  console.log(`  ${BASE} is not on the riverrecords.ai zone, and the feature is a zone`);
  console.log(`  setting. Run without BASE to check production.`);
}

if (ZONE_ONLY) {
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
  // x-markdown-tokens / x-original-tokens are Cloudflare's OPTIONAL diagnostic headers.
  // They vanished on 23 September 2026 while conversion carried on working perfectly, so
  // asserting on them failed all four pages over a vendor dropping a nice-to-have. A
  // check that reports a healthy feature as broken gets ignored, then gets deleted.
  // Reported, never failed.
  console.log(mdTokens && htmlTokens
    ? `  note    ${path} ${htmlTokens} → ${mdTokens} tokens, ${saved}% saved`
    : `  note    ${path} token-count headers absent (informational; conversion still works)`);
  // Without Vary, an edge or intermediary cache can hand a markdown response to a
  // browser. That is the failure mode that would be visible to real people.
  check(`${path} sets Vary: Accept`,
    (res.headers.get('vary') || '').toLowerCase().includes('accept'),
    `vary: ${res.headers.get('vary')}`);
}

/*
 * Cloudflare emits its own `content-signal` response header on converted markdown, and
 * on 23 September 2026 it said `ai-train=yes` while robots.txt said `ai-train=no`. Two
 * contradictory declarations of the same preference, with the contradiction served
 * precisely to the audience the signal exists for. Whichever one a crawler believes, one
 * of them is a lie we are telling.
 */
console.log('\nThe edge must not contradict robots.txt');
{
  const mdRes = await fetch(BASE + '/pricing/', { headers: { Accept: 'text/markdown' } });
  const hdr = (mdRes.headers.get('content-signal') || '').toLowerCase();
  if (!hdr) {
    console.log('  note    no content-signal response header (robots.txt is the only declaration)');
  } else {
    const robotsAhead = (await (await fetch(BASE + '/robots.txt')).text())
      .split('\n').find((l) => /^Content-Signal:/i.test(l.trim())) || '';
    for (const key of ['ai-train', 'search', 'ai-input']) {
      const inHeader = hdr.match(new RegExp(key + '\\s*=\\s*(yes|no)'))?.[1];
      const inRobots = robotsAhead.toLowerCase().match(new RegExp(key + '\\s*=\\s*(yes|no)'))?.[1];
      check(`${key} agrees between the header and robots.txt`, inHeader === inRobots,
        `header says ${inHeader}, robots.txt says ${inRobots}`);
    }
  }
}

/*
 * Cloudflare's Email Address Obfuscation rewrites any email in the HTML into a link to
 * /cdn-cgi/l/email-protection, which 404s. Crawlers that do not run the decoder script
 * follow it, so Ahrefs counted a broken link on every page carrying the dark CTA and
 * none of them ever saw the contact address. Turned off at the zone on 23 September
 * 2026 — a dashboard setting, so nothing in this repo prevents it coming back.
 */
console.log('\nEmail addresses reach crawlers unobfuscated');
{
  const page = await (await fetch(BASE + '/research/')).text();
  check('no /cdn-cgi/l/email-protection link', !page.includes('cdn-cgi/l/email-protection'),
    'Email Address Obfuscation is on again at the zone');
  check('the contact address is in the HTML as plain text',
    page.includes('hello@riverrecords.ai'));
  check('and it is a mailto a clinician can tap',
    page.includes('mailto:hello@riverrecords.ai'));
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
} // end ZONE_ONLY

/* ----------------------------------------------------------- content signals */

console.log('\nContent signals in the served robots.txt');
const robots = await (await fetch(BASE + '/robots.txt')).text();
const lines = robots.split('\n').filter((l) => /^Content-Signal:/i.test(l.trim()));

check('exactly one Content-Signal line', lines.length === 1,
  lines.length ? lines.join(' | ') : 'none found');
const signal = lines[0] || '';
/*
 * Structural, not a hardcoded policy. `ai-train=no` was asserted here and went stale the
 * day the decision changed — the same trap as the pricing date, in the script written to
 * avoid it. What each signal SAYS is a business call that lives in robots.txt with its
 * reasoning, and an unintended change to a repo file shows up in a diff. What needs
 * guarding is the edge, which is not in the repo — and the agreement check above does it.
 */
for (const key of ['search', 'ai-input', 'ai-train']) {
  const value = signal.match(new RegExp(key + '\\s*=\\s*(yes|no)'))?.[1];
  check(`${key} declared with a valid value`, !!value, `got "${value}"`);
}
console.log(`  note    current policy: ${signal.replace(/^Content-Signal:\s*/i, '')}`);
check('crawling still allowed', /^Allow:\s*\/$/m.test(robots));
check('no Disallow rules crept in', !/^Disallow:\s*\S/m.test(robots));

/* ---------------------------------------------- RFC 8288 Link header discovery */

console.log('\nLink header on the homepage');
const home = await fetch(BASE + '/', { redirect: 'follow' });
const link = home.headers.get('link') || '';

check('homepage returns a Link header', !!link, link || 'none');
check('advertises rel="describedby"', /rel="?describedby"?/.test(link), link);
check('points at /organization.jsonld', link.includes('/organization.jsonld'), link);

// Setting Link in _headers replaces the header Early Hints would synthesise, so ours
// has to carry the font preconnects or the 103 stops entirely — measured both ways.
// Losing it costs real visitors a round trip on first paint and nothing else would
// notice, which is precisely why it is asserted here.
check('font preconnects ride along, keeping Early Hints alive',
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
