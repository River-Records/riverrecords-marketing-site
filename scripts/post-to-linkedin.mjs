// Auto-post newly published blog posts to a LinkedIn *personal profile*.
//
// Runs from .github/workflows/linkedin-post.yml on every push to main that
// touches src/content/blog/**. It figures out which posts became publicly
// published in that push and shares each one to LinkedIn using the member
// share API (w_member_social scope — the self-serve "Share on LinkedIn"
// product, no app review required).
//
// "Newly published" means either:
//   * the markdown file was ADDED in this push and is non-draft, OR
//   * the file was MODIFIED and flipped from draft:true → draft:false.
// Posts tagged "comparisons" are skipped (they're SEO pages, never syndicated),
// matching the RSS feed's exclusion.
//
// Required environment (set as GitHub Secrets, wired in the workflow):
//   LINKEDIN_ACCESS_TOKEN  member token with w_member_social scope
// Optional:
//   LINKEDIN_AUTHOR_URN    e.g. "urn:li:person:xxxxxxxx". When unset it is
//                          looked up from /v2/userinfo with the token (needs
//                          the openid + profile scopes), so the token is the
//                          only secret that has to be renewed.
//   SITE_URL     canonical site origin (default https://www.riverrecords.ai)
//   BEFORE_SHA   github.event.before (push range start)
//   AFTER_SHA    github.sha          (push range end; defaults to HEAD)
//   POST_SLUG    workflow_dispatch override — post exactly this slug
//   DRY_RUN      "true"/"1" → log the payload, don't call LinkedIn
//   LINKEDIN_API_VERSION  pin the LinkedIn-Version header (YYYYMM). When unset
//                      it is the month two months before today, UTC. See below.
//   LIVE_WAIT_SECONDS  how long to wait for the post's page to go live before
//                      giving up (default 600). 0 skips the check.
//
// Why the wait: this runs the moment the push lands on main, while Cloudflare
// Pages is still building. LinkedIn scrapes the URL for its link card at post
// time and caches what it gets, so posting before the page exists bakes a
// blank/404 card into the share. We therefore poll the URL until it answers
// 200 and only then post; if it never does, the post is skipped and the job
// goes red rather than shipping a broken card.
//
// Token note: member access tokens last 60 days. When it expires the POST
// returns 401 and this job goes red — that's the signal to mint a fresh token
// (see scripts/README-linkedin.md) and update the LINKEDIN_ACCESS_TOKEN secret.

import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { basename } from 'node:path';
import yaml from 'js-yaml';

const BLOG_DIR = 'src/content/blog';
const SITE_URL = (process.env.SITE_URL || 'https://www.riverrecords.ai').replace(/\/+$/, '');
const TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
let AUTHOR_URN = process.env.LINKEDIN_AUTHOR_URN;
const DRY_RUN = /^(1|true)$/i.test(process.env.DRY_RUN || '');
const LIVE_WAIT_SECONDS = Number(process.env.LIVE_WAIT_SECONDS ?? 600);
const LIVE_POLL_SECONDS = 15;

function sh(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim();
}

// Parse a markdown file's frontmatter. Returns null if there is no frontmatter.
function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  try {
    return yaml.load(m[1]) || {};
  } catch {
    return null;
  }
}

// Read frontmatter for a blog file at a specific git revision (or working tree
// when rev is null). Returns null if the file/frontmatter is unavailable.
function frontmatterAt(path, rev) {
  let text;
  try {
    text = rev ? sh(`git show ${rev}:${path}`) : readFileSync(path, 'utf8');
  } catch {
    return null;
  }
  return frontmatter(text);
}

// `linkedin: false` in frontmatter keeps one post off LinkedIn (and out of the
// RSS feed) while it publishes on the site as normal.
const isPublishable = (fm) =>
  fm &&
  fm.draft !== true &&
  fm.linkedin !== false &&
  !(Array.isArray(fm.tags) && fm.tags.includes('comparisons'));

