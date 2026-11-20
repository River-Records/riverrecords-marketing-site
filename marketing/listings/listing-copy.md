# Stream by River Records: third-party listing copy

**What this is:** ready-to-paste text for software directories (G2, Capterra, Software
Advice) and for AI-scribe roundups that ask vendors for a blurb. One idea throughout:
*your EHR keeps the record; Stream keeps the project.*

**Written:** 20 November 2026. **Status:** draft. Checked by Vera on 20 November 2026 against this site and ai-scribe main at dbb7039.

**Before pasting anything, re-check it against the live site.** Every claim here was taken
from the site as it stood on the date above, and a directory listing does not update when
the site does. Prices especially: compare every figure with `src/config/pricing.ts` and
`/pricing/` on the day you paste. The same goes for the limits (no EHR write-back, no SOC 2,
no clinical decision support, no form filling yet). If one of those changes, this file is
wrong the same day.

**Rules that apply to any edit:** "works alongside any EHR", never "works with" or
"integrates with". Never position Stream against the EHR. No time-saved figures. No customer
names or quotes. Do not cut the limits to fit a character count; shorten something else.

The HTML comments after each section map its claims to their source. They do not render and
should not be pasted.

---

## Tagline (60 characters or fewer)

Your EHR keeps the record. Stream keeps the project.

**Alternate 1:** An AI scribe that files each visit under its problems.

**Alternate 2:** An AI scribe organized by problem. Alongside any EHR.

<!-- Sources
Primary (52 chars): homepage #thesis h2, src/pages/index.astro; gtm/problem-first-messaging.md "The position, in one line".
Alt 1 (54 chars): homepage hero sub, "an AI scribe that files each visit under the problems it touches".
Alt 2 (53 chars): CLAUDE.md Tone & copy rules ("organized by medical PROBLEM", "works alongside any EHR"); faqs.ts "Do I need to change my EHR?".
-->

## Short description (160 characters or fewer)

An AI scribe that files each visit's plan under its problem, so the history is there when you open the chart. Works alongside any EHR. No write-back.

<!-- Sources
"files each visit ... under its problem ... there when you open the chart": homepage hero sub, src/pages/index.astro.
"Works alongside any EHR": src/config/pricing.ts calloutBody; faqs.ts getting-started.
"No write-back": faqs.ts limits, "Does Stream write notes back into my EHR automatically?".
Length: 149 characters.
-->

## Medium description (about 50 words)

Stream is an AI scribe for independent practices. It files each visit's Assessment & Plan under the problem it belongs to, so when you open a problem, every plan you wrote for it is there, in order. It works alongside any EHR: the note pastes in. No integration, no write-back, no SOC 2.

<!-- Sources
"AI scribe ... independent practices": homepage hero sub; faqs.ts limits, "built for independent practices".
"Assessment & Plan filed under its problem": homepage #thesis Stream card.
"Open the problem: every plan for it, in order": homepage #thesis workflow question 1.
"works alongside any EHR ... the note pastes in ... no integration": homepage #thesis fine print ("Stream doesn't replace your EHR or integrate with it. The note pastes in"); faqs.ts getting-started.
"no write-back, no SOC 2": faqs.ts limits; src/pages/pricing/index.astro footnote.
-->

## Long description (about 250 words)

Before a visit, the hard part is often finding what you already decided. When did you last change her levothyroxine, and why? What was your partner's plan for this patient's CKD? Today the answer is to open notes until you find it, or to keep a running summary by hand. That system works. It also holds only for the patients you remember, lives in your own shorthand, and is the first thing to slip on a hard week.

Stream builds that summary as you document. It is an AI scribe: record the visit or dictate, and the note comes back with the Assessment & Plan split per problem. Each plan is filed under its problem, so any clinician in your practice can open a problem and read every plan written for it, in order. Huddle, the pre-visit view, shows what is active, what has gone ten months or more without attention, and which HCC-relevant problems are not yet captured this year. Stream Inlet, a metered add-on, reads inbound faxes and uploaded records and files their content under the problems it concerns, each fact linked to the page it came from. A person confirms the patient, and every excerpt is marked pending until a clinician reviews it.

