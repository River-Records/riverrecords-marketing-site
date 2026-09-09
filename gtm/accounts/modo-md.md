# Account Brief — MODO MD (Wailea, Maui)

**Status:** Live account, first contact failed
**Prepared:** 2026-09-09
**Prepared for:** handoff to another agent or teammate picking up this account
**Owner:** Jacob Kantrowitz

---

## 0. How to use this brief

This is a self-contained handoff. You are picking up a **cold account that has already
been approached once and lost**, so the constraint is not "learn about them" — it is
"do not repeat the first approach."

Read §1 (evidence quality) before you use a single fact from here in front of the
customer. Read §8 (corrections) before you describe the product to anyone, because it
contains two claims our own marketing makes that the code does not support.

Sections §2–§6 are the analysis. §7 is what Stream actually does, verified against the
repos rather than the website. §9 is the recommended plan. §10 is the hard constraints.
§11 is what nobody has answered yet.

---

## 1. Evidence quality — read this first

**Everything in §2 about MODO came from web search result summaries, not from reading
their site.** `modomd.com`, `yelp.com` and `nextmd.ai` were all blocked by the session's
network egress proxy at the time of writing. No page was retrieved directly.

| Claim | Confidence | Basis |
|---|---|---|
| Cash-pay, no Medicare/private insurance, HSA/FSA accepted | Medium-high | Repeated across multiple independent search summaries |
| Charges upfront, gives patient itemized receipt + HCFA form | **Medium — load-bearing, verify first** | Single search summary attributed to their site |
| Membership $5,000/yr (45+), $3,000 (<45), $1,000 (children) | Medium | Search summary of their product page; prices move |
| Wailea clinic, 7 days, ~8am–9/10pm; 24/7 mobile team | Medium-high | Multiple sources, hours vary slightly between them |
| Markets: Maui, Oahu/Big Island, Austin TX, LA County CA | Medium-high | Their own service pages, via search |
| Service lines incl. IV/NAD+, peptides, regenerative, ketamine, addiction medicine, aesthetics | Medium | Search summary |
| Dr. Reza Danesh, board-cert EM, UCLA residency, UC Davis med school | High | Consistent across sources |
| MODO for the People — nonprofit, free care to underserved Maui | High | Has its own site |

**Anything in §7 about Stream was verified by reading the `ai-scribe` and
`riverrecords-marketing-site` repositories directly** and is high confidence. Where a
capability is inferred rather than read, it says so.

**First action for whoever picks this up: actually load modomd.com and re-verify the
Medium rows.** Especially the HCFA/superbill claim, because the central recommendation
in §9 rests on it.

---

## 2. The account

**MODO MD** — "Medical Concierge, Wellness Center & Urgent Care," based at 34 Wailea
Gateway Pl, Kihei/Wailea, Maui.

**Founder:** Dr. Reza Danesh ("Dr. Rez"). Board-certified emergency medicine, 20+ years.
UC Davis medical school, internship at Harborview/UW Seattle, residency UCLA Emergency
Medicine, came from Cedars-Sinai. He is a public figure — appeared on HBO's *The White
Lotus*, and did national press (NPR, CNN, ABC, NBC) during the Maui fires. He also
founded **MODO for the People**, a nonprofit delivering free healthcare to underserved
communities on Maui.

**Model — this is the part that matters:**

- **Self-pay only.** Does not participate with Medicare or private insurance. Accepts
  HSA/FSA. Patients pay upfront.
- **Patients submit their own claims.** Per their site, patients are given an itemized
  medical receipt and an HCFA (CMS-1500) claim form to submit for possible
  reimbursement, and MODO says it works with patients to support that process. Travel
  insurance plans are welcomed.
- **Age-tiered concierge membership** with unlimited urgent care visits included, no
  copays. Family, group and corporate pricing on request. Members get ~15% off other
  services and reduced rates at Sollis Health's private ER network.
