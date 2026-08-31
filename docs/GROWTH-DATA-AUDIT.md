# Growth & Data Capture Audit

**Date:** 31 August 2026
**Scope:** riverrecords.ai marketing site — what we capture today, what works, what to build.
**Audit boundary:** everything below is verified from the repo and from read access to
HubSpot (portal `46752060`). The GTM container's internal config is **not** visible from
here — claims about triggers and tags come from `CLAUDE.md`, not from inspection. Those
are marked ⚠️ and need confirming in the GTM console.

**Operating constraint:** as of August 2026 Jay is no longer on the project and Jake is
running this alone. That is a design constraint, not a footnote — it changes what a good
recommendation looks like. Every phase below is written to be executable by one person
who is a physician first and a marketer second. Where a choice exists between repo code
and console configuration, this document picks repo code: it is reviewable, version
controlled, and maintainable with Claude's help, whereas console config is invisible from
here and rots unattended. Adding tools is treated as a cost, not a win.

---

## Summary

The site is a well-built publishing asset with almost no capture layer attached to it.
88 blog posts, a 13-chapter book, six team pages, six segment pages, and a comparison
page — feeding **one** three-field form and a Calendly embed that carries no attribution.

The headline finding is not a bug, it's an absence:

> **HubSpot has never recorded a single page view on riverrecords.ai.** The
> `hs_analytics_num_page_views` counter is `0` for effectively every contact, and on the
> handful where it isn't, `hs_analytics_last_url` points at `meetings.hubspot.com` — a
> HubSpot-hosted page, not ours. The tracking script has never been in `Base.astro`.

**A correction to an earlier draft of this document.** It led with "16 of 3,440 contacts
carry web attribution (0.5%)," which was a misleading denominator. Most of those 3,440 are
cold outbound prospects sourced by Bullpen who never visited the site and were never
supposed to carry web attribution. The honest version of the finding is narrower and still
serious: *inbound is not measured at all, so we cannot even count it.* The site→CRM join
is missing, not broken.

That matters most for the outbound motion, not for reporting — see Part 8, which is now
the highest-value section in this document.

Three fixes account for most of the recoverable value:
1. **Install the HubSpot tracking script.** One script tag. It turns the website into a
   live buying-intent signal for Bullpen's call list.
2. Give anonymous visitors a durable identity and carry it into the CRM and the app.
3. Give the 88 blog posts something to ask for other than a credit card.

---

## Part 1 — What we have

### The traffic asset
| Asset | Count | Notes |
|---|---|---|
| Blog posts | 88 | The single largest asset. Tag taxonomy, series, RSS→LinkedIn automation |
| Book chapters | 13 + figures | `book/manuscript/`, published at `/book` |
| Segment pages | 6 | primary-care, snf, dpc, pediatrics, np, + therapy pending on a branch |
| Comparison page | 1 | `/comparison/freedai` — bottom-funnel, highest commercial intent |
| Feature pages | `/features/*` | incl. a deep `/features/huddle` |
| Team pages | 6 | Real names and faces — trust surface for a clinician audience |
| Total `.astro` pages | 33 | Plus 88 generated post pages and tag/pagination routes |

### The tracking stack
- **GTM** `GTM-N767QFHJ`, loaded in `Base.astro`. Container holds GA4, three Google Ads
  conversions, Hotjar, and PostHog.
- **Ahrefs analytics**, loaded separately in `Base.astro`.
- **`dataLayer` pushes in the entire repo: one**, in `intake.astro`. GTM is installed and
  is being fed almost nothing custom. It sees pageviews and little else.
- **No HubSpot tracking script anywhere in the codebase.** This is the root cause of the
  headline finding.

### The CRM
- 3,440 contacts, 350 deals, deal amounts clustering at $1,788 and $708.
- Lifecycle stages in active use (`lead`, `opportunity`), so the pipeline is being worked.
- Attribution properties are effectively empty. See Finding 1.

### The capture surface — the whole of it
1. `/contact` — a **three-field** form (name, email, message) POSTing to
   `formsubmit.co/hello@riverrecords.ai`, a third-party email relay. Output is an email,
   not a record. No UTM, no segment, no practice size, no CRM write.
2. `/book-demo` — a Calendly inline embed, static `data-url`, no UTM passthrough, no prefill.
3. Outbound clicks to `stream.riverrecords.ai/onboard/*` — 45 such links in the repo.