Your EHR keeps the record; Stream keeps the project. Stream works alongside any EHR and does not integrate with it: the note copies in one click and pastes into any field. There is no EHR write-back, no SOC 2 certification and no clinical decision support. It is built for independent practices, typically one to twenty clinicians, not health systems.

$149/month per clinician, or $99/month billed annually. 30-day free trial, no credit card.

<!-- Sources
Para 1. The two questions and "open notes until you find it": homepage #thesis workflow questions 1 and 4. "running summary by hand", "holds for the patients you remember", "lives in your shorthand", "first thing to slip on a hard week": homepage #thesis muted card; gtm/problem-first-messaging.md points 1-3. "That system works": messaging doc "Concede first".
Para 2. "builds that system as a by-product of documenting ... any clinician in the practice can open it": messaging doc; homepage #thesis Stream card. "Record ambiently or dictate", "A/P split per problem": homepage tour 03. Huddle (active; ten months or more without attention; HCCs not captured this calendar year): src/pages/features/huddle.astro hero and three tabs. Checked by Vera against ai-scribe main at dbb7039, 20 Nov 2026. ai-scribe: active = last three visits: api/src/services/patientContext/views/huddleView.ts:292, frontend/src/help-guides/06-clinical-readiness.md:15; ten months: frontend/src/help-guides/06-clinical-readiness.md:17, huddleView.ts:173,470-482,726; HCC this year: huddleView.ts:296,492. The Inlet review sentence is reworded from the site's "nothing auto-filed without review"; ai-scribe: person confirms patient: frontend/src/CHANGELOG.md:61,71; excerpts pending until reviewed: frontend/src/help-guides/21-outside-records.md:21,29; links to page: 21-outside-records.md:37, CHANGELOG.md:196; Inlet flag: docs/features/document_excerpts.md:3. Inlet (faxes and uploaded records, filed under problems, every fact links to its page, nothing auto-filed without review): faqs.ts how-it-works "What happens to documents that arrive by fax?"; src/pages/intake.astro hero. "metered add-on": src/config/pricing.ts inletPricing.addOnNote. Inlet filing under problems is behind a per-practice flag; owner to confirm it is on for every practice that buys it.
Para 3. One line: homepage #thesis h2. "does not integrate": homepage #thesis fine print. "copies ... in one click and pastes into any field", "no EHR write-back": faqs.ts limits; ai-scribe docs/internal/marketing-handoff.md:142-144. "not SOC 2 certified": faqs.ts limits. "no clinical decision support": faqs.ts limits; ai-scribe docs/features/ask-the-chart.md:3. "one to twenty clinicians", not health systems: faqs.ts limits "Is Stream right for a large health system?".
Para 4. src/config/pricing.ts pricing.monthly and trialDays (owner, 20 Nov 2026: "Stream is $149/month"); ai-scribe: $149 docs/internal/marketing-handoff.md:186; trial api/src/functions/auth/onboard.ts:113; "per clinician": src/pages/pricing/index.astro. Annual price: src/config/pricing.ts (annual 99, annualTotal 1188), confirmed by the owner, 20 Nov 2026.
-->

## Feature bullets

