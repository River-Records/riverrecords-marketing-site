# Part I — Anatomy of a Relic

# Chapter 2 — What a Note Actually Is

Before we can weigh the pros and cons of the note, we need to understand what
exactly a note *is*, and how it operates in the current documentation paradigm.
The simplest answer to this seemingly odd question is that a note is a discrete
bundle of related clinical information: a set of facts, opinions, and thoughts
wrapped up in a single document package. The note isn't meant to hold the
entirety of a patient's medical history or all the reasoning attached to it —
it's only a small part of the whole chart.

> **Figure 1.1** (`figures/fig-1-1-fact-note-chart.jpeg`) — Under the current
> paradigm, a set of clinical facts makes up a note, and a set of notes (along
> with additional structured data) makes up a chart.

This three-level hierarchy — fact, note, chart — is so familiar that it has
become invisible. But the middle layer is a choice, and everything in this book
turns on examining that choice. Why do we bundle certain clinical facts together
into "notes" at all? What work is the bundle doing? When we look closely, the
note performs three distinct bundling functions at once: it groups information
by **time**, by **clinical thread**, and by **responsibility**. Each function is
legitimate. The trouble, as we will see, comes from welding all three into a
single, indivisible object.

## 2.1 The note bundles information by time

Most fundamentally, we bundle facts into notes based on time. Each note is meant
to capture a discrete timeslice of a patient's medical life. To simplify for now
(we will deal with the complexities of the multi-member medical team soon
enough), think of a patient who is seen repeatedly by only one clinician. The
clinician interacts with the patient at particular time points, when the patient
needs medical care. In between those points, the patient is living their normal
life, and the clinician is effectively in the dark. At each encounter, the
clinician collects, acts on, and records all relevant information from the
intervening chunk of time. That chunk varies drastically in length — from a
single day (inpatient hospital rounds) to multiple years (a healthy person's
outpatient primary care visits) — but the chunks are sequential and
non-overlapping.

> **Figure 1.2** (`figures/fig-1-2-note-as-timeslice.jpeg`) — The note as
> timeslice. Each tick represents a note in a patient's chart. Notes provide
> updates on a patient's status over a period of time. The length of that period
> depends on the nature of the note: a routine primary care note updates the
> patient's status after several months; during an inpatient admission, a new
> note updates the patient's status each day.

The individual note, then, captures all relevant data between the last encounter
and the current one — progression of illness, medication adherence, new issues —
as well as what happened at the current encounter: conversations, reasoning,
recommendations. Immediately after an encounter, the most recent information is
reflected in the latest note, and the entire history of the patient from birth
to the present is captured in the set of all existing notes — the chart. In this
highly simplified model, each fact is captured exactly once, in whichever
timeslice it falls into.

On the whole, non-overlapping timeslices make sense as a way to bundle facts.
When searching a chart, it is easy to sort the bundles by time to find a
particular event or track an evolving disease course. On the input side,
documentation events map neatly onto patient encounters: most new information is
acquired when a clinician sees a patient, and the clinician can document the
bundle of new facts just afterward.

But the non-overlapping timeslice model isn't perfect — some clinical
information simply doesn't fit. Most notes include summarizations of information
from past timeslices (past medical history, "one-liner" summary statements,
problem-level assessments), so we cannot truly say a note contains only
information from its own timeslice. Newly documented events may recontextualize
or change the interpretation of data recorded earlier; previously documented
information may be found to be erroneous — and in these scenarios, one must read
a *more recent* note to truly understand an older note's timeslice. Certain
information, such as cited research knowledge, doesn't map to any timeslice at
all. And clinicians routinely document the same information in multiple separate
timeslices, breaking the non-overlapping ideal in practice.

For these reasons and more, a world of perfectly non-overlapping time-sliced
bundles is unachievable. Nonetheless, the timeslice ideal should be a guiding
principle of any sensible documentation paradigm — it is what minimizes
redocumentation, minimizes the introduction of errors, and enables effective
searching and sorting by time. Hold on to this: there are many possible ways to
implement informational timeslices, and the modern note is only one of them.

## 2.2 The note bundles information by clinical thread

A second reason we bundle certain facts together — and keep others separate —
relates to *clinical threads*. We define a thread as a stream of clinical
reasoning and action that persists across multiple timeslices: the sequence of
daily nursing notes during a hospital stay, a series of primary care notes over
a lifetime, the sequential notes of an inpatient neurology consult. In general
(though not always), clinical threads map onto the different aspects of care
provided by different services. Different clinicians can be part of the same
thread when they are responsible for managing the same bundle of information
over time — night-shift and day-shift nurses, a primary care physician covering
a partner's patients, a consult team of attendings, residents, and students —
and they generally speak with a unified clinical voice.