- **Walk-in urgent care** at the Wailea clinic, seven days a week, staffed by an
  emergency physician.
- **24/7 mobile / house calls** to homes, hotels, resorts and private events, staffed by
  ER- and primary-care-trained providers. After-hours fees apply outside ~8am–10pm.
- **Telemedicine** (phone and video).
- **Wellness / longevity lines:** IV therapy (hydration, Myers, NAD+, performance),
  peptides, regenerative medicine, ketamine, addiction medicine, aesthetics.
- **Multi-market:** Maui plus Oahu/Big Island, Austin TX, and LA County CA, each with
  local ER/primary-care-trained providers doing 24/7 on-demand house calls.

**Who we met:** the practice manager, the clinical director, and Dr. Rez.

---

## 3. What happened

Our outreach team told them we could "help their practice." They agreed to a brief
look — roughly 20 seconds — and disengaged. **Stated reason: we are not integrated.**

Jake's read, which should be respected: do not argue the integration point. It was not
worth defending in the room and it is not worth re-litigating by email.

---

## 4. Diagnosis — what that objection probably was

The objection is very likely reflexive rather than real, and the reason is structural:
**MODO is a cash-pay, non-participating practice.** They do not bill Medicare or
commercial insurance. There is no claims pipeline for a scribe to integrate with, and
quite possibly no enterprise EHR either — a practice that is one urgent care clinic plus
a mobile team plus a wellness/aesthetics line typically runs on something light.

So "you're not integrated" is what a busy clinician says to make a scribe vendor leave.
It is a category-exit, not a requirements statement. The category they put us in was
"another AI scribe," and in that category the objection is correct and unanswerable in
20 seconds.

**The implication for re-entry: do not rebut. Re-enter in a different category.** The
goal is not to win the integration argument; it is to make the next 20 seconds be about
a problem they recognize as specifically theirs. Any follow-up that begins by explaining
why integration doesn't matter will read as a vendor who didn't listen, and will fail
faster than the first attempt.

---

## 5. The four documentation problems their model creates

None of these is solved by an EHR integration. That is the point — it is what makes a
non-integration conversation legitimate rather than a dodge.

### 5.1 Their patients leave the island

A large share of volume is visitors to Maui. That patient's real continuity need is a
document they can hand to their own PCP in Denver, or Düsseldorf, next week. **No EHR
integration in existence connects MODO's chart to a visitor's home physician.** For an
episodic tourist encounter, a well-structured, problem-organized discharge document *is*
the entirety of the available interoperability.

This is the honest reframe of "integration" and it does not require contradicting them.

### 5.2 The patient submits their own claim

The reimbursement packet — itemized receipt plus HCFA/CMS-1500 — is a **documentation
deliverable**, and it is the artifact their commercial model depends on most. Two
consequences:

- It is a recurring front-desk support burden. Every denied or bounced reimbursement
  comes back to their staff, not to a payer relations team.
- It is a retention risk. A member paying $3–5k/year whose claim gets denied on
  documentation grounds has a concrete grievance, and concierge membership churn is
  expensive to replace.

Their coding accuracy matters for **the patient's reimbursement success**, not for their
own accounts receivable. That inverts the usual scribe coding pitch and almost nobody
will have said it to them.

### 5.3 The concierge promise is memory, but the coverage is a team

Members pay $3–5k/year for the feeling that their doctor knows them. But with unlimited
visits, 24/7 access, and ER-trained providers covering four geographic markets, **the
person who answers at 2am is frequently not Dr. Rez.**

The thing that lets a covering provider sound like they know the member is a
problem-oriented longitudinal chart — the record organized by medical problem rather
than by date, so the covering clinician sees the thread rather than the last note.

This is the strongest genuine fit Stream has for this account, it is what Stream is
architecturally built for, and it has nothing whatsoever to do with integration.

### 5.4 Documentation happens in a car at 11pm

House calls at hotels, resorts and private events, on a 24/7 rotation, across four
markets. There is no workstation. Mobile capture matters far more here than desktop EHR
write-back does.

