# Blog from your phone

Write and publish a blog post end-to-end from iOS: share a LinkedIn post or
type a prompt, get a fully drafted post back as a Pull Request, review the live
preview, request edits, and merge to publish — all from your phone.

## How it works

```
LinkedIn / Notes  ──share──▶  iOS Shortcut  ──creates──▶  GitHub issue (@claude)
                                                                  │
                                                                  ▼
                                                  Claude GitHub Action drafts the post,
                                                  opens a Pull Request
                                                                  │
                                  Cloudflare builds a preview URL on the PR
                                                                  │
                                                                  ▼
                  You review on phone ──comment "@claude <edits>"──▶ Claude revises the PR
                                                                  │
                                                       Merge the PR ──▶ Cloudflare deploys to prod
```

The PR is the "send it back for review" surface. Commenting `@claude ...` is how
you propose edits. Merging is how you confirm and publish.

---

## One-time setup

### 1. Install the Claude GitHub App
Install it on this repo: https://github.com/apps/claude
(Choose "Only select repositories" → `River-Records/riverrecords-marketing-site`.)

### 2. Add your Claude subscription token as a repo secret
The Action runs on your Claude Pro/Max subscription (no separate API billing).
1. On a machine with Claude Code installed, run: `claude setup-token`
   (this generates a long-lived OAuth token tied to your subscription).
2. GitHub → repo **Settings → Secrets and variables → Actions → New repository secret**
   - Name: `CLAUDE_CODE_OAUTH_TOKEN`
   - Value: the token from step 1

The workflow is committed at `.github/workflows/claude.yml` and already reads this secret.

(API-billing alternative: store `ANTHROPIC_API_KEY` instead and swap that one line
in the workflow to `anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}`.)

### 3. Create a fine-grained GitHub token for the Shortcut
This lets the iOS Shortcut create issues. GitHub → **Settings (your account) →
Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**
- Resource owner: **River-Records**
- Repository access: **Only select repositories** → `riverrecords-marketing-site`
- Permissions → **Issues: Read and write**
- Expiration: set a reminder to rotate it (max 1 year)
- Copy the token (starts with `github_pat_...`) — you'll paste it into the Shortcut once.

---

## The iOS Shortcut

Build this once in the Shortcuts app. It works from the share sheet (share a
LinkedIn post into it) **and** from the home screen (tap to type a prompt).

**Settings:** turn on *Show in Share Sheet*, accept input type *Text* and *URLs*.

**Actions, in order:**

1. **Receive** input from *Share Sheet* (Text, URLs). If there's no input, *Ask For Input* (Text), prompt: "What's the post about?"

2. **Text** action — paste this as the body template, with the `Shortcut Input`
   (or the *Provided Input*) variable dropped in where shown:

   ```
   @claude Write a new blog post for the River Records marketing site.

   Follow the house style in CLAUDE.md exactly: philosophical tone (not
   product-focused), Stream is "organized like clinicians think" and organized
   by medical PROBLEM, never use the word "narrative", and EHR phrasing is
   "works alongside any EHR". Match the blog frontmatter schema in
   src/content.config.ts — required: title, description, author ("Jacob
   Kantrowitz MD, PhD"), publishDate (today's date); recommended: seoTitle,
   seoDescription, tags, readTime; set draft: false. Match the style of existing
   posts in src/content/blog/. Create the file at src/content/blog/<slug>.md and
   open a pull request titled with the post title.

   Source material / angle:
   ---
   [Shortcut Input]
   ```

3. **Text** action (for the issue title) — set to:
   `Blog draft: [Current Date]` (or use *Ask For Input* if you'd rather title it yourself).

4. **Get Contents of URL**
   - URL: `https://api.github.com/repos/River-Records/riverrecords-marketing-site/issues`
   - Method: **POST**
   - Headers:
     - `Authorization` → `Bearer github_pat_YOUR_TOKEN_HERE`
     - `Accept` → `application/vnd.github+json`
     - `X-GitHub-Api-Version` → `2022-11-28`
   - Request Body: **JSON**
     - `title` (Text) → the title Text from step 3
     - `body` (Text) → the body Text from step 2

5. **Get Dictionary Value** → key `html_url` from the previous result.

6. **Open URLs** (or *Show Notification*) → opens the new issue so you can confirm it fired.

Name it something like **"Draft blog post"** and add it to your home screen.

### Using it
- **From LinkedIn:** tap Share on any post → *Draft blog post*. The post text/URL
  becomes the source material.
- **From scratch:** tap the Shortcut on your home screen → type the angle.

Within a minute or two the Action opens a PR. Watch for the Cloudflare
"deploy preview" check on the PR — tap it to read the rendered post on your phone.

---

## Reviewing and editing (all on phone)
- **Read it:** open the PR in the GitHub mobile app (or Safari). Use the
  Cloudflare preview URL to see it rendered, not just the markdown diff.
- **Propose edits:** comment on the PR, e.g.
  `@claude tighten the intro, drop the section on cost, and add a short anecdote about night-shift charting`.
  The Action pushes the revision to the same PR; the preview rebuilds.
- **Publish:** tap **Merge** on the PR. Cloudflare auto-deploys main to production.
- **Discard:** just close the PR (and the issue).

## Notes
- Each Action run uses your Claude Pro/Max subscription (via `CLAUDE_CODE_OAUTH_TOKEN`), not separate API billing.
- The fine-grained token only grants Issues access on this one repo; rotate it before it expires.
- Want it even more hands-off? You can also `@claude` directly in an issue from
  the GitHub mobile app without the Shortcut — the Shortcut just makes capture one tap.
