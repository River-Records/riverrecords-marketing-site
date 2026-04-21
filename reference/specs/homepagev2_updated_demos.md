River Records Homepage — Full Redesign Spec
Target: https://www.riverrecords.ai/ (homepage only — other pages later) Goal: Migrate the homepage to the design language, positioning, and interactive demos of the v4 comparison page — so every visitor across every traffic source gets the same sharp story.
Stack: Astro (same as current), add Vue islands via @astrojs/vue, reuse the three demo components already built (HuddleDemo.vue, EncounterViewDemo.vue, TimelineRecapDemo.vue)

Strategic reframe
The current homepage argues at the same altitude as every other AI scribe site: "save time, get home earlier, fewer clicks." That's Freed's turf. The comparison page fights better — it names a structural difference and owns it.
The new homepage leads with the same thesis but calibrated for a broader, colder audience. The comparison page says "you're already evaluating Freed, here's why Stream is next." The homepage says "you're evaluating AI scribes, Stream is a different category."
Everything else flows from that calibration.

Page structure — top to bottom
	1	Announcement bar (unchanged)
	2	Nav (unchanged + one CTA text fix)
	3	Hero — new copy, Huddle demo on right
	4	Trust bar — identical to comparison page
	5	Thesis section — why a scribe isn't enough
	6	Three-step how it works — collapsed from four, problem-oriented is step 1
	7	Product tour — four cards, same shape as comparison page with the Vue demos embedded
	8	Quote from Jake — elevated, not buried in the middle
	9	Feature grid — rebuilt from 9 icon tiles to 6 substantive cards
	10	JAMA research strip — new, standalone
	11	Testimonials — unchanged structure, styled to match new system
	12	Pricing — unchanged copy, restyled to match
	13	FAQ — unchanged
	14	Final CTA — new copy
	15	Footer (unchanged)

Section 1: Announcement bar
Keep as is. Links to /onboard/stream-pro with new UTM: ?utm_source=homepage&utm_medium=banner&utm_campaign=home-v2

Section 2: Nav
One change: top-right CTA button text from "Try it on your next visit" → "Start free trial". Apply sitewide. Five-minute fix that aligns homepage and comparison page.
Link destination unchanged: /onboard/stream-pro (with UTMs appended per source).

Section 3: Hero
Layout: Two columns on desktop (1.05fr / 1fr), stacked on mobile. Same structure as comparison page hero.
Left column:
Eyebrow pill (green background, pulsing dot):


● Built by practicing physicians · Published in JAMA Network Open
H1:


Your AI scribe stops at the note.
Stream keeps going.
Make "Stream keeps going." italic green (Fraunces italic, --stream color), matching the comparison page's emphasis pattern.
Subhead:


Most AI scribes write a better note. Stream builds a chart — organizing every visit by medical problem, surfacing what's falling off your radar, and keeping the longitudinal record you've spent years building actually usable.
CTAs:
	•	Primary: Start free for 30 days → (dark ink button)
	•	Secondary: Talk to a clinician first (outlined)
Trust line (below CTAs):


✓ No credit card · ✓ 30-day free trial · ✓ $59/mo for year one · ✓ Pastes into any EHR · ✓ HIPAA compliant
Right column:
Mount <HuddleDemo client:load /> in a .demo-frame container (same pattern as comparison page).
Optional floating annotation top-right: "every patient, pre-organized"
Use client:load here (not client:visible) since it's above the fold and affects LCP perception.

Section 4: Trust bar
Identical to comparison page. Full-width cream band, top and bottom borders.


BUILT BY CLINICIANS FROM   Tufts University School of Medicine  ·  Published in JAMA Network Open  ·  Primary care · Peds · DPC · SNF

Section 5: Thesis section (new)
Purpose: Establish the category difference up front, before the reader gets deep into features. Same role as the SOAP-vs-structured comparison on the conquest page, but calibrated for a broader audience.
Background: Cream, with top and bottom borders (matches comparison page thesis styling).
Section eyebrow: A DIFFERENT CATEGORY
H2 (centered, max-width ~760px):