Separately: ketamine, addiction medicine and peptide/regenerative therapy are
protocol-driven, longitudinal, cash-pay elective lines delivered across multiple state
licensures. In those lines the documentation is the liability shield and the protocol
tracker, not administrative overhead. That is a different — and more urgent — reason to
care about note quality than "save time."

---

## 6. Why this account is worth unusual effort

- **Reference value.** Dr. Rez is a media figure with national press exposure and a
  television credit. A named concierge/urgent-care reference is worth considerably more
  than the subscription revenue.
- **Multi-market, multi-provider.** Four markets with distributed provider teams is a
  seat-expansion story, not a single-seat one.
- **Segment beachhead.** Cash-pay concierge + urgent care is a segment we have no field
  material for (we have DPC, pediatrics, internal medicine, SNF). Winning one gives us
  the segment.
- **The nonprofit.** MODO for the People is a genuine, non-cynical second door. Donated
  seats for the nonprofit arm is a real offer. **Keep it structurally separate from the
  commercial ask** so it cannot read as leverage or as a trade — if it looks like a
  bargaining chip it will do more damage than not offering it at all.

---

## 7. Stream capability map — verified against the repos

Everything in this section was confirmed by reading code or content files in
`River-Records/ai-scribe` and `River-Records/riverrecords-marketing-site`.

### Strong fits

| Capability | Where it lives | Why it fits MODO |
|---|---|---|
| **Quick Encounter** ("Lite Mode") | `frontend/src/components/pages/Encounter/QuickEncounter.vue`; content at `src/content/features/quick-encounter.md` | Our own content describes it as built for "urgent care, telehealth, or one-time consultations." This is the walk-in visitor. |
| **Longitudinal problem-oriented chart** (Stream Pro) | Core product; `src/content/features/clinical-context-continuity.md` | This is the concierge member, and §5.3 above. |
| **Mobile capture** | `Encounter/MobileEncounter.vue`, `Encounter/MobileAudioBar.vue` | The 24/7 house-call team. |
| **After Visit Summary** | `Encounter/AfterVisitSummary.vue`; schema in `api/src/services/llm/types.ts` | Patient-facing instructions for someone who is about to fly home. |
| **Document generation** | `frontend/src/components/GenerateDocumentModal.vue` (`DOC_TYPE_CONFIGS`) | Types today: **Referral, Prior Authorization, Patient Summary, Custom.** Patient Summary is scopable to This Encounter / Last 3 / Last 5 / Full Chart. Custom takes a free-text prompt. |
| **Record ingestion** | `src/content/features/record-ingestion.md`; Spruce fax integration brief | Inbound fax, PDF, or pasted outside records laid out under the problems they belong to. Relevant when a visitor's home records arrive mid-episode. |
| **ICD / CPT suggestion** | `Encounter/CodingModal.vue`, `IcdPickerModal.vue` | Supports §5.2 — but see the gap in §8.1. HCC is marketed as "coming soon," not shipped. |

**The two-mode point is the tailored pitch.** MODO genuinely needs both halves — Quick
Encounter for the episodic walk-in tourist, Stream Pro's longitudinal chart for the
concierge member. Very few practices need both. Most scribe vendors offer only the
first. That framing is specific to them and is not something a competitor will have
used.

### Commercial terms (from `src/config/pricing.ts`)

$149/user/month, or $99/user/month billed annually ($1,188/yr). 30-day free trial, no
credit card. First non-clinician staff seat free, additional staff seats $25/month.

---

## 8. Gaps and corrections — do not skip

### 8.1 No superbill / HCFA / CMS-1500 support exists

A grep across both repositories for `superbill`, `HCFA`, `CMS-1500`, `cms1500` and
`itemized receipt` returns **zero matches.** Nothing in the product touches the
reimbursement packet described in §5.2.

This is the paradox of the account: **the single highest-value thing we could build for
MODO is a thing we have not built.**

