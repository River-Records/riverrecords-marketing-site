# River Records — Marketing Site

## Project overview
Marketing site for riverrecords.ai / Stream by River Records.
Built with Astro (static output). Deployed via Cloudflare Pages.
Repo: github.com/River-Records/riverrecords-marketing-site

## Build system
- Framework: Astro 6 (static output mode)
- Source: src/pages/, src/components/, src/layouts/, src/content/
- Static assets: public/ (CSS, JS, images)
- Build: `npm run build` → output to `dist/`
- Dev: `npm run dev` (localhost:4321)
- Node: >=22 required (set NODE_VERSION=22 in Cloudflare)

## File structure
```
src/
  layouts/
    Base.astro          ← HTML shell, GTM, Ahrefs, SEO meta, JSON-LD
    Page.astro          ← Wraps pages with OfferBanner + Nav + Footer
    BlogPost.astro      ← Blog post layout with styled markdown
  components/
    Nav.astro           ← Nav with Specialties dropdown + mobile menu
    Footer.astro        ← Site footer
    OfferBanner.astro   ← Top banner (trial + pricing)
    HeroSection.astro   ← Reusable hero with props
    ProofStrip.astro    ← Trust strip
    PhilBlock.astro     ← Philosophy quote block
    CtaDark.astro       ← Dark CTA section
    TestimonialCard.astro
    FeatureCell.astro
    PainCard.astro
    StepMock.astro      ← Mock UI card for How It Works
    BlogTagBar.astro    ← Tag filter pills for blog
  pages/
    index.astro         ← Homepage
    about/              ← About, team, research
    book-demo/          ← Calendly embed
    contact/            ← Contact form (redirects to /contacted)
    contacted/          ← Thank-you page (triggers Ads conversion)
    comparison/freedai/ ← Stream vs Freed
    for/primary-care/   ← Primary care specialty page
    for/snf/            ← SNF/LTC specialty page
    blog/
      [...page].astro   ← Paginated blog index (12 per page)
      [slug].astro      ← Individual blog posts
      tag/[tag]/[...page].astro ← Tag-filtered blog pages
    baa/                ← Business Associate Agreement
    privacy-policy/
    terms-of-service/
    404.astro           ← 404 with page search
  content/
    blog/               ← Markdown files (Astro content collection)
  content.config.ts     ← Collection schema (at src/ root, not in content/)
functions/
  rr/id.js              ← Cloudflare Pages Function: durable rr_vid cookie (Safari/ITP)
public/
  brand-extract.css     ← Design tokens from product
  shared.css            ← All component styles + CSS variables
  ui-widgets.js         ← Interactive product widgets
  attribution.js        ← Acquisition attribution (see below)
  hubspot-events.js     ← Forwards high-intent events to the HubSpot timeline
  _redirects            ← Cloudflare 301 redirects
  robots.txt
  og-default.png        ← OG social sharing image
  og-default.svg        ← OG image source
  images/team/          ← Team headshots
```

## Adding a new page
1. Create `src/pages/your-page/index.astro`
2. Import and use the `Page` layout
3. Add page-specific styles in a `<style>` block
4. Use reusable components (HeroSection, FeatureCell, etc.)
5. Never edit Nav, Footer, or OfferBanner directly in a page

## Adding a blog post
1. Create `src/content/blog/your-slug.md`
2. Add frontmatter:
```yaml
---
title: Your Post Title
description: A short description
author: Jacob Kantrowitz MD, PhD
publishDate: 2026-04-07
tags: [topic-slug]
draft: false
---
```
3. Write content in markdown below the frontmatter
4. Push — it builds and deploys automatically

### Blog tags
Tags come from a fixed taxonomy — do NOT invent new tags. Use 2 per post (3 max):

`product-updates`, `research`, `information-chaos`, `burnout`, `ai-scribe`,
`longitudinal-care`, `note-bloat`, `clinical-context`, `care-coordination`,
`medical-decision-making`, `practice-operations`, `ehr-design`, `comparisons`

- Tag pages generate automatically at `/blog/tag/<tag>/`
- Display labels live in TWO `tagLabels` maps that must stay in sync:
  `src/pages/blog/tag/[tag]/[...page].astro` and `src/components/BlogTagBar.astro`
- `displayTags` in BlogTagBar.astro is the curated subset shown as filter pills
  on the blog index (not every tag appears there — `comparisons` is deliberately
  hidden, and posts tagged `comparisons` are also excluded from the RSS feed)
