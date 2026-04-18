# Stream vs. Freed — Landing Page v4 Build Spec

**For:** Website developer  
**Site:** https://www.riverrecords.ai/comparison/freedai/  
**Stack:** Astro + Cloudflare Pages, Vue islands via `@astrojs/vue`  
**Goal:** Replace the current zero-converting comparison page with a version designed to convert Freed-evaluating clinicians into Stream trial signups.

---

## Context: why we're rebuilding this page

- Current page: 2.5% CTR from conquest ads, **0 conversions**.
- Problem is message/architecture, not visual polish. The current page argues philosophy to an audience that wants outcomes; has no product visuals; compares pricing against a Freed tier that doesn't exist.
- v4 ships with new copy, new structure, new thesis. Three interactive Vue demos sit inside the page (`HuddleDemo.vue`, `EncounterViewDemo.vue`, `TimelineRecapDemo.vue`) which the product engineering team has already built in `marketing/demos/`.
- **Ship sequence: this v4 goes live as soon as the demos are integrated. No waiting for screenshots — the demos *are* the visuals.**

---

## What you're building

A single Astro page at `/comparison/freedai/` that replaces the existing page at that route.

The page has 9 sections, top to bottom:

1. Announcement bar
2. Nav
3. Hero (left: copy + CTAs / right: `HuddleDemo` embedded)
4. Trust bar
5. Thesis section (SOAP vs structured — two-panel visual comparison, static)
6. Product tour (four cards — two of them embed `EncounterViewDemo` and `TimelineRecapDemo`)
7. Comparison table (Stream vs Freed Premier)
8. Social proof (testimonials)
9. Switcher block ("Already using Freed?")
10. Pricing
11. Final CTA
12. Footer

Full copy for every section is in **Part 2: Complete Page Copy** below.

---

## Part 1: Technical integration

### 1.1 Vue demo components — how to mount them

The product team has placed three components at `marketing/demos/` in the repo:

- `HuddleDemo.vue`
- `EncounterViewDemo.vue`
- `TimelineRecapDemo.vue`
- `demo-data.js`

All are self-contained Vue 3 Options API SFCs with scoped CSS, no external dependencies beyond Vue. Responsive to 380px. Each has a "DEMO · fake patient data" watermark.

**Mounting approach** (use whichever you prefer — both work):

**Option A — Astro Vue islands (recommended if `@astrojs/vue` is already installed):**

```astro
---
import HuddleDemo from '../../../components/demos/HuddleDemo.vue';
---
<HuddleDemo client:visible />
```

Use `client:visible` (not `client:load`) so the demos hydrate when they scroll into view. The hero demo may warrant `client:load` if above-the-fold rendering matters for LCP.

**Option B — if Vue integration isn't already set up:**

Install `@astrojs/vue`:
```bash
npm install @astrojs/vue
```

Update `astro.config.mjs`:
```js
import vue from '@astrojs/vue';
export default defineConfig({
  integrations: [vue()],
});
```

Then use Option A.

**File placement:** Copy the four files from `marketing/demos/` into the Astro project at `src/components/demos/`. Don't modify them — any edits should happen in the source location and be synced over. If there's ongoing drift risk, consider a build step that copies from `marketing/demos/` at build time.

### 1.2 Styling boundaries

The demos use Stream's production styling (Inter variable, Bootstrap variables). The marketing page uses its own editorial styling (Fraunces + Inter Tight + warm paper tones). **These should not collide.**

- The demo components use `<style scoped>` which should contain styles to the component.
- The marketing page uses global styles at the page level.
- **Don't wrap the demos in a container that applies marketing-site fonts via `font-family` inheritance** — either the demo has its own `font-family` declarations that override, or you explicitly set `font-family: Inter, system-ui, sans-serif;` on a wrapping demo container.

Each demo gets a thin wrapping container provided by the marketing page:

```html
<div class="demo-frame">
  <div class="demo-frame__label">LIVE DEMO · fake patient data</div>
  <HuddleDemo client:visible />
</div>
```

Container CSS:

```css
.demo-frame {
  position: relative;
  background: var(--cream);
  border: 1px solid var(--rule);
  border-radius: 16px;
  padding: 8px;
  box-shadow: 0 8px 24px rgba(15, 26, 20, 0.10), 0 24px 60px rgba(15, 26, 20, 0.08);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
.demo-frame__label {
  position: absolute;
  top: -12px;
  left: 20px;
  background: var(--accent, #c9563f);
  color: var(--cream, #faf7f0);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.66rem;
  letter-spacing: 0.1em;
  padding: 4px 10px;
  border-radius: 100px;
  font-weight: 600;
  z-index: 2;
}
```

### 1.3 Design tokens for the marketing surround

```css
:root {
  --ink: #0f1a14;
  --ink-soft: #2a3a32;
  --ink-mute: #566b60;
  --paper: #f5f1e8;
  --paper-warm: #ede6d3;
  --cream: #faf7f0;
  --stream: #1e5a3e;
  --stream-dark: #0f3a26;
  --stream-light: #e8f0ea;
  --accent: #c9563f;
  --accent-soft: #e87a61;
  --amber: #d4a44a;
  --rule: rgba(15, 26, 20, 0.12);
  --rule-strong: rgba(15, 26, 20, 0.25);
}
```

### 1.4 Fonts

Load via Google Fonts (or self-host — your call):

- **Fraunces** (headings): weights 400, 500, 600, 700 + italic 400
- **Inter Tight** (body): weights 400, 500, 600, 700
- **JetBrains Mono** (labels/tags): weights 400, 500

```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### 1.5 SEO & meta

```html
<title>Stream vs. Freed — A scribe that writes your chart, not just your note | River Records</title>
<meta name="description" content="Stream is the only AI scribe that outputs Assessment & Plan per medical problem — so your chart is already organized the way you read it. 30-day free trial, no credit card.">
<meta property="og:title" content="Stream vs. Freed — A scribe that writes your chart">
<meta property="og:description" content="Every scribe writes SOAP. Stream writes per problem — so your chart is already organized the way you read it.">
```

### 1.6 Conversion tracking

The primary CTA destination is `https://stream.riverrecords.ai/onboard/stream-pro`. 

- Add UTM parameters to all CTA links for attribution: `?utm_source=compare-freed&utm_medium=landing&utm_campaign=conquest-v4`
- If we're using GA4/Plausible/etc., fire a `lp_cta_click` event on every CTA click with a `cta_location` prop (hero / switcher / pricing / final).
- Track scroll depth to 25/50/75/100%.
- Track demo engagement: if we can wire up `onInteraction` callbacks on the Vue demos (e.g., a user clicks a Huddle tab), fire `demo_engagement` events. Not blocking — add if trivial.

### 1.7 Performance targets

- LCP < 2.5s (hero text + demo renders fast)
- CLS < 0.1 (no layout shift as demos mount)
- Total page weight < 400kb gzipped including demos
- Lazy-load below-the-fold demos with `client:visible`
- Image-less hero keeps it fast — the Vue demo is the visual

### 1.8 Accessibility

- All interactive elements keyboard-accessible
- Color contrast 4.5:1 minimum for all text
- Headings follow a logical hierarchy (one h1, h2s for section titles, h3s for cards)
- The demos are already keyboard-accessible per the dev spec; verify after integration

---

## Part 2: Complete page copy

**Style note for all copy:** em-dashes are real em-dashes (—), smart quotes throughout. Italics are real italic HTML (`<em>`). Do not substitute styled text via CSS `font-style` where italics are part of the typography; use `<em>` so italics survive copy-paste and screenreaders.

### 2.1 Announcement bar

```
Limited pricing: $59/mo for your first year — then $149/mo. 30-day free trial. No credit card.
```

"Limited pricing:" is bold (or uses the accent color). Rest is body.

### 2.2 Nav

Logo: Stream (with circular "S" mark)

Nav links (desktop, left to right):
- Why Stream → `#thesis`
- How it works → `#features`
- Coming from Freed → `#switch`
- Compare → `#compare`

CTA button (right): **Start free trial →** (links to `#cta` which scrolls to the final CTA section, or directly to the onboard URL — your call)

Mobile: collapse all but the CTA into a hamburger.

### 2.3 Hero

**Layout:** Two columns on desktop (1.05fr / 1fr), stacked on mobile.

