# River Records — Website

## Build system
This site uses Astro (static output mode).
- Source files: src/pages/, src/components/, src/layouts/
- Static assets: public/ (CSS, JS, images)
- Build command: npm run build
- Output: dist/
- Dev server: npm run dev (runs on localhost:4321)

## Adding a new page
1. Create src/pages/your-page/index.astro
2. Use the Page layout at the top
3. Add page-specific styles in a <style> block
4. Add page-specific scripts in a <script> block at the bottom
5. Never edit Nav, Footer, or OfferBanner directly in a page file

## Changing nav/footer/offer banner
Edit the component file in src/components/
Change once — updates every page automatically.

## Project overview
Static site for riverrecords.ai / Stream by River Records.
Deployed via Cloudflare Pages from this GitHub repo.
Built with Astro (static output) — CSS + vanilla JS, no frontend framework.

## File structure
```
riverrecords-site/
  shared.css              ← SINGLE source of truth for all tokens, components, utilities
  shared-nav.html         ← nav + mobile menu HTML snippet (copy into each page)
  shared-footer.html      ← footer HTML snippet (copy into each page)
  index.html              ← homepage
  comparison/
    freedai/
      index.html          ← Stream vs Freed comparison LP
  features/
    index.html            ← features overview
    clinical-context-continuity/index.html
    problem-based-organization/index.html
    record-ingestion/index.html
    administrative-automation/index.html
  blog/
    index.html            ← blog index (proxied to Framer for now via _redirects)
  _redirects              ← Cloudflare routing rules
  CLAUDE.md               ← this file
```

## Design system — ALWAYS follow these rules

### Colors
All color values live in `shared.css` as CSS variables.
NEVER hardcode a hex value in a page file. Always use `var(--token-name)`.

Primary navy:     var(--primary)       → var(--brand-primary)     #24599e
Dark background:  var(--dark)         → var(--brand-primary-100) #022A5B
Accent teal:      var(--accent)        → var(--brand-functional-60) #27959C
Page background:  var(--surface)     → var(--brand-neutral-10)  #F3F5F7
Body text:        var(--ink)           → var(--brand-ink)         #333333

### Typography
- Headings: Instrument Serif (loaded via Google Fonts in shared.css)
- Body: DM Sans (loaded via Google Fonts in shared.css)
- NEVER use Inter, Roboto, Arial, or system-ui as primary fonts

### Spacing
Use the --space-* tokens from shared.css for padding/margin.
Section vertical padding: 72–88px top and bottom (--space-xl to --space-2xl)

### Components
All reusable component styles (buttons, nav, footer, proof strip, testimonial cards,
dark CTA block, philosophy block) are in shared.css.
To add a new component: add CSS to shared.css first, use class in HTML.

## Page template
Every page must:
1. Link to shared.css in <head>
2. Include the offer banner (see below)
3. Include the shared nav
4. Include the shared footer
5. End with the shared JS block

## Offer banner (current — update when promotion ends)
```html
<div class="offer-banner">
  <strong>Limited time:</strong> Lock in $59/month for your first year — normally $149.
  <a href="https://stream.riverrecords.ai/onboard/stream-pro">Start free trial →</a>
</div>
```

## Pricing (as of April 2026)
- Ad campaign price: $59/month for first year, then $149/month
- Normal price: $149/month
- Trial: 30 days free, no credit card required
- Freed comparison price: $99/month (Freed's listed price)

## CTAs
Primary CTA URL:  https://stream.riverrecords.ai/onboard/stream-pro
Demo URL:         https://www.riverrecords.ai/book-demo
Login URL:        https://stream.riverrecords.ai/login

## Tone & copy rules
- DO NOT use the word "narrative" in any copy
- DO NOT say Stream "thinks like a clinician" — it is "organized like clinicians think"
- Preferred hero headline: "Reimagine Medical Documentation."
- Blog posts: philosophical tone, not product-focused
- Stream is organized by medical PROBLEM, not by date/encounter
- Brand voice: direct, clinical, physician-to-physician

## Adding a new page
1. Copy the closest existing page as a starting template
2. Update <title> and <meta description>
3. Change only the main content section — keep nav, footer, offer banner identical
4. Add any new component styles to shared.css (not inline)
5. Use .reveal class on sections for scroll animations

## Adding a blog post
Create: blog/[slug]/index.html
Use the blog post template in blog/template.html
Front matter goes in a <script type="application/json" id="post-meta"> block

## Deployment
Push to main branch → Cloudflare Pages auto-deploys in ~30 seconds.
Preview deployments are created automatically for every branch.
Check build status at: https://dash.cloudflare.com (Pages section)

## DO NOTs
- Do not add npm, node_modules, package.json, or any build tooling
- Do not use inline styles — use shared.css classes
- Do not duplicate CSS between pages — add to shared.css
- Do not add external CSS frameworks (Tailwind, Bootstrap, etc.)
- Do not use localStorage or sessionStorage
- Do not add cookie consent banners without checking with Jake first