- **Problem-organized notes.** Record the visit or dictate. The note comes back with the Assessment & Plan split per problem, as classic SOAP or problem-based, ready to paste. Capture visits in languages other than English; the note is written in English. Templates are customizable.
- **Timeline and Recap.** Open any problem and see every Assessment & Plan you have written for it, in order, as written in your notes, not re-summarized. Recap adds an AI-generated summary, medication trajectory and key metrics when you want them.
- **Huddle, the pre-visit view.** What you addressed in the last three visits, what has gone ten months or more without attention, and which HCC-relevant problems are not yet captured this year, each with your most recent Assessment & Plan.
- **Tasks attached to problems.** Stream suggests tasks from each visit and shows every task under the problem it belongs to.
- **Stream Inlet for faxes and outside records (metered add-on).** Inbound faxes and uploads are read, matched to a patient for a person to confirm, and their clinical content filed under the problems it concerns. Every extracted fact links back to the page it came from.
- **Coding support.** ICD, CPT and HCC support is included in Stream Pro.
- **Works alongside any EHR.** No integration to configure and no software to install. The finished note copies in one click and pastes into any field. Stream does not write back to the EHR.
- **HIPAA compliant, BAA with every subscriber.** A Business Associate Agreement on every plan, including trials, at no extra charge. Connections to Stream use TLS, and stored data is encrypted at rest, with an audit log of sign-ins and changes to the chart. River Records does not train models on patient data. Stream is not SOC 2 certified.

<!-- Sources
1. "Record ambiently or dictate", "A/P split per problem", "Classic SOAP or Problem-Based — paste-ready either way": homepage tour 03. Languages: faqs.ts how-it-works says 22 languages; the number is dropped and "the note is written in English" added. Checked by Vera against ai-scribe main at dbb7039, 20 Nov 2026. ai-scribe: frontend/src/services/speech/deepgramSpeechService.js:5-41; frontend/src/CHANGELOG.md:261. Customizable templates: faqs.ts how-it-works.
2. homepage tour 04 ("every A&P you've written for a problem — your chart, not AI output. Recap adds an AI-generated summary, medication trajectory and key metrics when you want them"). "as written in your notes, not re-summarized" replaces "in your own words". Checked by Vera against ai-scribe main at dbb7039, 20 Nov 2026. ai-scribe: as written, not re-summarized: frontend/src/help-guides/06-clinical-readiness.md:5,53; Recap: api/src/functions/llm/promptLLMGenerateRecap.ts:29,42.
3. src/pages/features/huddle.astro hero sub and three tabs. "most recent Assessment & Plan" replaces the page's "signed". Checked by Vera against ai-scribe main at dbb7039, 20 Nov 2026. ai-scribe: active = last three visits: api/src/services/patientContext/views/huddleView.ts:292, frontend/src/help-guides/06-clinical-readiness.md:15; ten months: frontend/src/help-guides/06-clinical-readiness.md:17, huddleView.ts:173,470-482,726; HCC this year: huddleView.ts:296,492; most recent A&P: frontend/src/help-guides/06-clinical-readiness.md:36.
4. src/pages/features/huddle.astro:304, Tasks section: "auto-generates task recommendations from each visit" (suggests tasks from each visit) and "attached to the medical problems they belong to, showing up under the relevant problem in every view" (shown under its problem). Deliberately says "suggests", and makes no claim about tracking plan items to completion (early access, CLAUDE.md /referral-tracking/). Task suggestions are behind a per-practice flag; owner to confirm it is on for every Pro practice. ai-scribe task flag: api/src/functions/llm/promptLLMTaskSuggestions.ts:16-19; db/seeds/master/seed_feature_flags.ts:24-32.
5. faqs.ts how-it-works; src/pages/intake.astro hero and How it works step 05 ("A person confirms the patient"); "metered" and "on top of Stream Pro": pricing.ts inletPricing.addOnNote. Inlet filing under problems is behind a per-practice flag; owner to confirm it is on for every practice that buys it. ai-scribe: person confirms patient: frontend/src/CHANGELOG.md:61,71; excerpts pending until reviewed: frontend/src/help-guides/21-outside-records.md:21,29; links to page: 21-outside-records.md:37, CHANGELOG.md:196; Inlet flag: docs/features/document_excerpts.md:3.
6. src/pages/pricing/index.astro included list ("ICD, CPT and HCC coding support").
7. faqs.ts getting-started ("no integration to configure, no software to install"); faqs.ts limits (one-click copy, no write-back); ai-scribe docs/internal/marketing-handoff.md:142-144.
8. src/pages/security/index.astro (all four sections); faqs.ts security group; faqs.ts limits (SOC 2). Encryption, audit log and model-training sentences are narrower than /security/. Checked by Vera against ai-scribe main at dbb7039, 20 Nov 2026. ai-scribe: TLS: iac/main.tf:161; in-transit narrowed: docs/features/phi-protection-audit.md:8-11; at rest: phi-protection-audit.md:10-11; audit log: SECURITY_REVIEW.md:53, narrowed per docs/features/access-audit-trail.md:3,10-12; training narrowed: phi-protection-audit.md:180,189; HIPAA owner note: docs/features/ehr_roadmap.md:67. "HIPAA compliant": [OWNER TO CONFIRM].
-->