**Left column:**

Eyebrow pill (green background):
```
● Built by a physician, for primary care
```

H1:
```
Every scribe writes SOAP.
<em>Stream writes per problem.</em>
```

Subhead:
```
Freed generates a single blob per visit. Stream's scribe produces Assessment & Plan broken out <em>per medical problem</em> — so your chart is already organized the way you actually read it, the way you actually think. APSO, not SOAP.
```

CTAs (button row):
- Primary: **Start free for 30 days →** (dark, pill-shaped, links to onboard URL with UTMs)
- Secondary: **Coming from Freed?** (outlined, links to `#switch`)

Trust line (small, below CTAs):
```
✓ No credit card · ✓ 4× Freed's trial length · ✓ Pastes into any EHR · ✓ HIPAA compliant
```

**Right column:**

Mount `HuddleDemo` in a `.demo-frame` container. Optional floating annotations — small styled pills overlaid on the demo with messages like "your next visit, pre-organized" (top-right) and "nothing slips through" (bottom-left). These are marketing flourishes, not part of the Vue component. Skip if they complicate responsive behavior.

### 2.4 Trust bar

Full-width band, cream background, top and bottom borders.

```
BUILT BY CLINICIANS FROM    Tufts University School of Medicine  ·  Published in JAMA Network Open  ·  Primary care · Peds · DPC · SNF
```

"BUILT BY CLINICIANS FROM" is a small monospace label (uppercase, letter-spaced). Everything after is Fraunces serif, 1rem. Dividers are a thin dot.

### 2.5 Thesis section (static, no demos)

**Section eyebrow:** `THE STRUCTURAL DIFFERENCE`

**H2:** `Same visit. <em>Different note shape.</em>`

**Lede:**
```
Every clinician writes SOAP. Every clinician reads APSO — you open a chart to find the Assessment and Plan first. Stream's scribe produces a note that already matches how you use it.
```

**Two-column comparison block** (side-by-side cards, stacks on mobile):

**Left card (gray/muted background):**

Tag: `FREED & MOST OTHER SCRIBES`

H3: `One blob. <em>You go hunting.</em>`

Visual: a stylized representation of a SOAP note as a single block of text — use CSS to render ~10 short gray bars stacked to look like unstructured paragraph text. Label the block with a monospace label: `SOAP NOTE`.

Body:
```
The scribe produces one continuous note per encounter. To find what you said about the patient's diabetes four months ago, you open four old notes and scroll. The chart is organized by <strong>when things happened</strong>, not by <strong>what's going on</strong>.
```

**Right card (green-tinted background):**

Tag: `STREAM`

H3: `A/P per problem. <em>Already sorted.</em>`

Visual: a structured representation showing `S · Subjective` (2 bars), `O · Objective` (2 bars), then `A · P` with three distinct nested cards — each labeled with a problem name (Diabetes T2, Hypertension, Anxiety) and 1-2 bars each.

Body:
```
The scribe produces a structured note: Subjective, Objective, then Assessment & Plan <strong>split out per medical problem</strong>. Every A/P block is addressable. Every problem has its own thread across time. The chart is organized around <strong>what matters</strong>.
```

### 2.6 Product tour (4 cards)

**Section eyebrow:** `HOW STREAM ACTUALLY WORKS`

**H2:** `Four things your scribe <em>doesn't</em> do.`

**Lede:**
```
Because the note is structured per problem, Stream can do things other scribes architecturally can't.
```

**Grid:** 2×2 on desktop, 1 column on mobile. Each card has a visual area on top and a text area below.

**Card 1 — Huddle (static visual, not the demo):**

Visual: small-scale rendering mimicking the Huddle (three mini-tabs across top: Active / Falling off / Compliance, with "Falling off" active; then a mini list of problem bands — "Hypothyroidism / 11 MO", "CKD stage 2 / 13 MO", "Diabetes · HTN · Anxiety / ACTIVE"). This is a hand-authored CSS visual, not the Vue demo — the actual `HuddleDemo` is in the hero. This tour card is a teaser.

Label: `01 · HUDDLE`

H3: `Every patient, pre-organized.`