- Adding a taxonomy tag = add it to both `tagLabels` maps (and `displayTags` if
  it should be a filter pill), then use it in frontmatter

### Blog series
Multi-part series are wired via two optional frontmatter fields:
```yaml
series: "Revenue & Coding"   # shared name, must match exactly across parts
seriesPart: 2                # 1-based order within the series
```
- BlogPost layout renders a "Part N of X" badge and cross-linked series nav
  automatically; X counts published (non-draft) parts, so it grows as parts ship
- The blog index groups series parts and orders them by `seriesPart`,
  independent of `publishDate`
- Existing series: "The Work Before the Work" (5 parts), "Revenue & Coding" (3 parts)

### When opening a blog PR (e.g. via the @claude Action)
Always include the Cloudflare preview link at the TOP of the PR description so it
can be reviewed on mobile without logging into the Cloudflare dashboard. Build it
from the branch name (replace every `/` with `-`) and the post slug:
`https://<branch-with-slashes-as-dashes>.riverrecords-marketing-site.pages.dev/blog/<slug>/`
Example: branch `claude/issue-7-...`, slug `my-post` →
`https://claude-issue-7-....riverrecords-marketing-site.pages.dev/blog/my-post/`

## RSS feed & syndication
The blog feed is generated at `/rss.xml` by `src/pages/rss.xml.js` from the
published (non-draft) posts. It powers readers and the blog→LinkedIn automation.
Each item's `<description>` carries the optional `linkedinCaption` frontmatter
field when present, otherwise it falls back to the SEO `description`. The caption
is routed through the standard `<description>` field on purpose, so no-code RSS
posters (e.g. Buffer) publish the bespoke caption without needing to read a
custom XML element. This only affects the feed — the site reads `description`
straight from the content collection, so on-page copy and SEO are unaffected.
To make auto-posted LinkedIn updates read natively, set a `linkedinCaption` in
the post's frontmatter (a hook written for LinkedIn, not the SEO description).
Comparison/SEO posts tagged `comparisons` are excluded from the feed entirely,
so they never auto-post to LinkedIn.

## Specialty pages
Live at `/for/[specialty]`. Follow the template in `/for/primary-care/index.astro`:
Hero → Pain cards → Philosophy → How it works (with widgets) → Features → Testimonials → Pricing callout → CTA.

Current pages:
- /for/primary-care — primary care & family medicine
- /for/snf — SNF, LTC, post-acute care (primary CTA is Book a Demo)

## Changing nav/footer/offer banner
Edit the component in `src/components/`. Change once — updates every page.

## Revenue tools
`/tools/undercoding-calculator/` estimates fee-for-service revenue an independent
practice leaves uncaptured. All figures live in `src/config/coding-rates.ts`.

**Those rates expire every January.** The Medicare Physician Fee Schedule is republished
annually, and a calculator quoting last year's numbers is worse than none — it is wrong
with a confident face, in front of a numerate audience. The config carries an
`effectiveLabel` that is rendered on the page and a `reviewBy` date. Update both together
with the citations, never one without the other.

Three things on that page are not decoration and should not be trimmed:
- the **rates-as-of stamp**, so a visitor can judge how current the numbers are
- the **anti-upcoding guardrail**, because the audience is right to be wary and the
  argument is about defensible documentation, not billing more
- the **"what this leaves out" list**, which is what makes a conservative estimate
  credible rather than promotional

The undercoding-rate default is deliberately low. Published prevalence research reports
much higher figures, but nearly all of it predates the 2021 E/M overhaul, after which
coding shifted upward materially — so the page presents the rate as the visitor's own
assumption and says why it does not lean on those studies.

Verify with `scripts/verify-calculator.mjs`, which asserts each line against
hand-computed values.

## Calculator submissions (`functions/api/calculator.js`)
Setup runbook: `docs/HUBSPOT-SETUP.md`. The three contact properties must exist with
exactly the internal names the field map uses, or submissions fail silently.
The calculator posts to a Cloudflare Pages Function that fans out to HubSpot, Mandrill
and a notification path. Everything is optional and independently gated by environment
variables, so it degrades to exactly the previous behaviour when nothing is set.

