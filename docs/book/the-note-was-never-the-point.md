# The Note Was Never the Point

### Why medical documentation is broken, and what has to come next

*A short book assembled from the River Records blog*

By Jacob Kantrowitz, MD, PhD
with the River Records team

---

## Preface

This is not a product manual. It is an argument.

Over the last few years, we have written dozens of essays trying to name a problem that most clinicians feel every day but rarely get to articulate: the medical record does not work the way medicine works. We have come at it from a dozen angles — the history of the paper chart, the research on duplicated text, the daily experience of chart review, the economics of burnout, the design of the software itself. This book collects those angles into a single line of reasoning.

The argument, in one breath, is this. The clinical note is a relic of the paper era. When medicine went digital, we did not rethink the record — we digitized the filing cabinet. Because the chart is organized by time, author, and data type instead of by medical problem, it scatters a patient's story across hundreds of documents and then quietly hands the job of reassembling that story to the one person who can least afford the time: the clinician. We call the result *burnout*, as though it were a personal failing of resilience. It is not. It is a structural failure of information design.

The good news is that the hardest-looking part of this problem — getting the note written faster — is largely solved. AI can produce a clean note from a conversation. That matters, and we are glad the industry attacked it. But getting the note done faster was never the hard problem. The hard problem is everything that happens *after* the note is signed: whether the record still makes sense to the next clinician, and the next, and the one practicing ten years from now.

This book is about that harder problem, and about what a record built for the way clinicians actually think would look like. It is organized in three movements: the diagnosis, a necessary detour, and the prescription. Wherever a chapter draws on a specific study or essay, we have kept the reasoning product-agnostic on purpose. The ideas should stand on their own.

— Jake

---

# Part One — The Diagnosis

## Chapter 1: The Relic

For roughly three thousand years, the medical note did an honest job. It was a static, single-author snapshot: one clinician, at one moment, recording what they saw and what they planned to do. On paper, that made sense. Paper is static. A note written in ink is locked the moment it dries. One person holds the chart at a time. The format matched the medium.

Then medicine went digital, and we made a decision so quietly that most people never registered it as a decision at all. We took the note — the static, single-author, locked-after-signing artifact of the paper era — and we moved it onto a screen without changing what it fundamentally was. We digitized the filing cabinet instead of rethinking it.

Look at almost any electronic health record deployed to date and you will see the paper chart staring back at you. A labs tab. A meds tab. A notes tab. A radiology tab. Folders and dividers, rendered in pixels. If you have computerized order entry — your medications, your allergies, your orders captured discretely — you have most of the tangible, safety-driving benefits of going electronic. Beyond that, the typical EHR is a system of tabs and folders that organizes information by its *format* rather than by its *meaning*. It is skeuomorphic: a digital imitation of a physical object, carrying the physical object's limitations into a medium that no longer has them.

This is why some practices are, remarkably, still on paper. They look at an EHR, weigh the pain against the benefit, and don't see enough to justify the switch. They are not simply behind the times. They have correctly noticed that much of what the EHR added was not clinical value but clerical labor.

The deeper cost is conceptual. Because we never revisited the note itself, we inherited all of its paper-era assumptions and then asked it to do work it was never built for. The single-author snapshot is now expected to support a dozen clinicians collaborating across settings. The locked, static document is now expected to represent a patient whose conditions evolve continuously over decades. A format designed to describe one visit is now the atomic unit of a lifetime of care.

It doesn't fit. And most of the dysfunction that follows — the bloat, the copy-forward, the endless scrolling, the sense that the software is working against you — traces back to this original, unexamined choice. We had a chance, at the moment of digitization, to ask what a record *should* be. We mostly declined to ask.

That is the starting point for everything in this book: the note is a relic, and we are still living inside it.

## Chapter 2: Information Chaos

Give the paper-era note a modern workload and it fails in specific, nameable ways. Researchers have a term for the composite failure — *information chaos* — and a useful breakdown of its parts: information overload, information underload, information scatter, information conflict, and erroneous information. Every clinician has met all five, usually before lunch.

*Overload* is the obvious one: too much data, too little time. You open the chart and there is simply more than any human can process in the minutes available. But overload is not really a time-management problem, and you cannot fix it by reading faster. It is a design problem. The system dumps everything in front of you, sorted by date, and leaves the sorting-for-relevance to you.

