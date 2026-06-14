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
//   LINKEDIN_AUTHOR_URN    e.g. "urn:li:person:xxxxxxxx"
// Optional:
//   SITE_URL     canonical site origin (default https://riverrecords.ai)
//   BEFORE_SHA   github.event.before (push range start)
//   AFTER_SHA    github.sha          (push range end; defaults to HEAD)
//   POST_SLUG    workflow_dispatch override — post exactly this slug
//   DRY_RUN      "true"/"1" → log the payload, don't call LinkedIn
//
// Token note: member access tokens last 60 days. When it expires the POST
// returns 401 and this job goes red — that's the signal to mint a fresh token
// (see scripts/README-linkedin.md) and update the LINKEDIN_ACCESS_TOKEN secret.

import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { basename } from 'node:path';
import yaml from 'js-yaml';

const BLOG_DIR = 'src/content/blog';
const SITE_URL = (process.env.SITE_URL || 'https://riverrecords.ai').replace(/\/+$/, '');
const TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
const AUTHOR_URN = process.env.LINKEDIN_AUTHOR_URN;
const DRY_RUN = /^(1|true)$/i.test(process.env.DRY_RUN || '');

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

const isPublishable = (fm) =>
  fm && fm.draft !== true && !(Array.isArray(fm.tags) && fm.tags.includes('comparisons'));

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

async function postToLinkedIn({ caption, url }) {
  const commentary = `${caption}\n\n${url}`;
  const payload = {
    author: AUTHOR_URN,
    commentary,
    visibility: 'PUBLIC',
    distribution: {
      feedDistribution: 'MAIN_FEED',
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    lifecycleState: 'PUBLISHED',
    isReshareDisabledByAuthor: false,
  };

  if (DRY_RUN) {
    console.log('[dry-run] would POST to LinkedIn:\n' + JSON.stringify(payload, null, 2));
    return;
  }

  const res = await fetch('https://api.linkedin.com/rest/posts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
      'LinkedIn-Version': '202405',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`LinkedIn API ${res.status}: ${body}`);
  }
  // Posted-share URN is returned in the x-restli-id header.
  console.log(`Posted → ${res.headers.get('x-restli-id') || '(no id header)'}`);
}

async function main() {
  if (!TOKEN || !AUTHOR_URN) {
    console.log(
      'LINKEDIN_ACCESS_TOKEN / LINKEDIN_AUTHOR_URN not set — skipping LinkedIn posting.\n' +
        'Add both as GitHub Secrets to enable auto-posting.'
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

  let failures = 0;
  for (const path of paths) {
    const fm = frontmatterAt(path, null) || frontmatterAt(path, process.env.AFTER_SHA || 'HEAD');
    const slug = basename(path, '.md');
    const caption = fm.linkedinCaption || fm.description || fm.title;
    const url = `${SITE_URL}/blog/${slug}/`;
    try {
      console.log(`Sharing "${fm.title}" (${url})`);
      await postToLinkedIn({ caption, url });
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
