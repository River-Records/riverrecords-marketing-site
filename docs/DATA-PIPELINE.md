# Giving the site data about itself

Two independent halves. Either works without the other, and both degrade to nothing
rather than breaking anything if their setup is incomplete.

| Half | What it captures | Where it lands |
|---|---|---|
| **Events → D1** | anonymous behaviour, keyed by `rr_vid` | Cloudflare D1, queryable with SQL |
| **Search Console → repo** | impressions, clicks, position, per page and query | committed JSON in `data/gsc/` |

The problem both solve: the site already produced this data and discarded it. Ten
dataLayer events fire and no GTM tag listens. `hubspot-events.js` rescues a short
high-intent subset, but only for people who are already known contacts — which is nobody
until they identify themselves. Search Console holds a year of history that is only
reachable by logging in and clicking around.

---

## Half 1 — Events into D1

**Nothing happens until the binding exists.** `functions/api/events.js` accepts and
discards when `env.SITE_EVENTS` is missing, so this can ship before the database and
change nothing.

### 1. Create the database

```bash
npx wrangler login
npx wrangler d1 create riverrecords-site-events
```

### 2. Apply the schema

```bash
npx wrangler d1 execute riverrecords-site-events --remote \
  --file=migrations/0001_create_events.sql
```

`--remote` matters. Without it you migrate a local SQLite file and the deployed
database stays empty — which looks exactly like the endpoint being broken.

### 3. Bind it to the Pages project

Cloudflare dashboard → **Workers & Pages** → `riverrecords-marketing-site` →
**Settings** → **Bindings** → **Add** → **D1 database**:

- Variable name: **`SITE_EVENTS`** — must match exactly; the handler looks it up by name
- Database: `riverrecords-site-events`

Add it for **both Production and Preview**, otherwise preview branches silently collect
nothing and you will think a change broke it.

### 4. Confirm

```bash
curl -i -X POST https://www.riverrecords.ai/api/events \
  -H 'Content-Type: application/json' \
  -d '{"events":[{"rr_vid":"setup-test","event":"smoke_test"}]}'
```

Read the **`X-RR-Events`** header:

| Value | Meaning |
|---|---|
| `stored:1` | working |
| `nodb` | the binding is missing or misnamed |
| `empty` | the payload had no usable rows |
| `badjson` | body was not JSON |
| `error` | the insert threw — check the D1 console |

The response is always `204`, deliberately. A visitor's page must not care whether
analytics succeeded, and a collector that saw errors and retried would turn one bad
deploy into a request storm against our own origin.

Then delete the test row:

```bash
npx wrangler d1 execute riverrecords-site-events --remote \
  --command "DELETE FROM events WHERE rr_vid = 'setup-test'"
```

### What gets collected, and what cannot

`public/event-collector.js` reads the dataLayer by polling — never wrapping
`dataLayer.push`, which would race GTM installing its own — and sends every non-`gtm.*`
event, plus a synthesised `page_view` so there is a denominator.

**Props are allow-listed, not forwarded.** Only keys named in `FIELDS` leave the browser.
An event object is whatever the pushing code decided to include, and a future push could
reasonably carry an email address; an email plus a durable anonymous id is how an
anonymous id stops being anonymous. `scripts/verify-event-collector.mjs` pushes a real
email and asserts it never appears in any payload. **Adding a field to that list is a
decision, not a detail.**

The server never stores the user agent — it reads it to set the `bot` flag and discards
it — and `ts` is server time, because device clocks are wrong often enough to poison any
ordering built on them.

### Questions it can now answer

```bash
q() { npx wrangler d1 execute riverrecords-site-events --remote --command "$1"; }
```

One visitor's whole journey — the query the table exists for:

```sql
SELECT ts, event, path, props FROM events
WHERE rr_vid = '<id>' AND bot = 0 ORDER BY ts;
```

Which posts are genuinely read, not merely opened:

```sql
SELECT path, COUNT(*) reads,
       ROUND(AVG(json_extract(props,'$.engaged_seconds'))) avg_seconds
FROM events WHERE event = 'post_read' AND bot = 0
GROUP BY path ORDER BY reads DESC LIMIT 20;
```

Visitors who came back on a different day — the strongest anonymous intent signal here:

```sql
SELECT rr_vid, COUNT(DISTINCT date(ts/1000,'unixepoch')) days, COUNT(*) events
FROM events WHERE bot = 0
GROUP BY rr_vid HAVING days > 1 ORDER BY events DESC LIMIT 20;
```

What people did before they converted — paste an `rr_vid` from a HubSpot contact:

```sql
SELECT path, event, ts FROM events
WHERE rr_vid = '<id from the contact record>' ORDER BY ts;
```

