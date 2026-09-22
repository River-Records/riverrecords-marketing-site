// verify-press.mjs — the interview links, which are the only claims on this site a
// visitor can check without trusting us.
//
// WHY THIS EXISTS
// Everything else on /about/ is the company describing the company. These two links are
// the part a sceptic can verify, which makes a dead one worse than no section at all —
// the visitor who clicks is exactly the visitor who was checking. And nothing in the
// build would notice: verify-internal-links.mjs only reads hrefs beginning with `/`, so
// an external URL can rot for a year in a green pipeline.
//
// Static analysis over dist/, no browser, runs in about a second:
//   npm run build && node scripts/verify-press.mjs
//
// The link-rot check needs the network and is therefore opt-in here, so this script
// stays runnable in a sandbox or on a plane:
//   npm run build && node scripts/verify-press.mjs --live
//
// CI runs it with --live weekly and on any pull request touching src/config/press.ts
// (.github/workflows/press-links.yml), so a link that dies goes red without anybody
// remembering to look. Weekly rather than on every push: link rot happens over months,
// and a pipeline that depends on two third parties being up on every commit is a
// pipeline people learn to ignore.
//
// What it asserts, and why each one has a way of going wrong:
//   - every configured appearance renders on /about/            (config edited, page not)
//   - every appearance renders on its speaker's team profile    (name match drifts)
//   - no profile carries somebody else's appearance             (match too loose)
//   - a written Q&A is never labelled a podcast                 (the one dishonesty here)
//   - every outbound link is https + target=_blank + noopener   (copy-paste omission)
//   - /organization.jsonld declares exactly the same URLs       (two lists, one source)

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { probe, TRIES } from './lib/link-probe.mjs';
import { join } from 'node:path';

const DIST = 'dist';
const LIVE = process.argv.includes('--live');

let fails = 0;
const check = (n, c, d) => {
  console.log((c ? '  PASS  ' : '  FAIL  ') + n + (d ? '\n          ' + d : ''));
  if (!c) fails++;
};

const short = (u) => (u.length > 58 ? u.slice(0, 58) + '\u2026' : u);

if (!existsSync(join(DIST, 'about', 'index.html'))) {
  console.error('dist/ not built — run `npm run build` first.');
  process.exit(1);
}

