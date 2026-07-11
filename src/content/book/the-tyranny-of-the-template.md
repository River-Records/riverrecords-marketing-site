---
title: "The Tyranny of the Template"
chapterLabel: "Chapter 5"
part: "Part I — Anatomy of a Relic"
order: 5
description: "SOAP was built for the single-problem visit. Pre-templated exams fabricate certainty, note bloat buries signal, and perfect-looking notes hide the absence of clinical reasoning."
seoTitle: "Why SOAP Notes and Templates Fail Complex Care"
seoDescription: "SOAP was built for the single-problem visit. Pre-templated exams fabricate certainty, note bloat buries signal, and perfect-looking notes hide the absence of clinical reasoning."
relatedPosts:
  - slug: "breaking-free-from-soap"
    title: "Breaking Free from SOAP"
  - slug: "templated-ehr-notes-patient-safety-risks"
    title: "The Danger of Pre-Templated Information in Medical Records"
  - slug: "the-hidden-danger-of-perfect-looking-notes"
    title: "The Hidden Danger of Perfect-Looking Notes"
  - slug: "ehrs-cause-note-bloat"
    title: "Why EHRs Are Causing “Note Bloat”"
draft: false
---

So far we have treated the note as a container and asked how the container came
to be. This chapter looks *inside* the container — at the templates that govern
what a note holds and how it's arranged — because the paper inheritance didn't
stop at the document boundary. It dictated the interior too.

## 5.1 SOAP was built for a simpler visit

Most EHRs enforce a single documentation format: the SOAP structure —
Subjective, Objective, Assessment, Plan. SOAP was genuinely revolutionary in its
day. It emerged from Lawrence Weed's work on the problem-oriented medical
record in the late 1960s — work we will return to with admiration in Part III —
and it gave generations of clinicians a shared discipline for organizing a
clinical encounter. For a visit with one problem, it remains hard to beat:
here's what the patient reports, here's what I found, here's what I think,
here's what we'll do.

But medicine stopped looking like that visit. The patients who fill a modern
primary care panel carry five, ten, fifteen concurrent problems, and for the
multi-problem visit SOAP becomes a straitjacket:

- **Subjective and objective data are mashed together** across all problems,
  regardless of how many distinct issues are in play. The clinician managing
  diabetes, hypertension, and depression in one visit gets a single merged
  section in which the threads of each problem are interleaved and lost.
- **Assessments collapse into lists.** Most EHRs allot one assessment section
  per note. Each problem ideally needs its own assessment and plan, but the
  structure forces simplification — often reducing the assessment to a bulleted
  problem list with no individual reasoning attached.
- **Problem-specific focus disappears.** When the documentation structure can't
  mirror the structure of the clinical thinking, clinicians end up documenting
  in ways that serve the EHR, not the patient.

When we transitioned from paper to digital we had an extraordinary opportunity
to rethink this — to let documentation structure flex with clinical complexity.
Instead we hard-coded the paper form into software, then bolted billing
requirements onto it. As the saying goes: if the only tool you have is a hammer,
it is tempting to treat everything as if it were a nail. SOAP is our hammer, and
every patient — the twenty-minute wellness visit, the fifteen-problem geriatric
follow-up, the two-year diagnostic odyssey — gets treated as the same nail.

The point is not that structure is bad. (Part III of this book is, among other
things, a defense of structure.) The point is that *one fixed structure,
applied to every encounter regardless of content*, is bad. Different care
settings make fundamentally different documentation demands — a fact any
clinician knows tacitly:

- **Acute, one-time problems** need concise, problem-specific notes that stay
  accessible but out of the way; they rarely need future review.
- **Medium-term problems** — the new hypertension diagnosis, the depression
  visit that also needs the anxiety history — require a holistic view across
  multiple related issues.
- **Chronic disease** benefits from documentation that grows with the problem
  over years: micro-updates and longitudinal review, not a fresh re-telling at
  every encounter.
- **Wellness visits** are really evolving checklists — preventive care items
  added, resolved, and carried forward over time.
- **Administrative work** — forms, authorizations, referrals — is its own genre
  entirely.

One template cannot serve all of these. The diversity of documentation
workflows reflects the diversity of cognitive work in medicine, and a system
that ignores that diversity taxes the clinician on every encounter that doesn't
fit the form.

## 5.2 The pre-templated exam: efficiency that lies

The template problem gets sharper when templates don't just structure
information but *pre-fill* it.

