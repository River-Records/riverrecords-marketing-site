# Chapter 3 — The Paper Inheritance

The clinical note was born of necessity. In the pre-digital era, paper was the
only medium for documenting patient encounters. Each note was handwritten,
intended to capture a snapshot of the patient's condition and the clinician's
thinking at a particular moment. The structure was designed to be clear,
concise, and easy to reference later — usually by a single clinician, with
little consideration for collaboration. In that context, the note made perfect
sense: a self-contained record placed in the patient's file, available at the
next visit. Healthcare was less complex, information was shared less widely, and
a static document filed in a folder served the need.

Most of us now document in an electronic record, but this is a remarkably recent
development. As late as 2012, fewer than half of non-federal acute care
hospitals in the United States had even a "basic" electronic medical record.
Since we are barely a generation removed from all-paper records, it should not
surprise us that most paradigms for thinking about clinical documentation date
to the pre-digital world. We are not just talking about the well-worn complaint
that modern software design principles have yet to permeate the major commercial
EHRs. We are referring to something much closer to the core of how we document:
the wholesale adoption of the *note* as the central paradigm for recording the
majority of a patient's chart.

The argument of this chapter is simple to state: many of the reasons the note
was the best documentation paradigm in the paper era no longer apply, and the
transition to digital records — which might have been an opportunity to rethink
documentation entirely — instead became a wholesale lifting of concepts from the
paper world.

Perhaps this was necessary. We certainly don't blame the colleagues of that
time. In 2003, when the requirements for "basic" EHR use were being hashed out,
consumer software development was in its infancy, the iPhone was years away,
real-time collaborative systems like Google Docs presented genuinely thorny
technical problems, and half of U.S. households didn't own a computer. Perhaps
moving from writing on paper to typing on a computer was a large enough step for
one era. And perhaps the field didn't yet have the design thinking or software
infrastructure to get real mileage out of an alternative. But the move from
paper to digital must be seen for what it was: an incremental step whose
potential remains unrealized. We are still tied to the paper era's ways of
thinking — including the assumption that the "note" is the only possible bundle
of unstructured information.

So where to start? With the medium itself. If our documentation paradigms were
developed under paper, we should identify exactly how the limitations of the
physical medium shaped our practices — and then ask which of those practices
deserve to survive into a medium that has none of those limitations.

## 3.1 The limitations of paper

**Paper is single-user.** A clinical note written on paper is a physical object
that exists in exactly one place at a time. It's difficult for more than one
person to comfortably read it simultaneously, and impossible if they're not in
the same room. It's likewise difficult for two people to edit different parts of
a paper note at the same time without getting in each other's way. You could
enable simultaneous editing by dividing the paper into many small, individually
editable pieces — by tearing it up — but then you face the problem of bringing
the pieces back together with paper clips, staples, or glue. In computing terms,
paper notes are functionally readable and writable by one person at a time,
simply because they are objects in space.

**Paper is atomic.** Paper notes are hard to split into smaller units. It isn't
easy to detach a single *fact* from a paper note into its own note: you'd have
to physically tear off a piece (difficult, especially if the fact sits in the
middle of the page) or carefully rewrite the same information on another sheet.
It's even more onerous to merge pieces of information from different paper notes
into a new note — you're stuck rewriting everything, unless you like your notes
in the form of collages. You can erase or amend individual pieces of information
within a note, within the spatial constraints of the medium, but you cannot
really detach or recombine them.

**Paper copies are unlinked.** It is time-consuming to copy a paper record, and
when you do, the two copies are unlinked: updating one does not update the
other. If someone finds an error in one copy and crosses it out, they must also
correct every other copy that shares the information. Miss a single copy and
there are now two conflicting notes. Since truly linked paper copies are
impossible, whole categories of collaboration between clinicians simply couldn't
exist.

