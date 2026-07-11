# Book Draft — *The Note Was Never the Point*

This directory contains the first draft of a book combining the River Records blog
essays with Jackson's rigorous treatment of the note paradigm and information chaos
(the material behind the JMIR viewpoint, the JMIR Formative noteless-EMR study, and
the JAMA Network Open duplication study).

This directory is **not** part of the Astro site build (nothing under `src/` or
`public/` references it), so it deploys nowhere and affects nothing.

## Structure

```
book/
  README.md            ← this file: plan, source map, open editorial questions
  manuscript/          ← the draft, one markdown file per chapter, in reading order
  figures/             ← figures referenced by the manuscript
```

## Working title

**The Note Was Never the Point** — *Why clinical documentation is broken, how the
paper chart still runs your EHR, and what comes after the note.*

Alternatives considered: *Beyond the Note*; *Information Chaos*; *The Chart Is the
Real Work*. The working title is the strongest single line from the source material
and states the thesis.

## The argument, in one paragraph

The clinical note — a static, single-author, indivisible bundle of text — is a relic
of the paper chart that was digitized rather than rethought. Because the note bundles
facts by time, by clinical thread, and by responsibility all at once, and because it
is the atomic unit of unstructured data in every EHR, it systematically produces
information chaos: overload, underload, scatter, conflict, and error. That chaos is
what actually consumes the clinical day — not typing speed — and it is a major,
tractable driver of medical error and clinician moral injury. The way out is to break
the note's atomicity: organize the record around the patient's problems, let facts be
documented once and edited individually, separate attestation from redocumentation,
normalize the review surface while personalizing the projection, and use AI to build
structure rather than to generate prose faster. The note can fall out as a byproduct.

## Part / chapter map with sources

| # | Chapter | Primary sources |
|---|---------|-----------------|
| — | Front matter, preface | building-stream-ai-scribe; why-medical-documentation-sucks-fix-it |
| 1 | Introduction: Drowning | Essay Part 1; drowning-in-documentation; Arndt/Sinsky data |
| **I** | **Anatomy of a Relic** | |
| 2 | What a Note Actually Is | Essay Part 2 (time / thread / responsibility bundles); Figs 1.1–1.4 |
| 3 | The Paper Inheritance | Essay Part 3.1–3.2; what-next-in-medical-charts; clinical-notes-in-need-of-change; Fig 2.1 |
| 4 | The Standards That Froze Us | Essay Part 3.3–3.5 (Meaningful Use, C-CDA, FHIR) |
| 5 | The Tyranny of the Template | breaking-free-from-soap; templated-ehr-notes; ehrs-cause-note-bloat; the-hidden-danger-of-perfect-looking-notes; not-all-problems-need-ai |
| — | Interlude: Obituary — The Medical Note | medical-notes-are-dying (verbatim, light edits) |
| **II** | **Information Chaos** | |
| 6 | The Five Pathologies | Essay Part 4; what-is-information-scatter; ehr-information-overload; ehr-information-underload; ambient-ai-needs-context (library metaphor) |
| 7 | Seven Ways the Note Creates Chaos | Essay Part 5 (the seven causes, kept intact) |
| 8 | Copy-Paste Is a Symptom, Not a Sin | medical-record-duplicate-information-errors (JAMA); why-clinicians-copy-paste-ehr; lost-diagnoses-and-chart-lore; tragedy-of-the-ehr-commons |
| 9 | The Work Before the Work | the-work-before-the-work; i-dont-read-charts (part); medicine-doesnt-scale; the-chart-doesnt-know-your-patient |
| **III** | **After the Note** | |
| 10 | The Chart as a Collaborative Workspace | noteless-emr-research; medical-notes-obsolete-research-perspective; part-2-siloed-documentation; essay §5 fixes |
| 11 | The Problem Is the Unit | notes-are-deadweight; building-toward-patient-level-representation; what-carries-forward; clinical-note-best-task-manager |
| 12 | Normalize the Surface, Personalize the Projection | i-dont-read-charts-i-hunt-through-them; normalization-makes-personalization-possible |
| 13 | What AI Changes — and What It Doesn't | not-all-problems-need-ai; why-faster-notes-wont-fix-cognitive-overload; ambient-ai-needs-context; summarization-is-a-tool; the-note-is-solved-the-chart-is-not |
| 14 | The Bridge, Not the Destination | the-bridge-not-the-destination; the-note-was-never-the-point |
| 15 | Conclusion: Let the Work Be the Work | Essay conclusion; the-work-before-the-work closing |
| — | Afterword: What We're Building | building-stream-ai-scribe; summarization-is-a-tool (product notes kept out of main text on purpose) |
| — | References | consolidated citations |

## Editorial decisions made in this draft

1. **Product-agnostic main text.** Stream/River Records appears only in the preface
   and afterword. The chapters argue from evidence and first principles so the book
   stands on its own (mirrors the disclosure style used in the 2026 posts).
2. **The essay's rigor is preserved.** Chapters 2, 4, 6, 7 carry Jackson's treatment
   nearly whole, edited for book flow (e.g., "this article" → "this chapter",
   cross-references stitched to chapters instead of posts).
3. **Voice.** First-person-plural ("we") throughout, physician-to-physician, direct.
   Per brand rules: the word "narrative" is not used; systems are described as
   "organized like clinicians think," never as "thinking like a clinician."
4. **The Obituary post is used as an interlude** between Parts I and II — a palate
   cleanser that earns the tone shift from anatomy to pathology.
5. **SEO/product-marketing posts were deliberately excluded** (the scribe-benefit
   listicles, specialty landing posts, implementation guides). They aren't
   philosophy and would dilute the argument.

## Open questions for the authors

- **Authorship & credit.** Draft front matter lists Jacob Kantrowitz and Jackson
  Steinkamp as primary authors with Alex Butler, Abhinav Sharma, and Wasif Bala as
  contributors (several chapters derive from their posts/papers). Confirm ordering
  and whether this is "and" or "with contributions from."
- **The 2020-era essay dates itself** ("Just eight years ago, in 2012…"). The draft
  reframes those passages to absolute dates. Verify no other time-sensitive claims
  slipped through.
- **Figure redraws.** The five figures included are the original blog/essay images;
  a designer should redraw them in a consistent style for print.
- **Citations** are consolidated in `99-references.md` in rough author-year form;
  they need a proper pass (page numbers, DOIs, and the "Adoption of EHR Systems"
  ONC data brief full citation).
- **Length.** This draft runs ~27,500 words — a short book (~100–120 print pages).
  If a longer treatment is wanted, the natural expansions are chapters 5, 8, and 13
  (each has more source material available than the draft uses).