**The form must keep submitting natively. Do not convert it to `fetch()`.** HubSpot's
Collected Forms captures these into the CRM by watching real form submissions — that
capture already works and is the floor. Intercepting the submit would switch it off
silently, and nothing would look broken.

| Variable | Effect when absent |
|---|---|
| `HUBSPOT_FORM_GUID` | no CRM write from this endpoint (Collected Forms still captures) |
| `MANDRILL_API_KEY` | no email to the visitor; the FormSubmit notification stays on |
| `MANDRILL_FROM_EMAIL` / `MANDRILL_FROM_NAME` | defaults used |
| `HUBSPOT_PORTAL_ID` | defaults to the portal in `Base.astro` |

**There is deliberately no FormSubmit fallback.** One existed briefly and could never
have worked: formsubmit.co answers server-side POSTs with a 403 Cloudflare bot challenge,
because it is built for browser-originated posts. Verified against the live endpoint. It
was redundant anyway — Collected Forms already notifies on these submissions. The
browser-posted form on `/contact` is unaffected and still works.

**Mandrill is optional.** The portal has Marketing Hub **Starter**, which includes simple
workflows attached to forms — one per form, up to ten actions, "send a marketing email"
among them — and a Forms API submission triggers them. So HubSpot can send the follow-up
itself, personalized from the contact properties written here and editable without a
deploy. Prefer that; it is one fewer vendor. Mandrill remains wired for sends that must
be genuinely transactional, or to avoid consuming the marketing-contact allowance.

**Watch the marketing-contact limit.** Starter includes 1,000 marketing contacts and the
CRM already holds ~3,440. Only marketing contacts can receive marketing email, so
designating the whole cold-outreach list would blow the allowance several times over.
Calculator submitters are worth the slot; a bought prospect list generally is not.

The HubSpot call uses the **unauthenticated** endpoint
(`/submissions/v3/integration/submit/...`), which needs no token — verified by probe: it
returns 404 for an unknown form GUID rather than 401. The `secure/` variant does require
a bearer token. The submission passes `context.hutk` from the `hubspotutk` cookie, which
is what retroactively attaches a visitor's prior anonymous browsing to the new contact.

The handler must never throw — a person who filled in a form gets their guide whatever
any third party is doing. Outcomes are reported in an `X-RR-Fanout` response header so a
misconfiguration can be diagnosed with `curl -I` rather than a redeploy. Verify with
`scripts/verify-calculator-fanout.mjs`.

## Guides
`/guides/the-defensible-visit/` is the asset the calculator promises. It explains the
2021 MDM table — the 2-of-3 rule, the data categories and their counting traps, and why
prescription drug management carries moderate risk in primary care.

**It makes specific coding claims to clinicians, so accuracy outranks persuasiveness.**
Three rules if you edit it:
- Every criterion must trace to AMA/ACS/AAFP guidance, not to a billing vendor's blog.
- Do not let an example qualify on a contested item. The worked example deliberately
  reaches its level on *problems plus risk* and states that the data element does not
  carry it — an earlier draft claimed Category 1 was satisfied by two items plus
  patient-supplied home BP readings, which is both a miscount and a disputed item.
- Keep the compliance disclaimer. It is educational content, not compliance advice.

**Delivery: on the page, not by email.** The calculator hands the guide over in the
`?sent=1` confirmation the relay returns to. Do not replace this with an emailed link.

The first version promised "we'll email this to you" using FormSubmit's `_autoresponse`.
It never fired — FormSubmit does not send an autoresponse when `_captcha` is `false`,
which the form sets — so the offer was broken for every visitor, and silently, because
the submission itself succeeded. Rescuing it would have meant enabling reCAPTCHA, which
puts friction and a Google script in front of a lead capture.

The guide is a public URL. Handing it over immediately is faster for the visitor and
removes deliverability from the critical path entirely. `scripts/verify-calculator-delivery.mjs`
asserts the confirmation carries a working link and that no inbox promise creeps back in.

## Product videos (Loom)
All video metadata lives in `src/config/videos.ts` — ids, titles, durations, thumbnails.
Add or re-record a video there and every placement updates. Currently embedded on the
homepage (`#see-it-work`, all three), `/intake` (intake) and `/features/huddle` (huddle).