That's it. There is no newsletter, no gated asset, no progressive profiling, no exit
capture, no segment self-identification.

---

## Part 2 — What's working

Genuinely worth protecting:

- **The content engine.** 88 posts with a disciplined taxonomy, series support, and an
  RSS→LinkedIn pipeline with bespoke `linkedinCaption` support. This is the hard part of
  content marketing and it is already solved.
- **ICP segmentation.** Six segment pages mean the message is already tailored by
  specialty. The targeting thesis is in place; only the measurement is missing.
- **Bottom-funnel coverage.** A competitor comparison page, a security page, a BAA page,
  and a research page. These are the pages that close clinicians, and they exist.
- **Technical SEO hygiene.** Canonical URLs, OG/Twitter cards with absolute image URLs,
  JSON-LD for `SoftwareApplication` and FAQ, `sitemap-index.xml`, permissive robots.
- **Trust surface.** Named team pages with headshots, real BAA, explicit security page.
  For a physician audience buying a documentation tool, this is load-bearing.
- **PR #31 (`claude/site-attribution`)** is the correct foundation and is already built —
  see Part 4. It is not yet merged.

---

## Part 3 — What's broken

### Finding 1 — The CRM has no idea the website exists ⚠️ severity: critical
**Evidence.** Of 3,440 contacts, 16 have a web source. All 16 were created between
6 October 2024 and 9 October 2025. Thirteen of the sixteen have an
`hs_analytics_first_url` of `meetings.hubspot.com/river-records/stream-demo` — HubSpot's
own booking tool, which carries tracking natively. Only **three** were ever attributed
from an actual `riverrecords.ai` page, all blog posts, all Feb–Jun 2025.

**Reading.** HubSpot attribution never really worked on the site itself. It worked on
HubSpot Meetings links. When demo booking moved to Calendly, that last thread was cut,
and web attribution flatlined to zero. The site has never carried the HubSpot script.

**Consequence.** No channel → pipeline join exists. Ad spend, blog, and LinkedIn are all
unmeasurable at the revenue level. This also means any claim about CAC by channel today
is unsupported.

### Finding 2 — All three Google Ads conversions measure proxies, not outcomes ⚠️ needs GTM confirmation
> **Priority: deferred.** No ad spend is running as of August 2026, so nothing is leaking
> today. This becomes blocking again the day ads resume — fix it *before* switching them
> back on, not after, because the first weeks of a restarted campaign are when the bidding
> algorithm learns what to chase.
Per `CLAUDE.md`, the three Ads conversions are:

| Conversion | Value | What it actually fires on |
|---|---|---|
| Book a demo | $200 | **Page view** of `/book-demo` |
| Contacted | $50 | Page view of `/contacted` — a genuine post-submit redirect ✅ |
| Signup click | $150 | **Click** on a link to `stream.riverrecords.ai` |

Two of the three fire on intent, not completion. Someone who lands on `/book-demo` and
bounces without booking counts as $200. Someone who clicks through to the app and never
finishes onboarding counts as $150. Google's bidding algorithm optimises toward whatever
you tell it a conversion is — so it is currently being trained to buy **page views and
outbound clicks**, and will happily find cheap traffic that does exactly that and nothing
more. This is the most likely single source of wasted spend on the account.

### Finding 3 — The demo booking is an attribution black hole
`/book-demo` embeds `calendly.com/jacob-riverrecords/meeting` with a static `data-url`.
Calendly accepts `utm_source`/`utm_medium`/`utm_campaign`/`utm_content`/`utm_term` plus
`name`/`email` prefill as query params, and passes them into the booking record and its
webhook. We pass none of them. The highest-intent action on the entire site — a booked
demo with a real clinician — lands with no idea where the person came from.

### Finding 4 — 88 posts, and the only ask is a credit card
`BlogPost.astro` contains exactly one CTA: "Try it on your next visit" → `/onboard/stream-pro`.
That is a bottom-funnel ask on top-of-funnel content. A physician reading a philosophical
post about note bloat at 11pm is not starting a trial; they are, plausibly, willing to
give an email address for something useful. We never ask. Every one of those readers
leaves anonymous and unreachable.

This is the largest *marketing* gap in the audit, distinct from the largest technical one.

