# Chapter 7 — Seven Ways the Note Creates Chaos

Where does information chaos come from?

Keep in mind the three purposes of the modern note established in Chapter 2 —
grouping information by time, by clinical thread, and by responsibility — and
the note's *atomicity*: the fact that it is difficult to add, change, split,
merge, or delete units of information smaller than a whole note. In this
chapter we trace seven major mechanisms by which our attachment to the note
produces the pathologies of Chapter 6, organized along those conceptual axes.
For each mechanism we also sketch the treatment — the design move that removes
the cause rather than medicating the symptom.

We don't claim that every EHR or institution suffers every one of these
problems; there are ways to mitigate them even within note-based systems. But
there is ample reason to believe our overreliance on the note is responsible
for a large share of the information chaos in modern charts — and that moving
beyond it holds enormous potential for patient care and clinician satisfaction.

## [1] The note is the atomic unit of storage → scatter

If you need to update a single clinical fact, how do you do it? In most EHRs,
you must create a new free-text note to hold even one piece of information.
Some systems allow an "addendum," but typically only in narrow contexts (e.g.,
within 24 hours of signing). Consider the common scenario: a patient calls
three months after their last visit to report a new rash. You cannot append
this to the previous note without destroying the sense of time between the two
events — so you create a new note, containing a single fact, floating alone in
the chart.

This forced bundling may be the single largest contributor to **information
scatter**. Information that belongs together — that should be viewable and
editable as a unit — is strewn across the chart, or must be repeatedly
re-collated by hand. Most EHR interfaces can't display multiple notes at once,
adding clicks and time to every cross-note reconstruction. Worse, significant
cognitive work is required just to *identify which notes are relevant*, and
under time pressure, relevant notes are simply missed. And it is often
genuinely impossible to tell which of several scattered mentions is the most
current.

The atomic note also cripples secondary uses of the record. Building systems to
track single facts for quality improvement, research, or population health is
extremely difficult when the fact is buried in an undifferentiated text block.
Think how much easier it is to extract "all patients with an elevated
potassium" (a fact stored atomically, in a structured lab interface) than "all
patients who have had substernal chest pain" (a fact trapped inside
note-bundles) — this is why so much effort has gone into natural language
processing systems for clinical text extraction, which are, fundamentally, a
band-aid over a storage-paradigm wound.

Contrary to popular belief, interface redesign cannot solve this. The scatter
results from the concept of the note as the smallest addable and editable unit
of information. As Deming's famous line has it: *every system is perfectly
designed to get the results it gets.*

