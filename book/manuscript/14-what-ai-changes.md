# Chapter 13 — What AI Changes, and What It Doesn't

This book has so far been almost silent about artificial intelligence, and the
silence was deliberate. The argument — that the note is the wrong paradigm and
the problem-organized workspace the right one — was formulated before large
language models existed, published in the peer-reviewed literature before
ChatGPT, and stands or falls without any appeal to AI. But we are writing in
the middle of the fastest technology adoption clinical medicine has ever seen:
ambient AI scribes are in exam rooms everywhere, and every EHR vendor is
racing to add generative features. So the question must be faced squarely.
Does AI solve the problems in this book? Does it worsen them? What is it
actually for?

Our answer, compressed: **AI is the first technology capable of building the
structure this book calls for at zero marginal cost to the clinician — and the
industry is mostly using it to produce unstructured text faster.** Whether AI
helps or harms depends entirely on which of those paths wins.

## 13.1 The faster printing press

Begin with a caution that predates this technology by decades: not every
problem needs the newest tool, and lasting innovation in medicine has humbled
many hyped technologies before this one. Clinicians are rightly skeptical; the
question is never "is the technology impressive?" but "is this the right nail
for the hammer?"

Most ambient scribes today are building a faster printing press. They make it
quicker to produce notes — and that feels genuinely good in the moment: less
typing, fewer clicks, evenings partially reclaimed. We do not dismiss it. The
note, as a work product standing between the visit and the bill, is a real
burden, and the industry attacking it is doing something worthwhile.

But recall the library. The EHR is a library organized by media type and
acquisition date; the chart's disease is disorganization, not insufficient
volume. A faster printing press does nothing for a broken library — it floods
it. Faster note-writing is also faster *long*-note-writing: without structural
reform, generative scribes accelerate the production of exactly the
copy-forwarded, context-poor material that Part II diagnosed. The short-term
studies show clinicians feeling relief, and we believe them — writing burden
falls immediately. The question nobody's short-term study measures is what the
chart looks like two years in, when the review burden — already the majority
of documentation time — has compounded. The real hidden driver of burnout is
reviewing, not writing. Speed up writing while leaving review broken and you
have treated the smaller half of the problem by enlarging the larger half.

There's a revealing pattern in products built this way: notes as first-class
citizens on every screen, patients bolted on late. Some scribes now feed their
own generated notes through *another* model to produce summaries — AI
summarizing AI, the clinician's edits and judgment quietly washed out between
passes. This is what building around the wrong unit looks like when the
technology is new but the paradigm is old. The trap of the first digitization
— reproducing the paper chart in software — has a successor trap: reproducing
the note-centric EHR with a voice interface bolted on top.

**The note is solved, or soon will be. The chart is the real work.**

## 13.2 The god-like librarian

A second tempting shortcut: skip fixing the library and hire an omniscient
librarian. Leave the chart as chaotic as it is, and let a model read all of it
on demand — summarize the record, answer questions, find the thing.

In theory this works. In practice it is fragile and wasteful — and it's worth
being precise about why, because "just ask the AI" is rapidly becoming the
industry's default answer to information chaos.

Ask a model to summarize a two-hundred-page chart and three things happen,
none of them good:

**You lose texture.** "BP 148/92, likely white coat given 128/82 at home"
becomes "hypertension, suspected white coat." Technically correct, clinically
impoverished. The way a clinician words an assessment carries meaning that
compression discards — six months later, the summary can't tell you what the
last doctor was actually thinking. The original could.

**You lose certainty.** Every model summary is an interpretation. When a human
writes and signs an assessment, you know what they meant; when a model
rewrites it, you know what the model *thought* they meant. In clinical work,
the difference between "the patient denied chest pain" and "the patient
reported no significant cardiac symptoms" is the difference between a clean
review of systems and a subtle liability.