*Underload* is overload's quieter twin, and in some ways worse. Sometimes you open the chart and there is nothing there. The information you need was never captured, or was captured somewhere you can't find, and now you are making decisions half-blind. When the chart comes up empty, the entire burden shifts onto you — you feel alone in the care.

*Scatter* is the one that produces the peculiar experience of *I know I've seen this before.* The information exists. It is simply fragmented across a dozen disconnected places — this note, that lab flowsheet, a scanned fax, a specialist letter — so that in practice it might as well not exist. It falls to you to reassemble the story from scratch, every time.

*Conflict* is when two parts of the record disagree — the problem list says one thing, the last note says another, and there is no way to know which is current without doing detective work. *Erroneous information* is when something is simply wrong, and has been wrong for so long that everyone now treats it as true.

Underneath all five is a single mechanical cause, and it is not laziness or carelessness. It is duplication. In our 2022 study, *Prevalence and Sources of Duplicate Information in the Electronic Medical Record*, we found that just over half — 50.1% — of the text in a patient's record was duplicated from prior text written about the same patient. Half. And crucially, that duplication is not a moral failing. It is a survival strategy. In the absence of tools that reliably preserve context, clinicians copy forward what matters because copying is the only way to be sure it isn't lost. Repetition becomes retention. Redundancy becomes safety.

But duplicated text corrodes the record it is meant to protect. Once you know that half of what you are reading was pasted from somewhere else, you can no longer fully trust any of it. Was this exam actually performed today, or copied from a visit in March? Is this the current medication list or a fossil? Duplicate text casts doubt on the veracity of *all* the information in the chart. The workaround that keeps information from being lost simultaneously makes the surviving information harder to believe.

This is the engine underneath the burnout statistics. Not the typing. The chaos.

## Chapter 3: The Rational Workarounds

Once you see duplication as a survival strategy rather than a bad habit, a whole set of clinician behaviors that get scolded in compliance trainings start to look like what they actually are: intelligent responses to a broken system.

**Copy-paste** is the clearest case. It gets treated as laziness, or as a medico-legal hazard to be stamped out. But clinicians copy-paste for a reason: the system forgets. A condition is persistent; the note is ephemeral. If you want to be certain that the next person — or the next *you*, six months from now — knows this patient has heart failure, the safest move available is to carry that fact forward by hand. Copy-paste is a symptom. The real diagnosis is a system that forgets what matters.

**Note bloat** is the accumulated residue of all that carrying-forward. Notes grow longer not because clinicians have more to say but because nobody has time to re-summarize an entire patient at every visit, so the last note gets photocopied — electronically — and added to. The record swells, the signal-to-noise ratio collapses, and the genuinely new information from today's visit hides inside a wall of inherited text. The real cost of note bloat is not the wasted minutes. It is the erosion of clinical reasoning itself: when documentation turns into noise, thinking gets harder, and the patient's actual story gets smothered.

**Chart lore** is what happens when a copied-forward fact outlives its own truth. A diagnosis gets entered once, copied from note to note, and over the years becomes assumed-true simply because it has been there so long. Nobody re-examines it. It has tenure. Meanwhile a real diagnosis, made carefully by a good clinician, can vanish entirely — recorded in one note, in one visit, that no one later thinks to open. It is genuinely strange that a doctor's work, a diagnosis, could be lost outright, or worse, be wrong and persist unchallenged. The encounter-and-billing structure of the record makes both failures ordinary.

**Perfect-looking notes** are the most insidious workaround, because they look like the opposite of a problem. Templates and pre-filled content produce documents that check every box: complete review of systems, full physical exam, tidy assessment. A note can be voluminous, immaculate, and completely hollow — creating the illusion of thoughtful medicine while masking the absence of any real reasoning. Worse, it can assert things that did not happen: a full exam documented when only part of one was performed. Good documentation does not hide uncertainty; it reveals thoughtful, evolving reasoning. The perfect-looking note hides everything interesting about a clinician's actual thinking behind a facade of completeness.

Every one of these is rational. Every one is a person adapting themselves to software that will not adapt to them. Documentation, as it exists today, is a stack of workarounds. You cannot scold your way out of it. You have to change what the workarounds are compensating for.

## Chapter 4: The Reconstruction Tax

Here is the cost nobody bills for.

Every patient has a story — not in the sentimental sense, in the clinical sense. A sequence of problems, interventions, responses, and adjustments that together explain why they are in front of you today. That story exists somewhere in the chart. But the chart does not tell it. It *archives* it. The telling is left to the physician, who reconstructs continuity from fragments, visit after visit, patient after patient.