## Pricing

**Stream Pro:** $149/month per clinician, or $99/month per clinician billed annually ($1,188/year).

**Free trial:** 30 days, no credit card required. If you do nothing at the end of it, nothing is charged.

**Included:** unlimited visits, notes and recordings. No per-encounter or per-note fee, no usage caps, no implementation or onboarding fee, no contract or minimum term. Monthly plans can be cancelled at any time. The BAA is included at no charge.

**Staff seats:** the first non-clinician team member is free. Additional staff are $25/month each.

**Three or more clinicians:** the Clinic plan is priced per clinician with volume discounts and is quoted on request.

**Optional add-on, Stream Inlet (fax and records intake):** metered, on top of Stream Pro. $89/month for 500 pages, $199/month for 1,500 or $349/month for 3,000, plus a one-time $299 setup fee to provision the fax number. Pages beyond the allowance are $0.14 each. Faxes your staff mark 'Not about a patient' at least two hours before the billing period ends are not billed.

Directory fields, if asked:

| Field | Value |
|---|---|
| Starting price | Stream Pro: $149 per clinician per month |
| Annual price | Stream Pro: $99 per clinician per month, billed annually ($1,188/year) |
| Pricing model | Flat subscription per clinician |
| Free trial | Yes, 30 days, no credit card |

<!-- Sources
Pro price, trial days: src/config/pricing.ts (monthly 149, trialDays 30). Owner, 20 Nov 2026: "Stream is $149/month". ai-scribe: $149 docs/internal/marketing-handoff.md:186; trial api/src/functions/auth/onboard.ts:113; "per clinician": src/pages/pricing/index.astro h1 and FAQ. Annual price: src/config/pricing.ts (annual 99, annualTotal 1188), confirmed by the owner, 20 Nov 2026.
"nothing is charged": faqs.ts getting-started; pricing page FAQ.
Included / not charged for: src/pages/pricing/index.astro "What you are not charged for" and FAQs ("Can I cancel at any time?", "Is a BAA included?").
Staff seats: pricing.ts faqAnswer; pricing page FAQ.
Clinic plan: src/pages/pricing/index.astro "Practices with three or more clinicians".
Inlet: pricing.ts inletPricing (tiers, setupFee 299, overagePerPage 0.14, includes); pricing page FAQ. The unbilled-fax sentence replaces the site's "Junk faxes are filtered and never billed". Checked by Vera against ai-scribe main at dbb7039, 20 Nov 2026. ai-scribe: unbilled faxes: docs/features/fax-billing-inlet-connect.md:175, frontend/src/help-guides/29-fax-billing.md:31,35; tiers: db/migrations/master/20260926000100_create_fax_plan.ts:72-102; setup fee: fax-billing-inlet-connect.md:35.
Left out on purpose: Stream Lite (owner, 20 Nov 2026) and Stream Connect. See "Held back" below.
-->

## Best for

- Independent practices, typically one to twenty clinicians.
- Primary care, pediatrics, direct primary care, and skilled nursing and long-term care.
- Clinicians who follow the same patients over years and want each problem's plan and history in one place.
- Practices where patients are shared or covered, and a partner needs to pick up the plan without decoding someone else's notes.
- Practices on any EHR that are comfortable pasting the finished note in.