// Build the list of blog markdown paths that became published in this push.
function detectNewlyPublished() {
  const before = process.env.BEFORE_SHA;
  const after = process.env.AFTER_SHA || 'HEAD';
  // A valid "before" lets us diff the exact push range; otherwise (first push,
  // force-push, or all-zero SHA) fall back to just the tip commit.
  let range;
  const validBefore =
    before && !/^0+$/.test(before) && (() => {
      try { sh(`git cat-file -e ${before}^{commit}`); return true; } catch { return false; }
    })();
  range = validBefore ? `${before} ${after}` : `${after}^ ${after}`;

  let lines = [];
  try {
    lines = sh(`git diff --name-status ${range} -- ${BLOG_DIR}`).split('\n').filter(Boolean);
  } catch {
    return [];
  }

  const out = [];
  for (const line of lines) {
    const [status, ...rest] = line.split('\t');
    const path = rest[rest.length - 1]; // handles rename "Rxxx old new"
    if (!path || !path.endsWith('.md')) continue;
    const code = status[0];

    const current = frontmatterAt(path, null) || frontmatterAt(path, after);
    if (!isPublishable(current)) continue;

    if (code === 'A') {
      out.push(path);
    } else if (code === 'M' || code === 'R') {
      // Only post on the draft→published transition, not on every later edit.
      const prev = validBefore ? frontmatterAt(path, before) : null;
      const wasPublished = prev && prev.draft !== true;
      if (!wasPublished) out.push(path);
    }
  }
  return out;
}

// LinkedIn's versioned REST API retires each monthly version about a year after
// release and then answers 426 NONEXISTENT_VERSION. A hard-coded '202405' did
// exactly that on 16 Nov 2026 and silently stopped every share. So the version
// follows the calendar: two months back is old enough to be released and young
// enough to be active for another ~10 months. Set LINKEDIN_API_VERSION to pin one.
function linkedInVersion(now = new Date()) {
  const pinned = (process.env.LINKEDIN_API_VERSION || '').trim();
  if (pinned) return pinned;
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 2, 1));
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

const API_HEADERS = () => ({
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
  'X-Restli-Protocol-Version': '2.0.0',
  'LinkedIn-Version': linkedInVersion(),
});

// LinkedIn's commentary field is "little text format": these characters are
// markup, and an unescaped one (a bracket, a parenthesis, an @ or #) can
// truncate the post or turn text into a broken mention. Escape them all.
// https://learn.microsoft.com/linkedin/marketing/community-management/shares/little-text-format
function escapeLittleText(text) {
  return text.replace(/[\\|{}@\[\]()<>#*_~]/g, (c) => `\\${c}`);
}

// The API never scrapes the page. Pasting a URL into LinkedIn by hand builds a
// link card from the og: tags, but a post made through /rest/posts shows the URL
// as plain text unless the post carries the card itself. That shipped once
// (16 Nov 2026: no image, no card). So the card is built here: an "article"
// with the page's own og:image uploaded through the Images API.
async function ogImageUrl(pageUrl) {
  try {
    const html = await (await fetch(pageUrl, { signal: AbortSignal.timeout(15000) })).text();
    const m = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
    if (m) return new URL(m[1], pageUrl).href;
  } catch {}
  return `${SITE_URL}/og-default.png`;
}

async function uploadThumbnail(pageUrl) {
  const imgUrl = await ogImageUrl(pageUrl);
  const img = await fetch(imgUrl, { signal: AbortSignal.timeout(30000) });
  if (!img.ok) throw new Error(`og:image ${imgUrl} answered ${img.status}`);
  const bytes = Buffer.from(await img.arrayBuffer());

  const init = await fetch('https://api.linkedin.com/rest/images?action=initializeUpload', {
    method: 'POST',
    headers: API_HEADERS(),
    body: JSON.stringify({ initializeUploadRequest: { owner: AUTHOR_URN } }),
  });
  if (!init.ok) throw new Error(`image initializeUpload ${init.status}: ${await init.text()}`);
  const { value } = await init.json();

  const put = await fetch(value.uploadUrl, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': img.headers.get('content-type') || 'image/png' },
    body: bytes,
  });
  if (!put.ok) throw new Error(`image upload ${put.status}: ${await put.text()}`);
  console.log(`Card image uploaded from ${imgUrl} → ${value.image}`);
  return value.image;
}

async function postToLinkedIn({ caption, url, title, description }) {
  const article = { source: url, title };
  if (description) article.description = description;

  const payload = {
    author: AUTHOR_URN,
    // The card carries the link, so the URL is not repeated in the text.
    commentary: escapeLittleText(caption),
    visibility: 'PUBLIC',
    distribution: {
      feedDistribution: 'MAIN_FEED',
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    content: { article },
    lifecycleState: 'PUBLISHED',
    isReshareDisabledByAuthor: false,
  };

  if (DRY_RUN) {
    console.log(`[dry-run] LinkedIn-Version: ${linkedInVersion()}`);
    console.log(`[dry-run] card image would come from ${await ogImageUrl(url)}`);
    console.log('[dry-run] would POST to LinkedIn:\n' + JSON.stringify(payload, null, 2));
    return;
  }

  // A missing image is worth a warning, not a missing post: the card still
  // renders with its title and link.
  try {
    article.thumbnail = await uploadThumbnail(url);
  } catch (err) {
    console.warn(`::warning::Posting without a card image: ${err.message}`);
  }

  const res = await fetch('https://api.linkedin.com/rest/posts', {
    method: 'POST',
    headers: API_HEADERS(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    const hint =
      res.status === 426
        ? ` — LinkedIn-Version ${linkedInVersion()} is not active; set LINKEDIN_API_VERSION to a current YYYYMM`
        : '';
    throw new Error(`LinkedIn API ${res.status}${hint}: ${body}`);
  }
  // Posted-share URN is returned in the x-restli-id header.
  console.log(`Posted → ${res.headers.get('x-restli-id') || '(no id header)'}`);
}

// Resolve the member URN from the token itself. Read-only, so it also runs on
// a dry run, which makes the dry run a check that the token works.
async function lookupAuthorUrn() {
  const res = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) {
    const body = await res.text();
    const hint =
      res.status === 401
        ? ' — the token is invalid or expired; mint a new one (scripts/README-linkedin.md)'
        : res.status === 403
          ? ' — the token lacks the openid/profile scopes; re-mint it with openid, profile and w_member_social'
          : '';
    throw new Error(`LinkedIn userinfo ${res.status}${hint}: ${body}`);
  }
  const { sub } = await res.json();
  if (!sub) throw new Error('LinkedIn userinfo returned no "sub"; cannot build the author URN.');
  return `urn:li:person:${sub}`;
}

// Poll until the page answers 200 (redirects followed). Read-only, so it runs
// on dry runs too. Throws if the page is not live within LIVE_WAIT_SECONDS.
async function waitUntilLive(url) {
  if (!(LIVE_WAIT_SECONDS > 0)) return;
  const deadline = Date.now() + LIVE_WAIT_SECONDS * 1000;
  let last = 'no response';
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url, {
        redirect: 'follow',
        headers: { 'Cache-Control': 'no-cache', 'User-Agent': 'riverrecords-linkedin-poster' },
        signal: AbortSignal.timeout(15000),
      });
      if (res.ok) {
        if (attempt > 1) console.log(`Page is live (after ${attempt} checks).`);
        return;
      }
      last = `HTTP ${res.status}`;
    } catch (err) {
      last = err.cause?.code || err.name || err.message;
    }
    if (Date.now() + LIVE_POLL_SECONDS * 1000 > deadline) {
      throw new Error(
        `page not live after ${LIVE_WAIT_SECONDS}s (last: ${last}) — not posting, so LinkedIn ` +
          `doesn't cache a broken link card. Re-run with this slug once the deploy is up.`
      );
    }
    if (attempt === 1) console.log(`Waiting for ${url} to go live (${last})…`);
    await new Promise((r) => setTimeout(r, LIVE_POLL_SECONDS * 1000));
  }
}

