# Chapter 4 — The Standards That Froze Us

We are certainly not the first to suggest that paradigms from the paper era were
wholesale adopted into the EHR age, at great cost in documentation burden and
clinician burnout. Hopefully the general argument so far is convincing. But you
don't have to take our word for it. We can examine the dominant conceptual
frameworks in play at the moment of transition to digital records, and see for
ourselves whether the note concept received significant scrutiny — or passed
through unquestioned.

A note on intent: we are not here to criticize decisions made in a completely
different technological and medical culture during a period of massive
transition. We only want to establish whether the idea of the note was ever
thoroughly examined by the institutions best positioned to examine it. This
chapter dives into the fine details of documentation standards and how they have
evolved since the inception of the EHR. If you share our soft spot for data
standards, read on; if not, skim to the summary at the end and proceed to
Chapter 5 with our blessing.

## 4.1 Meaningful Use: notes as an afterthought

Perhaps the most important place to look is the Meaningful Use (MU) program,
which tied specific EHR adoption measures to Medicare reimbursement in an effort
to accelerate the digital transition. MU was divided into three stages, each
containing requirements that organizations had to meet through EHR usage.

Exactly one Meaningful Use criterion relates to notes: the requirement "to
record electronic notes in patient records" — an optional "menu" objective in MU
Stage 2. Meanwhile, the majority of the first-stage MU objectives focused on
recording highly specific structured data elements: orders, allergies,
medications, demographics, vital signs, laboratory results, and problems.

Two things follow from this. First, undifferentiated chunks of free text —
notes — were a distant second priority during the era that defined what an EHR
had to be. The note was neither questioned nor championed; it was simply
assumed, carried along as the default container for everything the structured
elements didn't cover. Second — and this is worth pausing on — the
somewhat-arbitrary division we now take for granted between "structured" data
(entered outside the note) and "unstructured" data (entered inside it,
templated or not) may be largely a *consequence of Meaningful Use requirements*
rather than any clinical or informatic logic. The regulation drew a line
through the patient's information, and the software industry built walls along
the line.

## 4.2 HL7 and C-CDA: flexible blocks, frozen templates

Initiatives to develop international standards for health information systems
represent another venue where dominant documentation paradigms might have been
critically examined. Such initiatives — including Health Level 7 (HL7) and Fast
Healthcare Interoperability Resources (FHIR) — aim to promote interoperability
by establishing agreed-upon standards for healthcare data transfer: a laudable
goal in a world of fragmented systems. These standards exert significant
influence on the design of present and future EHRs — not just on data transfer,
but upstream on data organization and even user input workflows, particularly
when interoperability metrics are tied to payment incentives.

HL7's Consolidated Clinical Document Architecture (C-CDA) provides a set of
flexible building blocks and document templates for common clinical
communication scenarios: continuity-of-care documents, procedure notes,
discharge summaries. The building blocks themselves are flexible and can
construct arbitrary documents. But the majority of the *templates* conform to
the dominant paradigms of the atomic note — progress notes, discharge
summaries, H&Ps. (Not all C-CDA documents function as notes in the
fact–note–chart hierarchy; the Continuity of Care Document acts more like a
chart, summarizing the whole course of care up to a transfer.) In short, the
standard concerns itself with communicating free-text documents from one system
to another, and is technically flexible enough to permit different organizations
of information — but the templates it provides conform to, and therefore
*enforce*, a particular mindset about how clinical data should be sliced,
stored, displayed, and transmitted.

## 4.3 FHIR: the note, standardized but unexamined

The majority of FHIR guidance focuses on transmitting structured data, but there
is a small informative section on "clinical notes." The US Core implementation
guide defines a minimum set of note types that a compliant system must support:
three diagnostic report types (cardiology, pathology, radiology) and five
general-purpose clinical note types (history & physical, progress note,
discharge summary, consult note, procedure note). Beyond these sits a much more
comprehensive catalog of "document reference types" adapted from the LOINC
ontology, which breaks notes into hyper-specific categories — "Deprecated Speech
therapy Initial assessment note at First encounter" is a real entry — that
compliant systems are encouraged to support in transmission.

