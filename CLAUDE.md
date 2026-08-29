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
public/
  brand-extract.css     ← Design tokens from product
  shared.css            ← All component styles + CSS variables
  ui-widgets.js         ← Interactive product widgets
  attribution.js        ← Acquisition attribution (see below)
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

See `docs/GROWTH-DATA-AUDIT.md` for the full reasoning.

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
- Do not use localStorage or sessionStorage
- Do not add cookie consent banners without checking with Jake
- Do not add standalone analytics scripts — use GTM


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

**Not yet done:** the app does not yet read `rr_vid` — that needs a column on
`tenant` in the `ai-scribe` repo before visitor-level journeys can be joined.
Adding a first-party cookie should also be reflected in the privacy policy.
