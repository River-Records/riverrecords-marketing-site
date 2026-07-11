# Chapter 8 — Copy-Paste Is a Symptom, Not a Sin

Anyone who has worked in an EHR has seen it: the wall of text pasted from a
prior note. Maybe you've done it yourself — carrying forward last week's plan,
an old problem summary, a phrase that captured a patient's history well.

We are routinely told this behavior is *the* problem with clinical
documentation. It's dangerous, we're told. Lazy. It bloats the chart.
Institutions run campaigns against it; compliance offices audit for it; every
few years someone proposes banning the paste function outright.

This chapter argues the opposite: copy-paste is not the disease. It is the most
visible symptom of the disease — and, examined honestly, it is a *diagnostic
gift*, because the pattern of duplication tells us exactly what clinicians need
that their systems refuse to give them.

## 8.1 Measuring the flood

Complaints about note bloat are as old as the EHR, but until recently nobody
had measured duplication at scale. In 2022 our group published a
cross-sectional analysis in *JAMA Network Open* examining every inpatient and
outpatient note written in the University of Pennsylvania Health System from
2015 through 2020: 104 million notes, for nearly two million patients,
comprising about 33 billion words. Using a sliding-window approach (matching
spans of ten adjacent word tokens), we identified text duplicated exactly from
earlier notes in the same patient's record.

The findings:

- **50.1% of all text in the record was duplicated** from prior text written
  about the same patient — 16.5 billion words of copies.
- **The problem is accelerating.** The duplication fraction rose year over
  year, from 33.0% for notes written in 2015 to 54.2% for notes written in
  2020.
- **Duplication crosses authorship.** 54.1% of duplicated text came from the
  same author copying themselves; 45.9% was duplicated from a *different*
  author.
- **Bigger records are worse.** Records with more notes had proportionally
  more duplicate text, approaching 60%.
- **Duplication and scatter trade off.** Note types with high information
  scatter tended to have low duplication and vice versa — direct empirical
  confirmation of the "bundle of updates versus state of the patient" dilemma
  from Chapter 7: under the note paradigm, clinicians can escape one hazard
  only by embracing the other.

Sit with the headline number for a moment. Half of everything written in the
medical record of a major academic health system is a copy of something already
written. Half the reading a clinician does is re-reading. And duplicate text
casts doubt on the veracity of *all* text: when any given sentence may be a
stale copy, every sentence must be treated as possibly stale, and verifying
any fact means excavating for its original. The record's most basic function —
being believed — is compromised.

One more implication from the study deserves emphasis: because duplication is
a systemic hazard, *simple solutions aimed at the behavior will backfire*.
Banning copy-paste without changing the underlying paradigm doesn't eliminate
the need that drives it — it just forces clinicians to satisfy that need
through paraphrase (duplication that's harder to detect) or to stop carrying
information forward at all (worsening scatter and underload). The note
paradigm itself is the cause that requires examination.

## 8.2 What the copying is *for*

Why do clinicians copy? Ask the compliance office and you'll hear about
laziness and billing. Ask the clinicians — or study the actual pattern of what
gets copied — and a different answer emerges.

Clinicians copy because **the problems persist and the documentation doesn't**.
In most EHRs, once a note is signed it disappears into the archive, and the
next note starts from scratch. But a patient with CKD stage 3 doesn't reset to
stage 0 next week. The child with obesity doesn't shed years of counseling
history because it's a new visit. Clinical work is longitudinal; the
documentation is episodic. Copy-paste is the workaround that bridges the gap —
a crude, rational attempt to make important clinical information *persist*
across visits. Clinicians aren't trying to game anything. They are trying to
preserve context, using the only tool the note paradigm offers: making another
copy.

Seen this way, the copying is a signal, and its message is precise. Every
pasted med list says: *there is no living medication summary I trust.* Every
copied-forward assessment says: *there is no problem thread that carries my
reasoning to the next visit.* Every re-pasted radiology impression says:
*there is no way to view that result alongside my thinking without physically
embedding it here.* Repetition becomes retention. Redundancy becomes safety.
The behavior maps, one-to-one, onto the missing capabilities of the system.

This reframing matters because it redirects the fix. If copy-paste were a
discipline problem, the solution would be education and audits — which have
been tried for twenty years, during which duplication *increased by two-thirds*.
If copy-paste is an infrastructure problem — clinicians manually simulating
persistence in a system without it — then the solution is to provide
persistence: linked information that remains accessible without
redocumentation, problem threads that carry context forward, a single source
of truth with multiple views. Design for persistence and the incentive to
duplicate evaporates.

## 8.3 Chart lore and lost diagnoses

Chapter 6 introduced chart lore — erroneous information that persists because
it keeps being copied — and its inverse, the lost diagnosis. The duplication
data shows the mechanism at industrial scale. Copies beget copies: text that
has been carried forward once is likelier to be carried forward again, because
it now appears in more recent, more visible notes. An error that enters the
copy-stream is not merely preserved; it *compounds*, appearing in more places
with each generation, gaining credibility from repetition — data assumed true
simply because it has been there so long. Meanwhile, true information that
fails to enter the copy-stream ages out of view, however important it is. The
chart becomes a popularity contest among facts, adjudicated by paste
frequency rather than accuracy.

Neither failure is possible in a system where a diagnosis is a single, living
object — asserted once, revised in place, retired explicitly, with full
history. Both are inevitable in a system of unlinked textual copies.

It's worth noting what happened when the healthcare system began depending on
persistent, accurate diagnoses for payment — with the rise of value-based care
and risk-adjusted coding. The failures became commercially visible, and an
entire industry of external tools sprang up to "resurface" lost diagnoses and
flag suspected ones: companies whose product is, in essence, archaeology
services for a record that buries its own contents. A well-structured chart
would make that industry unnecessary — and its benefits are indifferent to
payment model. Good information management transcends billing systems.

## 8.4 The tragedy of the chart commons

There is one more lens that makes the systemic nature of the problem obvious.

The chart is a shared resource — a commons. Every clinician writes into it, and
every clinician depends on being able to read out of it. But the note paradigm
gives each contributor a private incentive structure: your note must stand
alone (for billing, for liability, for your own future reference), so you pad
it with copies of whatever you need; your time is scarce, so you dump
information where it's easiest to put rather than where it's easiest to find.
Each individual note-writer optimizes locally, and the shared record degrades
globally. Everyone dumps; nobody curates. The chart becomes a digital landfill,
and certain clinicians — primary care above all — become its unwilling garbage
collectors, sifting through everyone else's deposits to reconstruct a coherent
patient.

Every commons problem has the same solution shape: change the incentives, or
change the structure so that individual and collective interest align. Moral
exhortation — "document better!" — fails for the same reason it fails in every
other commons. What works is stewardship made cheap: systems where maintaining
clean, organized, current records is *easier* than degrading them; where the
well-placed fact serves the writer as much as the reader; where there is one
obvious place for each piece of information and putting it there takes fewer
keystrokes than pasting it everywhere. When the right behavior is also the
lazy behavior, commons problems solve themselves.

That is a structural bar no note-based system clears — and a preview of the
design brief for Part III. But before we build, we owe an accounting of what
all this costs the people inside it.