**The treatment:** disentangle the clinical fact from the note. Let facts be
documented and edited individually, without requiring a new document each time.
Build documentation paradigms that by their nature pull related information
into the same place, viewable at the same time. Dynamically editable,
continuously updating workspaces — the Google Docs and wikis of the world —
show the pattern; problem-based charting is the right clinical instinct, though
(as we'll argue in Part III) an insufficient one on its own.

## [2] Notes are not dynamically editable → overload, scatter, and conflict

Here is a thought experiment. If you wanted to truly "clean up" a patient's
chart — and all the normal rules were suspended — what would you do?

The question is really asking: what is the communicative purpose of the chart
as a whole? We propose: at any time *t*, the chart should enable quick review
and accurate summarization of everything clinically relevant that happened from
time zero to *t*. So a true cleanup would look like a deep spring cleaning:
read the whole chart and *compress it* — consolidate related information from
different notes, write concise summaries of long timespans, and delete — truly
delete — erroneous and duplicate information. The result would be a concise
chart reflecting all relevant information for future readers. Such a process
would act as a safety valve against every documentation pathology: even if
information started out scattered, it could be consolidated; even if
duplicates were created, they could be removed.

This is unthinkable under the current paradigm, because once information is
saved, it is nearly unmodifiable. Correction takes the form of *adding* an
edited note. Deletion takes the form of *adding* a statement that the past
information is no longer believed. Information perpetually accumulates and can
never be reduced — a nightmare of overload — while errors and contradictions
lurk permanently in the record, waiting for someone to mistake the superseded
version for the current one and copy it forward again.

This is plainly suboptimal design; we would not tolerate it in any other
software we use. Why does it persist? The most common answer: "How would we
ascribe responsibility? How would we know who was responsible for a decision?"
Sensible question — with no bearing on the design choice. It falls apart at
the slightest glance from anyone familiar with **version control**, the
"track-changes" capability prevalent in word processors and ubiquitous in
software development. With version control, the entire history of a document —
additions, edits, deletions, structural changes — is stored and attributable.
The full history should be *viewable but not present by default*, reflecting a
bedrock principle of design: optimize the interface for the common case
(understanding the current state of the patient) rather than the rare one
(assigning responsibility for a past action).

**The treatment:** true editing and true deletion of clinical information, on
top of complete version history. The chart's default face shows the clean
current state; the audit trail preserves everything for the rare day it's
needed.

## [3] The note is both "bundle of updates" and "state of the patient" → an unresolvable trade-off

As clinicians we know that the patient's state changes over time — and so does
the *interpretation* of past events. Effective documentation reflects the
situational understanding of the clinicians at the time of documentation. Even
if that understanding was later shown to be incomplete, it explains why they
acted as they did. This is why you would never go back and change the
creatinine value in an old note when a new result arrives: the old note is a
record of what was known *then*.

But notice that the note is trying to serve two masters:

- **The bundle-of-updates view:** the note holds only what is new or changed
  since the last note — a pure timeslice increment.
- **The state-of-the-patient view:** the note taken at time N+1 should let a
  reader understand the *entire* current state of the patient, even though most
  of that state is unchanged from time N.

Each view implies a completely different answer to "what belongs in this
note?" Document strictly the updates, and you minimize duplication — but
reconstructing the state of the patient now requires combing through a scatter
of past notes and assembling the pieces. Document the full state, and the
reader gets one-stop orientation — at the cost of massive duplication in every
note. Scatter or overload: pick one. This trade-off is not a failure of
discipline or training. It is an *unresolvable conceptual conflict* between two
purposes jammed into one object — and it shows up empirically, as we'll see in
Chapter 9, as a measurable inverse relationship between duplication and
scatter across note types.

**The treatment:** split the two purposes into two layers. Let the *chart*
present the clean, current state of the patient — synthesized from every
clinician's contributions, viewable on one screen. Let a *documentation event*
be exactly what its name says: an edit to the relevant pieces of information,
leaving everything else untouched. After the update, the chart reflects the new
state; old states remain viewable through version history. In such a system,
the need for anything shaped like a "note" begins to vanish entirely.

## [4] Clinicians treat the note like the chart → overload and scatter

What is the difference between the purpose of a single note and the purpose of
the whole chart? They are two different abstraction layers, and they should
play different, complementary roles: the chart holds everything across the
patient's medical life; the note — in a sane division of labor — would be freed
to be a bundle of updates.

In practice the division collapses. Clinical reasoning inherently involves
summarizing the past: to justify a decision at time *t*, you cite the symptom
from *t−5* and the medication stopped at *t−7*. Some of this cross-timeslice
summarization is inevitable and appropriate. But the *degree* to which our
paradigms incentivize re-documentation is under our control, and the current
incentives are perverse. When the chart is horrible to search — when scatter is
everywhere — clinicians protect themselves by hoarding: once you have
painstakingly assembled the relevant history from disparate notes, you paste
the assembly into your own note so you never have to do it again. We call the
resulting pattern **history-of-the-patient documentation** — the single note
gradually assuming the role the chart was supposed to play:

> **Note 1**
> 6/12: Increased edema. Furosemide increased 20mg bid → 40mg bid.
>
> **Note 2**
> 6/12: Increased edema. Furosemide increased 20mg bid → 40mg bid.
> 6/19: Improved edema. No medication changes necessary.
>
> **Note 3**
> 6/12: Increased edema. Furosemide increased 20mg bid → 40mg bid.
> 6/19: Improved edema. No medication changes necessary.
> 8/20: Called for furosemide refill. Sent to pharmacy.

None of these entries involves reasoning-based summarization — they are simple
objective facts with stable interpretations. The clinician is using an
accumulative note purely to defeat information scatter. It's an adaptive
solution, and for one problem it looks harmless. Applied across every problem,
by every clinician, over years, it mathematically guarantees a chart bloated
with copies — and notes so engorged that the atomicity problem gets worse,
because finding or changing a single fact inside a chart-sized note is even
harder than inside a normal one. What is good for the note is bad for the
chart.

**The treatment:** as in [3] — give each layer its own job. Documentation
events stay small (pure updates); the chart interface makes navigating between
timeslices trivial and presents the always-current state view. For this to
work, previously documented elements must be *individually editable* (change
the latest EF, update the asthma symptom status — nothing else) and *viewable
together* regardless of when they were documented. Which is to say: it
requires abandoning the atomicity of the note. Everything keeps pointing at
the same load-bearing wall.

## [5] Structured updates are fast, note updates are slow → underload and conflict

If the chart is to serve as a state-of-the-patient view, we must be able to
trust that what we see is current. Data that enters the chart late is
functionally missing — information underload — for every clinician who looks
in the meantime.

For automated channels (monitors, lab feeds), updates are immediate. For
humans, the ease of making an update controls its timeliness, and the dominant
factor is the *size* of the required update. Under a note-only paradigm, you
can't really update the chart until you have an entire note's worth of
information. So we don't update at the moment of change, even when we're
sitting at the computer. We batch. We finish our notes at day's end — or the
next day — and the chart lags reality by hours to days. Predictably, clinicians
have learned to trust non-note data (structured lab values, with their shared
expectation of real-time entry) over note data whenever currency matters.

Meanwhile, the single-fact updates that *do* happen urgently travel through
side channels — pages, phone calls, texts — and then get documented again
later, when the atomic note is finally assembled. The chart's most
time-sensitive content is precisely the content the chart receives last. And
when a single-fact update *is* documented promptly (as its own tiny note), it
is largely invisible: trapped in the notes list rather than surfaced in any
state-of-the-patient view.

**The treatment:** make the smallest possible update a first-class act.
Single-fact updates, entered in seconds, visible immediately in the chart's
current-state view. The documentation system should never require a bundle
when the clinician has only one new thing to say.

## [6] Thread boundaries are historical, not informational → redocumentation, overload, and scatter

A note, under the current paradigm, is written by one person or one
hierarchical team. So when two teams cover the same patient during the same
timeslice, they write two notes — and most of the information in those notes is
*shared*. There are genuine areas of divergence (a neurology consult's detailed
neuro exam; honest differences in assessment), but the bulk — history, vitals,
labs, events overnight — is identical, and it gets documented separately by
each thread: copy-pasted or paraphrased into each team's notes. That is
information overload manufactured by an org chart. Simultaneously, the
information that *should* be viewable together is split across note boundaries
merely because different people collected it — information scatter, same
cause. In many hospitals today, the same fact is documented upward of five
separate times, within a single timeslice, by five different consulting teams.

And when unlinked copies proliferate across teams, correcting an error becomes
practically impossible: you would have to fix it in every team's notes, and you
generally can't edit someone else's.

Notice that we already tolerate — indeed rely on — a working counterexample.
Within a hierarchical team, the attending, senior resident, and intern do *not*
each write independent notes; they share one, contributed to in parallel, with
the attending attesting to the final state. Nobody considers this a
medicolegal scandal. It is simply a sane thread boundary: people who manage the
same information share the same documentation.

**The treatment:** draw thread boundaries around *shared information*, not
historical service lines — and be very suspicious of any workflow that requires
multiple people to document the same facts in separate threads. A collaborative
workspace in which consultants, primary teams, outpatient physicians, and
cooperating services contribute to a shared, structured record — with
disagreement preserved and attributed — would collapse most of this
duplication and give chart review a single home. Once the atomic note is gone,
a whole design space of thread boundaries opens up.

## [7] No attestation without redocumentation → overload

These diagnoses may sound right in theory, and the treatments promising. But —
you say — "EHRs were largely designed for billing. That's never going to
change." Fair. The billing and medicolegal functions loom over any alternative
to the note, not just conceptually but bureaucratically: institutions have been
built on the note, and generations of clinicians have learned to operate inside
its constraints. The perceived barrier is always the same: the need to assign
individual responsibility for clinical actions and reasoning.

But look closely at how attestation actually works today. Each note is written
"by" one clinician, who is simultaneously the documenter and the attestor — in
theory a clean boundary of responsibility. In practice the boundary is already
a fiction. Because of the enormous volume of copied and re-summarized text in
every note, clinicians constantly attest to information *collected by others*:
outpatient physicians document inpatient events they never witnessed; radiology
and pathology reports are pasted into primary team notes; attendings attest to
histories assembled by residents from chart review. We sign it all as if we
had verified it all. The note is not a clean attestation boundary now — we
merely pretend it is.

And the pretense has a price: whenever a billing rule, a legal anxiety, or our
own internalized habit demands that we "attest" to old information, the note
paradigm makes us *redocument* it — within teams, across timeslices, across
threads. Copies of the same information senselessly proliferate because the
system provides no way to say "I reviewed this; it is unchanged" for
unstructured content.

We are not suggesting clinicians shouldn't verify a colleague's exam or
history. We are saying that when you verify it and find it accurate, you should
not have to *type it again*. The system should record that you confirmed it —
one action, no new copy, no added bloat.

The pattern already exists: "medication list reviewed, unchanged" is a single
click in most EHRs, and where it's implemented well it saves real time. What
has never happened is the extension of attestation-without-redocumentation to
unstructured clinical information — because the note's atomicity forbids it.
You can't attest to a fragment of an atomic object; you'd have to agree with
100% of a colleague's note to attest to the whole, which almost never happens
outside the attending–resident relationship.

**The treatment:** break the atomicity, and attestation becomes granular.
Attest to single facts, or document the few changes and confirm the rest —
"everything else as documented." Pair it with version history, and every
attestation is tracked, timestamped, and attributed: responsibility assignment
at least as rigorous as today's, with none of today's duplication.

## The common root

Seven mechanisms, one anatomy. Scan back over the list and notice how every
mechanism terminates in the same two structural facts:

1. **Atomicity** — the note is the smallest unit that can be created, and
   nothing smaller can be edited, moved, merged, or attested to ([1], [2],
   [5], [7]).
2. **Conflated functions** — one object simultaneously serving as timeslice,
   state summary, thread container, and attestation bundle ([3], [4], [6]).

These are not features of any particular vendor's software. They are features
of the *concept* — which is why no amount of interface polish, and no
generation of faster note-writing tools, can fix them. The concept is the
disease.

The next two chapters examine what the disease does to the record's content
(Chapter 8: duplication, measured at scale) and to the people who work inside
it (Chapter 9: the work before the work). Then we build.