> **Figure 1.3** (`figures/fig-1-3-note-as-thread.jpeg`) — The note as thread
> separator. A thread is a collection of notes with similar content or purpose;
> under the current paradigm each note belongs to a particular thread (indicated
> here by color). A patient's outpatient cardiology care is one thread; their
> inpatient treatment is another. Threads can overlap in time, as when inpatient
> care includes both physician and nursing threads.

In a note-based system, clinicians operating in different threads write
different notes, some covering overlapping timeslices. This has real benefits.
On the input side, multiple threads let different clinicians capture different
types of information, document simultaneously in parallel, record conflicting
opinions about a diagnosis or treatment, and build personalized systems for
organizing information to their own needs — discipline-specific templates,
dashboards, and so on. On the output side, threads provide a coarse grouping
that allows basic filtration by discipline: if you want to know how the
patient's Parkinson's disease is going, it probably makes sense to check the
neurology notes.

But as with timeslices, notes are not the only way to separate information into
threads — and the note-based version of threading is no match for the team-based
care model now standard across the country. As the number of threads in a
patient's care grows (controlling stage II hypertension, titrating SSRIs for
major depressive disorder, following weight after a new diet plan), it becomes
more important that each is separated out and routed to the relevant
clinicians. Yet finding the optimal grouping of clinicians into threads — who
belongs together, who apart — is genuinely hard, and our choices about thread
boundaries have very practical consequences. Under the current system, the same
information — a physical exam, a radiology report, a lab panel — is documented
many times across different clinical threads, producing duplicate data and
wasted time, both in the redocumenting and in the sorting through the
redundancy afterward. The more threads there are, the more time is spent
documenting redundant information, the more opportunity for factual conflict
and error, and the more redundant text accumulates in the chart as a whole.

## 2.3 The note bundles information by responsibility

Beyond organizing information by time and thread, notes serve a third major
function in our healthcare system: they are groups of clinical facts that can be
*attested to* as a single unit. By attestation, we mean a statement of agreement
with, and responsibility for, a group of clinical facts. Clinically, it matters
who documented what — who heard the systolic murmur, who discussed end-of-life
wishes with the family, who increased the dose — to fully understand a patient's
course. We also assume medicolegal responsibility for the outcomes of our fact
collection, our reasoning, and our treatment decisions. And — in some ways most
importantly for the system as a whole — we state which services were performed
in order to be paid.

For all these reasons, any effective documentation system must let us assign
responsibility for each piece of data collected or action taken. In note-based
systems, responsibility assignment happens at the note level: if Dr. X wrote a
note, we assume Dr. X collected (or at least verified) everything in it. By
signing the note, Dr. X attests to every fact within it in a single action.

> **Figure 1.4** (`figures/fig-1-4-note-as-attestation.jpeg`) — The note as
> attestation bundle. When a clinician writes and signs a note, they attest to,
> and take responsibility for, each individual fact within it.

But writing a note is not the only way to attest to a set of clinical facts. In
academic medical centers, attending physicians routinely use attestations to
indicate agreement with a trainee's or colleague's conclusions *without
rewriting the same facts* in their own documentation. Some EHRs let clinicians
perform medication reconciliation or problem-list updates through simple
attestation — a single click stating "nothing has changed" or "I agree with the
current state of the chart." This creates no new information and takes almost no
time.

This, of course, is highly sensible. If only we were so sensible in every other
setting of attestation. Separating the concept of attestation from the act of
documentation is critical to understanding how charts become bloated with
redundant, copied text. Attesting to a set of clinical facts may be necessary
for billing or medicolegal purposes — but it fundamentally does not require
*re-documenting* those facts. The two concepts have blurred together in the
world of the text note. Clinicians have gotten into the habit of re-documenting
old information rather than simply stating that nothing (or little) has changed.
Text gets copied forward not only across timeslices within a thread, but across
threads, as clinicians paste the radiology report, the consult recommendation,
or another physician's history into their own notes. One of the deepest problems
with the modern note, then, is that it trains us to treat documentation and
attestation as the same action. To build truly modern documentation systems,
these ideas must be disentangled — not only inside EHR software, but inside our
own habitual minds.

## 2.4 Three functions, one object

So: a note is a bundle of related clinical observations, documented at a single
time, that simultaneously (1) marks off a timeslice, (2) assigns information to
a clinical thread, and (3) packages facts for one-signature attestation. Any
worthy documentation paradigm has to provide all three separations somehow. The
question this book asks is whether one rigid object should provide all three at
once — because there are many possible design decisions about how these
bundlings play out, and while some yield usable systems, others yield something
horribly inefficient and frustrating.

Notice what the three-function analysis already reveals. The timeslice function
argues for *small* bundles, documented close to the moment of change. The thread
function argues for bundles that *persist* across time. The attestation function
argues for bundles shaped by *billing and legal* requirements, which map to
neither. The note is being pulled in three directions at once, and every
clinician who has stared at a blank note template wondering how much history to
re-summarize has felt the tension personally.

Next, we ask where this strange three-headed object came from. The answer, in a
word: paper.