`src/components/LoomEmbed.astro` renders a **click-to-play facade**: a static thumbnail
plus a play button, with Loom's iframe injected only once the visitor clicks. Do not
replace it with a bare `<iframe>` — the facade exists so that (1) three Loom players
don't load on the homepage, (2) no third-party frame or Loom cookie is set for people
who never watch, and (3) the play click is measurable. It pushes `video_play` to the
dataLayer with the video key and context; watching a walkthrough is one of the strongest
buying signals on the site.

Sizing is built to `1280x828`, the real footage dimensions. Loom's oEmbed reports
`1668x1251` — that is its default player box, and building to it letterboxes every video.

Thumbnails are static frames in `public/images/videos/`, extracted from Loom's animated
preview GIF (the refresh command is in the header of `videos.ts`). They are committed
rather than hotlinked so the homepage doesn't pull ~1MB of animated GIF from Loom's CDN.

Verify with `scripts/verify-video-embeds.mjs` after touching the component or the config.

## Design system

### Colors
All values in `public/shared.css` as CSS variables.
NEVER hardcode hex values. Always use `var(--token-name)`.

Primary navy:    var(--primary)     #24599e
Dark background: var(--dark)        #022A5B
Accent teal:     var(--accent)      #27959C
Page background: var(--surface)     #F3F5F7
Body text:       var(--ink)         #333333

### Typography
- Headings: Instrument Serif (Google Fonts, loaded in Base.astro)
- Body: DM Sans (Google Fonts, loaded in Base.astro)
- NEVER use Inter, Roboto, Arial, or system-ui as primary fonts

### Components
Reusable components are Astro files in `src/components/`.
Shared styles (buttons, nav, footer, proof strip, testimonials, CTA, philosophy) in `public/shared.css`.

## Pricing (as of April 2026)
- Monthly: $149/month
- Annual: $99/month ($1,188/year)
- Trial: 30 days free, no credit card required
- Freed comparison: $119/month (Freed Premier tier)

### Changing pricing
All pricing is centralized in `src/config/pricing.ts`. Edit the values there and push — every page updates automatically. The only exceptions are:
- JSON-LD schema in index.astro (hardcoded in `is:inline` script)
- Freed comparison table amounts (hardcoded HTML in comparison/freedai page)
These must be updated manually when pricing changes.

## CTAs
Primary CTA:  https://stream.riverrecords.ai/onboard/stream-pro
Demo:         /book-demo
Login:        https://stream.riverrecords.ai/login
Contact:      /contact (form redirects to /contacted)

## Analytics & tracking
Most analytics run through Google Tag Manager (GTM-N767QFHJ).
GTM contains: GA4, 3 Google Ads conversions, Hotjar, PostHog, login tracking.

Two scripts load directly in Base.astro instead, on purpose:
- **Ahrefs** analytics
- **HubSpot** tracking (portal 46752060)

Do not add further standalone analytics scripts — default to GTM. The HubSpot
exception is deliberate and worth understanding before overriding it:

1. It has to run reliably on every page to do its job. Routing identity tracking
   through a container adds a failure mode (a mis-set trigger silently stops
   de-anonymising prospects) for no benefit.
2. Nobody currently owns the GTM container. Jay set it up and is no longer on the
   project, so container config has no reviewer, no history, and no version control.
   Logic that lives in this repo can be read, diffed, and fixed; logic in the console
   rots unnoticed. Keep the container thin and the repo authoritative.

See `docs/GROWTH-DATA-AUDIT.md` for the full reasoning, `docs/GTM-SETUP.md` for the
container work this is waiting on, and `docs/VERIFY-DEPLOY.md` to confirm a deploy
actually works.

### High-intent events go straight to HubSpot
`public/hubspot-events.js` forwards a short list of dataLayer events — `video_play`,
`intake_video_complete`, `cta_click_demo` — to HubSpot as page views at synthetic
`/engagement/*` paths, so they land on the contact timeline **without** needing a GTM
tag. The outbound team works in HubSpot, not GA4, and "watched four minutes of Huddle"
is the strongest buying signal the site produces.

Three things to know before changing it:
- **Keep the list short.** Every entry becomes a line on a real person's timeline; one
  cluttered with scroll depth is one nobody reads.
- **It reads the dataLayer by polling, never intercepts it.** Wrapping `dataLayer.push`
  would race GTM installing its own — `gtm.js` is async, so whoever assigns last wins.
- **The real path must be restored after each send.** Leaving the synthetic path set
  makes the visitor's *next* genuine page view report it, turning one extra row into
  corrupted page data.