**You lose signal.** The chart's most decision-relevant contents are small and
specific: the medication stopped four months ago for a side effect, the test
ordered and never resulted, the referral that never came back. These facts do
not survive summarization — they get rolled into aggregate statements that
hide exactly the thing you needed to see. Summarization is compression, and
compression works when most of the detail is noise. In a clinical chart, the
details are the signal.

Beyond the three losses, the librarian approach is architecturally backwards:
it asks a model to reconstruct a coherent picture *every time anyone asks*,
at inference cost, with hallucination risk, against an ever-growing pile —
rather than building the coherent picture *once*, at the point of creation,
and keeping it current. You shouldn't need divine intervention to find the
last A1c or the reason a medication was stopped. The right fix is to shelve
the books properly in the first place.

## 13.3 What the model is actually for

So where does AI genuinely change the game? Precisely at the bottleneck that
kept the problem-oriented record from working for fifty years: **the cost of
structuring.**

Weed's vision failed in practice not because clinicians disagreed with it but
because maintaining problem-organized documentation by hand is expensive — a
tax on every encounter, paid by the busiest person in the room. The
noteless-EMR feasibility study of Chapter 10 demonstrated the paradigm but
still asked users to place information into its structure. This is the labor
that language models eliminate. Reading across a large body of clinical text
and surfacing its structure — which statements concern which problem, what
changed, what was tried, what came of it — is exactly the pattern-recognition
task modern models are genuinely good at. Not because they think like
clinicians — they don't — but because they can read everything and organize
what they read.

That capability, pointed at the right target, yields a different product
category from the faster scribe:

- **Structure at the point of creation.** The visit conversation is captured
  ambiently — and lands *pre-organized*: each statement filed to its problem
  thread, visit-specific context separated from what carries forward
  (Chapter 11's distinction, automated). The clinician edits and attests;
  nothing is filed twice.
- **The delta, not the repetition.** Because the record is structured, an
  update can be a true micro-update — what changed, attached to the thread it
  changes — and a reviewer can see exactly what's new since they last looked
  rather than re-reading engorged snapshots.
- **Tasks born from the plan.** The follow-up written in the assessment
  becomes a tracked commitment without a second entry, resurfacing when due —
  articulation work deleted, not delegated.
- **Normalized rendering.** With content structured, the review surface of
  Chapter 12 becomes a rendering problem the system can actually solve — every
  document in the reader's preferred shape, outside records included.
- **Summarization as a scoped tool.** And yes — summarize, when summary is the
  right tool for a bounded job: "tell me the story of this one problem over
  this patient's whole course" is a task compression serves well, *provided*
  it complements the structured record underneath rather than replacing it.
  Summarization is a tool, not a default. The failure mode is generic
  compression of everything; the success mode is a specific answer to a
  specific question, with the signal-bearing details intact beneath it.

Notice the common thread: in every case the model *builds or serves
structure*; the structure — visible, editable, attributable, persistent — is
what the clinician actually uses. Judgment stays where it belongs. The model's
output doesn't replace the physician's reading of the patient; it compresses
the time between opening the chart and having enough context to exercise
judgment well.

## 13.4 The test

Every AI documentation product can be put to a one-question test: **does it
reduce the chaos in the record, or accelerate its production?**

Faster SOAP blobs fail the test. AI-summarizing-AI fails it twice.
Structure-at-creation passes. Task extraction passes. Normalized rendering
passes. Scoped, problem-level recaps pass — if the structure beneath them is
real.

The reason for optimism, despite the industry's current trajectory, is that
the right path is now also the cheap path. For the first time since Weed, the
best-organized record and the least clinician labor point in the same
direction. Generic tools generate the old artifacts faster; specific tools —
built with a theory of what clinicians actually do — can finally build the
record medicine has needed all along. "Summarize the chart" is the AI-native
version of "put all the data in the record": a non-answer to a non-question.
The useful moves are the specific ones.

What stands between here and there is not capability but integration — the
walls of the systems that hold the data today. That terrain is the subject of
the next chapter.
