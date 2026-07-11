---
title: "The Five Pathologies"
chapterLabel: "Chapter 6"
part: "Part II — Information Chaos"
order: 7
description: "Overload, underload, scatter, conflict, and erroneous information — Beasley's information chaos framework, as clinicians actually live it, from chart lore to the library organized by media type."
seoTitle: "Information Chaos in the EHR: The Five Pathologies"
seoDescription: "Overload, underload, scatter, conflict, and erroneous information — Beasley's information chaos framework, as clinicians actually live it, from chart lore to the library organized by media type."
relatedPosts:
  - slug: "what-is-information-scatter"
    title: "“I Know I’ve Seen This Before”: How Information Scatter Drives Clinician Burnout"
  - slug: "ehr-information-overload"
    title: "Too Much Information, Too Little Time"
  - slug: "when-the-chart-comes-up-empty"
    title: "When the Chart Comes Up Empty"
  - slug: "lost-diagnoses-and-chart-lore"
    title: "Lost Diagnoses and Chart Lore"
draft: false
---

Most clinicians have strong opinions about current EHR systems. Whether you
think they have been a net benefit or a net harm to the practice of medicine,
you likely agree there are significant improvements to be made. A good system
should make it easy to get data *in* — easy navigation, minimal duplicate
documentation, decision support, customizable templates — and easy to get
relevant data *out* — sensible grouping of related information, effective
search and summarization, customizable views. These two tasks are fundamentally
intertwined, and a system that does them poorly produces incorrect information,
longer chart-search times, medical error, and burnout.

To evaluate the note rigorously, we need a vocabulary for *how* documentation
systems fail. The most useful framework we know was developed by Beasley and
colleagues in 2011 in the *Journal of the American Board of Family Medicine*.
They proposed the concept of **information chaos** in primary care and broke it
into five components:

1. **Information overload** — too much data in the chart to review, filter,
   and act on safely.
2. **Information underload** — required data is absent or unavailable.
3. **Information scatter** — related information is fragmented across multiple
   places.
4. **Information conflict** — multiple sources contradict each other with no
   easy way to tell which is accurate or current.
5. **Erroneous information** — self-explanatory, and self-perpetuating.

Their conclusion was blunt: primary care physicians experience information
chaos routinely, and it isn't merely irritating — it degrades performance and
threatens patient safety. These five pathologies, prevalent and worsening in
many organizations' EHRs, give us the diagnostic categories for everything that
follows. This chapter examines each one as clinicians actually live it; the
next chapter traces them back to their common cause.

## 6.1 Overload: too much information, too little time

Every primary care physician has experienced this moment. You're halfway
through a clinic day. Fifteen patients left. Fifty inbox messages. Multiple
notes open. Five different tabs just to figure out what happened at cardiology.
A flashing vaccine alert, a cancer screening reminder, and a patient waiting to
be seen. This isn't a failure of time management. It's a failure of the system.

Information overload is the simplest pathology to understand, but perhaps the
most nefarious, and it repays careful analysis because it is really two
distinct problems:

**Too much medical information.** The patient genuinely has a long, complex
history — partly a consequence of modern medicine's complexity, but inflated by
over-documentation of irrelevant material: templated content, auto-populated
default negatives, boilerplate inserted to satisfy audits.

**Too many copies of the same information.** The same fact — a lab value, an
exam finding, a past medical history — is documented over and over: across
consecutive notes in a thread, across different clinicians' parallel notes, and
between notes and the structured interfaces where the data already lives.

The second form is the tractable one, and a concept from software development
shows why. There is a fundamental difference between storing **multiple copies**
of information and providing **multiple views** of a single copy. EHRs already
demonstrate the right pattern with laboratory results: one stored result can be
displayed as a list, a graph, a panel-wide dashboard — and amending the single
stored copy updates every view instantly. By contrast, when that same lab value
is retyped into three consecutive progress notes, three *unlinked copies* now
exist. Correct one and the others silently persist — now the chart contains
conflict and error, our fourth and fifth pathologies, manufactured directly
from the second.

