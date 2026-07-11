---
title: "Introduction: Drowning"
chapterLabel: "Chapter 1"
order: 1
description: "Clinicians spend over half the workday in the EHR. The problem isn't the software — it's the note paradigm underneath it. The book's argument, chapter by chapter."
seoTitle: "Why Clinical Documentation Is Broken — Introduction"
seoDescription: "Clinicians spend over half the workday in the EHR. The problem isn't the software — it's the note paradigm underneath it. The book's argument, chapter by chapter."
relatedPosts:
  - slug: "drowning-in-documentation"
    title: "Drowning in Documentation: The Cognitive Overload of Clinical Notes"
  - slug: "why-medical-documentation-sucks-fix-it"
    title: "Documentation Sucks: How Did We Get Here?!"
draft: false
---

It's 7:40 on a Tuesday night and you're still in the chart.

Ask yourself an uncomfortable question: in the last twenty minutes, what did you
actually *decide*?

Probably not much. You reconciled a med list against a discharge summary written
by someone who didn't know the patient. You scrolled a consult note looking for
the one line that mattered. You clicked into a task module to log a follow-up
you'd already written in your assessment. You tried to remember whether you'd
sent the referral or only meant to.

None of that is medicine. All of it is required before medicine can happen. And
if you are like most clinicians, it consumes the majority of your working life.

As clinicians, we spend an enormous share of our time with the electronic health
record, both getting data in — documenting information about our patients — and
getting data out — searching through the chart to find information. The
documented information serves routine clinical, medicolegal, and billing
purposes, along with research, quality improvement, and population health. Each
of these purposes, to varying degrees, influences what, when, and how we
document.

The specific ways we document and retrieve information shape our day-to-day
efficiency, our satisfaction with our work, and our ability to provide
high-quality care. Poorly designed systems lead to the proliferation of
out-of-date and incorrect information, more time spent searching the chart,
medical error, and clinician burnout. When Sinsky and colleagues shadowed
ambulatory physicians, they found that for every hour of direct clinical face
time, physicians spent nearly two additional hours on EHR and desk work. When
Arndt and colleagues instrumented the EHR event logs of 142 family physicians,
they found clinicians spent roughly 5.9 hours of an 11.4-hour workday inside the
EHR — with clerical and administrative work accounting for about 44% of that
time and inbox management another 24%. More than half the workday, spent in the
machine. Our own research found that half — literally half — of all the words in
a large academic health system's clinical notes were exact duplicates of text
written earlier in the same patient's record.

Numbers like these get cited constantly, usually in service of an argument about
staffing, or reimbursement, or software vendors. This book makes a different
argument.

## The question nobody asks

You probably already have an opinion about the specific EHR software used at
your institution — the navigation, the decision support, the search. You might
have a strong opinion about electronic health records as a whole. But do you
have an opinion about the underlying paradigms of information organization and
storage?

For instance: what do you think about the idea of the *note* as the primary mode
of documentation? Is the note the best way to bundle related clinical
information together? Could the idea of the note itself be outdated — a relic of
the era of paper charts that contributes to so many clinicians' frustrations
with the EHR? What other paradigms are possible, and how could they improve
patient care and clinician satisfaction with the records of the future?

At first these may seem like strange questions. How else could we document our
patient encounters? What would an alternative structure even look like? To be
clear, we are not arguing that clinical documentation should be abandoned — only
that we shouldn't limit ourselves to the idea of the single-user, static,
indivisible note. We will argue that a set of "notes," as traditionally
conceived, is not the most effective way to structure clinical documentation; in
fact, it is a significant contributor to the problems that plague the EHR. Even
if there remain use cases where the note is the appropriate concept in our
design toolbox, there are many cases where alternative paradigms have decisive
advantages.

This claim tends to provoke one of two reactions. Clinicians who have spent
years watching the same lab value get retyped into note after note tend to nod.
Everyone else asks the reasonable question: if the note is so broken, why is it
everywhere? The answer — which takes the first part of this book to develop — is
that the note is everywhere for historical reasons, not functional ones. It was
the right technology for paper. It was carried into the digital era wholesale,
without re-examination, and then locked in place by regulation, billing
practice, interoperability standards, and habit. The note is not a law of
nature. It is a design decision that nobody remembers making.

## The plan of this book

The argument runs in three parts.

**Part I dissects the note.** Chapter 2 asks what a note actually *is* — and
answers that it is a bundle of clinical facts grouped along three axes at once:
by time, by clinical thread, and by responsibility. Understanding these three
bundling functions precisely is what lets us evaluate the note against
alternatives, rather than simply venting at it. Chapter 3 traces the note's
origins to the physical constraints of paper — single-reader access, atomicity,
unlinked copies, no version history — and shows how those constraints were
digitized rather than removed. Chapter 4 examines the standards era: Meaningful
Use, HL7's C-CDA, FHIR — and finds that at no point during the transition from
paper to digital was the note concept seriously questioned. Chapter 5 turns to
the templates — SOAP and its descendants — that govern what goes *inside* the
note, and the peculiar dangers of notes that look perfect.

**Part II names the damage.** Chapter 6 introduces the framework of *information
chaos* — Beasley and colleagues' five documentation pathologies: overload,
underload, scatter, conflict, and erroneous information — which gives us a
precise vocabulary for the difference between a well-organized chart and a
harmful one. Chapter 7 is the analytic core of the book: seven specific
mechanisms by which the note paradigm directly produces information chaos.
Chapter 8 re-examines the most-blamed behavior in documentation — copy-paste —
and argues from our duplication research that it is a rational adaptation to a
system that forgets, not a moral failing of clinicians. Chapter 9 tallies the
human cost: the articulation work, the reconstruction tax, the moral injury of
spending your evenings as a human indexing service.

**Part III builds the alternative.** Chapter 10 describes the chart as a single,
dynamically updating, fully collaborative workspace — and reports the
feasibility study in which we actually built one. Chapter 11 argues that the
medical problem, not the note, is the natural unit of clinical meaning, and
works through what should carry forward across visits and what should stay
behind. Chapter 12 resolves the apparent conflict between consistency and
clinician autonomy: normalize the artifact, personalize the projection.
Chapter 13 takes up artificial intelligence — why faster note generation
deepens the underlying problem, and where AI genuinely changes what is possible.
Chapter 14 is the honest chapter about the terrain between here and there: what
cannot ship today, why, and the pragmatic bridge worth building in the
meantime. Chapter 15 concludes.

## Who this book is for

We wrote this book physician-to-physician, but not only for physicians. If you
are a clinician, we hope to give you a vocabulary for problems you have felt for
years but perhaps never seen named — and to convince you that they are
tractable, which is a different thing from easy. If you build health software,
we hope to persuade you that the most valuable thing you can do is not to
generate the old artifacts faster but to question the artifacts themselves. If
you regulate, purchase, or administer these systems, we hope to show you where
the leverage actually is: not in the interface, but in the paradigm underneath
it.

It may seem strange to devote a whole book to clinical documentation, which can
feel so ancillary to the reason any of us joined medicine — taking care of
patients. But that is precisely the point. The time we spend fighting the record
is taken directly from patients, from learning, from research, and from our
lives outside work. Documentation is not a side issue. For most clinicians it is
the single largest consumer of the working day, and it is a leading contributor
to the epidemic of burnout — or, more precisely, moral injury — hollowing out
the profession.

Most physicians we know aren't asking to work less. They're asking for their
work to be the work. That is what this book is about.