### Finding 5 — The book is a lead magnet that isn't being used as one
There is a full 13-chapter book with figures, published openly at `/book`, with zero
capture attached. Long-form authored content by a named physician is the strongest
possible email-capture offer for this audience. Ungating it entirely is a defensible SEO
choice — but offering a PDF/EPUB version in exchange for an email costs nothing, keeps
the web version fully indexable, and converts the readers who want to keep it.

### Finding 6 — Safari silently cuts the attribution cookie from 180 days to 7
In PR #31, `attribution.js` sets `rr_vid` with `max-age = 180 days` via `document.cookie`
(`public/attribution.js:32,64`). Safari's ITP caps **client-side JavaScript-set** cookies
at **7 days**. A large share of physician traffic is iPhone and Mac. So on that traffic
the 180-day intent silently becomes 7 days, and any consideration cycle longer than a
week loses first-touch.

**Fix:** set the cookie server-side as a `Set-Cookie` HTTP header from a Cloudflare Pages
Function. Server-set first-party cookies are not subject to the 7-day cap. This is a small
addition to an otherwise correct design, and it is invisible without specifically testing
Safari across a week boundary.

### Finding 7 — The contact form throws away everything it could learn
Three fields, to an email relay. No practice name, no specialty, no clinician count, no
EHR, no role — and no attribution. Each submission is a lead we then have to research by
hand. The segment pages already tell us who we're talking to; the form doesn't ask.

### Finding 8 — No owned audience
RSS exists and auto-posts to LinkedIn. There is no email list. LinkedIn reach is rented
and algorithm-dependent; an email list is owned. For a 88-post content operation, not
having a newsletter is leaving the compounding asset uncollected.

---

## Part 4 — The identity architecture

The goal: one durable, first-party identity per visitor, created on first touch, carried
across `www` → `stream`, and joined to a real person the moment they identify themselves.

PR #31 already builds **stage 1**. The rest is unbuilt.

```
   Anonymous visit ──► rr_vid minted (first-party cookie on .riverrecords.ai)
                       first-touch UTM stored, write-once
                       last-touch UTM stored alongside
                              │
                              │  ← STAGE 1: built in PR #31, not merged
   ═══════════════════════════╪═══════════════════════════════════════════
                              │  ← STAGE 2+: to build
                              ▼
   Identification ──► email captured (form / newsletter / book / demo)
                       rr_vid + first/last touch written onto the HubSpot contact
                              │
                              ▼
   App handoff ─────► /onboard link carries rr_vid + UTM
                       app writes tenant.rr_vid + tenant.utm_* on signup
                              │
                              ▼
   Revenue join ────► deal ← contact ← rr_vid ← first touch = channel
                       "this $1,788 deal began as an organic visit to
                        /blog/the-undercoding-tax on 12 June"
```

`rr_vid` is the spine. It is worthless while anonymous and valuable the instant it's
stitched, which is why the capture surface (Part 5, phase 2) and the identity work are
the same project, not two projects.

**Three writes make the join real:**
1. **HubSpot** — custom contact properties `rr_vid`, `rr_first_source`, `rr_first_medium`,
   `rr_first_campaign`, `rr_landing_page`, `rr_last_source`. Populated on every form post.
2. **The app** — a `tenant.rr_vid` column in the `ai-scribe` repo, written at signup.
   Already flagged as a follow-up on PR #31; nothing downstream works without it.
3. **Calendly** — UTM + `rr_vid` appended to the embed URL so booked demos carry source.

---

## Part 5 — Roadmap

Ordered by (value ÷ effort). Phase 0 and 1 are prerequisites for measuring anything else,
so sequence matters more than usual here.

### Phase 0 — Secure access, then land what's built · do the first item today
- [ ] **Confirm ownership of every marketing account** — GTM `GTM-N767QFHJ`, the GA4
      property, Google Ads, Hotjar, PostHog, Ahrefs. If any of these were created under
      Jay's personal login rather than a River Records account, access can disappear
      without warning and the Ads conversion history with it. This is the one item on the
      list with a deadline attached, and it is not a code change.
- [ ] **Decide whether ad spend keeps running in the meantime.** Per Finding 2 the
      conversions are proxies, so an unattended account is optimising toward page views.
      Spending against a metric nobody is watching is the most expensive item here.
