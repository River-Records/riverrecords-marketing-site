# Chapter 14 — The Bridge, Not the Destination

A book like this owes its readers an honest chapter about the terrain. It is
one thing to argue that the record should be a problem-organized, persistent,
collaborative workspace — the case is made, and we stand by it. It is another
to pretend that vision can ship, in full, into the healthcare system as it
exists this year. It can't. This chapter explains exactly why, examines the
unsatisfying ways of waiting, and describes the pragmatic bridge that
clinicians can walk across in the meantime.

## 14.1 Why the full vision can't ship yet

The persistence layer described in Part III depends on software being able to
write structured information back into the system of record — to push, update,
and resolve problems automatically. Most EHRs simply do not permit that depth
of integration. And almost none allow automated, problem-based charting
through FHIR — the very standard that was supposed to make this kind of
interoperability possible. (Recall Chapter 4: FHIR standardizes the
*transmission* of the existing note types; it was never asked to enable a
different paradigm.)

Where some version of write-back *is* technically possible, it usually
arrives with a catch that quietly kills it: every piece of data must be
validated by a human at the moment it crosses the EHR's threshold. So the
clinician validates the same information twice — once in the outside system
that generated the structure, and again inside the EHR that has to accept it.
Double review for the same fact. For essentially every clinician, that is
untenable: it is slower than the broken status quo, and the whole point was to
make care simpler to see, not harder to enter.

## 14.2 The two waiting games

That leaves two ways to wait, and neither is satisfying.

**Wait for the incumbents.** The established EHR vendors could open deep,
problem-level integration — but they are not especially incentivized to.
"We made it easier for an outside tool to write to our chart" is not a roadmap
item most are racing toward, and retrofitting decades-old, click-laden
interfaces — embedding new paradigms meaningfully inside them — is very hard
even with the will. The pattern across the industry is telling: a
patient-shaped object is emerging even in newer tools, but late, and bolted
onto architectures still organized around the note. Retrofits inherit their
foundations.

**Wait for the full replacement.** Entirely new systems that solve persistence
*and* the complete end-to-end workflow — billing, orders, results, scheduling,
the whole stack — are the right long-term answer, and we believe they are
coming; the next generation of clinical systems will likely be built
AI-native, voice-heavy, and (one hopes) better organized. They will most
plausibly be adopted first in smaller practices — the settings where the
person buying the software sits close to, or *is*, the clinician using it,
where the gap between user need and product design is smallest and better
design is rewarded fastest. But that road is long, and clinicians need help
before it is paved.

## 14.3 The pragmatic third option

So here is the less elegant thing that can be done today. Keep pushing
unstructured documentation into the EHR, where it satisfies the medicolegal
and billing record. And maintain a well-structured, genuinely usable copy
*outside* the EHR — organized around problems and topics, the way the chart
should be.

We won't pretend this is free, and the costs should be named in the very
vocabulary this book has used throughout. It worsens information scatter: now
there are two places the truth can live. It introduces a risk of drift between
the copies that doesn't exist in a single system. Those are real costs, and
anyone who tells you otherwise is selling something.

But look at what you get in return. With structured, problem-organized
documentation outside the EHR, it becomes far easier to actually keep track of
what is going on with a patient. The busywork clinicians do by hand today —
re-collating, re-summarizing, hand-tracking follow-ups — can be automated
against the structured copy. And it becomes possible to build the surfaces
this book has argued for: a pre-visit view that answers the real questions
(what's active, what did I say last time, what's quietly falling off, what did
I leave open); problem threads that carry reasoning forward; tasks born from
plans. That is most of the day-to-day value of the persistence vision,
available now, without waiting for the ecosystem's permission.

The one-sentence justification: **a bridge is not the destination, but bridges
carry people across while the road is being built.** The structured copy
outside the EHR is a workaround — a better one than copy-paste, aimed at the
same need (persistence) that copy-paste has been crudely serving for twenty
years. The destination is still a single system in which documentation,
structure, and the record are the same thing and nothing is entered twice. The
destination has not changed. We just have to be honest about the terrain
between here and there.

## 14.4 What to demand in the meantime

For the clinician or practice evaluating tools this year, the analysis of this
book compresses into a short list of questions worth asking of any vendor —
established or new:

1. **What persists?** After the note is signed, does any structure survive —
   problems, plans, tasks, trajectories — or does everything return to prose?
2. **What carries forward?** Does the system distinguish visit-specific from
   patient-specific information, or does it copy everything forward (or
   nothing)?
3. **Can you see the delta?** At the next visit, can you see what changed
   since last time without re-reading everything?
4. **Where does a follow-up live?** Does tracking a commitment require a
   second entry, or is it born from the documentation itself?
5. **Who else can work in it?** Is the record collaborative, with attributed
   contributions — or single-author documents all the way down?
6. **Does the AI reduce chaos or accelerate it?** (Chapter 13's test.) Faster
   unstructured notes fail. Structure at creation passes.

None of these questions requires waiting for anything. They are answerable in
a demo, and they sort the tools that are walking toward the destination from
the tools that are motorizing the status quo.

The last mistake left to avoid is the one medicine made at the first
digitization: mistaking a faithful copy of the old thing for progress. We have
one more chance at this transition — and this time, no excuse of novelty. We
know what paper did to our paradigms. We know what the note does to our
charts. We can see the destination. Let's not build a skeuomorph of the
filing cabinet again.