Before you can make a good decision about a patient you haven't seen in six months, you need context. What did we try for the blood pressure before landing on this regimen? Was the A1c drifting or holding? Did the cardiologist ever weigh in on the chest pain from the spring? All of it is in the chart. Retrieving it is another matter. The standard workflow is archaeology: opening prior notes in reverse chronological order, scanning for the relevant detail, holding it in working memory while the next patient waits. A thorough review of a complex chart can take five to ten minutes. For a physician seeing twenty patients a day, that time does not exist. So what happens instead is a partial reconstruction — good enough to proceed, but not the same as actually knowing.

We call this the *reconstruction tax*, and it is one of the most expensive, least-discussed inefficiencies in medicine. It does not show up in patient-satisfaction scores. It does not appear in quality metrics. It lives in the gap between the care a physician intended to deliver and the care that was possible in the time available.

The tax exists because the encounter model quietly made the physician into the *integration layer*. In the absence of a system that synthesizes clinical history, a human does it — so routinely that it has become invisible, just part of what it means to know your patients. But it is work. It consumes the exact attention and working memory that might otherwise go to the person in the room. And it is unreliable in a way we rarely admit: a physician who knows a patient well practices differently than a colleague covering for them, seeing the patient fresh. Neither is failing. They simply have different inputs. But the quality of care should not depend on who happens to remember what.

There is a moral dimension here too, and it is worth naming plainly. When the chart is a shared resource that everyone dumps into and no one is responsible for maintaining, it becomes a kind of commons — and, predictably, a tragedy of the commons. The record fills with clutter because clutter is free to add and expensive to clean. Primary care physicians, sitting downstream of everyone, end up as the system's garbage collectors: sifting other people's data dumps to find the few facts that matter. That is not what they trained for. It is a waste of the most expensive, most carefully educated attention in the building, and it is a reliable path to moral injury.

The reconstruction tax, the integration layer, the commons: three names for the same transfer. The system's structural work has been offloaded onto human beings, uncompensated and mostly unseen, and then the exhaustion that results has been renamed as their personal problem.

---

# Part Two — The Redirection

## Chapter 5: Faster Is the Wrong Goal

When a problem is painful enough, the first solution the market reaches for is usually *speed*. The note hurts, so let's make the note faster. It is an understandable instinct, and for the past few years it has defined the entire AI-scribe category. Listen to the conversation, generate the note, sign it, go home earlier. Real value. We are genuinely glad it exists.

But speed solves the wrong problem, and it is worth being precise about why.

Imagine the note-writing machine works perfectly — instant, accurate, effortless. What have you actually changed? You have made it faster to produce documents. And the core disease of the modern chart is not that documents are slow to produce. It is that there are too many of them, poorly organized, scattering the patient's story across an ever-growing pile. Faster note-writing is also faster *long-note*-writing. Point a printing press at a library that is already overflowing and disorganized, and you do not get a better library. You get a bigger mess, produced more efficiently.

The library is the right way to picture it. Every EHR is a library sorted by format and time rather than by topic or meaning — imagine walking into one where the books were shelved by their binding and their purchase date instead of their subject. You would spend all your time hunting and none of it reading. That is chart review. The burden falls on the clinician, the human middleware, who spends hours reassembling what the system scattered. A faster scribe adds more books to that library. It does nothing about the shelving.

There is a subtler failure lurking in the speed framing, too. The bottleneck in documentation was never words-per-minute. Ask any clinician where the time actually goes and it is not the typing — it is the *re-finding*. Re-locating information you already documented, re-reading a fax you already read, re-deriving context you already had. A fast SOAP note that leaves behind a digital haystack of snapshots has saved you thirty seconds of templating and cost you the ten minutes of excavation that the haystack will demand at every future visit. The reclaimed mental bandwidth from *not* having to reconstruct — that is what reduces burnout. Not the thirty seconds.

This is why the tempting AI move — "just summarize the whole chart for me" — is also a trap, and it deserves a moment. Summarization is compression, and compression works when most of the detail is noise. In a clinical chart, the details *are* the signal. The medication stopped four months ago for a side effect; the test ordered but never resulted; the specialist referral that never came back — these are exactly the small, specific facts that get rolled up and lost when you compress. Ask an AI to summarize everything and you lose texture, you lose certainty, and worst of all you lose the signal you were trying to find. "Summarize the chart" is the AI-native version of "let's just put all the data in the record." It is a non-answer to a non-question. Summarizing everything is what you ask for when you don't yet know how to ask for what you actually want.