The cost of the approach: these appear in HubSpot's Pages report alongside real pages.
That is why they are namespaced under `/engagement/` — so they can be filtered out. If
the portal is ever on Marketing Hub Enterprise, switch to `trackCustomBehavioralEvent`
and the tradeoff goes away.

The contact form additionally calls `_hsq identify` with the submitted email, which
retroactively attaches everything that visitor already browsed to their contact record.
That is sent **directly to HubSpot, never through the dataLayer** — an email address in
the dataLayer would flow to GA4, and Google prohibits personal data there.

Verify with `scripts/verify-hubspot-events.mjs`.

### dataLayer events the site pushes
Ten, and **no GTM tag listens to any of them yet** — see `docs/GTM-SETUP.md`. Site-wide:
`rr_attribution_ready`, `cta_click_signup`, `cta_click_demo`, `video_play`,
`contact_form_submit`. On `/intake` only: `intake_cta_click`, `intake_faq_expand`,
`intake_scroll_depth`, `intake_video_play`, `intake_video_complete`. If you add another,
add it to that doc's table too, or it will fire into the void like these did.

### Conversion triggers (configured in the GTM console)
- /book-demo page view → $200 Ads conversion
- /contacted page view → $50 Ads conversion
- Click to stream.riverrecords.ai → $150 Ads conversion

These were set up by Jay, who is no longer working on the project — as of Aug 2026
nobody is actively maintaining the container. Two of the three fire on a page view or
an outbound click rather than on a completed booking or signup, so they measure intent
rather than outcome. See `docs/GROWTH-DATA-AUDIT.md`. The container is not visible from
the repo, so treat the list above as unverified until checked in the console.

## Tone & copy rules
- DO NOT use the word "narrative" in any copy
- DO NOT say Stream "thinks like a clinician" — it is "organized like clinicians think"
- EHR language: "works alongside any EHR" (not "works with any EHR")
- Blog posts: philosophical tone, not product-focused
- Stream is organized by medical PROBLEM, not by date/encounter
- Brand voice: direct, clinical, physician-to-physician

## Deployment
Push to main → Cloudflare Pages auto-deploys.
Build command: `npm run build`
Output directory: `dist`
Node version: 22

## DO NOTs
- Do not use inline styles — use shared.css classes or scoped component styles
- Do not duplicate CSS between pages — use components
- Do not add external CSS frameworks (Tailwind, Bootstrap, etc.)
- Do not use browser storage for page state or UI behaviour — **except** the
  named acquisition-attribution keys below
- Do not add cookie consent banners without checking with Jake
- Do not add standalone analytics scripts — **except** the two already documented
  (Ahrefs, HubSpot); default to GTM for anything new

### The two storage/analytics exceptions, and why
These rules used to be absolute. Both now carry a deliberate exception, so that the
list matches the code rather than quietly contradicting it.

**Browser storage.** `public/attribution.js` uses `localStorage` for `rr_vid` and
first-touch attribution, and `sessionStorage` for the `?rr_debug=1` flag. First touch
has to survive a return visit days later, which is exactly what storage is for. The
rule still stands for everything else: no storing UI state, form drafts, dismissed
banners, or preferences — those cause stale-state bugs on a static site and are what
the rule was written against. Permitted keys are `rr_vid`, `rr_attribution`,
`rr_debug`. Adding a new one is a decision, not a detail.

**Standalone scripts.** Ahrefs and HubSpot load directly in `Base.astro`. See the
Analytics section for the full reasoning; the short version is that identity tracking
has to run on every page to work at all, and the GTM container has had no owner since
Jay left, so logic placed there has no reviewer, no history, and no version control.
Keep the container thin and the repo authoritative.


## Acquisition attribution (`public/attribution.js`)

The site is a **static** Astro build on `www.riverrecords.ai`; the app is on
`stream.riverrecords.ai`. CTA hrefs are therefore baked at build time and cannot
carry the visitor's real inbound channel — so attribution is applied client-side.

**The bug this fixed:** most signup CTAs (Nav, OfferBanner, HeroSection, CtaDark,
BlogPost, BookChapter, all four `/for/*` pages) carried no UTM at all, so all 87
blog posts contributed zero attribution. The two pages that did append UTM
hardcoded `utm_source=homepage`, which *overwrote* the real channel. The app's
`tenant.utm_source` column was recording which page the button was on, not where
the visitor came from.