<!-- Sources
1. faqs.ts limits, "independent practices, typically one to twenty clinicians".
2. Homepage specialties line ("Built for primary care · Peds · DPC · SNF"); CLAUDE.md Specialty pages (/for/snf is SNF, LTC, post-acute).
3. Homepage #thesis lede; faqs.ts "How is Stream different from other AI scribes?" ("longitudinal record ... by problem, not by date").
4. Homepage #thesis ("It doesn't transfer"; workflow question 4, "The same problem view your partner sees").
5. faqs.ts getting-started and limits.
-->

## Not a fit for, and what it does not do

- **No EHR write-back.** The note copies to your clipboard in one click and pastes into any field. Stream does not write back to your EHR. If automatic write-back is a hard requirement, choose a different product.
- **No EHR integration.** Stream does not replace your EHR or connect to it. Your EHR stays the record.
- **Not SOC 2 certified.** Stream is HIPAA compliant and signs a BAA. If your organization requires SOC 2 to sign, Stream cannot meet that today.
- **No clinical decision support.** No literature search you can query, no differential suggestions, no guidance on an individual patient.
- **Not built for health systems.** Stream is sold and supported for independent practices. Health systems generally need EHR-integrated enterprise products.
- **Does not fill out forms yet.** Form Filler (FMLA, disability and school forms) is not available yet; there is an early-access list.
- **Not the cheapest way to generate a note.** Stream Pro is priced above the cheapest scribes on purpose. If you want a note and nothing kept behind it, a lower-priced scribe may suit you better.

<!-- Sources
1. faqs.ts limits, "Does Stream write notes back into my EHR automatically?". The site's "none is planned for this year" is dropped; no date is stated. ai-scribe docs/internal/marketing-handoff.md:142-144.
2. Homepage #thesis fine print; gtm/problem-first-messaging.md ("no integration, no replacement").
3. faqs.ts limits, "Is Stream SOC 2 certified?". "HIPAA compliant": [OWNER TO CONFIRM]. HIPAA owner note: ai-scribe docs/features/ehr_roadmap.md:67.
4. faqs.ts limits, "Does Stream offer clinical decision support?". The Journal Club sentence was cut. ai-scribe docs/features/ask-the-chart.md:3.
5. faqs.ts limits, "Is Stream right for a large health system?".
6. faqs.ts limits, "Can Stream fill out forms for me?"; CLAUDE.md /form-filler/ (early access, on for no customer). This is the one early-access line in the file.
7. src/pages/pricing/index.astro "How that compares" ("priced above the cheapest scribes on purpose — it is not competing to be the cheapest way to generate a note"). No competitor is named and no competitor price is given.
-->

## Suggested categories

Primary: **AI Medical Scribe** (or the directory's nearest equivalent, such as ambient clinical documentation or medical transcription).

Secondary: **Clinical Documentation**.

Do not list under:

- **EHR / EMR.** Stream is not one and is never positioned against one.
- **Clinical Decision Support.** Stream has none.
- **Health system or enterprise** segments, where a size filter is offered. Pick small practice, one to twenty clinicians.

[UNVERIFIED: the exact category names each directory uses. G2, Capterra and Software Advice each keep their own taxonomy and none of the named sources lists them. Match to the nearest real category at submission time.]

<!-- Sources
"AI medical scribe": homepage title tag and hero sub; pricing page title.
Clinical documentation: src/pages/pricing/index.astro Product schema description ("AI medical scribe and problem-oriented longitudinal chart for independent practices").
Exclusions: CLAUDE.md Positioning ("never positions Stream against the EHR"); faqs.ts limits (decision support, health systems).
-->

---

## Held back: do not paste without a decision

- Stream Lite is not listed on directories (owner, 20 Nov 2026).
- **Stream Connect** (fax on the practice's own Spruce number). Outside the sources named for this piece, and its price needs the Spruce caveat next to it. Left out.
- **Plan item tracking.** Early access, on for no customer. Left out entirely.
- **A "free version" field.** Directories often ask yes or no. The site states a free trial and never states whether a free plan exists, so the table above omits the field.
