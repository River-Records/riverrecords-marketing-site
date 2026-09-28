# Ticket for `ai-scribe`: store `rr_vid` on `tenant`

**Scope:** one nullable column, one field read from parameters the app already parses.
No new tracking, no new data category, no site-side work — the marketing site has been
sending this on every signup link for weeks and the app drops it.

---

## What it buys

`tenant` already stores `utm_source` and `utm_campaign`, so acquisition data on a tenant
is established practice. Those tell you the *channel*. `rr_vid` tells you the *journey* —
which query brought them, which pages they read, how many visits before they paid,
whether they watched a walkthrough.

Concretely, from 28 September 2026: two customers signed up that month, Ammie Kahl and
Derek Hayton. Both were matched to their site visits **by lining up timestamps** — a
five-minute gap and a four-minute gap between a signup-CTA click and a Stripe customer
being created. That worked only because both converted within minutes and nobody else
clicked that day. It fails the moment two people convert in the same hour, and it cannot
see anyone who took a week to decide.

With this column it is a join instead of detective work.

## What the app receives today

Every `/onboard*` link on www.riverrecords.ai is decorated client-side by
`public/attribution.js`. Verified against production on 28 September 2026:

```
utm_source     test_channel
utm_campaign   vid_check
rr_landing     /
rr_vid         45197b4b-0d85-4c59-94df-6d01f4dfbdb2   ← currently dropped
rr_page        /
```

Full set of parameters that can appear:

| Parameter | Meaning |
|---|---|
| `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` | first-touch campaign |
| `gclid`, `fbclid`, `msclkid`, `li_fat_id`, `ttclid` | ad click ids |
| `ref` | referral source, when there was no campaign |
| `rr_landing` | the first page of their first-ever visit |
| `rr_last_source` | last touch, when it differs from first |
| `rr_page` | the page the CTA was clicked from |
| **`rr_vid`** | **the anonymous visitor id — this ticket** |

## Also available as a cookie, and that matters

```
name     rr_vid
domain   .riverrecords.ai
max-age  180 days
```

Set by a Cloudflare Pages Function (`functions/rr/id.js`) as a real `Set-Cookie` header,
**not** by JavaScript. That is deliberate: Safari's ITP caps script-written cookies at
seven days, and a large share of clinician traffic is Safari.

Because the cookie is on the parent domain, `stream.riverrecords.ai` can read it directly.

**Read the parameter first, fall back to the cookie.** The query string is lost whenever
someone does not click straight through — bookmarks the onboarding page, switches to
their phone, comes back tomorrow. Those are exactly the slow, considered signups worth
understanding, and the cookie is the only thing that survives them.

## The change

```sql
ALTER TABLE tenant ADD COLUMN rr_vid TEXT NULL;
```

At signup:

1. read `?rr_vid=` from the onboarding URL
2. if absent, read the `rr_vid` cookie
3. if both absent, leave NULL — someone who reached signup without passing through the
   marketing site, which is real and should not be faked

**Write once. Never update.** First touch is the acquisition fact; overwriting it on a
later login would silently convert the column into "most recent device they used", and
every journey built on it would be wrong in a way nothing would flag.

Validate loosely: it is a UUID from `crypto.randomUUID()`, so a length cap and a
character-class check are enough. Do not reject unknown values — an id minted before a
deploy is still a valid id.

## What must NOT happen

- **Nothing else comes across.** No events, no page paths, no engagement history. That
  data lives in Cloudflare D1 and joins at query time. The clinical database stays free
  of marketing telemetry, which is both cleaner and easier to defend.
- **Nothing flows back.** Site events go toward the app, never the reverse. The
  marketing collector allow-lists every field precisely so nothing new can start
  arriving without a decision, and that property is worth keeping.

## Privacy

`rr_vid` is a random UUID minted for an anonymous website visitor. No name, no email, no
health information. It identifies a *clinician as a website visitor* and never touches a
patient — the subject is the customer, not their patients.

A `tenant` row already contains far more identifying information than a UUID, and already
carries acquisition data in the UTM columns. Adding this does not change the row's
sensitivity or its BAA scope. The site's privacy policy already names `rr_vid`
(`/privacy-policy/`).

The one thing to avoid is exporting the column to a tool outside BAA scope. That is a
question about where data goes, not what this column is.

## How to verify it worked

After the next signup that came through the marketing site:

```sql
SELECT id, created_at, utm_source, rr_vid FROM tenant
WHERE rr_vid IS NOT NULL ORDER BY created_at DESC LIMIT 5;
```

Then take an `rr_vid` from that result and ask the marketing database what that person
did before signing up:

```bash
npx wrangler d1 execute riverrecords-site-events --remote \
  --command "SELECT datetime(ts/1000,'unixepoch') utc, event, path
             FROM events WHERE rr_vid = '<id>' ORDER BY ts"
```

That query is the whole point of the ticket.

---

*Context and related work: `docs/DATA-PIPELINE.md` in the marketing-site repo covers the
events database, and `CLAUDE.md` in the same repo covers attribution. The site side needs
no changes.*