Chose to watch versus arrived on a deep link:

```sql
SELECT json_extract(props,'$.video_trigger') trigger,
       json_extract(props,'$.video_key') video, COUNT(*) n
FROM events WHERE event = 'video_play' AND bot = 0 GROUP BY trigger, video;
```

### Housekeeping

Nothing prunes this table. At current traffic it will take years to matter, but it is
worth knowing that the free tier is 5 GB and 100k row writes/day, and that no job
enforces either. To drop old rows:

```sql
DELETE FROM events WHERE ts < (unixepoch('now','-18 months') * 1000);
```

To honour a deletion request, delete by `rr_vid`. This is the main reason the store is
D1 rather than Analytics Engine, which cannot remove an individual record at all.

---

## Half 2 — Search Console into the repo

`scripts/fetch-gsc.mjs` pulls pages, queries, and page+query pairs into `data/gsc/`.
`.github/workflows/gsc-snapshot.yml` runs it Mondays at 06:00 UTC and commits the result.

**Files are named `<endDate>-<days>d.json`, with `latest-<days>d.json` as a stable pointer
per window.** The window length is in the name because it has to be: the first version
keyed on `endDate` alone, and a one-off `--days 365` pull on 2026-09-14 silently
overwrote the 28-day snapshot taken the same day — destroying the baseline the first
data-driven page was meant to be judged against. Different windows are different
measurements. Compare `latest-28d.json` week over week; keep the annual pull separate.

Weekly, not daily: Search Console finalises on a lag, weekly volumes here are small
enough that daily deltas are mostly noise, and a daily commit would bury real change in
churn. The window ends three days back for the same reason — a partial final day looks
like a cliff in every chart built on it, and the cliff would move each run.

### 1. Service account

[console.cloud.google.com](https://console.cloud.google.com) → create or pick a project →

1. **APIs & Services → Library** → enable **Google Search Console API**
2. **IAM & Admin → Service Accounts → Create service account**. Name it something like
   `gsc-snapshot`. **Grant it no IAM roles** — Search Console access is granted in Search
   Console, not here, and roles at this step do nothing.
3. Open it → **Keys → Add key → Create new key → JSON**. The file downloads once.

### 2. Give it access to the property

This is the step that gets missed, and it fails with a 403 that reads like a code problem.

[Search Console](https://search.google.com/search-console) → the property →
**Settings → Users and permissions → Add user** → paste the service account's email
(`gsc-snapshot@<project>.iam.gserviceaccount.com`) → permission **Restricted** is enough.

If it 403s anyway, the script prints every property the account *can* see, which is
usually enough to spot that the property is `https://www.riverrecords.ai/` rather than
the domain property, or vice versa.

### 3. GitHub

Repo → **Settings → Secrets and variables → Actions**:

- **Secret** `GSC_SERVICE_ACCOUNT_JSON` — the entire contents of the downloaded JSON file,
  pasted whole. Not a path, not the private key alone.
- **Variable** `GSC_SITE_URL` — only if the property is not `sc-domain:riverrecords.ai`.
  For a URL-prefix property use the exact string Search Console shows, trailing slash
  included.

### 4. Run it

Actions → **Snapshot Search Console** → **Run workflow**. It writes
`data/gsc/<date>.json` and commits.

Locally:

```bash
GSC_SERVICE_ACCOUNT_JSON="$(cat ~/Downloads/gsc-key.json)" node scripts/fetch-gsc.mjs
GSC_SERVICE_ACCOUNT_JSON="$(cat ~/Downloads/gsc-key.json)" node scripts/fetch-gsc.mjs --days 90
```

Keep that key file out of the repo.

---

## What this does not do yet

These two halves are collection only. They deliberately stop short of the loop discussed
alongside them — detectors that read the snapshots and open PRs for pages with
impressions but no clicks, accidental rankings in strike distance, or decaying traffic.
That is the natural next step and it is a separate piece of work, because collection has
to be trustworthy before anything automated acts on it.

Two constraints worth writing down before that gets built:

- **Anything automated proposes; it does not push to main.** Content the site is judged on
  by clinicians should not change without a person reading the change.
- **Some things are not the loop's to edit** — the `limits` FAQ group, the competitor
  claim rules, the clinical criteria in both coding guides, the calculator's
  anti-upcoding guardrail. A metric-optimising process has every reason to soften a "no",
  and those noes are why the site is credible to the people it is selling to.

## Verifying

- `scripts/verify-event-collector.mjs` — 21 checks, including that a pushed email address
  never reaches the endpoint. Needs a browser; see the header for the Playwright setup.
- `node scripts/fetch-gsc.mjs` with no credentials should explain what is missing rather
  than throw a stack trace.