- [ ] Merge **PR #31**. Resolve the two `CLAUDE.md` conflicts first (Part 6).
- [ ] Add the Safari server-side cookie fix (Finding 6) — Cloudflare Pages Function.
- [ ] Build the GTM triggers/tags for `rr_attribution_ready`, `cta_click_signup`,
      `cta_click_demo`. **These events currently fire into a void** — the container has no
      tags listening. This is console work with no owner now; treat it as a candidate for
      Part 7 rather than assuming it gets done.

### Phase 1 — Connect the site to the CRM · ~2–3 days · highest value in the document
- [ ] Install the HubSpot tracking script in `Base.astro`. This alone restores web
      attribution for every future contact.
- [ ] Replace `formsubmit.co` with a HubSpot form (or a Pages Function that posts to the
      HubSpot Forms API). Every submission becomes a record with source, not an email.
- [ ] Expand the contact form: practice name, specialty, clinician count, role. Four
      fields, chosen to match how the segment pages already slice the market.
- [ ] Append UTM + `rr_vid` to the Calendly embed URL and prefill name/email where known.
- [ ] Create the six `rr_*` custom properties in HubSpot.

### Phase 2 — Build a capture surface · ~1 week · highest *marketing* value
- [ ] **Newsletter.** One well-designed subscribe unit in `BlogPost.astro`, so it appears
      on all 88 posts at once, plus the blog index. This is the single highest-leverage
      change available — one component, 88 pages of coverage.
- [ ] **Gate a book download.** Keep `/book` fully open and indexable; offer PDF/EPUB for
      an email. Zero SEO cost, real capture.
- [ ] **Segment-matched offers.** The field sheets and battle cards in `gtm/` are already
      written and designed. A specialty-specific one-pager offered on the matching
      `/for/*` page converts far better than a generic ask.
- [ ] Post-signup progressive profiling — never re-ask a known field.