Body:
```
Open a patient 5 minutes before their visit. Huddle shows three lenses: active problems from your last 3 visits, problems falling off your attention (10+ months), and compliance flags. Clinician priority first, revenue capture as a byproduct.
```

**Card 2 — Note with embedded `EncounterViewDemo`:**

Visual area: mount `<EncounterViewDemo client:visible />` inside a smaller `.demo-frame`. This is the interactive demo — user can toggle between Classic SOAP / Fully Combined / Problem-Based modes.

Label: `02 · NOTE`

H3: `A/P split per problem, every visit.`

Body:
```
Stream's scribe doesn't generate one SOAP blob — it generates Subjective, Objective, and separate Assessment & Plan sections for each medical problem discussed. Toggle between Classic SOAP and Problem-Based to see both shapes of the same visit. One architectural choice; everything else on this page is downstream of it.
```

**Card 3 — Timeline + Recap with embedded `TimelineRecapDemo`:**

Visual area: mount `<TimelineRecapDemo client:visible />` inside a `.demo-frame`. Interactive — user can click "Recap" to see the AI-generated summary layer.

Label: `03 · TIMELINE + RECAP`

H3: `Open any problem. See it across time.`

Body:
```
Pick a problem from Huddle. Timeline shows every A&P entry you've written for that problem across every visit — real chart data, not AI output. Hit Recap when you need the AI-generated narrative, medication trajectory with outcome badges, and key metrics. You see both layers; you trust both for different reasons.
```

**Card 4 — Scratchpad (static visual, not the demo):**

Visual: hand-authored CSS showing a "scratchpad" styled as a dashed-border notepad with italic serif text: *"Mom's breast ca at 58 — update fam hx. Refill rx for 90 days. Pt wants to try walking group."* Then an arrow down to a small styled "incorporated into note" box showing section headers (Family History / HTN · Plan) with brief content.

Label: `04 · SCRATCHPAD`

H3: `Type what you don't want to forget.`

Body:
```
Jot free-text notes during the visit in the Scratchpad field. When the note generates, Stream incorporates what you wrote into the right sections. Your mental sticky notes become permanent chart content.
```

### 2.7 Comparison table

**Section eyebrow:** `FEATURE BY FEATURE`

**H2:** `Where Stream goes beyond the scribe.`

**Lede:**
```
Compared to Freed's Premier plan ($119/mo) — the tier closest to Stream's feature set. If you're on Starter ($39) or Core ($79), you're using a different category of product.
```

**Table structure:** Three columns — Feature, Stream, Freed Premier. Grouped into sections with styled section dividers.

Header row (dark background): Feature / **Stream** (green tint with accent top bar) / Freed Premier

**Section: The scribe layer**
| Feature | Stream | Freed Premier |
|---|---|---|
| Ambient visit capture & note generation | ✓ | ✓ |
| Note structure | S / O / **A+P per problem** | SOAP blob |
| Specialty templates | ✓ | ✓ |
| In-visit Scratchpad | ✓ Folds into the note | — |

**Section: The chart layer**
| Feature | Stream | Freed Premier |
|---|---|---|
| Problem-based organization of visits | ✓ Automatic | — |
| Per-patient Huddle (pre-visit view) | ✓ 3 lenses | — |
| Problems flagged if untouched 10+ months | ✓ | — |
| Per-problem Timeline across visits | ✓ | — |
| Recap (AI summary + meds + metrics) | ✓ On demand | — |

**Section: Documents & data in**
| Feature | Stream | Freed Premier |
|---|---|---|
| PDF upload | ✓ Up to 20MB | — |
| Text / paste-in documents | ✓ | — |
| Document summarization | ✓ | — |

**Section: Note export**
| Feature | Stream | Freed Premier |
|---|---|---|
| Paste into any EHR | ✓ Flattens to SOAP | ✓ |
| Browser extension / scraping push | — | ✓ Premier only |

**Section: The offer**
| Feature | Stream | Freed Premier |
|---|---|---|
| Free trial | **30 days** | 7 days |
| Credit card required | No | No |
| Price (year one) | **$59/mo** | $119/mo |
| Price (standard) | $149/mo | $119/mo |

Footnote below table (small, italic, centered):
```
Comparison based on publicly listed pricing and features as of April 2026. Freed tier details from getfreed.ai.
```