**Rules the script enforces:**

- A real inbound source always beats a page's hardcoded one. Page identity belongs
  in `utm_content`, and a more specific existing `utm_content` (`hero`, `pricing`)
  is never overwritten.
- **First touch is write-once**; last touch is also kept (`rr_last_source`).
- Ad click IDs (`gclid`, `fbclid`, `msclkid`, `li_fat_id`, `ttclid`) are forwarded.
- Paramless visits are classified `organic` / `referral` / `direct` from the
  referrer rather than collapsing into "(none)". Internal navigation never
  re-attributes.
- `rr_vid`, an anonymous first-party id, is set in localStorage **and** a
  `.riverrecords.ai` cookie — the parent-domain cookie reaches the app even when
  URL params are lost (bookmark, new tab, return visit).
- **Only `/onboard*` links are decorated.** `/login` is an existing customer, not
  an acquisition; decorating it pollutes the app's UTM columns and firing a signup
  conversion on a login click corrupts the conversion count.
- All storage access is try/caught — private mode must not break a CTA.

**dataLayer events pushed** (GTM container `GTM-N767QFHJ`): `rr_attribution_ready`,
`cta_click_signup`, `cta_click_demo`.

### Debugging in production: `?rr_debug=1`

Add `?rr_debug=1` to any page. The console then prints, per pageview:

- how the visit was classified, in words (`explicit URL parameters`,
  `inferred from referrer (organic)`, `internal navigation — attribution left
  unchanged`, `inferred source ignored — a real campaign is already stored`)
- the visitor id, and whether it was newly minted or restored
- first touch and last touch, and whether first touch was created on this visit
- storage health — localStorage, and **whether the `.riverrecords.ai` cookie
  actually stuck**, which is the one thing that cannot be checked on a
  `*.pages.dev` preview or on localhost. A failed cookie prints a warning naming
  the likely cause.
- a table of every signup link rewritten, showing `utm_source` **before and
  after** — this is the direct check that the homepage-overwrite bug is fixed
- app links deliberately skipped, with the reason (`/login` is not acquisition)
- the `dataLayer` payload on any CTA click

The flag persists in `sessionStorage`, so it survives internal navigation —
necessary because verifying the overwrite fix requires landing on one page and
then clicking through to another. `?rr_debug=0` clears it. Output is silent for
everyone else; nothing is logged without the flag.

**Verify with** `scripts/verify-attribution.mjs` after any change to CTA components
or link structure. It drives a real browser through six scenarios (paid click on a
blog post, the homepage-overwrite case, organic, direct + click event, blocked
localStorage, and the debug flag itself) — 22 checks.

**Safari.** Cookies written by script are capped at 7 days by Safari's ITP, so
`attribution.js` writes `rr_vid` client-side for an immediate result and then calls
`GET /rr/id` once, which re-issues the same value as a real `Set-Cookie` with the full
180 days. That endpoint is a Cloudflare Pages Function (`functions/rr/id.js`) and is
deliberately its own route rather than middleware — a cached HTML response carrying
`Set-Cookie` would hand every visitor the same id. The `rr_vids` cookie marks that the
durable cookie has been issued, so it is one request per visitor, not per page view.
Verify with `node scripts/verify-vid-cookie.mjs` (no wrangler needed).

### Consuming attribution from another script
`window.rrAttribution` is the one public surface — `{ ready, vid, first, last }` plus
`whenReady(cb)`, which fires immediately if attribution has already resolved. Both the
Calendly embed on `/book-demo` and the contact form read from it.

**Never re-derive the source in a page script.** Two definitions of "where did this
visitor come from" drift apart, and the entire point is that one answer reaches every
system. If something needs attribution, read it here.

`/book-demo` deliberately does not use Calendly's `calendly-inline-widget` auto-init.
That fires as soon as Calendly's async script lands, which is a race attribution loses,
and an unattributed booking is exactly the bug being fixed. The page calls
`Calendly.initInlineWidget()` itself once both are ready. Consequence worth knowing: if
that init breaks, the booking box renders **empty** rather than merely unattributed —
`scripts/verify-conversion-attribution.mjs` checks the widget actually renders first,
before it checks any UTM.

**Not yet done:** the app does not yet read `rr_vid` — that needs a column on
`tenant` in the `ai-scribe` repo before visitor-level journeys can be joined.
The privacy policy now names the cookie.