So the redirection is this. The future of ambient AI in medicine is not speed. It is structure. The differentiator is no longer how fast you can write; it is how well the record is organized once you have. Faster is table stakes. Organized is the whole game.

---

# Part Three — The Prescription

## Chapter 6: Organized Like Clinicians Think

If the note is the wrong unit, what is the right one?

The problem. In medicine, we do not think in pages — we think in problems. When you prepare for a visit, you are not asking "what documents exist about this person, in date order?" You are asking "what is going on with their heart failure, their diabetes, their depression, and what has changed since I last looked?" The unit of clinical meaning is the medical problem, and it always has been. The record is simply organized around a different unit — the encounter — for reasons that have everything to do with billing and nothing to do with reasoning.

So flip it. Organize the record the way clinicians already think: by problem, not by date. Give each problem — "Heart Failure," "COPD," "Type 2 Diabetes" — its own thread that can be followed, updated, and reviewed in one place, regardless of when or where it was last addressed. Instead of a trail of disconnected snapshots, each problem becomes a single evolving line you can read start to finish. You are no longer writing to fill a container. You are maintaining a living, structured picture of the patient that grows over time.

This reframes what a note even is. The traditional note tries to do far too much at once: it is a legal record, a billing artifact, a communication handoff, a memory aid, and a working scratchpad, all bundled into one document and organized around none of those jobs well. Pull those jobs apart. The note becomes just one lens onto the record — one view among several — rather than the record itself. A chart is not a pile of notes. It never was. The note was never the point. The patient is.

Getting there requires answering a question the encounter model never had to ask: *what carries forward?* Not everything in a note belongs to the patient. Some of it belongs only to the visit — today's vitals, today's specific exam, the particular phrasing of today's plan. The design challenge is telling the two apart: visit-specific information that should be left behind, and patient-specific information that should persist. The visit is not the patient. Once you can separate them, a problem's documentation becomes a thread rather than a pile — each visit adds a micro-update to the relevant problem instead of re-documenting the whole patient from scratch. You update one thread without rewriting everything else. You see what changed at a glance instead of scrolling for it.

None of this is a demand that clinicians work differently. It is the opposite. Documentation tools should reflect the structure of clinical thinking, not impose a single structure on top of it. The whole point of organizing by problem is that it is already how the reasoning runs. We are not asking clinicians to think like the software. We are finally building software organized like clinicians think.

## Chapter 7: Information Persistence

Organizing by problem sets up the single most important idea in this book, the one everything else has been building toward: *information persistence.*

The principle is simple to state. You should not have to know to look for something in order for it to be available to you.

Consider a patient who once had a heart attack. That fact should not have to be hunted for. It should be apparent the moment anyone opens the chart — plainly, immediately, without a search, without knowing which note from which visit to dig into. Today it usually isn't. The place where that fact *should* live durably — the problem list, the medical history — sits divorced from the record, which is really just a pile of notes. And a note can be entirely accurate and still be functionally useless beyond the moment it was written, because using it requires someone to know it exists and go find it.

Think about the cardiologist who does excellent work for a hospitalized patient. If that cardiologist doesn't also structure the key information so it persists — so the *next* clinician simply sees it — they have done both the patient and that future clinician a quiet disservice. If the heart attack isn't persisted somewhere durable and obvious, outside the body of a single note, then for practical purposes it might as well not have happened. Someone would have to know to look for that particular note, from that particular day, about that particular problem. That is not a sustainable way to run a healthcare system, and it gets less sustainable every year, because medicine keeps getting more complex. People live longer. Guidelines multiply. As the picture grows more complicated, we need *simpler* ways to see what is going on with a patient — not more places to click.

Persistence is what makes structure beat search. The instinct in an AI-saturated moment is to leave the chart a mess and build an ever-smarter librarian to go re-find things in it on demand. But re-deriving a patient's context from scratch on every access is expensive, slower than it looks, and prone to error precisely where errors matter most. It is far better — safer, cheaper, more trustworthy — to organize the shelves once so the right information is simply present, than to send an increasingly clever assistant to re-hunt the same disorganized stacks a thousand times over. Structure done once outperforms search done endlessly.