### 2.8 Social proof

**Section eyebrow:** `WHAT CLINICIANS SAY`

**H2:** `From the practitioners using Stream <em>right now.</em>`

**Layout:** Two columns (1.4fr / 1fr) on desktop, stacked on mobile.

**Left — feature quote card** (cream bg, bordered):

Large italic opening quote mark (decorative).

Quote (Fraunces serif, 1.35rem, italic not required):
```
Stream focuses on the entire patient — which is exactly what DPC needs. Progress over time matters more than any single encounter, and Stream is the only tool I've found that actually works that way.
```

Attribution block (bottom):
- Avatar: green circle with initials "AB"
- Name: Anatoli Berezovsky, MD
- Role: Owner & CEO, Mila Family Health

**Right — mini quote stack** (three smaller cards, stacked):

```
"I can pull up previous visits inside Stream and build a comprehensive note every time — without the copy-paste."
— Donna Kirchoff, MD, FAAP · Integrative Developmental & Behavioral Peds

"Stream's approach to documentation matches how we think clinically. I love the concept."
— Spencer Dorn, MD · Vice Chair & Professor of Medicine, UNC

"I've gone from writing in the dirt to writing Rolls Royce quality."
— Allen Coffman, MD · Highland Pediatrics
```

### 2.9 Switcher block ("Already using Freed?")

**Background:** warm paper color (`--paper-warm`). Inside, a dark rounded card that's the main content.

**Layout:** Two columns (1fr / 1fr) on desktop, stacked on mobile.

**Left column:**

Section eyebrow (accent orange): `ALREADY USING FREED?`

H2 (on dark background — use paper color for the text):
```
Switching takes one visit. <em>Not one weekend.</em>
```

Body:
```
Stream isn't asking you to start over. You don't need to migrate old notes, retrain templates, or reinstall anything. You start using Stream on your next patient — and the problem-structured chart builds itself from there.
```

CTA button (accent orange background): **See Stream in your workflow →**

**Right column — switcher list** (four items, each with a green check circle):

```
✓ No migration required.
Your old notes stay where they are. Stream starts fresh with your next encounter and builds the structured chart from there.

✓ Bring your templates.
Upload your existing note structures or paste an example — Stream learns the format in the first few visits.

✓ Run them side by side.
30-day free trial, no credit card — four times longer than Freed's 7 days. Use both. Decide with real visits, not screenshots.

✓ Talk to a physician, not a rep.
Every onboarding call is led by a practicing clinician. Honest answers about whether Stream fits your practice.
```

### 2.10 Pricing

**Section eyebrow (centered):** `HONEST PRICING`

**H2 (centered):** `More than Freed Premier does. <em>For $60 less in year one.</em>`

**Lede (centered):**
```
Freed's Premier tier — the one with ICD codes and the browser push — is $119/mo. Stream costs $59/mo for your first year, standard rate $149. No tiers, no note caps, no usage limits.
```

**Two-column price grid:**

**Left column — Stream (dark green background, paper text):**

Label: `STREAM · YEAR ONE`

Name: `The whole chart, not just the note [LIMITED pill badge]`

Price: ~~$149~~ **$59**

Per line: `per clinician / month · 30-day free trial`

Features list (all ✓):
```
Unlimited visits, notes, recordings
Structured A/P per problem
Huddle — 3-lens pre-visit view
Per-problem Timeline + Recap
In-visit Scratchpad
PDF (20MB) and document summarization
30-day trial, no credit card
Pastes into any EHR
```

CTA button (accent orange, full width): **Start free for 30 days →**

**Right column — Freed (cream background):**

Label: `FREED · PREMIER TIER`

Name: `The note and a browser push`

Price: **$119**

Per line: `per clinician / month · 7-day free trial`

Features list (show each row; first 4 have a green ✓ via `.has` class, rest have em-dash):
```
✓ Unlimited notes
✓ Specialty templates
✓ ICD-10 codes (Premier only)
✓ Browser push (Premier only)
— No per-problem note structure
— No Huddle / pre-visit view
— No per-problem Timeline or Recap
— No document summarization
```

Footnote (small, italic, centered):
```
Freed Starter ($39) and Core ($79) don't include the browser push or ICD coding.
```