async function main() {
  if (!TOKEN) {
    console.log(
      'LINKEDIN_ACCESS_TOKEN not set — skipping LinkedIn posting.\n' +
        'Add it as a GitHub Secret to enable auto-posting.'
    );
    return;
  }

  let paths;
  if (process.env.POST_SLUG) {
    const slug = process.env.POST_SLUG.trim();
    const path = `${BLOG_DIR}/${slug}.md`;
    if (!existsSync(path)) throw new Error(`POST_SLUG "${slug}" not found at ${path}`);
    if (!isPublishable(frontmatterAt(path, null))) {
      console.log(`"${slug}" is draft or a comparison post — nothing to do.`);
      return;
    }
    paths = [path];
  } else {
    paths = detectNewlyPublished();
  }

  if (paths.length === 0) {
    console.log('No newly published posts in this push.');
    return;
  }

  if (!AUTHOR_URN) {
    AUTHOR_URN = await lookupAuthorUrn();
    console.log(`Author resolved from token: ${AUTHOR_URN}`);
  }

  let failures = 0;
  for (const path of paths) {
    const fm = frontmatterAt(path, null) || frontmatterAt(path, process.env.AFTER_SHA || 'HEAD');
    const slug = basename(path, '.md');
    const caption = fm.linkedinCaption || fm.description || fm.title;
    const url = `${SITE_URL}/blog/${slug}/`;
    try {
      await waitUntilLive(url);
      console.log(`Sharing "${fm.title}" (${url})`);
      await postToLinkedIn({ caption, url, title: fm.title, description: fm.description });
    } catch (err) {
      failures++;
      console.error(`Failed to post ${slug}: ${err.message}`);
    }
  }

  if (failures > 0) {
    process.exitCode = 1;
    console.error(`${failures} post(s) failed.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