This is also where summarization finds its proper, narrow home. Summarization is a tool, not a default. It is genuinely good at one kind of job: "tell me the story of *this one problem* across this patient's course" — a scoped request, against already-structured data, where the compression is intentional and the boundaries are clear. That is a real use, and a valuable one. It is the opposite of "summarize everything," which asks a machine to guess at relevance across an undifferentiated pile. Structure first; summarize deliberately, in bounded ways, on top of it.

Persistence changes the order of operations for the entire record. Instead of organizing around the note and bolting structure on afterward, organize around the patient's problems and let the note — and the bill — fall out as byproducts. The information a clinician already gathers in the ordinary course of care should persist on its own: structured, visible, durable across whoever is in the room next. No extra clicks. No second pass. No reliance on one person remembering to write the right note in the right place. Documentation stops being a rewrite and becomes a review. Capture once; use everywhere.

## Chapter 8: The Bridge and the Destination

It would be dishonest to end on pure vision, because the vision runs into a wall, and pretending otherwise is how people get sold things that don't work.

Here is the wall. The destination — a fully patient-organized, persistent record that every system reads from and writes to — cannot be delivered in one move today, because the incumbent EHRs largely do not permit structured write-back, and clinicians cannot simply abandon the systems their billing, orders, and legal record already live in. Anyone who tells you the whole thing can be swapped out cleanly tomorrow is selling something.

So the honest path is a bridge. You keep a clean, problem-organized, persistent copy of what matters *alongside* the existing EHR — carrying clinicians across the river while the real road is still being built on the far bank. A bridge is not the destination. But bridges carry people across in the meantime, and that is not a small thing. It has real costs — a degree of double-handling, a validation burden — and anyone honest names those costs out loud rather than hiding them. What makes the bridge worth building is that every crossing is useful *today*, even before the destination exists.

And the destination is worth being clear about, because it is what the bridge is for. It is a record built around the patient — around the problems and topics that are actually relevant to them, short-lived or lifelong — with a genuine persistence layer underneath, designed for the reality of medicine *now* rather than the reality of forty years ago when the first EMRs entered the space. Billing artifacts still get produced and still get set in stone, because they are part of the medico-legal record. But they fall out of the structured layer as byproducts, rather than being the thing the whole record is organized around.

What that unlocks goes beyond fixing what is broken. When the record knows a patient's problems and keeps them current, *continuity itself becomes a feature of the software* rather than a heroic act of memory. The chart can carry its own thread across visits, so every encounter continues a conversation instead of starting from a blank form. And information can finally start moving toward the clinician instead of waiting to be dug up — the relevant lab, the overdue follow-up, even the reading most relevant to the conditions you actually documented, brought to you rather than left for you to go pull. The reading should come to you. Continuity is care.

That is the whole arc. Stop being garbage collectors and start being stewards of clinical information. Stop making the note the point. The note was always just one lens; the patient was always the point. Getting the note done faster was the visible problem, and it is nearly behind us. The chart — the persistent, problem-organized, still-legible-in-ten-years record of a human being's health — is the real work.

The note is solved, or it soon will be. The chart is not. That is where we go next.

---

## Coda: What Node Does This Create?

If there is a single question to carry out of this book, it is a design question, and it is smaller and more practical than the grand argument that precedes it.

For any feature, any note, any piece of documentation, ask: *what persists, and to whom, and do they have to know to look for it?*

Most of what is wrong with the medical record fails that test. The brilliant assessment buried in a note no one reopens. The diagnosis that became chart lore. The fax read five times and retyped into four places. The story that lives only in one physician's memory and leaves when they do. In every case, information that should belong to the patient's durable record instead belongs to a document, a moment, or a person — and is therefore, functionally, at risk of being lost.

Build the other way. Make the record around the patient, organized by problem, persistent by default, so that the right information is simply present for the next clinician without anyone having to remember to surface it. Let the note and the bill be byproducts. Let continuity be a property of the system rather than an act of will.

None of this requires clinicians to think differently. It requires the software to finally be organized the way they already do. That is the entire project, and it is worth doing, because on the other side of it is the thing medicine keeps quietly taking away and everyone keeps trying to get back: the freedom to stop reassembling the chart, and simply take care of the person in the room.

---

*This book was assembled from essays published on the River Records blog. The arguments are the authors'; the framing is meant to stand on its own, independent of any particular product.*