### 2.11 Final CTA

**Background:** cream

**H2 (centered):** `Write the way you read. <em>SOAP in, APSO out.</em>`

**Body (centered):**
```
30-day free trial. No credit card. $59/month for your first year. Takes under three minutes to start.
```

**CTA row (centered):**
- Primary: **Start free for 30 days →** (links to onboard URL)
- Secondary: **Talk to a clinician first** (links to `/book-demo`)

**Trust line (centered, below CTAs):**
```
✓ No credit card · ✓ Cancel anytime · ✓ HIPAA compliant · BAA included
```

### 2.12 Footer

Standard site footer. Include:

- Brand block: `Stream by River Records` / tagline: `AI clinical documentation organized by medical problem — built for primary care, by primary care.`
- Links: Home, About, Blog, Privacy, Terms, BAA
- Copyright line (small): `© 2026 River Records, Inc. Stream is a registered trademark. Freed is a trademark of its respective owner and is used here for comparison purposes only.`

---

## Part 3: What I need from you (checkpoints)

### 3.1 Before you start

- Confirm `@astrojs/vue` is installed or you're OK installing it.
- Confirm the four demo files exist at `marketing/demos/` and have the expected data shape. If anything is unexpected, flag it before building.
- Pull the current page HTML into a dev branch; don't edit in place.

### 3.2 Mid-build review

Share a preview URL (Cloudflare Pages preview deploy works great) once the page is visually complete but before wiring conversion tracking. I'll review and flag copy/structure issues.

### 3.3 Pre-launch checklist

- [ ] All three Vue demos mount and render correctly on desktop, tablet, mobile
- [ ] No layout shift (CLS < 0.1) as demos hydrate
- [ ] All CTAs point to onboard URL with UTM params
- [ ] Conversion event fires on CTA click
- [ ] Analytics scroll depth wired up
- [ ] All internal anchor links work (`#thesis`, `#features`, `#switch`, `#compare`, `#cta`)
- [ ] Meta tags present (title, description, OG tags)
- [ ] Mobile at 375px and 414px both render clean
- [ ] Keyboard navigation works through all interactive elements
- [ ] Font loading optimized (FOUT acceptable, FOIT not)
- [ ] Page weight < 400kb gzipped
- [ ] LCP < 2.5s on 4G throttle

### 3.4 What Jake and I need to provide you

- UTM string for the conquest ad (I'll confirm with Jake before launch)
- Final confirmation on the onboard URL (currently `https://stream.riverrecords.ai/onboard/stream-pro` — assume no change unless Jake says otherwise)
- Google Ads conversion tag ID if we want to wire direct conversion reporting into the ad account
- Any last-minute copy edits after the preview review

---

## Part 4: After launch

### 4.1 Measurement

We care about two numbers:
- **Conversion rate from conquest-ad traffic** — measured by trial signups from UTM `source=compare-freed`
- **Scroll depth distribution** — to see where people drop off

If CR is still poor after 500+ visits, I'll iterate on copy. If CR is healthy but scroll depth is shallow, we may need to tighten the page.

### 4.2 A/B testing infrastructure (Phase 2)

Once v4 is stable, we'll want to run A/B tests on:
- Hero headline (current: *"Every scribe writes SOAP. Stream writes per problem."*)
- Primary CTA copy (current: *"Start free for 30 days"*)
- Whether to lead with the Huddle demo (current) or the Encounter demo

Build v4 so that swapping these out is trivial — a config file or feature flag rather than a template rewrite.

### 4.3 When the ad creative updates

The existing conquest ad was matched to the old landing page. After v4 ships, we'll refresh the ad creative to match the new positioning ("Every scribe writes SOAP. Yours shouldn't."). You don't need to do anything for that — Jake manages the ads — but keep the landing page decoupled enough that ad-copy-to-headline match stays tight.

---

## Questions? Flags?

If anything in this spec is unclear, doesn't match what's in the demo files, or seems like a bad idea — raise it before building rather than after. I'd rather rewrite a paragraph than have the page ship with something neither of us is happy with.

Expected turnaround: 2-4 days of focused work. Let me know what timeline is realistic on your end.