What you will not find, anywhere in this guidance, is a discussion of
alternative types of fact bundling — any consideration of whether "progress
notes" in particular, or notes in general, are the right way to "communicate
the current status of a patient." We understand this may fall outside FHIR's
mission; presumably the standard must facilitate the data types already in
widespread use in order to secure vendor buy-in. But it does seem a missed
opportunity. If these large multinational bodies — composed of exactly the
expert stakeholders one would convene to define the future structure of medical
documents — are not positioned to ask whether the note is the right structure,
then who exactly is?

## 4.4 Paradigms all the way down

We will examine the usefulness of specific note types elsewhere; suffice it to
say that some of them no longer make sense as fact bundles in the digital age,
because by their very nature they incentivize the creation of duplicated,
out-of-date, and erroneous information. What matters most to recognize here is
the extent to which standards shape future systems — and thereby shape our own
cognitive models of what documentation *can be*. Standards are how a temporary
consensus becomes a permanent assumption.

The mechanism is worth spelling out. If every EHR ships a template called
"progress note," every insurance company requires a daily "progress note" for
billing, and every clinician is trained to produce a "progress note" each day,
then it becomes nearly impossible for anyone — vendor, payer, or physician — to
imagine, let alone enact, a different paradigm, no matter how sensible. Each
institution's requirement is justified by the others' existence. The note is
load-bearing not because anyone examined it and found it strong, but because
everything was stacked on top of it before anyone thought to look.

And as far as we can tell — having looked — at no point during the transition
from paper records to digital records was the concept of the note in general,
or of specific note types like the progress note, ever seriously questioned,
nor were alternatives seriously considered.

## 4.5 The counterarguments, and why they fail

Two objections to moving beyond the note come up so reliably that they deserve
answers here, before we go further.

**"The note has to be the atomic unit for insurance and medicolegal reasons."**
The claim is that we need note-level bundles to assign specific clinicians
responsibility for specific actions. This argument lacks imagination. Many
software systems we use daily keep meticulous, effectively infallible track of
which users made which edits to which documents, down to the individual word.
Most EHRs already track which clinicians changed which notes. Exactly the same
granular responsibility-tracking is possible in a non-note paradigm: we can
build systems that trace any piece of text to a particular user, even if that
text has since been edited or deleted by another, and good interface design can
make the provenance of every fact instantly visible. Responsibility assignment
is a solved problem in software. It is not a reason to prefer the atomic note —
either paradigm supports it, and the fact-level version is frankly stronger.

**"Attestation requires documentation."** As established in Chapter 2, stating
agreement with, and taking responsibility for, a set of facts does not require
re-writing those facts. Attestation-based mechanisms already exist in most EHRs
for medication reconciliation and problem-list review — a single action that
says "I reviewed this; nothing has changed." The concept simply has never been
extended to unstructured clinical information, because the note's atomicity
makes it all-or-nothing: you'd have to agree with 100% of a colleague's note to
attest to it as a unit. Break the atomicity, and attestation without
redocumentation becomes available everywhere — with every attestation tracked,
and responsibility assigned at least as precisely as today.

There have, in fairness, been limited pushes against the note's monopoly. From
the beginning, EHRs have made *some* information individually editable at the
fact level — demographics, orders, lab results, vital signs — living in
non-note interfaces that require no bundling. More EHRs are adopting
collaborative problem-list interfaces, editable at the level of the individual
problem, with change tracking. These systems hold real promise. But notice the
pattern: to actually cut into the note's monopoly, they would have to *replace*
the need to document the same findings inside a note. In current workflows they
don't — we document problems, medications, and results both inside and outside
the note, which is to say the "structured data" innovation gave us a second
documentation burden rather than a first solution. And even these inroads leave
the vast majority of important unstructured information — symptoms, exam
findings, diagnostic and therapeutic reasoning, the patient's history in free
text — completely trapped inside the atomic note.

## 4.6 Summary

The historical record shows a clear pattern. The technical constraints that
created the note dissolved with digitization (Chapter 3), but the note survived
— codified by Meaningful Use as an unexamined menu item, templated into
permanence by C-CDA, given a standardized taxonomy by FHIR, demanded daily by
payers, and drilled into every trainee. The standard objections to alternatives
— responsibility and attestation — dissolve on inspection. What remains is a
paradigm sustained by mutual institutional reference and habit.

That would be merely an interesting historical observation if the note were
harmless. The next part of this book is about why it isn't. To get there, we
need one more piece of equipment: a precise vocabulary for how documentation
systems fail. But first — a brief word of remembrance for the deceased.
