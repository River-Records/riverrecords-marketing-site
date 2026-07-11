# Part III — After the Note

# Chapter 10 — The Chart as a Collaborative Workspace

Criticism is cheap. Two full parts of this book have now argued that the note —
atomic, static, single-author, triple-purposed — manufactures information chaos
and steals the clinical day. The obligation that follows is to describe what
should replace it, concretely enough to be built. This chapter lays out the
alternative paradigm; the remaining chapters develop its key commitments and
its honest limits.

We can state the alternative in one sentence:

> **The chart should be a single, dynamically updating, fully collaborative
> workspace, organized by clinical topic rather than by time, writer, or data
> type — in which individual facts are documented once, edited in place,
> attested without redocumentation, and tracked with complete version
> history.**

Every clause of that sentence answers a specific failure from Part II. Let's
take them in turn.

## 10.1 One workspace, not a pile of documents

In the workspace model, the chart stops being a container of accumulated
documents and becomes the primary object of care — the thing clinicians
actually read, write, and update. There is no "creating a new note" to record
a new fact. There is the patient's workspace, always current, and the act of
documentation is the act of updating it.

This directly resolves the deepest conflict we identified: the note's dual role
as bundle-of-updates and state-of-the-patient (Chapter 7, mechanism 3). In the
workspace model the two roles separate cleanly into two layers. The workspace
itself *is* the state of the patient — the clean, current picture, synthesized
from every contributor. A documentation event is *pure update* — edit the
facts that changed, touch nothing else. The trade-off between overload and
scatter that the note forces on every clinician simply does not arise:
nothing needs to be copied forward to stay visible, and nothing scatters,
because there is one place where each piece of information lives.

The timeslice function of the note — the genuinely valuable ability to see
what was known and believed at a past moment — is served by **version
history**, not by document immutability. Any prior state of the workspace is
reconstructable on demand: what did we believe on March 12th? One click. What
changed between the last two visits? A diff. Who asserted this fact, when, and
who has revised it since? All recorded, automatically, at a granularity the
signed note never achieved. You get *better* history than the note provides —
the note gives you snapshots at arbitrary intervals; version history gives you
a continuous record — without a single fact ever being duplicated.

## 10.2 Organized by topic, because that's the shape of the thinking

Within the workspace, the organizing unit is the **clinical topic** — most
often the medical problem. (Chapter 11 is devoted to this choice; here we need
only its outline.) The hypertension has a home. The CKD has a home. The
diagnostic uncertainty that hasn't earned a name yet has a home. Labs, imaging,
medications, consultant input, and reasoning attach to the problems they
concern, rather than to the tab matching their data type or the date of their
arrival.

This is the fix for the disorganized library of Chapter 6. It is also — and
this matters for adoption — not a novel imposition on clinical minds. It is
how clinicians already think. Problem-orientation has an honored history, from
Lawrence Weed's problem-oriented medical record onward; what the paper era
(and its digital reproduction) could never deliver was a problem-oriented
record that didn't demand extra labor to maintain. In a workspace with
fact-level editing, problem-orientation stops being a documentation *style*
enforced by discipline and becomes the passive structure of the record itself.

## 10.3 Collaborative, because care is

The workspace is shared. Multiple clinicians — across specialties, services,
and settings — read and write the same record, in parallel, in real time where
needed. The night nurse, the consultant, the primary team, and the outpatient
physician contribute to one structured picture instead of maintaining four
parallel picture-fragments that each partially copy the others.

Recall the working counterexample from Chapter 7: the attending, resident, and
intern already share a single note, contributed to in parallel, with
attestation at the end. Nobody finds that alarming. The workspace generalizes
the pattern from the hierarchical team to the whole care team — with the
critical addition that *disagreement is preserved and attributed*. Clinicians
can and do disagree about diagnoses and plans; a collaborative record must
hold competing assessments side by side, each signed, each dated, visible
together rather than buried in separate documents where the contradiction is
invisible (the conflict pathology, cured by adjacency).

