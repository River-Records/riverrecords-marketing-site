# Auto-posting blog posts to LinkedIn

When a new blog post is published to `main`, `.github/workflows/linkedin-post.yml`
runs `scripts/post-to-linkedin.mjs`, which shares it to a LinkedIn **personal
profile** via the member share API. Everything lives in this repo + GitHub
Actions — no Buffer/Zapier/Make.

The workflow is **inert until the two secrets below exist**, so merging it
changes nothing on LinkedIn until you finish this setup.

## One-time setup

### 1. Create a LinkedIn app
1. Go to <https://www.linkedin.com/developers/apps> → **Create app**.
2. Associate it with the River Records Company Page (LinkedIn requires every app
   to be owned by a Page — this is just ownership, the *posts* still go to your
   personal profile) and verify it via the Page.
3. On the app's **Products** tab, add **"Share on LinkedIn"** and **"Sign In
   with LinkedIn using OpenID Connect"**. Both are self-serve and approve
   instantly — no review.
4. On the **Auth** tab, note your **Client ID** / **Client Secret**, and add a
   redirect URL you can read back from (e.g. `https://riverrecords.ai` or
   `http://localhost:8080`).

### 2. Authorize and mint an access token
Open this URL in a browser (fill in your client id + the exact redirect you
registered), approve the prompt, then copy the `code` value from the redirected
URL bar:

```
https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=CLIENT_ID&redirect_uri=REDIRECT&scope=openid%20profile%20w_member_social
```

Exchange that code for a token:

```bash
curl -s -X POST https://www.linkedin.com/oauth/v2/accessToken \
  -d grant_type=authorization_code \
  -d code=THE_CODE \
  -d client_id=CLIENT_ID \
  -d client_secret=CLIENT_SECRET \
  -d redirect_uri=REDIRECT
# → { "access_token": "...", "expires_in": 5184000, ... }   (60 days)
```

### 3. Get your author URN
```bash
curl -s https://api.linkedin.com/v2/userinfo \
  -H "Authorization: Bearer ACCESS_TOKEN"
# → { "sub": "abc123", ... }   your URN is  urn:li:person:abc123
```

### 4. Add the GitHub Secrets
Repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret                  | Value                          |
| ----------------------- | ------------------------------ |
| `LINKEDIN_ACCESS_TOKEN` | the `access_token` from step 2 |
| `LINKEDIN_AUTHOR_URN`   | `urn:li:person:abc123`         |

### 5. Test
Repo → **Actions → "Post new blog posts to LinkedIn" → Run workflow**:
- Set **slug** to an existing post (e.g. `the-note-was-never-the-point`) and
  **dry_run = true** → confirm the logged payload looks right.
- Re-run with **dry_run = false** to post it for real once.

After that it's automatic: every new published post on `main` is shared, using
its `linkedinCaption` (falling back to `description`) plus the post URL, which
LinkedIn renders as a link card from the page's OG tags.

## Renewing the token (every ~60 days)
Member access tokens expire after 60 days. When one expires the workflow run goes
**red with a 401** — that's your reminder. Repeat steps 2 and update the
`LINKEDIN_ACCESS_TOKEN` secret. (LinkedIn only issues programmatic refresh tokens
to review-approved apps; for self-serve member posting, periodic re-auth is the
expected flow.)

## Notes
- Posts tagged `comparisons` are skipped (same exclusion as the RSS feed).
- A post is shared when it's added as non-draft **or** flipped `draft: true →
  false`. Later edits don't re-post.
- Re-running the *same* workflow run will re-post; only re-run on failure after
  fixing the token.
