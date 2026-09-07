// fetch-reddit-corpus.mjs — pulls a subreddit's posts and comments into JSONL for
// thematic analysis (what private-practice clinicians actually complain about, in
// their own words).
//
// Why this exists as a script rather than something an agent does inline: cloud
// sessions run behind an egress allowlist set to Trusted, which denies reddit.com at
// the CONNECT stage. The code is fine; the socket never opens. So this runs either
// locally, or in a cloud environment whose Network access is set to Custom with
// www.reddit.com and oauth.reddit.com allowed. The preflight below detects the
// difference and says which one you are in, because the failure otherwise looks
// like a credentials problem and is not.
//
// Auth is app-only (client_credentials), so it needs a Reddit "script" app's id and
// secret and no user password. Public subreddit reads are all it can do, which is
// all this needs.
//
//   REDDIT_CLIENT_ID=... REDDIT_CLIENT_SECRET=... \
//     node scripts/fetch-reddit-corpus.mjs --sub privatepracticedocs --comments
//
// Flags:
//   --sub <name>        repeatable; subreddits to sweep
//   --out <dir>         output root (default research/reddit/data)
//   --comments          also fetch comment trees (slow: one request per post)
//   --max-posts <n>     cap per subreddit (default 1200)
//   --keep-authors      store usernames verbatim (default: salted hash — see below)
//   --resume            skip posts whose comments are already on disk
//
// Usernames are hashed by default. Theme analysis needs the text, not the person,
// and a checked-out corpus of identifiable health-adjacent complaints is a liability
// with no upside. --keep-authors is there if you need to spot a repeat voice.

const args = process.argv.slice(2);
const flag = n => args.includes('--' + n);
const val = (n, d) => { const i = args.indexOf('--' + n); return i > -1 && args[i + 1] ? args[i + 1] : d; };
const many = n => args.reduce((a, v, i) => (v === '--' + n && args[i + 1] ? [...a, args[i + 1]] : a), []);

const SUBS = many('sub');
const OUT = val('out', 'research/reddit/data');
const MAX_POSTS = Number(val('max-posts', 1200));
const WANT_COMMENTS = flag('comments');
const KEEP_AUTHORS = flag('keep-authors');
const RESUME = flag('resume');
const UA = process.env.REDDIT_USER_AGENT || 'nodejs:riverrecords-research:1.0 (by /u/riverrecords)';

if (!SUBS.length) { console.error('Need at least one --sub. Example: --sub privatepracticedocs'); process.exit(2); }

const { mkdir, appendFile, writeFile, readFile } = await import('node:fs/promises');
const { createHash, randomBytes } = await import('node:crypto');
const { join } = await import('node:path');

// Salt lives with the corpus so a rerun keeps the same pseudonyms, but is never
// committed — without it the hashes cannot be walked back to usernames.
let SALT;
const saltPath = join(OUT, '.author-salt');
await mkdir(OUT, { recursive: true });
try { SALT = (await readFile(saltPath, 'utf8')).trim(); }
catch { SALT = randomBytes(16).toString('hex'); await writeFile(saltPath, SALT + '\n'); }
const author = a => !a || a === '[deleted]' ? a
  : KEEP_AUTHORS ? a
  : 'u_' + createHash('sha256').update(SALT + a).digest('hex').slice(0, 12);

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ---------------------------------------------------------------- preflight

// The egress proxy denies a blocked host by answering CONNECT with a 403 rather
// than dropping the socket, so fetch() resolves normally and the failure arrives
// looking like Reddit rejecting the credentials. It isn't. The x-deny-reason header
// is what tells the two apart, and getting this wrong costs an hour of rotating
// perfectly good API keys.
function egressBlocked(res, body) {
  return res.headers.get('x-deny-reason') === 'host_not_allowed'
    || /not in allowlist|egress/i.test(body || '');
}

function diagnose(err) {
  const m = String(err && (err.cause?.message || err.message) || err);
  const blocked = /CONNECT|EPROTO|ECONNREFUSED|fetch failed|tunnel/i.test(m);
  if (!blocked) return null;
  return explain(m);
}

function explain(detail) {
  return [
    '',
    'Could not open a connection to Reddit: ' + detail,
    '',
    'That is the network egress allowlist refusing the host — not your credentials.',
    'A cloud session on Trusted network access denies reddit.com before any HTTP',
    'is sent. To fix it, in the cloud environment settings:',
    '',
    '  1. Network access  -> Custom',
    '  2. Allowed domains -> www.reddit.com',
    '                        oauth.reddit.com',
    '  3. Tick "Also include default list of common package managers"',
    '     (without it npm breaks and the site stops building)',
    '  4. Start a NEW session — the policy is fixed when the VM boots',
    '',
    'Or just run this script on a machine with open network access.',
    ''
  ].join('\n');
}

