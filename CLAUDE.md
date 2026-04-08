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
    content.config.ts   ← Collection schema
public/
  brand-extract.css     ← Design tokens from product
  shared.css            ← All component styles + CSS variables
  ui-widgets.js         ← Interactive product widgets
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

## Specialty pages
Live at `/for/[specialty]`. Follow the template in `/for/primary-care/index.astro`:
Hero → Pain cards → Philosophy → How it works (with widgets) → Features → Testimonials → Pricing callout → CTA.

Current pages:
- /for/primary-care — primary care & family medicine
- /for/snf — SNF, LTC, post-acute care (primary CTA is Book a Demo)

## Changing nav/footer/offer banner
Edit the component in `src/components/`. Change once — updates every page.

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
- Introductory: $59/month for first 12 months (guaranteed)
- Standard (after year one): $149/month
- Trial: 30 days free, no credit card required
- Freed comparison: $99/month (Freed's listed price)

## CTAs
Primary CTA:  https://stream.riverrecords.ai/onboard/stream-pro
Demo:         /book-demo
Login:        https://stream.riverrecords.ai/login
Contact:      /contact (form redirects to /contacted)

## Analytics & tracking
All analytics managed via Google Tag Manager (GTM-N767QFHJ).
GTM contains: GA4, 3 Google Ads conversions, Hotjar, PostHog, login tracking.
Ahrefs analytics loaded separately in Base.astro.
Do NOT add standalone analytics scripts — everything goes through GTM.

### Conversion triggers (managed by Jay in GTM)
- /book-demo page view → $200 Ads conversion
- /contacted page view → $50 Ads conversion
- Click to stream.riverrecords.ai → $150 Ads conversion

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