The good news is that it is plausible rather than fantastical — `DOC_TYPE_CONFIGS` in
`GenerateDocumentModal.vue` is config-driven, and adding a document type is adding a
config object plus a backend template builder in `api/src/services/llm/documents.ts`.

**Do not promise this to MODO.** If we pursue it, it goes through the normal Feature
Brief process (`docs/features/_template.md`, per `ai-scribe/CLAUDE.md`), including the
Lite/Pro, permissions, and analytics dimensions. It is a build, and cash-pay
reimbursement paperwork has compliance surface that needs real thought.

### 8.2 The multilingual note claim is not true as written — marketing bug

`src/content/features/22-language-support.md` currently claims:

> **"Can I keep the note in the patient's language?"** — *"Yes. Choose your output
> language in settings."*

and lists a bullet **"Document in English"** alongside it, which already contradicts
itself.

What the code actually does:

- **Capture** is genuinely multilingual. Language lists live in
  `frontend/src/services/speech/deepgramSpeechService.js` and
  `elevenLabsSpeechService.js` and include `ja`, `ko` and others.
- **Note output is hard-coded to English at the prompt level.**
  `api/src/services/llm/refreshCard.ts` contains the instruction *"Regardless of the
  language of the transcript, the output should be in English"* in **five** separate
  places.
- **There is no output-language setting.** No `output_language` / `note_language` field
  exists in the frontend settings components or in the tenant migrations. The only
  language-related UI in `Settings.vue` is a commented-out transcription-provider
  picker.
- **Quality caveat on non-English capture:** `deepgramSpeechService.js` selects the
  `nova-3-medical` model only when the language is `en-US`, and falls back to
  `nova-2-general` — a non-medical model — for every other language.

**Consequences.** MODO serves substantial international visitor traffic, so this was
initially an attractive angle and it is **not currently available.** Do not pitch
"notes in the patient's language." Capture-in-22-languages, note-out-in-English is
still a real and useful claim — just say that one.

Separately and independently of this account, that FAQ answer should be corrected on the
marketing site. It is a false product claim on a public page.

### 8.3 Things we must never claim (from `riverrecords-marketing-site/CLAUDE.md`)

- **Never claim SOC 2.** We do not have it.
- **Never claim EHR write-back.** We do not have it and will not this year.
- Competitor pricing must carry `PRICING_VERIFIED` and link to their own pricing page.

---

## 9. Recommended re-entry plan

**Governing principle: do not follow up with a pitch. Follow up with an artifact.** They
gave us 20 seconds of listening and it failed. Ask for 20 seconds of *looking* instead.

### 9.1 The primary move — a worked example

Build a single worked example of a realistic MODO encounter run through Stream:
**a visitor with an ankle injury at a resort, seen on a house call.** Show, on one page:

1. The clinical note as Stream produces it.
2. The patient-facing After Visit Summary — the thing they hand someone who flies home
   on Thursday.
3. The problem-organized chart entry, showing what a covering provider would see if that
   same patient called at 2am three days later.
4. The coded output (ICD/CPT) that supports whatever the patient submits.

This is concrete, it is theirs, and it can be evaluated at a glance. It also implicitly
answers "not integrated" without ever using the word.

### 9.2 The question that reopens the conversation

Ask one question, and make it a real one rather than rhetorical:

> **"What are you charting in today?"**

If the answer is "nothing much" or a light system, the integration objection dissolves on
its own without us having argued it. If the answer is a real EHR, we have learned
something important that changes the approach. Either way we are better off. Do not
pre-empt the answer.

### 9.3 Sequencing

1. Verify the Medium-confidence facts in §1 against their live site.
2. Build the worked example (§9.1).
3. Send it to the practice manager — **not** to Dr. Rez. The practice manager owns the
   reimbursement-paperwork pain in §5.2 and is the likeliest internal champion; Dr. Rez
   is the hardest calendar to get and has already said no once.
