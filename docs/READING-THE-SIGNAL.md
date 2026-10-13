# Reading the signal

`data/gsc/` has collected itself every Monday since September 2026 and will keep doing so
whether or not anyone looks. This file is the other half: **how to read it without
reaching the wrong conclusion.**

Every correction below is one that was got wrong first, in some cases twice. They are not
obvious, and a competent person starting fresh will repeat them.

`scripts/weekly-signal.mjs` applies the mechanical ones automatically. The judgement ones
still need a person.

---

## The corrections, in order of how badly they mislead

### 1. Split brand from non-brand, and both from the wrong brand

Roughly 400 impressions a week are people searching "river records" — they already know
the name. Another ~450 are people searching **RecordsAI, a different product** whose name
is close enough that Google shows us. Those are not winnable and never were.

Mixed together, the three streams hide each other completely. Separated, the real story
appears: brand flat, wrong-brand halving as Google learns to tell the two apart, non-brand
up 62% in five weeks.

### 2. Two-thirds of clicks are anonymised

Google hides the query for low-volume searches. In a typical week, ~19 of ~62 clicks have
a query attached. **Any statement of the form "non-brand clicks are zero" is wrong** — the
honest version is "zero among named queries, with 43 unattributable."

Page-level data does not have this problem. Use it when the question is about clicks.

### 3. Brand sitelinks look exactly like broken pages

`/about` at position 4 with 328 impressions and no clicks is not a failing page. It is a
sitelink under the brand result. Thirty URLs rank for "river records", including homepage
anchors like `/#pricing`.

**Before treating a zero-click page as a problem, check whether its impressions are brand
queries.** A detector that skips this generates an endless stream of false work.

### 4. Never quote an annual figure without its recent counterpart

`/compare/open-evidence-alternative` had 2,451 impressions at position 8 across twelve
months and **zero in the most recent 28 days** — the ranking had already collapsed. Acting
on the annual number sent a week of effort at a page that no longer ranked.

The 365-day pull is for spotting clusters. The 28-day windows are for deciding anything.

### 5. Page-average position is confounded when the query mix changes

The pillar page "fell" from position 17 to 20 while **five of its seven target queries
improved.** The average dropped because the page started ranking badly for adjacent
vocabulary — `protocol writing automation` at position 79, which is pharma, not clinical
notes.

Judge a page by its target queries, not its average.

### 6. Zero impressions does not mean zero demand

Search Console only reports queries where the site already appeared. Having no page for a
topic guarantees no data about it — which is not the same as no demand.

This came up twice: the annual-visit angle and the integrative segment both returned
nothing, and in both cases the right reading was "we cannot see it from here", not "nobody
wants it". A keyword tool answers that question; this data cannot.

### 7. Rising impressions with flat clicks is the expected pattern now

Non-brand impressions rose 62% over five weeks. Clicks did not move. Non-brand queries
ranked at position ≤2 earning **zero** clicks went from 8 to 26 in the same period.

That is AI Overview absorption, confirmed directly: an AI answer for "best ai scribe for
primary care" cited riverrecords.ai as a source while recommending Freed, Heidi and
Doximity by name.

**So improving rankings further in the documentation category has a low ceiling.** This is
the single most important thing on this page, and the reason to be sceptical of any plan
whose payoff is "rank better".

---

## What the numbers cannot tell you

**Why anything moved.** The script reports what changed. Attribution to a cause needs
context it does not have.

**Where customers actually come from.** Both traced signups — September 2026 — arrived via
brand search to the homepage and converted in under five minutes. Brand search means they
had already heard the name somewhere. The site closed them; something off-site found them,
and that something is invisible here.

**Whether off-site work is paying off.** The measured constraint is corroboration: 129
humans recorded, exactly one arrived from another website. Listings on third-party sites
send almost no traffic (NNPEN has sent zero) but still do the job that matters — putting
the name on a page we do not own, where models and buyers can see it. **Judge a listing by
whether AI answers start naming Stream, never by its referral traffic.**

---

## How the weekly loop works

| | |
|---|---|
| Monday 06:30 UTC | `gsc-snapshot.yml` fetches and commits a 28-day snapshot |
| Monday 07:00 UTC | `weekly-signal.yml` runs the script and opens an issue |
| then | the issue mentions `@claude`, so `claude.yml` fires and adds interpretation |

Run it by hand any time:

```bash
node scripts/weekly-signal.mjs             # readable
node scripts/weekly-signal.mjs --markdown  # issue-shaped
```

### Changing this file

The weekly comment may **propose** changes here — a correction that is now wrong, a new
trap. It must not apply them itself. Analysis instructions that rewrite themselves drift
without anyone noticing, which is the exact failure this document exists to prevent.

When a correction is added, say what went wrong and what it cost. That is what makes the
next person believe it.