Consider what this means at scale. Imagine discovering that a patient you
thought had diagnosis X actually has diagnosis Y — after months of notes and
structured entries documenting X. Could you even *find* all the places the
chart asserts X? Could you notify everyone who read it? (Never mind that most
EHRs won't let you alter a signed note at all.) A single error, faithfully
copied, becomes effectively uncorrectable.

So a first design principle falls out: to whatever extent possible, **each
clinical fact should be documented exactly once**. Single documentation keeps
notes concise, minimizes redundancy, prevents conflict, makes errors
correctable, and shortens every future search. Our interfaces — and more
importantly our conceptual paradigms — should incentivize it. As we'll see in
the next chapter, the note paradigm incentivizes the exact opposite.

## 6.2 Underload: when the chart comes up empty

Sometimes the problem is the opposite. You open the chart and there's just
nothing there.

Information underload occurs when key clinical information is missing or
unavailable at the moment of need. It's the med list that was never reconciled.
The outside referral note that never arrived. The patient who says, "I think I
had a procedure a couple of years ago… not sure where." Five empty-feeling
notes in a row with no real history in any of them.

Underload slows care and raises its stakes. You spend the visit gathering basic
information that should have been waiting for you. You rely on recall and
assumption instead of records. You miss chances for early diagnosis, safety
netting, and coordination — and you spend more time documenting what *isn't*
known than acting on what is. Worst of all, you carry the patient's story
alone, because the system isn't carrying it with you.

Note that underload is not the mirror image of overload — the two coexist,
routinely, in the same chart. A record can be fifty pages long and still not
contain a reconciled medication list. Indeed, as our duplication research will
show in Chapter 8, the current paradigm forces a *trade-off* between the two:
documentation habits that fight scatter produce overload, and habits that
fight overload produce scatter and underload. A well-designed paradigm would
not force that choice.

## 6.3 Scatter: "I know I've seen this before"

As practicing clinicians, we catch ourselves saying it constantly: *I know I've
seen this before.* A lab result, a symptom, a family history detail. It's
somewhere in the chart — but not where you need it, and not when you need it.

Information scatter is when relevant clinical data is *present* but spread
across multiple disconnected places. You know it when you see it:

- A lipoma mentioned in a faxed radiology report and a progress note, but never
  added to the problem list.
- A medication change noted in a secure message, never reflected in the med
  list.
- Anxiety symptoms discussed in an old HPI, re-mentioned in a follow-up note in
  slightly different language.
- A colonoscopy result buried in a scanned PDF behind an out-of-date care gap.

In theory the information exists. In practice it's fragmented, and it falls to
the clinician to reassemble the story from scratch — visit after visit, patient
after patient. Scatter's effects are cumulative and corrosive: cognitive effort
spent stitching fragments instead of solving problems; redocumentation of the
same facts "so they don't get lost" (feeding overload); errors of omission when
a fragment stays lost; and — perhaps most damaging — a growing *mistrust of the
record itself*, as clinicians learn to treat the chart as a rough draft rather
than a source of truth.

Scatter deserves special emphasis for another reason: it is the neglected
pathology. Most healthcare technology of the last fifteen years has aimed
squarely at overload — filters, summaries, dashboards, ways to show you less.
Almost nothing has been aimed at scatter: the same information, in different
shapes, in different places, requiring a different approach every time you
encounter it. Yet scatter, as we will argue in Chapter 9, is the one that eats
the clinical day.

## 6.4 Conflict: which one is true?

When different clinicians document conflicting interpretations of the same
data in separate notes, the chart accumulates contradictions with no mechanism
for resolution. Let us be careful here: *disagreement itself is fine.*
Clinicians legitimately disagree about diagnoses and plans, and a good record
should preserve competing interpretations — they explain why different
decisions were made at different times. The pathology is not the existence of
conflict but its *invisibility*: because the conflicting statements live in
separate, disconnected documents, a reader may see only one of them and never
learn a contradiction exists. Your impression of the patient becomes a function
of which note you happened to click first — not of how the patient actually is.

Conflict is also manufactured mechanically, without any disagreement at all, by
the unlinked-copy problem of §6.1: yesterday's copied-forward "patient
improving" sits beside today's deterioration, and outdated copies contradict
their corrected originals forever.

## 6.5 Erroneous information: the error that cannot die

Errors happen in any system. What distinguishes a well-designed system is
whether errors can be *corrected*. In the note paradigm, once an error is
documented it is nearly immortal: the note is signed and locked, so correction
takes the form of *additional* documentation stating that the earlier
information is no longer believed. The error remains in the chart at full
visual parity with its correction, waiting for a hurried reader — or a
copy-paste operation — to resurrect it.

Clinicians have a folk name for the result: **chart lore**. The diagnosis that
was ruled out years ago but still stalks the problem list. The ancient allergy
of dubious provenance. The condition copied from note to note, consult to
discharge summary, assumed true simply because it has been there so long. And
chart lore has an equally troubling inverse: the *lost diagnosis* — the real,
documented condition that quietly vanishes from view because it lives in a note
nobody opens anymore. Both failures come from the same root. Diagnoses in the
current record are tied to encounters and documents rather than being treated
as dynamic, evolving components of the patient's health. A finding either
fossilizes (lore) or falls out of sight (loss); what it cannot do is *live* —
be updated, confirmed, revised, or retired in place.

Isn't it remarkable that a physician's central work product — a diagnosis —
can simply be lost? Or worse, be wrong, with nobody able to say so in a way
that sticks?

## 6.6 The library organized by media type

Here is an image that ties the five pathologies together.

Imagine walking into a library that is organized not by subject but by *media
type*. Books on one side, magazines on another, DVDs in the back. Within each
section, everything is sorted by date of acquisition and author's name. You're
looking for something on small business. You don't know a title — you know what
you want to *learn*. You walk the Books section: thousands of spines in
publication-date order. The Magazines section: same problem. After twenty
minutes you walk out frustrated and empty-handed.

No one would design a library like that. But that is exactly how we designed
the EHR. Open any chart and you'll find tabs by data type — Notes, Labs,
Imaging, Meds, Problem list — each timestamped, none telling you the story. You
can find a lab result, but not how it fits into the patient's diabetes. You can
read a note, but not whether it changed the plan for the hypertension. The
system stores everything and connects nothing.

Clinicians don't think in data types. We think in problems. A patient doesn't
have "one lab, one note, one medication" — they have diabetes, hypertension,
asthma, and the evidence connected to each. Yet the EHR asks us to navigate as
cataloging clerks rather than clinicians, reconstructing by hand a story the
system itself broke apart.

Libraries solved this centuries ago. Early collections *were* organized by
format and chronology; as knowledge grew, librarians recognized that humans
search by topic, and they invented classification systems that reflect meaning
rather than media. The medical chart is still waiting for its Dewey. Every
pathology in this chapter — the overload of unfiltered piles, the underload of
unfindable facts, the scatter across format-based shelves, the conflicts nobody
can see, the errors nobody can retire — is what daily life looks like inside a
library that never got organized.

The question, of course, is *why* our records look like this. It would be
comforting to blame lazy documentation or bad interface design, because those
are easy to imagine fixing. The next chapter argues the cause is more
fundamental: the pathologies follow, mechanically and predictably, from the
note itself.