**Paper has no version history.** Keeping track of the history of edits and
updates made by different people over time is very difficult on paper. We are
all now familiar with software in which you can view what a document looked like
at any point in the past and quickly see what changed from one version to the
next. Imagine replicating that with paper: you'd need a separate ledger — "at
11:42, Dr. Smith edited Note B, erasing the lab value 3.5 and writing today's
result: 3.7." This is onerous enough that version control in a paper regime was
effectively impossible. And when edits are made to multiple copies at different
stages, it rapidly becomes impossible to know which information is outdated in
which copy and who changed what. Anyone who has emailed around documents named
`mynote_v2_3.6.2019_js_edits.docx` understands the problem — and how completely
modern version control solves it.

> **Figure 2.1** (`figures/fig-2-1-realtime-collaboration.jpeg`) — Electronic
> documentation enables multiple clinicians to collaborate on a single document
> in real time, without working in the same physical location. Unlike paper,
> electronic documents are readable and writable by multiple people at once —
> and every contribution is attributable, down to the individual edit.

## 3.2 Paper paradigms in a digital world

The observations above may seem obvious — things paper can't do and digital
records can. But these limitations — single-user read/write, note-level
atomicity, unlinked copies, no version history — made certain types of
documentation possible and others *unthinkable*. The paradigms developed under
those limitations went on to shape our documentation protocols and concepts,
and they persisted long after the move to a medium that surmounts every one of
paper's constraints.

When the healthcare industry transitioned to EHRs, the primary goal was to
digitize existing paper processes, not to rethink them. The note, in its
paper-based form, was simply digitized — and with it came the inefficiencies
inherent in paper. Consider how faithfully we reproduced the physical medium's
constraints in software that had no need of them:

The note is still largely **the atomic unit** of unstructured information. If
you receive a single new piece of clinical information — say, on a phone call
with a patient — and wish to update the chart, you must typically create an
entirely new note to hold that single fact. In many EHRs, once a note is signed
it is essentially uneditable; the closest thing to an edit is an "addendum,"
which is an unlinked copy. Even in EHRs that allow true editing, the dominant
note-as-timeslice mindset makes us hesitant to use it: editing a past note, even
to correct misinformation, feels like tampering with history.

The record is still largely **single-author**. Many EHRs make it impossible for
multiple people to collaborate on different parts of a note at once, so we still
"collaborate" at the level of the chart — by writing separate notes containing
redundant, copied information, exactly as we did when the constraint was
physical.

Related information is still **impossible to view together**. If two pieces of
information were originally documented in different notes — no matter how
closely related they are — it is difficult to view them side by side. And it's
often unclear which note contains the fact you need, because as far as the
computer is concerned, a note is an undifferentiated block of free text with
minimal internal structure: an atomic element that cannot easily be split,
merged, or recombined. No different, in kind, from a page in a folder.

None of these issues result from technological limitations. They are remnants —
unquestioned holdovers from the paper-era paradigm of the note. The core issue
with today's clinical note is that it remains *static in a dynamic world*: locked
after signing, appended to rather than corrected, authored alone in an era of
team-based care. Updates arrive as new notes or addenda, fragmenting the
patient's story further; each new layer adds more outdated or duplicate material
for the next reader to wade through.

We were promised a revolution and received a filing cabinet with a screen. That
is not because anyone was foolish. It's because paradigms are sticky: they
outlive the constraints that created them, and they become invisible precisely
because everyone shares them. The paper chart didn't die when we digitized it.
It moved inside the software — and inside our heads.

## 3.3 What digitization should have meant

The digital era offers the opportunity to rethink clinical documentation
entirely. Digital records can be dynamic, updating as the patient's condition
evolves. They can be collaborative, allowing the whole team to work in one
place, in real time, each contribution attributed automatically. Information can
be searchable, sortable, reorganizable by context — rather than buried in a
static, linear document. Individual facts can be edited in place, with a full
version history preserving exactly who changed what and when, so that
correcting an error no longer requires publishing a new document and hoping
every reader finds it.

Each of these capabilities directly negates one of paper's constraints. Together
they dissolve the technical rationale for the note as we know it. What remains
holding the note in place is not technology but institutions: the regulations,
standards, billing practices, and professional habits that were themselves built
in the paper era and still operate on paper assumptions. Those are the subject
of the next chapter — because before we can propose alternatives, we should
examine whether the note concept was ever seriously questioned by the bodies
that had the standing to question it.

Spoiler: it wasn't.