// The config is TypeScript, so read it as text rather than importing it. Only the URLs,
// titles and kinds are needed, and a regex over a hand-maintained list is cheaper than
// adding a TS loader to a script that has to keep running in one second.
const src = readFileSync('src/config/press.ts', 'utf8');
const items = [...src.matchAll(/\{\s*\n\s*key:\s*'([^']+)',\s*\n\s*kind:\s*'([^']+)',\s*\n\s*outlet:\s*'([^']+)',\s*\n\s*title:\s*\n?\s*'((?:[^'\\]|\\.)*)',\s*\n\s*url:\s*'([^']+)',/g)].map(
  (m) => ({ key: m[1], kind: m[2], outlet: m[3], title: m[4].replace(/\\'/g, "'"), url: m[5] }),
);
const people = Object.fromEntries(
  [...src.matchAll(/key:\s*'([^']+)'[\s\S]*?people:\s*\[([^\]]*)\]/g)].map((m) => [
    m[1],
    [...m[2].matchAll(/'([^']+)'/g)].map((x) => x[1]),
  ]),
);

const about = readFileSync(join(DIST, 'about', 'index.html'), 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const profiles = readdirSync(join(DIST, 'team')).map((slug) => ({
  slug,
  html: readFileSync(join(DIST, 'team', slug, 'index.html'), 'utf8'),
}));
const nameOf = (html) => (html.match(/<h1[^>]*>([^<]+)<\/h1>/) || [, ''])[1];

console.log(`\nParsed ${items.length} appearance(s) from src/config/press.ts`);
check('the config parsed at all', items.length > 0, 'regex found nothing — did the shape of press.ts change?');
check('every appearance has a distinct URL', new Set(items.map((i) => i.url)).size === items.length);

console.log('\n/about/ renders what the config declares');
for (const i of items) {
  check(`${i.key} — title rendered`, about.includes(esc(i.title)));
  check(`${i.key} — outlet named`, about.includes(esc(i.outlet)));
  check(`${i.key} — links out`, about.includes(`href="${i.url}"`));
}

console.log('\nEach appearance is on its speaker’s profile, and nobody else’s');
for (const i of items) {
  const carrying = profiles.filter((p) => p.html.includes(`href="${i.url}"`));
  check(`${i.key} — on at least one profile`, carrying.length > 0,
    carrying.length ? '' : `no team page links ${i.url} — the name match in pressBy() is not hitting`);
  const wrong = carrying.filter(
    (p) => !(people[i.key] || []).some((n) => nameOf(p.html).toLowerCase().includes(n.toLowerCase().split(' ').pop())),
  );
  check(`${i.key} — only on the right profile(s)`, wrong.length === 0, wrong.map((p) => p.slug).join(', '));
}

console.log('\nThe label says what the thing actually is');
for (const i of items) {
  // Find the card and read the badge inside it, rather than searching the whole page.
  const at = about.indexOf(`href="${i.url}"`);
  const card = at === -1 ? '' : about.slice(at, at + 900);
  const badge = (card.match(/class="talk-kind[^"]*"[^>]*>([^<]+)</) || [, ''])[1].trim();
  const expected = i.kind === 'podcast' ? 'Podcast' : 'Written Q&amp;A';
  check(`${i.key} — labelled ${expected.replace('&amp;', '&')}`, badge === expected, `badge reads "${badge}"`);
}

console.log('\nEvery outbound link is safe and absolute');
const cards = [...about.matchAll(/<a href="(https?:\/\/[^"]+)"([^>]*)class="talk-card"/g)];
check('every card is an anchor to an absolute URL', cards.length === items.length, `${cards.length} cards, ${items.length} configured`);
for (const [, url, attrs] of cards) {
  check(`${url.slice(0, 48)}… — https`, url.startsWith('https://'));
  check(`${url.slice(0, 48)}… — opens in a new tab with noopener`,
    attrs.includes('target="_blank"') && /rel="[^"]*noopener/.test(attrs), attrs.trim());
}

console.log('\n/organization.jsonld declares the same list, from the same source');
const doc = JSON.parse(readFileSync(join(DIST, 'organization.jsonld'), 'utf8'));
const declared = (doc.subjectOf || []).filter((s) => !s.url.startsWith('https://www.riverrecords.ai'));
check('one entry per appearance', declared.length === items.length, `${declared.length} declared, ${items.length} configured`);
check('same URLs', items.every((i) => declared.some((d) => d.url === i.url)),
  items.filter((i) => !declared.some((d) => d.url === i.url)).map((i) => i.key).join(', '));
check('podcasts typed as PodcastEpisode',
  items.filter((i) => i.kind === 'podcast').every((i) => declared.find((d) => d.url === i.url)?.['@type'] === 'PodcastEpisode'));
check('no appearance claims us as publisher',
  declared.every((d) => d.publisher?.name && d.publisher.name !== 'River Records'),
  'subjectOf is for work somebody else published about us');

if (LIVE) {
  console.log('\nEvery link still resolves (--live)');
  for (const i of items) {
    const r = await probe(i.url);
    if (r.ok) {
      check(`${i.key} — ${short(i.url)}`, true, `HTTP ${r.status}`);
    } else if (r.gone) {
      check(`${i.key} — ${short(i.url)}`, false,
        `HTTP ${r.status} — this link is gone. Replace the URL or remove the entry; ` +
        'link rot is the failure this check exists for.');
    } else {
      check(`${i.key} — ${short(i.url)}`, false,
        `${r.status} after ${TRIES} attempts — no 2xx. This can also be the publisher ` +
        'refusing a datacentre IP rather than a dead page, so open it in a browser ' +
        'before editing the config.');
    }
  }
} else {
  console.log('\nSkipped the link-rot check — it needs the network, so it is opt-in and');
  console.log('this script still runs on a plane. It runs weekly in CI (press-links.yml),');
  console.log('and on any pull request touching src/config/press.ts.');
}

console.log('\n' + (fails ? `${fails} CHECK(S) FAILED` : 'ALL CHECKS PASSED'));
process.exit(fails ? 1 : 0);