### Phase 3 — Make the numbers honest · ~2 days
- [ ] Re-point the $200 demo conversion from `/book-demo` **page view** to a real Calendly
      booking event (Calendly webhook → GTM/GA4, or the embed's `event_scheduled` postMessage).
- [ ] Re-point the $150 signup conversion from *outbound click* to a real signup, fired
      server-side from the app on trial creation with the `rr_vid` as the join key.
- [ ] Import offline conversions into Google Ads so bidding optimises on closed revenue
      rather than clicks. Requires Phase 1 to be in place.

### Phase 4 — Compound it · ongoing
- [ ] Pull the Ahrefs data and map which of the 88 posts actually earn traffic; add
      segment-matched offers to the top ~10 rather than treating all 88 equally.
- [ ] Build retargeting audiences off `rr_vid` segments (read a comparison page, read
      three posts, visited pricing) — impossible before Phase 1.
- [ ] Report pipeline by first-touch channel monthly. The point of the whole exercise.

---

## Part 6 — Guardrails

These are decisions for Jake, not things to implement unilaterally.

**Two live conflicts with `CLAUDE.md`.** The DO NOT list currently says *"Do not use
localStorage or sessionStorage"* and *"Do not add standalone analytics scripts — use GTM."*
PR #31 does both, and Phase 1's HubSpot script does the second again. Either carve out an
explicit, documented exception or change the approach. Right now the rules and the roadmap
contradict each other, and leaving that unresolved means the next person to touch this has
no idea which to follow.

**Cookie consent.** `CLAUDE.md` says not to add a consent banner without checking with
Jake. Worth a deliberate decision now: the audience is US clinicians, the site is
marketing-only with no PHI, and the cookies are first-party — so the exposure is far lower
than a patient-facing health site. But adding HubSpot tracking plus a 180-day identity
cookie is the moment to decide, not later. If any EU/UK traffic is targeted, consent
becomes non-optional.

**Privacy policy.** Already discloses cookies, pixel tags, and Google Analytics in general
terms (`privacy-policy/index.astro:93,137`), which plausibly covers `rr_vid`. It does not
name HubSpot. Adding HubSpot tracking should come with naming it.

**Healthcare context.** This is a marketing site for clinicians, not a patient portal, and
nothing here touches PHI — the OCR tracking-technology guidance that has driven pixel
litigation against health systems is aimed at patient-facing properties. Worth stating
explicitly in the privacy policy that the marketing site collects no patient data, since
the buyers are themselves privacy-sensitive and will look.

---

## Part 7 — Running this with one person

The stack currently spans **ten systems**: GTM, GA4, Google Ads, Hotjar, PostHog, Ahrefs,
HubSpot, Calendly, formsubmit.co, and Cloudflare. That is a reasonable number for a team
with a dedicated growth person. It is too many for one physician founder, and an
unwatched tool is worse than no tool — it costs money, adds page weight and privacy
surface, and produces numbers nobody checks but everybody half-trusts.

The good news is that consolidating *also* fixes findings 1, 3 and 7, because HubSpot
already does natively what we were about to build by hand.

### Move demo booking from Calendly back to HubSpot Meetings
This is the highest-leverage single change available, and the audit data argues for it
directly: **13 of the 16 contacts that ever carried web attribution came through
`meetings.hubspot.com`.** HubSpot Meetings was the only thing on this site that ever
produced attribution, and switching to Calendly is what turned it off.

Switching back:
- restores source attribution on booked demos with no code at all,
- creates the contact and logs the meeting straight into the CRM,
- makes Finding 3 disappear rather than needing UTM-passthrough plumbing,
- removes a vendor.

The cost is losing whatever Calendly-specific scheduling features are in use. Worth
checking before committing, but the default answer here looks like yes.

### Replace formsubmit.co with a HubSpot form
Same argument. A HubSpot form writes a real record with source data attached, instead of
mailing `hello@riverrecords.ai` and leaving re-keying as manual work. One fewer vendor,
and Finding 7 is solved as a side effect.

### Pick one of Hotjar and PostHog, and cut the other
Both do session recording and behavioural analytics; the overlap is substantial. Both load
on every page. Ask the honest question: when did either last change a decision? If the
answer is "never" or "I don't have the login," cut both for now — they can be restored in
an afternoon when there's someone to watch them.

### Where the newsletter should live
If the HubSpot tier includes Marketing Hub email, put the list there — the subscriber, the
attribution, and the CRM record become one object rather than three, and no new vendor
appears. If it doesn't, that is the one case in this document where adding a tool is
justified, since the owned-audience argument in Finding 8 outweighs the overhead.

### The principle for anything built from here
Prefer the repo over a console. Code in this repo is reviewable, version controlled,
recoverable, and something Claude can maintain alongside you. GTM container config is
invisible from here, has no history, and — with no owner — will drift out of sync with
the site until someone discovers it broke months ago. That is not an argument for removing
GTM, which is still the right place to fire tags. It is an argument for keeping the logic
in `attribution.js` and the container dumb, so that the part that can rot is as small as
possible.

**Target state: six systems.** Cloudflare, GTM (thin), GA4, Google Ads, Ahrefs, HubSpot
(CRM + forms + meetings + email). Everything Calendly and formsubmit.co do today gets
absorbed, and the two session-recording tools go dormant until someone can own them.

---

## Part 8 — The website as an instrument for outbound

This is the highest-value section in the document, and it reframes everything above.

Bullpen is running cold outreach through HubSpot, tracking opens and link clicks, and
prioritising calls by engagement — though in practice calling most offices they find. The
website's job, right now, is **not** to generate inbound. It is to tell Bullpen which of
those offices to call today.

It cannot currently do that at all.

### The signal that doesn't exist
Ranked by how much they predict a real conversation, the intent signals available on a
cold prospect look roughly like:

| Signal | Predictive value | Do we have it? |
|---|---|---|
| Read the Freed comparison page twice | Very high | ❌ |
| Viewed pricing, or the specialty page matching their practice | High | ❌ |
| Read 3+ blog posts in a week | High | ❌ |
| Visited the site at all after an email | Moderate–high | ❌ |
| Clicked a link in an email | Moderate | ⚠️ partially — see below |
| Opened an email | Low — inflated by image proxies and scanners | ⚠️ 67 contacts |

Every high-value row is missing, and all of them arrive with **one script tag**. HubSpot's
tracking code sets its own first-party cookie (`hubspotutk`) and — critically — when
someone clicks a link in a HubSpot email, HubSpot ties that cookie to their contact record
on arrival. From that moment every page they view lands on their CRM timeline, by name.

For a 3,440-contact outbound list, installing that script means: any prospect who ever
clicks through from a Bullpen email stops being anonymous, permanently, and their browsing
becomes a call-prioritisation signal. **"Dr. K read the Freed comparison and the pricing
section on Tuesday"** is a fundamentally different call than "Dr. K opened an email."

This is the answer to the original question about tracking users via cookies across the
site. For the outbound population, HubSpot's cookie does the identity join natively and
better than anything we would hand-roll. `rr_vid` from PR #31 remains necessary for the
genuinely anonymous population — organic search and LinkedIn readers who have never been
emailed — and for joining a signup back to first touch inside the app. The two are
complementary, not competing: HubSpot de-anonymises known contacts, `rr_vid` carries
anonymous first touch across to `stream.riverrecords.ai`.

### A question for Bullpen, worth asking this week
Only **67 of 3,440 contacts** have any `hs_email_open` value, and the maximum is 8. For an
active cold-outreach programme those numbers look far too low. Either the sending happens
in a tool outside HubSpot that only syncs partial data, or the sequences are not writing
to the standard properties. Either way, if the engagement data Bullpen prioritises on
isn't fully visible in the portal, then Jake cannot audit their targeting and no HubSpot
scoring rule can use it. Ask them directly: *where do you send from, and what syncs back?*

### Point the emails at the right pages
Bullpen calls offices by specialty, and `gtm/field-sheets/` already contains
specialty-specific collateral. The site has matching pages — `/for/primary-care`,
`/for/snf`, `/for/dpc`, `/for/pediatrics`, `/for/np`. Outbound emails should link to the
**matching segment page**, not the homepage. Two benefits: the prospect lands on copy
written for their specialty, and the page they visit becomes a self-declared segment
signal on their timeline.

### Turn visits into call triggers
Once tracking is live, HubSpot can notify on revisits. The classic outbound play — *call
the prospect the day they come back to the site* — becomes available with no custom code.
For a solo founder taking the warmest calls himself while Bullpen works the top of the
funnel, this is the highest-value routing rule available.

### One risk worth heading off early: sending domain
If Bullpen sends cold outbound from the primary `riverrecords.ai` domain, that reputation
is shared with any future marketing email — including the newsletter proposed in Phase 2.
Cold outbound attracts spam complaints by nature. Burning the root domain's reputation is
slow to happen and very slow to undo. Standard practice is a **separate subdomain or
sending domain for cold outbound**, kept away from the domain used for opt-in marketing
email. Worth confirming with Bullpen now, while the list is still small, rather than
discovering it when the first newsletter lands in spam.

### Revised priority order
1. **HubSpot tracking script in `Base.astro`** — one tag, unlocks the entire table above.
2. Segment-page links in Bullpen's sequences + revisit notifications.
3. Confirm the sending-domain split and where Bullpen's engagement data lives.
4. HubSpot Meetings instead of Calendly (Part 7) — restores booking attribution.
5. HubSpot form instead of `formsubmit.co`.
6. Everything else in Phase 2 onward.

Ads (Finding 2) drop off the near-term list entirely until spend resumes.

---

## Appendix — How the findings were verified

| Claim | How to re-check |
|---|---|
| 16/3,440 web-attributed contacts | HubSpot contact search, `hs_analytics_source IN (ORGANIC_SEARCH, PAID_SEARCH, DIRECT_TRAFFIC, REFERRALS, SOCIAL_MEDIA, EMAIL_MARKETING, PAID_SOCIAL, OTHER_CAMPAIGNS)` |
| Last web-attributed contact 9 Oct 2025 | Same query, sorted `createdate DESC` |
| All 350 deals `OFFLINE` | HubSpot deal search on `hs_analytics_source` |
| One `dataLayer` push in the repo | `grep -rn "dataLayer" src/ public/` |
| No HubSpot script | `grep -rn "hs-scripts\|hubspot" src/layouts/Base.astro` |
| One form site-wide | `grep -rln "<form" src/` |
| Calendly has no UTM | `src/pages/book-demo/index.astro:93` |
| Blog CTA is trial-only | `src/layouts/BlogPost.astro:85-88` |
| Cookie is JS-set, 180d | `public/attribution.js:32,64` (PR #31) |
| HubSpot has never seen a riverrecords.ai page view | Contact search on `hs_analytics_num_page_views` + `hs_analytics_last_url`; non-zero values point only at `meetings.hubspot.com` / `app.hubspot.com` |
| 67 contacts with any email-open data | Contact search, `hs_email_open HAS_PROPERTY`, total = 67 |
| Ads conversions ⚠️ | **Not verified** — from `CLAUDE.md`. Confirm in the GTM console |
