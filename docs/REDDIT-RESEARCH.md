# Reddit research corpus

`scripts/fetch-reddit-corpus.mjs` pulls a subreddit's posts and comments into JSONL so
recurring pains, vocabulary and tool gaps can be read out of what private-practice
clinicians actually write, rather than out of what we assume they want.

## Why it is a script and not something an agent does inline

Cloud sessions run behind an egress allowlist. On the **Trusted** access level the proxy
answers CONNECT for `reddit.com` with a 403, so no HTTP is sent and no credential is ever
offered. Reddit separately blocks Anthropic's crawler, which rules out WebFetch and
WebSearch against `reddit.com` regardless of network settings — but that block does not
apply to the authenticated API, which is the path this script uses.

Two ways to run it:

- **Locally**, on any machine with open network access. Nothing to configure.
- **In a cloud session**, if the environment's Network access is set to **Custom** with
  `www.reddit.com` and `oauth.reddit.com` allowed, *and* "Also include default list of
  common package managers" is ticked — without that, npm is unreachable and the site
  stops building. The policy is fixed when the VM boots, so it takes a new session.

The script detects the blocked case and prints those steps, because the proxy's denial
arrives as a plain `403 Forbidden` that reads exactly like Reddit rejecting the API key.
It is distinguished by the `x-deny-reason: host_not_allowed` response header.

## Credentials

App-only OAuth (`client_credentials`), which reads public subreddits and nothing else.
Create a **script** app at <https://www.reddit.com/prefs/apps>, then:

```bash
REDDIT_CLIENT_ID=... REDDIT_CLIENT_SECRET=... \
  node scripts/fetch-reddit-corpus.mjs --sub privatepracticedocs --comments
```

No username or password is needed. Reddit's API terms restrict commercial use of the
data, which is a decision to make before this feeds anything customer-facing.

## What comes back

`research/reddit/data/<sub>/posts.jsonl`, `comments.jsonl`, and a `manifest.json`
recording what was swept and when. The directory is gitignored — it is third-party
content and it grows.

A single Reddit listing tops out around 1000 items, so no one sort can see a busy
subreddit's whole history. The script sweeps seven listings (top all/year/month/week,
hot, new, controversial) and de-duplicates by id, which reaches materially further back
than any single call. For genuinely complete history, an Arctic Shift archive dump is the
better source and lands in the same shape.

**Usernames are hashed by default**, with a salt written to `.author-salt` beside the
data and never committed. Theme analysis needs the text, not the person, and a
checked-out corpus of identifiable health-adjacent complaints is a liability with no
upside. `--keep-authors` overrides it when you need to spot a repeat voice.

## Reading the result

Reddit is complaint-selected. It is excellent for *vocabulary* — the phrasing clinicians
use when nobody is selling to them — and for surfacing pains that never come up on a
sales call. It is bad for prevalence. Write conclusions as "here is what practices
articulate, and how they say it", never as "N% of practices need X".

The intended outputs are a themes document, a tool-gap list checked against what Stream
does and does not do, candidate posts mapped to the existing blog tag taxonomy, and FAQ
entries for `src/config/faqs.ts` phrased as the questions people actually type.