// ---------------------------------------------------------------- transport

let token = null, tokenExpiry = 0;

async function getToken() {
  if (token && Date.now() < tokenExpiry) return token;
  const id = process.env.REDDIT_CLIENT_ID, secret = process.env.REDDIT_CLIENT_SECRET;
  if (!id || !secret) {
    console.error('Set REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET (create a "script" app at');
    console.error('https://www.reddit.com/prefs/apps — app-only read access is enough).');
    process.exit(2);
  }
  let res;
  try {
    res = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(id + ':' + secret).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': UA
      },
      body: 'grant_type=client_credentials'
    });
  } catch (err) {
    const hint = diagnose(err);
    if (hint) { console.error(hint); process.exit(1); }
    throw err;
  }
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    if (egressBlocked(res, body)) { console.error(explain(body.trim() || res.status + ' from the egress proxy')); process.exit(1); }
    console.error(`Token request failed: ${res.status} ${res.statusText}`);
    if (res.status === 401) console.error('401 means the id/secret pair is wrong, or the app is not a "script" app.');
    process.exit(1);
  }
  const j = await res.json();
  token = j.access_token;
  tokenExpiry = Date.now() + (j.expires_in - 60) * 1000;
  return token;
}

// Reddit allows 100 requests/minute for OAuth clients. 700ms between calls keeps us
// under it without reading headers optimistically; the headers are still honoured
// when they say we are closer to the edge than that.
let nextAllowed = 0;