4. Ask the §9.2 question in the same message. One question, not a list.
5. Keep the nonprofit offer (§6) for a separate, later, unconditional conversation.

### 9.4 Do not

- Do not send "The Bridge, Not the Destination" as the opener. It is our standing asset
  for the integration objection (`gtm/content-objection-map.md`, category 6) and it is
  good, but leading with it makes the follow-up a rebuttal, which is exactly what Jake
  said not to do. It is a *second* touch if they raise integration again themselves.
- Do not pitch the undercoding calculator. It is built on fee-for-service capture and
  they do not bill insurance. It will read as evidence we did not understand them.
- Do not promise the superbill capability (§8.1).
- Do not promise notes in the patient's language (§8.2).

---

## 10. Constraints for whoever picks this up

From `riverrecords-marketing-site/CLAUDE.md` — these apply to any copy produced for this
account:

- Do not use the word **"narrative"** in any copy.
- Do not say Stream "thinks like a clinician." It is **"organized like clinicians think."**
- EHR language is **"works alongside any EHR,"** never "works with any EHR."
- Brand voice: direct, clinical, physician-to-physician.
- Stream is organized by medical **problem**, not by date or encounter.
- If a page is created: internal links end in a slash; no inline styles; no hardcoded
  hex; use `src/config/pricing.ts` for any figure.

Process constraints from `ai-scribe/CLAUDE.md`:

- Any new product capability (e.g. §8.1) needs a **Feature Brief** in `docs/features/`
  and explicit sign-off **before** implementation code.
- A user-facing change is not done on a clean build — it needs an E2E test exercised
  against the running app.

---

## 11. Open questions

Nobody has answered these. They are listed in the order that they change the plan.

1. **What are they charting in today?** (§9.2) Determines whether the integration
   objection was real. Highest value question on this list.
2. **Is the HCFA/superbill claim accurate and current?** (§1) The §5.2 wedge depends on
   it entirely.
3. **How many providers across the four markets?** Determines seat count and whether
   this is a single-seat trial or a multi-market rollout.
4. **Who actually produces the reimbursement paperwork today** — the practice manager,
   a biller, an outsourced service? Determines who the champion is.
5. **What proportion of volume is visitors vs. resident members?** Determines whether
   the Quick Encounter half or the Stream Pro half leads.
6. **Does the clinical director have a documentation-quality mandate** for the ketamine
   and addiction medicine lines (§5.4)? If so that is a separate, stronger entry point
   than either of the above, aimed at a different person.

---

## 12. Suggested follow-on work items

Not started. Listed for triage, not as commitments.

| Item | Type | Notes |
|---|---|---|
| Fix the false multilingual-output FAQ answer | **Bug — do first** | `src/content/features/22-language-support.md`. Public page making a claim the code contradicts. Independent of this account. |
| Worked example for MODO (§9.1) | GTM asset | The actual deliverable for re-entry. |
| Cash-pay / concierge field sheet | GTM asset | `gtm/field-sheets/` has DPC, peds, IM. No cash-pay concierge sheet exists. Would serve the whole segment, not just MODO. |
| Reimbursement packet document type | **Feature Brief first** | §8.1. Do not build without sign-off. |
| Note output language setting | Feature Brief | §8.2. Would make the international-visitor angle real rather than aspirational. |

---

## 13. Sources

All retrieved via web search summaries on 2026-09-09; none fetched directly (§1).

- https://modomd.com/
- https://modomd.com/about-modo/
- https://modomd.com/concierge-membership/
- https://modomd.com/product/concierge-membership-individual/
- https://modomd.com/product/concierge-membership-family/
- https://modomd.com/texas-services/
- https://modomd.com/california-services/
- https://modomd.com/oahu-services/
- https://modomd.com/emergency-care/
- https://www.modoforthepeople.org/
- https://www.yelp.com/biz/modo-urgent-care-kihei-2
- https://nextmd.ai/practice/modo-md