Pre-templated content — the fully populated review of systems, the default
"comprehensive" physical exam, the auto-inserted normal findings — has become a
standard tool for surviving documentation requirements. At first glance it
seems like a gift to busy clinicians. But templates are inherently rigid, and
their rigidity costs accuracy. A pre-templated exam may assert that a full
physical examination was performed when only a focused exam was done. Pre-filled
histories and plans smother the patient-specific findings that make an
encounter meaningful. Every pre-populated negative is a small statement the
clinician may never have verified, sitting in a legal document above their
signature.

This becomes most dangerous where clinical reality is least certain. Modern
EHRs have made it easier than ever to produce notes that *look* complete: every
field filled, every symptom coded, every checkbox checked. But a note can be
voluminous and still hollow. It can satisfy every institutional checklist and
still fail to capture the most important truths about a patient's care. It can
create the illusion of thoughtful medicine while masking the absence of actual
clinical reasoning.

When notes prioritize documentation over reflection, predictable failures
follow:

- **Diagnostic uncertainty disappears.** Templated notes present a false air of
  certainty; there is no field for "I'm not sure yet."
- **Clinical nuance is flattened.** Patients with overlapping problems,
  psychosocial complexity, or evolving illness get compressed into whatever the
  template can hold.
- **Reasoning becomes invisible.** Future readers — consultants, hospitalists,
  the documenting clinician six months later — are left with conclusions but no
  path to them.

The deep lesson of clinical practice is that uncertainty is normal. Symptoms
don't always fit categories; tests aren't always conclusive; some conditions
resist explanation for years. Good documentation doesn't hide uncertainty — it
records the working diagnosis as working, the differential as open, the
reasoning as evolving. A note that reads as definitively certain when the
clinician was legitimately unsure is not a complete note. It is a false one,
and it sets a trap for every reader who comes after, because initial
assumptions that are documented as conclusions tend never to be re-challenged.

## 5.3 Note bloat: the template meets the broken chart

Put the rigid template together with the disorganized chart and you get the
phenomenon every clinician knows as **note bloat**: notes stuffed with
redundant and irrelevant material until the signal disappears.

It's worth being precise about where bloat comes from, because the standard
story — lazy clinicians padding notes — is wrong. Most EHRs organize the chart
by *data type*: labs in one tab, images in another, medications in a third,
notes in a fourth, each sorted by date. Nothing connects information by
clinical problem. A clinician who needs the full picture around a problem —
the relevant labs *and* the imaging *and* the consultant's opinion *and* the
medication changes — has no place in the chart where that picture exists.

So clinicians build the picture themselves, in the only writable space they
control: the note. Lab results get copied in, even though they live elsewhere
in the EHR, so that the data informing today's decision sits next to the
decision. Imaging impressions get pasted in. The relevant history gets
re-summarized, again, because the last summary is buried three notes back. Each
individual act is rational — it keeps the story assembled and saves the next
reader a scavenger hunt. Collectively, the acts produce charts in which the
same information exists in dozens of unlinked copies, and notes so engorged
that nobody can find the one new finding inside them.

Note bloat, in other words, is not a discipline problem. It is a *data
organization* problem wearing a discipline problem's clothes. The information
needed to avoid it already exists in structured form — tagged by patient,
orderer, and date — but because the chart won't assemble it by problem, every
clinician assembles it by hand, in prose, forever. We will meet this pattern —
individually rational adaptation, collectively disastrous outcome — again in
Chapter 8, because it is the signature failure mode of the note paradigm.

## 5.4 What flexibility would look like

None of this argues against structure, templates, or checklists as such. It
argues for matching the structure to the clinical situation, rather than the
reverse. Imagine documentation that:

- lets subjective and objective information be organized *by problem*, so each
  issue's story reads coherently;
- gives every problem its own assessment and plan, however brief;
- lets the shape of the note flex with the type of encounter — acute, chronic,
  wellness, administrative — rather than forcing all encounters through one
  form;
- treats templates as scaffolding the clinician can invoke where they help
  (structured data entry where structure exists) and drop where they harm
  (complex, uncertain, evolving cases);
- and, above all, never *fabricates* content the clinician didn't verify.

Nothing in that list is technically exotic. Every element exists somewhere in
consumer software. What has been missing is the willingness to let the
documentation paradigm change shape — because as long as the atomic,
one-template note is the only vessel, everything must be poured into it.

This closes our anatomy of the relic. We have seen what the note is (a
three-function bundle), where it came from (paper), why it survived (standards
and habit), and what it does to the content inside it (flattens, pads, and
falsifies). Part II turns from anatomy to pathology: the precise ways this
arrangement damages the chart, the clinician, and the patient.

But first, the interlude we promised.