async function api(path) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const wait = nextAllowed - Date.now();
    if (wait > 0) await sleep(wait);
    nextAllowed = Date.now() + 700;

    const t = await getToken();
    let res;
    try {
      res = await fetch('https://oauth.reddit.com' + path, {
        headers: { Authorization: 'Bearer ' + t, 'User-Agent': UA }
      });
    } catch (err) {
      const hint = diagnose(err);
      if (hint) { console.error(hint); process.exit(1); }
      throw err;
    }

    const remaining = Number(res.headers.get('x-ratelimit-remaining'));
    const reset = Number(res.headers.get('x-ratelimit-reset'));
    if (Number.isFinite(remaining) && remaining < 5 && Number.isFinite(reset)) {
      nextAllowed = Date.now() + (reset + 1) * 1000;
    }

    if (res.status === 429 || res.status >= 500) {
      const backoff = 2000 * 2 ** attempt;
      console.warn(`  ${res.status} on ${path} — retrying in ${backoff / 1000}s`);
      await sleep(backoff);
      continue;
    }
    if (res.status === 401) { token = null; continue; }
    if (res.status === 403) {
      const body = await res.text().catch(() => '');
      if (egressBlocked(res, body)) { console.error(explain(body.trim())); process.exit(1); }
      throw new Error(`403 on ${path} — subreddit is private or quarantined`);
    }
    if (res.status === 404) throw new Error(`404 on ${path} — subreddit does not exist (check the spelling)`);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} on ${path}`);
    return res.json();
  }
  throw new Error(`gave up after 5 attempts on ${path}`);
}

// ---------------------------------------------------------------- shaping

const postRow = d => ({
  id: d.id,
  created_utc: d.created_utc,
  date: new Date(d.created_utc * 1000).toISOString().slice(0, 10),
  subreddit: d.subreddit,
  title: d.title,
  selftext: d.selftext || '',
  author: author(d.author),
  score: d.score,
  upvote_ratio: d.upvote_ratio,
  num_comments: d.num_comments,
  link_flair_text: d.link_flair_text || null,
  permalink: 'https://www.reddit.com' + d.permalink,
  is_self: d.is_self,
  url: d.is_self ? null : d.url
});

const commentRow = (d, postId) => ({
  id: d.id,
  post_id: postId,
  parent_id: d.parent_id,
  created_utc: d.created_utc,
  date: new Date(d.created_utc * 1000).toISOString().slice(0, 10),
  author: author(d.author),
  score: d.score,
  body: d.body || '',
  depth: d.depth ?? null
});

function flattenComments(node, postId, out = []) {
  if (!node) return out;
  const children = node.data?.children || [];
  for (const c of children) {
    if (c.kind !== 't1') continue;             // 'more' stubs carry no text
    if (c.data.body && c.data.body !== '[deleted]' && c.data.body !== '[removed]') {
      out.push(commentRow(c.data, postId));
    }
    if (c.data.replies && typeof c.data.replies === 'object') {
      flattenComments(c.data.replies, postId, out);
    }
  }
  return out;
}

// ---------------------------------------------------------------- sweep
//
// A single listing tops out around 1000 items, so one call to /top can never see a
// busy subreddit's whole history. Sweeping several listings and de-duping by id
// reaches considerably further back — top-of-all-time gives the canonical threads,
// the windowed sorts surface what is live now, and /new catches recent posts that
// have not accumulated score yet.

const LISTINGS = [
  '/top?t=all', '/top?t=year', '/top?t=month', '/top?t=week',
  '/hot', '/new', '/controversial?t=all'
];

async function sweepSubreddit(sub) {
  const dir = join(OUT, sub);
  await mkdir(dir, { recursive: true });
  const postsPath = join(dir, 'posts.jsonl');
  const commentsPath = join(dir, 'comments.jsonl');

  const seen = new Map();
  for (const listing of LISTINGS) {
    let after = null, pulled = 0;
    const sep = listing.includes('?') ? '&' : '?';
    while (pulled < MAX_POSTS) {
      const path = `/r/${sub}${listing}${sep}limit=100${after ? '&after=' + after : ''}`;
      const j = await api(path);
      const children = j.data?.children || [];
      if (!children.length) break;
      for (const c of children) if (c.kind === 't3' && !seen.has(c.data.id)) seen.set(c.data.id, postRow(c.data));
      pulled += children.length;
      after = j.data.after;
      if (!after) break;
    }
    console.log(`  ${listing.padEnd(22)} swept — ${seen.size} unique posts so far`);
    if (seen.size >= MAX_POSTS) break;
  }

  const posts = [...seen.values()].sort((a, b) => b.created_utc - a.created_utc);
  await writeFile(postsPath, posts.map(p => JSON.stringify(p)).join('\n') + '\n');
  console.log(`  wrote ${posts.length} posts -> ${postsPath}`);

  if (!WANT_COMMENTS) return { sub, posts: posts.length, comments: 0 };

  let done = new Set();
  if (RESUME) {
    try {
      const prior = await readFile(commentsPath, 'utf8');
      for (const line of prior.split('\n')) if (line) done.add(JSON.parse(line).post_id);
      console.log(`  resuming — ${done.size} posts already have comments on disk`);
    } catch { /* nothing to resume from */ }
  } else {
    await writeFile(commentsPath, '');
  }

  let total = 0, n = 0;
  for (const p of posts) {
    n++;
    if (done.has(p.id)) continue;
    if (p.num_comments === 0) continue;
    try {
      const tree = await api(`/comments/${p.id}?limit=500&depth=10&sort=top`);
      const rows = flattenComments(tree[1], p.id);
      if (rows.length) await appendFile(commentsPath, rows.map(r => JSON.stringify(r)).join('\n') + '\n');
      total += rows.length;
    } catch (err) {
      console.warn(`  skipped comments for ${p.id}: ${err.message}`);
    }
    if (n % 25 === 0) console.log(`  comments: ${n}/${posts.length} posts, ${total} rows`);
  }
  console.log(`  wrote ${total} comments -> ${commentsPath}`);
  return { sub, posts: posts.length, comments: total };
}

// ---------------------------------------------------------------- main

const summary = [];
for (const sub of SUBS) {
  console.log(`\nr/${sub}`);
  try {
    summary.push(await sweepSubreddit(sub));
  } catch (err) {
    console.error(`  failed: ${err.message}`);
    summary.push({ sub, error: err.message });
  }
}

await writeFile(join(OUT, 'manifest.json'), JSON.stringify({
  fetched_at: new Date().toISOString(),
  authors: KEEP_AUTHORS ? 'verbatim' : 'salted-hash',
  comments_included: WANT_COMMENTS,
  max_posts_per_sub: MAX_POSTS,
  listings_swept: LISTINGS,
  subreddits: summary
}, null, 2) + '\n');

console.log('\nSummary');
for (const s of summary) {
  console.log(s.error ? `  r/${s.sub}: ${s.error}` : `  r/${s.sub}: ${s.posts} posts, ${s.comments} comments`);
}
console.log(`\nmanifest -> ${join(OUT, 'manifest.json')}\n`);