The scribe is table stakes. The chart is the product.
("chart is the product" in italic green)
Lede (centered):


Every AI scribe records a visit and writes a note. That's solved. The problem that isn't solved — and what Stream was built for — is what happens to that note over the next five years. A chart that organizes itself around your patient, not around the calendar.
Two-column split (same pattern as comparison page's thesis, but reframed for homepage):
Left card (muted background):
Tag: MOST AI SCRIBES
H3: A note. Then another note. <em>Then 400 more.</em>
Body:


The note is the end of the workflow. After a year of visits, you've generated a stack of disconnected documents. To find when you last adjusted a patient's thyroid medication, you open six notes and scroll. The scribe helped with the visit. It didn't help with the chart.
(No visual on this side — keeping the homepage version leaner than the comparison page's visual-heavy thesis split.)
Right card (green-tinted background):
Tag: STREAM
H3: Every visit builds <em>one organized chart.</em>
Body:


Stream's scribe produces a structured note — Subjective, Objective, then Assessment & Plan <strong>per medical problem</strong>. That single architectural choice means every visit updates a problem-oriented, longitudinal record. One click to see every A&P you've written for diabetes. One glance to see what's falling off your attention. The chart works the way you actually think.

Section 6: Three-step how-it-works
Purpose: Quick orientation of the workflow for someone who's never heard of Stream. Replace the current four-step version because current Step 03 is three features jammed together.
Section eyebrow: HOW STREAM WORKS
H2:


Three things, in the order you do them.
Three numbered cards, horizontal row on desktop, stacked on mobile:
Step 01 — Speak


Record your visit ambiently, or dictate a quick update. Stream transcribes in real time and generates a structured note as you talk. Your voice sets the context; Stream does the structure.
Small visual: waveform or "recording" indicator styled to match the product.
Step 02 — Organize


Stream's note isn't one blob. It's Subjective, Objective, and Assessment & Plan <em>split per medical problem</em>. Every problem you discuss gets its own addressable block — automatically filed under that problem in the patient's longitudinal chart.
Small visual: the mini version of the structured-note shape used in the comparison page's thesis section.
Step 03 — Use


Before the next visit, Huddle surfaces what's active, what's falling off, and what needs attention. During the visit, the Scratchpad keeps your side notes. After the visit, Timeline + Recap give you per-problem history on demand. Tasks are generated automatically. Codes are suggested. Outside records are summarized. The chart does the work.
Small visual: the mini Huddle tab pattern (Active / Falling off / Compliance) used in the comparison page tour card.

Section 7: Product tour (four cards with live demos)
This is the section most like the comparison page. Same structure, same embedded demos, slightly broader copy.
Section eyebrow: WHAT'S INSIDE
H2:


Four tools your scribe <em>doesn't</em> give you.
Lede:


Because the note is structured per problem, Stream unlocks capabilities that every other AI scribe is architecturally blocked from building.
Layout: Identical to the updated comparison page tour — row 1 has two short cards (Huddle + Scratchpad) paired, rows 2 and 3 are full-width cards with interactive demos.
Row 1 card 01 — HUDDLE (short, mini-visual on top, text below)
Mini-visual: three tabs (Active / Falling off / Compliance) + three problem rows
Label: 01 · HUDDLE
H3: Every patient, pre-organized.
Body:


Open a patient five minutes before their visit. Huddle shows three lenses: active problems from your last three visits, problems falling off your attention past ten months, and compliance flags. Clinician priority first, revenue capture as a byproduct.
Row 1 card 02 — SCRATCHPAD (short, mini-visual on top, text below)
Mini-visual: scratchpad notepad with italic text → arrow → incorporated-into-note output (same as comparison page)
Label: 02 · SCRATCHPAD
H3: Type what you don't want to forget.
Body:


Jot free-text notes during the visit in the Scratchpad. When the note generates, Stream incorporates what you wrote into the right sections. Your mental sticky notes become permanent chart content.
Row 2 card 03 — NOTE (full-width, demo on left, text on right)
Mount <EncounterViewDemo client:visible /> in .demo-frame.
Label: 03 · NOTE
H3: A/P split per problem, every visit.
Body:


Stream's scribe doesn't generate one SOAP blob — it generates Subjective, Objective, and separate Assessment & Plan sections for every medical problem discussed. Toggle between Classic SOAP and Problem-Based to see both shapes of the same visit. Every downstream capability on this page is enabled by this one architectural choice.
Callouts (small monospace below body):


→ Try the toggle
→ Same visit, three views
→ Paste-ready in any format
Row 3 card 04 — TIMELINE + RECAP (full-width, demo on left, text on right)
Mount <TimelineRecapDemo client:visible /> in .demo-frame.
Label: 04 · TIMELINE + RECAP
H3: Open any problem. See it across time.
Body:


Pick a problem from any patient's chart. Timeline shows every A&P entry you've written for that problem across every visit — real chart data, not AI output. Hit Recap when you need the AI-generated narrative, medication trajectory with outcome badges, and key metrics. You see both layers; you trust both for different reasons.
Callouts:


→ Real chart data, not AI
→ Meds + metrics on demand
→ One click from any problem
Demo cards use the same max-height + internal scroll pattern from the comparison page round 3 fix.

Section 8: Jake quote (elevated)
Purpose: Move this up. It's one of your sharpest lines of copy across all of marketing. Current placement buries it after the feature grid. New placement: directly after the product tour, before the feature grid.
Background: Dark ink card on paper-warm background (same styling as comparison page's switcher block, but as a quote container instead of a CTA block).
Layout: Single column, centered content, max-width ~900px.
Section eyebrow: WHY WE BUILT STREAM
Quote (large, Fraunces serif, ~1.75rem, italic):


Primary care is a project management specialty. Every patient is a longitudinal project — with an evolving problem list, open tasks, and a plan that changes over time. We built the tool to manage it.
Attribution (centered below):
	•	Avatar: Jake's headshot if you have it, otherwise the "J" initial circle
	•	Name: Jake Kantrowitz, MD
	•	Role: Co-Founder & CEO · Assistant Professor, Tufts University School of Medicine
	•	Link: "Meet the team →" (to /about)

Section 9: Feature grid (rebuilt)
Purpose: Replace the current 9-emoji-icon grid with something substantive. The current version reads as a SaaS template. A leaner, more specific grid feels like a product that actually knows what it does.
Section eyebrow: EVERYTHING INCLUDED
H2:


Every feature, designed to save <em>minutes now and hours later.</em>
Lede:


One subscription. Unlimited visits. No usage caps. No tiers.
Grid: 3 columns × 2 rows on desktop, 1 column on mobile. Six cards total, not nine.
Each card: label (small mono), H3 (Fraunces), body (Inter Tight). No emoji icons — replace with a small custom illustration or leave text-only (text-only is fine, cleaner than amateur icon art).
Card 1 — Real-time scribe


AMBIENT OR DICTATED

Real-time scribe in 22 languages.

Record your visit ambiently, dictate a quick update, or mix both. Stream transcribes as you speak, structures the note, and learns your style over time. Works in 22 languages with automatic translation to English.
Card 2 — Problem organization


LONGITUDINAL

Problem-oriented chart, automatic.

Every visit updates a living problem list. Each encounter's Assessment & Plan is filed under the relevant problem. After a year of visits, you have a chart organized by what matters — not a stack of dated documents.
Card 3 — Documents


IN AND OUT

External records, summarized and filed.

Upload a PDF consult (up to 20MB), paste in free text, or send in a fax. Stream summarizes the document and files the relevant pieces under the right problem. Two lines instead of twenty pages.
Card 4 — Tasks


AUTOMATIC

Tasks from every visit.

Follow-up tasks, pending labs, overdue screenings — extracted from every note automatically and tied to the problem they belong to. Not buried in the body of a document where nobody finds them.
Card 5 — Coding


POINT OF CARE

ICD, CPT, and HCC support.

Diagnosis codes, procedure codes, and HCC capture opportunities suggested at point of care. Revenue integrity that happens as a byproduct of doing the clinical work right.
Card 6 — Security


HIPAA · BAA · SOC 2

Security and privacy.

Fully HIPAA compliant. BAA with every subscriber. Encrypted at rest and in transit. We never train our models on your patient data.
(Verify SOC 2 status before using that bullet — if you don't have SOC 2 Type II yet, drop it.)
Five features I intentionally cut from the old grid: "Customizable Templates" (fold into Card 1), "Quick Encounter Mode" (fold into Card 1), "Patient & Problem Summaries" (covered by Timeline + Recap in the tour), "Problem-Oriented Organization" (duplicate of Card 2), and "Automatic Task Generation" (duplicate of Card 4). The new grid is denser and each card earns its place.

Section 10: Research strip (new)
Purpose: Stand-alone moment for the JAMA Network Open citation. It's currently a link inside a body paragraph. As a dedicated strip it becomes a trust anchor.
Background: Dark ink, paper text. Full-width bleed.
Layout: Centered single column, max-width ~760px.
Small label above H2: PEER-REVIEWED RESEARCH
H2 (paper color, Fraunces):


Half of everything in your patient's chart is copy-pasted noise.
Body (paper at 75% opacity):


A peer-reviewed study of 104 million clinical notes found that half of the text in the average EHR is duplicated word-for-word from prior documentation — and that fraction grows every year. The average patient chart contains roughly half the words of <em>Hamlet</em>. Half of it is noise.

Stream's founders wrote that paper. Then they built the product that answers it.
Attribution (small, paper at 60% opacity):


Steinkamp, Kantrowitz et al. — JAMA Network Open, 2022 →
Links to the JAMA article.

Section 11: Testimonials
Keep the copy. Change the styling to match the comparison page's testimonials layout.
Section eyebrow: WHAT CLINICIANS SAY
H2:


Built by physicians. <em>Trusted by clinicians.</em>
Layout: Same as comparison page. One large featured quote on the left (1.4fr), three smaller quotes stacked on the right (1fr).
Featured quote — left card: Use Spencer Dorn's (better authority signal for cold traffic than Berezovsky):


"River Records' approach to clinical documentation matches how we think clinically. I love the concept."
— Spencer Dorn, MD · Vice Chair & Professor of Medicine, UNC
Right column — three smaller quotes:


"Stream focuses on the entire patient — perfect for DPC where progress matters more than individual encounters."
— Anatoli Berezovsky, MD · Owner & CEO, Mila Family Health

"I can review and reuse information from previous visits inside Stream — creating a more comprehensive note every time."
— Donna Kirchoff, MD, FAAP · Integrative Developmental & Behavioral Pediatrics

"I've gone from writing in the dirt to writing Rolls Royce quality."
— Allen Coffman, MD · Highland Pediatrics
Drop the Stephen Wood quote for now — five testimonials is one too many, and his title ("DMSc, ACNP, Northeastern University") is less recognizable to a PCP audience than the others. Keep it in reserve; swap in if you need rotation later.

Section 12: Pricing
Keep the structure. Restyle the cards to match the comparison page's pricing section — dark green Individual card with accent border on top, cream Clinic card alongside.
Section eyebrow: SIMPLE PRICING
H2:


One flat rate. No tiers. <em>No usage caps.</em>
Lede:


$59/month for your first year. $149/month after. 30-day free trial on every plan. Cancel anytime.
Card 1 — Individual Plan (dark green, accent border top, "MOST POPULAR" pill badge)
Label: INDIVIDUAL PLAN Name: For independent clinicians and small practices. Price: $149 $59 (big, Fraunces) Per: per clinician / month for your first year · then $149/mo
Features (same as current):
	•	Unlimited visits & recordings
	•	Problem-oriented longitudinal chart
	•	Huddle — pre-visit view with three lenses
	•	Per-problem Timeline + Recap
	•	In-visit Scratchpad
	•	ICD, CPT, and HCC coding support
	•	External record import (PDF 20MB, text paste)
	•	Automatic task generation
	•	Customizable note templates
	•	30-day trial, no credit card
	•	Pastes into any EHR
CTA (accent orange): Start free for 30 days →
Trust line below: No credit card · Cancel anytime · BAA included
Card 2 — Clinic Plan (cream, bordered)
Label: CLINIC PLAN Name: For multi-provider practices needing team collaboration. Price: Custom Per: Reach out to discuss your clinic
Body:


Best for group practices, FQHCs, DPC clinics, and multi-provider independent practices. Per-seat pricing with volume discounts available.
Features:
	•	Everything in Individual Plan
	•	Team-based collaboration & shared templates
	•	Role-based permissions & admin controls
	•	Bulk patient panel upload
	•	Periodic workflow optimization reviews
	•	Custom onboarding & dedicated support
	•	Support roles for admin and ancillary staff
CTA (outlined): Contact Sales → (to /book-demo)

Section 13: FAQ
Keep as is. Copy is good. Styling should inherit the new system — cream cards, Fraunces section headings, Inter Tight body, no emoji.
One edit — the "How is Stream different from other AI scribes?" answer should lead with the SOAP/APSO thesis to reinforce the hero:


Most AI scribes generate one SOAP note per visit and stop there. Stream's scribe produces a structured note — Subjective, Objective, and separate Assessment & Plan sections per medical problem. That architectural choice means every visit updates a living, problem-organized chart. Six months in, you have an actual longitudinal record — not a stack of disconnected documents. Stream was built by practicing physicians with peer-reviewed research on exactly this problem.

Section 14: Final CTA
Section background: Cream with top border (matches comparison page's final CTA).
H2 (centered):


Your chart should work the way you <em>actually think.</em>
Body:


Start your 30-day free trial. No credit card. $59/month for your first year. Takes under three minutes to set up.
CTA row (centered):
	•	Primary: Start free for 30 days → (dark ink)
	•	Secondary: Talk to a clinician first (outlined)
Trust line below:


✓ No credit card · ✓ Cancel anytime · ✓ HIPAA compliant · BAA included

Design tokens and typography
Use the same tokens and fonts as the comparison page. If the dev hasn't already extracted them to a shared CSS file, now's a good time — both pages should reference the same :root variables and font imports.


css
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
Fonts: Fraunces (headings, italic emphasis), Inter Tight (body), JetBrains Mono (labels/callouts). Same Google Fonts import as the comparison page.

Technical integration
Same pattern as the comparison page:
	•	Mount Vue demos as Astro islands via @astrojs/vue
	•	client:load for the hero Huddle demo (above the fold, affects LCP perception)
	•	client:visible for the tour section's EncounterView and TimelineRecap demos
	•	Same .demo-frame wrapper with corner "LIVE DEMO · fake patient data" pill
	•	Remove any internal watermark inside the Vue components (same fix as comparison page P0 item)
	•	Max-height on the Note demo to prevent the "empty right column" problem you just solved on the comparison page
UTM params on every CTA: ?utm_source=homepage&utm_medium=landing&utm_campaign=home-v2&utm_content={cta_location} where location is hero, thesis, tour, pricing, final, or sticky-nav

What to deprecate
These current homepage sections go away:
	•	The giant trust strip below the hero ("Trusted by internists, pediatricians & SNF clinicians / Works alongside any EHR / 30-day free trial / HIPAA Compliant / Built by primary care physicians") — redundant with the new trust bar and the hero trust line
	•	The four-step how-it-works section — replaced by the new three-step version
	•	The nine-tile emoji feature grid — replaced by the six-card substantive grid
	•	The "Founded by physicians. Validated by research. Published in JAMA..." line inside the pricing section — the new research strip handles this better
Everything else stays and just gets restyled.

Ship sequence
Phase 1 (this week):
	•	Change the sticky nav CTA text sitewide to "Start free trial" (five minutes)
	•	Verify UTM tracking and analytics events on the comparison page are actually firing
Phase 2 (next 2-3 weeks — parallel to measuring comparison page):
	•	Build the new homepage per this spec
	•	Share preview URL for review before publishing
Phase 3 (after homepage launch):
	•	Migrate /for/primary-care and /for/snf to match the new design language
	•	Migrate /about last — least visited, least conversion-critical
	•	Every page eventually uses the same design tokens, same nav, same demos where relevant