What disappears is not disagreement but *redundant agreement* — the five
identical histories, the five pasted lab panels, the five re-summarized
hospital courses that today constitute "collaboration" between threads.

## 10.4 Attestation without redocumentation, finally

The workspace makes the Chapter 2 disentanglement real. Documentation creates
or changes information. **Attestation** — "I reviewed this; I agree; I take
responsibility" — is its own lightweight act, applicable to a single fact, a
problem, or the workspace as a whole, and recorded with the same rigor as any
edit.

The billing and medicolegal machinery this supports is *stronger* than the
note's, not weaker. Today, responsibility is assigned at the resolution of the
signed note — a blunt instrument wrapped around a mass of text the signer
largely didn't produce (Chapter 7, mechanism 7). In the workspace,
responsibility is assigned at the resolution of the individual assertion:
every fact traceable to its author; every confirmation, revision, and
retirement stamped and attributed. If regulators or payers require a
document-shaped artifact — and today they do — one can be *generated* from the
workspace at any moment: a rendered view of the relevant problems, updates,
and attestations for a given encounter, frozen as a legal snapshot. The
document becomes an output of the record rather than the record itself. The
bill falls out as a byproduct.

## 10.5 This has actually been built

Everything to this point could be dismissed as whiteboard architecture, so let
us report an existence proof.

In 2021, our group published a software design and feasibility study in *JMIR
Formative Research* describing a working, web-based EMR built on exactly these
principles — an EMR with **no notes at all**. The design goals were explicit:
disincentivize information duplication and information scattering by
construction. The reasoning encoded in the design: by default, the majority of
a patient's history remains the same over time, so users should never have to
redocument it; clinicians on different teams mostly share the same
information, so data should be collaboratively shared across teams (while
preserving room for disagreement and nuance); and wherever a clinician needs
to state that information is unchanged, attestation without redocumentation
must suffice.

The resulting system treated the chart as a single, dynamically updating,
fully collaborative workspace, with all information organized by clinical
topic. Version history provided granular tracking of every change. And one
finding deserves particular emphasis: the system was *highly customizable at
the individual level* — each user could decide which data should be structured
and which unstructured, gaining the benefits of templates and decision support
where they wanted them, without requiring programming knowledge. Structure and
flexibility turned out to be complements, not opposites (a theme Chapter 12
returns to).

The study demonstrated feasibility, not outcomes — we make no grander claim
for it here. But feasibility is precisely what the fatalist position denies.
"The note is how it must be" is refuted by a single working counterexample:
our attachment to the note as the only possible atomic unit of unstructured
medical data is a choice, and alternative models exist to be evaluated.

## 10.6 What the workspace asks of us

Honesty requires naming what this paradigm demands, because none of it is
free.

**It demands curation.** A living record can decay — problems left open,
duplicates entered in parallel — and unlike the note pile, the workspace makes
decay *visible* and assigns it a cure (merge, retire, edit) rather than
layering new sediment on old. Stewardship must be cheap and expected; the
commons lesson of Chapter 8 applies with full force.

**It demands cultural change around editing.** Clinicians have been trained —
by malpractice anxiety more than by regulation — to treat the record as
append-only. The workspace asks us to distinguish the *audit trail* (which is
append-only, complete, and untouchable) from the *presentation* (which should
always show the best current understanding). The law has never actually
required that errors remain on permanent display; our software habits did.

**It demands interoperability that does not yet fully exist.** A workspace
inside one institution still faces a world of C-CDA documents at every
boundary. Chapter 14 confronts this directly.

What it does *not* demand is more documentation labor. Every mechanism in this
chapter removes work — the copying, the re-summarizing, the parallel
documentation, the archaeology. That is the test any successor paradigm must
pass, and the note's replacements have historically failed: problem lists that
must be maintained *in addition to* notes, reconciliation modules that add a
step instead of removing one. The workspace succeeds only where it *replaces*
the redundant act, never where it supplements it.

With the paradigm on the table, we can now look closely at its two central
design commitments: the problem as the unit of meaning (Chapter 11), and
normalization with personalization (Chapter 12).
