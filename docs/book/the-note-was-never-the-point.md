# The Note Was Never the Point

### Why medical documentation is broken, and what has to come next

*A short book assembled from the writing and research of River Records*

By Jacob Kantrowitz, MD, PhD, and Jackson Steinkamp, MD
with the River Records team

---

## Preface

This is not a product manual. It is an argument.

Over the last few years we have written a great deal — blog essays, peer-reviewed papers, a long manifesto that most people never saw — trying to name a problem that most clinicians feel every day but rarely get to articulate: the medical record does not work the way medicine works. We have come at it from a dozen angles — the history of the paper chart, the research on duplicated text, the daily experience of chart review, the economics of burnout, the design of the software itself. This book collects those angles into a single line of reasoning.

The argument, in one breath, is this. The clinical note is a relic of the paper era. When medicine went digital, we did not rethink the record — we digitized the filing cabinet. The note remained the atomic unit of documentation: an indivisible, single-author, write-once bundle of facts. Because that bundle is organized by time, by clinical thread, and by whoever signed it — rather than by the patient's actual medical problems — it scatters a patient's story across hundreds of documents, forces clinicians to re-document what they cannot easily reference, and then quietly hands the job of reassembling the whole thing to the one person who can least afford the time: the clinician. We call the result *burnout*, as though it were a personal failing of resilience. It is not. It is a structural failure of information design.

The good news is that the hardest-*looking* part of this problem — getting the note written faster — is largely solved. AI can produce a clean note from a conversation. That matters, and we are glad the industry attacked it. But getting the note done faster was never the hard problem. The hard problem is everything that happens *after* the note is signed: whether the record still makes sense to the next clinician, and the next, and the one practicing ten years from now.

This book is about that harder problem, and about what a record built for the way clinicians actually think would look like. Part One is the diagnosis, and it is the longest part on purpose — most of the industry is treating symptoms because no one took the time to name the disease. Part Two is a necessary detour past the obvious wrong turn. Part Three is the prescription. Wherever a chapter draws on a specific study, we have kept the reasoning product-agnostic on purpose. The ideas should stand on their own.

— Jake & Jackson

---

# Part One — The Diagnosis

## Chapter 1: The Relic

For roughly three thousand years, the medical note did an honest job. It was a static, single-author snapshot: one clinician, at one moment, recording what they saw and what they planned to do. On paper, that made sense. Paper is static. A note written in ink is locked the moment it dries. One person holds the chart at a time. The format matched the medium.

Then medicine went digital, and we made a decision so quietly that most people never registered it as a decision at all. We took the note — the static, single-author, locked-after-signing artifact of the paper era — and we moved it onto a screen without changing what it fundamentally was. We digitized the filing cabinet instead of rethinking it.

It is worth being precise about what paper actually forced on us, because those constraints are the hidden source code of the modern EHR. A paper note is a physical object in exactly one place at one time, and that single fact cascades into four limitations. It is **single-user**: only one person can comfortably read or write it at once. It is **atomic**: you cannot easily pull one fact out of the middle of it, or merge a fact from another note into it, without rewriting everything by hand. Its copies are **unlinked**: photocopy a note and the two drift apart — fix an error on one and the other stays wrong. And it has **no version history**: there is no practical way to see what the note said last week, or who changed what. Under those constraints, certain habits weren't choices; they were the only options. You collaborated by writing separate parallel notes full of the same duplicated information, because there was no other way to collaborate at all.

Every one of those four limitations vanished when we went digital. Screens are multi-user. Databases can edit a single fact without touching its neighbors. Linked copies update everywhere at once. Version control — the track-changes we all now take for granted in ordinary word processors — records every edit and who made it. And yet we kept documenting as though none of that were true. The note is *still* the atomic unit of unstructured clinical information. In most systems a note, once signed, is essentially uneditable except by appending an addendum — an unlinked copy. We inherited paper's constraints and then declined to spend the freedom digital gave us.

Look at almost any electronic health record and you will see the paper chart staring back. A labs tab. A meds tab. A notes tab. A radiology tab. Folders and dividers, rendered in pixels. If you have computerized order entry — medications, allergies, orders captured discretely — you have most of the tangible, safety-driving benefits of going electronic. Beyond that, the typical EHR is a system of tabs and folders that organizes information by its *format* rather than by its *meaning*. It is skeuomorphic: a digital imitation of a physical object, carrying the physical object's limitations into a medium that no longer has them.

This is why some practices are, remarkably, still on paper. They look at an EHR, weigh the pain against the benefit, and don't see enough to justify the switch. They are not simply behind the times. They have correctly noticed that much of what the EHR added was not clinical value but clerical labor.

The deeper cost is conceptual. Because we never revisited the note itself, we inherited all of its paper-era assumptions and then asked it to do work it was never built for. The single-author snapshot is now expected to support a dozen clinicians collaborating across settings. The locked, static document is now expected to represent a patient whose conditions evolve continuously over decades. A format designed to describe one visit is now the atomic unit of a lifetime of care.

It doesn't fit. And most of the dysfunction that follows — the bloat, the copy-forward, the endless scrolling, the sense that the software is working against you — traces back to this original, unexamined choice. The note is a relic, and we are still living inside it. The rest of Part One is an attempt to take the note apart and show you exactly how it breaks.

## Chapter 2: What a Note Actually Is

Before we can say what is wrong with the note, we have to say what a note *is* — a question that sounds trivial and isn't.

A note is a discrete bundle of related clinical information: a set of facts, opinions, and thoughts wrapped in a single document package. It is not the whole chart. It sits in a small hierarchy that is worth making explicit, because most of the trouble hides in the layers. At the bottom is the **fact** — a single clinical observation ("potassium 3.5," "chest pain radiating to the left arm"). Facts get bundled into a **note**. Notes, together with the structured data, make up the **chart**. Fact, note, chart. The note is the middle layer, and — crucially — it is the *atomic* one: in most systems you cannot add, edit, split, or merge anything smaller than a whole note. If you want to record a single new fact, you write a whole new note to hold it.

Why do we bundle facts into notes the way we do? There turn out to be exactly three reasons, and naming them is the analytic key to everything that follows. A note bundles information by **time**, by **clinical thread**, and by **responsibility**.

**By time.** Each note is a timeslice. It captures a discrete chunk of a patient's life — everything relevant between the last encounter and this one, plus what happened at this one. Those chunks vary wildly in length, from a single day on an inpatient service to years between primary-care visits, but the intent is that they are sequential and non-overlapping: each fact captured once, in the slice where it belongs. Sort the slices by time and you can trace a disease course. This is a genuinely sensible way to group facts, and any good documentation system needs *some* notion of it. The note is just one implementation of the idea, not the only one.

**By thread.** A thread is a stream of clinical reasoning and action that persists across multiple timeslices — a lifetime of primary-care notes, the daily nursing notes of one admission, an inpatient neurology consult's sequential notes. Threads usually map onto services, and they let different clinicians document in parallel, hold conflicting opinions, and filter by discipline ("how's the Parkinson's going? — check the neurology notes"). Also sensible. Also just one way to separate threads, not the only one.

**By responsibility.** This is the one people forget, and it will turn out to matter most. A note is a bundle of facts that can be *attested to as a single unit*. When Dr. X writes and signs a note, she is making a statement of agreement with, and responsibility for, every fact inside it, in one action. That responsibility is real and necessary — clinically (who heard the murmur?), medico-legally (who owns the decision?), and for billing (which services were performed?). Any documentation system has to assign responsibility. The note does it by welding responsibility to the document.

Here is the thing to hold onto as we go. All three of these jobs — separating by time, by thread, by responsibility — are legitimate. A record has to do all three. But *the note is not the only way to do any of them*, and by forcing all three through a single indivisible, single-author, write-once object, we created a tool that does each job passably and their combination badly. The remaining chapters of Part One are, essentially, what happens when you pull those three bundlings apart and look at each one under load.

## Chapter 3: The Note That Went Unquestioned

You might expect that somewhere in the long, expensive migration from paper to digital, someone paused to ask whether the note should survive the trip. Someone with authority, convening the right experts, examining the foundational unit of all clinical documentation before enshrining it in a generation of software. It is worth looking, because what you find tells you how we got here.

Consider the timeline. As recently as 2012, fewer than half of non-federal acute-care hospitals had even a "basic" electronic record. When the requirements for "basic" EHR use were being hashed out around 2003, consumer software was in its infancy, the iPhone was years away, real-time collaborative editing like Google Docs posed genuinely hard technical problems, and half of U.S. households didn't own a computer. In that context, moving from writing on paper to typing on a screen was already a heroic step. We don't blame anyone for taking it. But it was an incremental step whose potential was left unrealized — and the note rode across unexamined.

Look at Meaningful Use, the federal program that tied EHR adoption to Medicare payments and did more than anything else to shape what these systems became. Its objectives are revealing. The overwhelming majority concern *structured* data — orders, allergies, medications, demographics, vital signs, labs, problems — the discrete facts that live outside notes. Only a single, optional, menu-tier objective even mentions notes: "record electronic notes in patient records." The free-text note, the thing clinicians spend the most time inside, was a near-afterthought in the standards that built the modern EHR. The now-familiar split between "structured" data and "unstructured" note-text is in large part an artifact of these requirements.

Look at the interoperability standards. HL7's Consolidated Clinical Document Architecture offers flexible building blocks — and then ships templates that faithfully reproduce the existing paradigm: progress notes, discharge summaries, H&Ps. Look at FHIR, whose clinical-notes guidance defines a minimum set of note *types* a compliant system must support — progress note, consult note, discharge summary, and so on — with an enormous downstream catalog of ever-more-specific categories. Nowhere in any of it is there a discussion of whether the note is the right bundle in the first place. These were the exact bodies — multinational, expert, convened specifically to define the future of clinical data — best positioned to ask the question. They didn't. Presumably they couldn't: to get vendor buy-in, a standard has to move the data types already in use.

This is not a villain story. It is a story about inertia, and about how a concept becomes invisible. If every EHR ships a "progress note" template, every payer requires a daily progress note to bill, and every clinician is trained from day one to produce one, then the note stops being a design choice and starts being the water we swim in. As Deming put it: *every system is perfectly designed to get the results it gets.* The results we get — bloat, duplication, scatter, burnout — are not a bug in an otherwise sound design. They are exactly what a system built on the unexamined note is designed to produce. Which means the fix cannot only be a better interface on top of the note. It has to reach the note itself.

## Chapter 4: Information Chaos

Give the paper-era note a modern workload and it fails in specific, nameable ways. Researchers have a framework for the composite failure — Beasley and colleagues called it *information chaos* — and it has five components. Every clinician has met all five, usually before lunch.

*Information overload*: too much data, too little time — including too many copies of the same data. *Information underload*: the data you need is missing when you need it. *Information scatter*: the data exists but is fragmented across disconnected places, so it might as well not. *Information conflict*: two parts of the record disagree and there's no easy way to tell which is current. *Erroneous information*: something is simply wrong — and often has been for so long that everyone treats it as true.

Naming them separately matters, because the note's failures land on different ones, and — this is the important part — *fixing one component the wrong way makes another worse.* Hold that idea; it's the hinge of the whole diagnosis, and the next chapter is entirely about it.

Underneath at least three of the five sits a single mechanical cause, and it is not laziness. It is duplication. In our 2022 study, *Prevalence and Sources of Duplicate Information in the Electronic Medical Record*, we found that just over half — 50.1% — of the text in a patient's record was duplicated from prior text written about the same patient. Half. And that duplication is not a moral failing. It is a survival strategy. In the absence of tools that reliably preserve context, clinicians copy forward what matters because copying is the only way to be sure it isn't lost.

> Repetition becomes retention. Redundancy becomes safety.

But duplicated text corrodes the record it is meant to protect. Once you know that half of what you're reading was pasted from somewhere else, you can no longer fully trust any of it. Was this exam performed today, or copied from March? Is this the current medication list or a fossil? Duplicate text casts doubt on the veracity of *all* the information in the chart — that's *conflict* and *erroneous information* seeded directly by the fix for *underload*.

There's a concept from software that names the way out, and we'll need it later: the difference between storing multiple *copies* of a fact and offering multiple *views* of a single copy. A lab result is entered once and lives in one place, yet an EHR can show it as a list, a graph, a panel-wide roll-up — many views, one source of truth. Amend the source and every view updates. Now watch what a note does with the same lab value: retyped into three consecutive progress notes, it becomes three unlinked copies that must each be corrected by hand, and won't be. The chart is full of copies masquerading as views. That is the engine underneath the burnout statistics. Not the typing. The chaos.

## Chapter 5: The Two Notes

Here is the conceptual conflict at the very center of the note, the one that makes information chaos not an accident but a certainty. We ask a single note to be two incompatible things at once.

On one hand, a note is supposed to be a **bundle of updates** — it should hold only what's new since the last note, the fresh information from this timeslice. That's what keeps the record from repeating itself. On the other hand, we also expect any given note to be a **state of the patient** — open it and understand the whole picture as of that moment, even the parts that haven't changed. That's what lets a covering clinician get oriented from a single document.

These two demands pull in opposite directions, and you cannot satisfy both in one note. Use the note strictly as a bundle of updates and you minimize duplication — but reconstructing the state of the patient now requires combing through many scattered notes to assemble the picture. Use the note as a state of the patient and you can read one document to get oriented — but every note now re-documents mountains of unchanged information. Push toward one horn and you get *scatter*. Push toward the other and you get *overload*. There is no setting of the dial that escapes both, because the conflict is in the concept, not the discipline of the person writing.

You can watch clinicians live this tradeoff. Faced with a chart that's painful to navigate, a clinician will quietly turn a single note into a private copy of the whole chart, to avoid ever having to reassemble it again:

> **Note 1** — 6/12: Increased edema. Furosemide increased 20mg to 40mg BID.
> **Note 2** — 6/12: Increased edema. Furosemide increased 20mg to 40mg BID. 6/19: Improved edema. No changes.
> **Note 3** — 6/12: Increased edema. Furosemide increased 20mg to 40mg BID. 6/19: Improved edema. No changes. 8/20: Refill on furosemide, sent to pharmacy.

None of this involves the kind of reasoning-based summary that clinical thinking legitimately requires. These are plain objective facts, copied forward, growing with every visit. It's a rational adaptation to information scatter — assemble the story once, never do it again — and it's a disaster for the chart, which now fills with bloated, self-duplicating notes. What is good for the note is bad for the chart.

Notice what's actually gone wrong here: the note is being asked to do the *chart's* job. The chart is the layer that should hold the state of the patient across all time; the note should be free to be a small bundle of updates. When those layers collapse into one, you get the furosemide note — a document straining to be an entire medical record.

And now watch the tradeoff simply *dissolve* the moment you stop making the note carry both jobs. Imagine the chart itself presents a clean, current state of the patient — assembled from individually documented facts, each entered once, each editable in place, no matter who recorded it or when. An "update" is then just editing the handful of facts that changed and leaving everything else untouched; afterward the chart reflects the new state on one screen. Want to know what the patient looked like in June? A version history shows you, the way track-changes shows you any document's past. Overload and scatter were never a law of nature. They were the price of forcing one indivisible object to be both a diff and a snapshot. Split those jobs across the right layers and the price disappears.

## Chapter 6: The Rational Workarounds

Once you see duplication as a survival strategy, and the two-notes conflict as its root cause, a whole set of clinician behaviors that get scolded in compliance trainings start to look like what they actually are: intelligent responses to a broken system.

**Copy-paste** is the clearest case. It gets treated as laziness, or a medico-legal hazard to be stamped out. But clinicians copy-paste for a reason: the system forgets. A condition is persistent; the note is ephemeral. If you want to be certain the next person — or the next *you*, six months on — knows this patient has heart failure, the safest move available is to carry that fact forward by hand. Copy-paste is a symptom. The real diagnosis is a system that forgets what matters.

**Note bloat** is the accumulated residue of all that carrying-forward. Notes grow longer not because clinicians have more to say but because nobody has time to re-summarize an entire patient at every visit, so the last note gets photocopied — electronically — and added to. The record swells, the signal-to-noise ratio collapses, and today's genuinely new information hides inside a wall of inherited text. The real cost of note bloat is not the wasted minutes. It is the erosion of clinical reasoning itself: when documentation turns into noise, thinking gets harder, and the patient's actual story gets smothered.

**Chart lore** is what happens when a copied-forward fact outlives its own truth. A diagnosis gets entered once, copied note to note, and over the years becomes assumed-true simply because it has been there so long. Nobody re-examines it. It has tenure. Meanwhile a real diagnosis, made carefully, can vanish entirely — recorded in one note, in one visit, that no one later thinks to open. It is genuinely strange that a doctor's work, a diagnosis, could be lost outright, or worse, be wrong and persist unchallenged. The encounter-and-billing structure of the record makes both failures ordinary.

**Perfect-looking notes** are the most insidious workaround, because they look like the opposite of a problem. Templates and pre-filled content produce documents that check every box: complete review of systems, full physical exam, tidy assessment. A note can be voluminous, immaculate, and completely hollow — creating the illusion of thoughtful medicine while masking the absence of any real reasoning. Worse, it can assert things that did not happen: a full exam documented when only part of one was performed. Good documentation does not hide uncertainty; it reveals thoughtful, evolving reasoning. The perfect-looking note hides everything interesting about a clinician's thinking behind a facade of completeness.

Every one of these is rational. Every one is a person adapting themselves to software that will not adapt to them. Documentation, as it exists today, is a stack of workarounds. You cannot scold your way out of it. You have to change what the workarounds are compensating for — and the deepest thing they're compensating for is the subject of the next chapter.

## Chapter 7: Attestation Is Not Documentation

We now arrive at the keystone. Pull it and a surprising amount of the edifice comes down.

Recall the third reason a note bundles facts: responsibility. When you sign a note, you attest to it — you state agreement with, and responsibility for, the facts inside. That attestation is necessary. Nobody is arguing that clinicians should stop being accountable for what's in the chart. The argument is subtler and more consequential than that:

> Attesting to a fact and documenting a fact are two different actions — and we have fused them into one.

Here is the distinction. To *document* is to record a fact for the first time. To *attest* is to say "I agree with this, and I take responsibility for it." Nothing about the second requires repeating the first. When you verify a colleague's exam and find it accurate, you have attested to it — but our tools give you no way to *say* so except by typing the whole exam again into your own note. So you do. Attestation, which should cost a click, instead costs a re-documentation. Multiply that across every consult team, every shift, every visit, and you have manufactured a staggering fraction of the duplicate text in medicine — not to record anything new, but merely to take responsibility for something already recorded.

We already know this can be done differently, because in the narrow places where the tools allow it, we do it every day. "Medication list reviewed — no changes." "Problem list reconciled." One click. It creates no new text, assigns responsibility cleanly, and takes a second. That is attestation without redocumentation, and it is quietly one of the best-designed interactions in the entire EHR. We just never extended it to unstructured information — to the exam, the history, the assessment — because those are trapped inside the atomic note, where you cannot attest to one fact at a time. To sign a note is to attest to all of it or none of it. Since you rarely agree with 100% of a colleague's note verbatim, you copy the parts you trust into your own — and the duplication machine runs again.

The usual objection is that the note *must* be the unit of attestation for medico-legal and billing reasons — that responsibility would dissolve without it. This lacks imagination. Every serious piece of software we use tracks precisely who changed which word, when, and can reconstruct any past state on demand. Version control assigns responsibility at the level of the individual fact *better* than the note ever did, not worse — it can tell you who documented a fact, who later edited it, and who deleted it, even after the text is gone. The design principle is simple: optimize the interface for the common case — a clinician trying to understand the patient — and keep the rare case — adjudicating who was responsible for what — one click away, present but not in the foreground. We have had this technology for decades. We just haven't pointed it at the note.

Disentangle these two ideas — attestation and documentation — and the whole picture shifts. Copy-paste is revealed as what happens when the only way to attest is to redocument. Note bloat is revealed as attestation debt, paid in duplicated text. The billing-versus-care tension softens, because you can satisfy the medico-legal need to assign responsibility *without* corrupting the clinical need for a clean, non-redundant record. The note fused documentation and attestation because paper gave it no choice. Digital gives us the choice. We have simply not taken it.

## Chapter 8: The Reconstruction Tax

Step back from the mechanics — the bundlings, the copies, the attestation debt — and look at who pays for all of it. Because someone does, every day, and it is the most expensive resource in the building.

Every patient has a story — not in the sentimental sense, in the clinical sense. A sequence of problems, interventions, responses, and adjustments that together explain why they are in front of you today. That story exists somewhere in the chart. But the chart does not tell it. It *archives* it. The telling is left to the physician, who reconstructs continuity from fragments, visit after visit, patient after patient.

Before you can make a good decision about a patient you haven't seen in six months, you need context. What did we try for the blood pressure before landing on this regimen? Was the A1c drifting or holding? Did the cardiologist ever weigh in on the chest pain from the spring? All of it is in the chart. Retrieving it is another matter. The standard workflow is archaeology: opening prior notes in reverse chronological order, scanning for the relevant detail, holding it in working memory while the next patient waits. A thorough review of a complex chart can take five to ten minutes. For a physician seeing twenty patients a day, that time does not exist. So what happens instead is a partial reconstruction — good enough to proceed, but not the same as actually knowing.

We call this the *reconstruction tax*, and it is one of the most expensive, least-discussed inefficiencies in medicine. It does not show up in patient-satisfaction scores. It does not appear in quality metrics. It lives in the gap between the care a physician intended to deliver and the care that was possible in the time available.

The tax exists because the encounter model quietly made the physician into the *integration layer*. In the absence of a system that synthesizes clinical history, a human does it — so routinely that it has become invisible, just part of what it means to know your patients. But it is work. It consumes the exact attention and working memory that might otherwise go to the person in the room. And it is unreliable in a way we rarely admit: a physician who knows a patient well practices differently than a colleague covering for them, seeing the patient fresh. Neither is failing. They simply have different inputs. But the quality of care should not depend on who happens to remember what.

There is a moral dimension here too, and it is worth naming plainly. When the chart is a shared resource that everyone dumps into and no one is responsible for maintaining, it becomes a kind of commons — and, predictably, a tragedy of the commons. The record fills with clutter because clutter is free to add and expensive to clean. Primary care physicians, sitting downstream of everyone, end up as the system's garbage collectors: sifting other people's data dumps to find the few facts that matter. That is not what they trained for. It is a waste of the most expensive, most carefully educated attention in the building, and it is a reliable path to moral injury.

> The system's structural work has been offloaded onto human beings, uncompensated and mostly unseen — and then the exhaustion that results has been renamed as their personal problem.

That is the diagnosis, in full. A paper-era unit that never evolved; three bundlings forced through one indivisible object; a concept asked to be both a diff and a snapshot; attestation welded to documentation; and a reconstruction tax paid, in the end, by the clinician's attention and the patient's care. Everything in Part One has been about naming the disease precisely. The rest of the book is about the cure — starting, in the next chapter, with the cure everyone reaches for first, and why it isn't one.

---

# Part Two — The Redirection

## Chapter 9: Faster Is the Wrong Goal

When a problem is painful enough, the first solution the market reaches for is usually *speed*. The note hurts, so let's make the note faster. It is an understandable instinct, and for the past few years it has defined the entire AI-scribe category. Listen to the conversation, generate the note, sign it, go home earlier. Real value. We are genuinely glad it exists.

But speed solves the wrong problem, and it is worth being precise about why — because everything in Part One tells you exactly where a faster note lands.

Imagine the note-writing machine works perfectly — instant, accurate, effortless. What have you actually changed? You have made it faster to produce documents. And the core disease of the modern chart is not that documents are slow to produce. It is that there are too many of them, poorly organized, each straining to be both a diff and a snapshot, scattering the patient's story across an ever-growing pile. Faster note-writing is also faster *long-note*-writing. Point a printing press at a library that is already overflowing and disorganized, and you do not get a better library. You get a bigger mess, produced more efficiently.

The library is the right way to picture it. Every EHR is a library sorted by format and time rather than by topic or meaning — imagine walking into one where the books were shelved by their binding and their purchase date instead of their subject. You would spend all your time hunting and none of it reading. That is chart review. The burden falls on the clinician, the human middleware, who spends hours reassembling what the system scattered. A faster scribe adds more books to that library. It does nothing about the shelving.

There is a subtler failure lurking in the speed framing, too. The bottleneck in documentation was never words-per-minute. Ask any clinician where the time actually goes and it is not the typing — it is the *re-finding*. Re-locating information you already documented, re-reading a fax you already read, re-deriving context you already had. A fast note that leaves behind a digital haystack of snapshots has saved you thirty seconds of templating and cost you the ten minutes of excavation that the haystack will demand at every future visit. The reclaimed mental bandwidth from *not* having to reconstruct — that is what reduces burnout. Not the thirty seconds.

This is why the tempting AI move — "just summarize the whole chart for me" — is also a trap, and it deserves a moment. Summarization is compression, and compression works when most of the detail is noise. In a clinical chart, the details *are* the signal. The medication stopped four months ago for a side effect; the test ordered but never resulted; the specialist referral that never came back — these are exactly the small, specific facts that get rolled up and lost when you compress. Ask an AI to summarize everything and you lose texture, you lose certainty, and worst of all you lose the signal you were looking for. "Summarize the chart" is the AI-native version of "let's just put all the data in the record." It is a non-answer to a non-question. Summarizing everything is what you ask for when you don't yet know how to ask for what you actually want.

> The future of ambient AI in medicine is not speed. It is structure.

The differentiator is no longer how fast you can write; it is how well the record is organized once you have. Faster is table stakes. Organized is the whole game — and Part Three is what organized actually means.

---

# Part Three — The Prescription

## Chapter 10: Organized Like Clinicians Think

If the note is the wrong unit, what is the right one?

The problem. In medicine, we do not think in pages — we think in problems. When you prepare for a visit, you are not asking "what documents exist about this person, in date order?" You are asking "what is going on with their heart failure, their diabetes, their depression, and what has changed since I last looked?" The unit of clinical meaning is the medical problem, and it always has been. The record is simply organized around a different unit — the encounter — for reasons that have everything to do with billing and nothing to do with reasoning.

So flip it. Organize the record the way clinicians already think: by problem, not by date. Give each problem — "Heart Failure," "COPD," "Type 2 Diabetes" — its own thread that can be followed, updated, and reviewed in one place, regardless of when or where it was last addressed. Instead of a trail of disconnected snapshots, each problem becomes a single evolving line you can read start to finish. You are no longer writing to fill a container. You are maintaining a living, structured picture of the patient that grows over time.

This is where the three bundlings from Chapter 2 finally come apart cleanly — which is the whole point. Time still matters, so each problem carries its own version history: you can see what it looked like at any past moment. Thread still matters, but the thread is now the *problem*, not the author or the service, so everyone caring for the heart failure works in one place instead of five parallel notes. And responsibility still matters — but now, as Chapter 7 argued, it's handled by attestation and change-tracking at the level of the individual fact, not by welding it to a document. The record can finally do all three jobs well because it stops forcing them through one indivisible object.

It also reframes what a note even is. The traditional note tries to do far too much at once: legal record, billing artifact, communication handoff, memory aid, working scratchpad — all bundled into one document organized around none of those jobs well. Pull the jobs apart. The note becomes one lens onto the record — one view among several — rather than the record itself. A chart is not a pile of notes. It never was.

> The note was never the point. The patient is.

Getting there requires answering a question the encounter model never had to ask: *what carries forward?* Not everything in a note belongs to the patient. Some of it belongs only to the visit — today's vitals, today's specific exam, the particular phrasing of today's plan. The design challenge is telling the two apart: visit-specific information that should be left behind, and patient-specific information that should persist. The visit is not the patient. Once you can separate them, a problem's documentation becomes a thread rather than a pile — each visit adds a micro-update to the relevant problem instead of re-documenting the whole patient from scratch. You update one fact without rewriting everything around it. You see what changed at a glance instead of scrolling for it. The furosemide note from Chapter 5 stops being necessary, because the chart itself now holds the state of the patient and the version history holds the past.

None of this is a demand that clinicians work differently. It is the opposite. Documentation tools should reflect the structure of clinical thinking, not impose a single structure on top of it. The whole point of organizing by problem is that it is already how the reasoning runs. We are not asking clinicians to think like the software. We are finally building software organized like clinicians think.

## Chapter 11: Information Persistence

Organizing by problem sets up the single most important idea in this book, the one everything else has been building toward: *information persistence.*

The principle is simple to state. You should not have to know to look for something in order for it to be available to you.

Consider a patient who once had a heart attack. That fact should not have to be hunted for. It should be apparent the moment anyone opens the chart — plainly, immediately, without a search, without knowing which note from which visit to dig into. Today it usually isn't. The place where that fact *should* live durably — the problem list, the medical history — sits divorced from the record, which is really just a pile of notes. And a note can be entirely accurate and still be functionally useless beyond the moment it was written, because using it requires someone to know it exists and go find it.

Think about the cardiologist who does excellent work for a hospitalized patient. If that cardiologist doesn't also structure the key information so it persists — so the *next* clinician simply sees it — they have done both the patient and that future clinician a quiet disservice. If the heart attack isn't persisted somewhere durable and obvious, outside the body of a single note, then for practical purposes it might as well not have happened. Someone would have to know to look for that particular note, from that particular day, about that particular problem. That is not a sustainable way to run a healthcare system, and it gets less sustainable every year, because medicine keeps getting more complex. People live longer. Guidelines multiply. As the picture grows more complicated, we need *simpler* ways to see what is going on with a patient — not more places to click.

Persistence is also what finally pays off the software concept from Chapter 4: multiple *views* of a single source, instead of multiple *copies*. When each fact lives once and persists in the problem it belongs to, the visit note, the problem timeline, the pre-visit summary, and the billing artifact all become *views* of the same underlying facts — not four retyped copies drifting out of sync. Correct the fact once and every view is correct. Attest to it once, with a click, and responsibility is recorded without a word being retyped. Everything Part One diagnosed as duplication was, at bottom, copies standing in for views because the note left no other option.

### Structure beats search

Persistence is what makes structure beat search. The instinct in an AI-saturated moment is to leave the chart a mess and build an ever-smarter librarian to go re-find things in it on demand. But re-deriving a patient's context from scratch on every access is expensive, slower than it looks, and prone to error precisely where errors matter most. It is far better — safer, cheaper, more trustworthy — to organize the shelves once so the right information is simply present, than to send an increasingly clever assistant to re-hunt the same disorganized stacks a thousand times over. Structure done once outperforms search done endlessly.

This is also where summarization finds its proper, narrow home. Summarization is a tool, not a default. It is genuinely good at one kind of job: "tell me the story of *this one problem* across this patient's course" — a scoped request, against already-structured data, where the compression is intentional and the boundaries are clear. That is a real use, and a valuable one. It is the opposite of "summarize everything," which asks a machine to guess at relevance across an undifferentiated pile. Structure first; summarize deliberately, in bounded ways, on top of it.

Persistence changes the order of operations for the entire record. Instead of organizing around the note and bolting structure on afterward, organize around the patient's problems and let the note — and the bill — fall out as byproducts. The information a clinician already gathers in the ordinary course of care should persist on its own: structured, visible, durable across whoever is in the room next. No extra clicks. No second pass. No reliance on one person remembering to write the right note in the right place. Documentation stops being a rewrite and becomes a review. Capture once; use everywhere.

## Chapter 12: The Bridge and the Destination

It would be dishonest to end on pure vision, because the vision runs into a wall, and pretending otherwise is how people get sold things that don't work.

Here is the wall. The destination — a fully patient-organized, persistent record that every system reads from and writes to — cannot be delivered in one move today, because the incumbent EHRs largely do not permit structured write-back, and clinicians cannot simply abandon the systems their billing, orders, and legal record already live in. Anyone who tells you the whole thing can be swapped out cleanly tomorrow is selling something.

So the honest path is a bridge. You keep a clean, problem-organized, persistent copy of what matters *alongside* the existing EHR — carrying clinicians across the river while the real road is still being built on the far bank. A bridge is not the destination. But bridges carry people across in the meantime, and that is not a small thing. It has real costs — a degree of double-handling, a validation burden — and anyone honest names those costs out loud rather than hiding them. What makes the bridge worth building is that every crossing is useful *today*, even before the destination exists.

And the destination is worth being clear about, because it is what the bridge is for. It is the thing Jackson's manifesto pointed at years ago: a dynamic, multi-user, collaborative patient workspace, structured in customizable ways, where clinicians alter single facts at a time rather than writing whole notes — a record built around the patient's problems and topics, short-lived or lifelong, with a genuine persistence layer underneath, designed for the reality of medicine *now* rather than the reality of forty years ago when the first EMRs entered the space. Billing artifacts still get produced and still get set in stone, because they are part of the medico-legal record. But they fall out of the structured layer as byproducts, rather than being the thing the whole record is organized around.

What that unlocks goes beyond fixing what is broken. When the record knows a patient's problems and keeps them current, *continuity itself becomes a feature of the software* rather than a heroic act of memory. The chart can carry its own thread across visits, so every encounter continues a conversation instead of starting from a blank form. Different clinicians can work the same problem in the same place instead of in five parallel notes. And information can finally start moving toward the clinician instead of waiting to be dug up — the relevant lab, the overdue follow-up, even the reading most relevant to the conditions you actually documented, brought to you rather than left for you to go pull. The reading should come to you. Continuity is care.

That is the whole arc. Stop being garbage collectors and start being stewards of clinical information. Stop making the note the point. The note was always just one lens; the patient was always the point. Getting the note done faster was the visible problem, and it is nearly behind us. The chart — the persistent, problem-organized, still-legible-in-ten-years record of a human being's health — is the real work.

The note is solved, or it soon will be. The chart is not. That is where we go next.

---

## Coda: What Node Does This Create?

If there is a single question to carry out of this book, it is a design question, and it is smaller and more practical than the grand argument that precedes it.

For any feature, any note, any piece of documentation, ask: *what persists, and to whom, and do they have to know to look for it?*

Most of what is wrong with the medical record fails that test. The brilliant assessment buried in a note no one reopens. The diagnosis that became chart lore. The fax read five times and retyped into four places. The exam re-documented only to attest to it. The story that lives only in one physician's memory and leaves when they do. In every case, information that should belong to the patient's durable record instead belongs to a document, a moment, or a person — and is therefore, functionally, at risk of being lost.

Build the other way. Make the record around the patient, organized by problem, persistent by default, so that the right information is simply present for the next clinician without anyone having to remember to surface it. Let facts be editable one at a time and attested to with a click. Let the note and the bill be byproducts. Let continuity be a property of the system rather than an act of will.

None of this requires clinicians to think differently. It requires the software to finally be organized the way they already do. That is the entire project, and it is worth doing, because on the other side of it is the thing medicine keeps quietly taking away and everyone keeps trying to get back: the freedom to stop reassembling the chart, and simply take care of the person in the room.

---

*This book was assembled from essays on the River Records blog and from the authors' longer manifesto and peer-reviewed research on duplication and information chaos. The arguments are the authors'; the framing is meant to stand on its own, independent of any particular product. Disclosure: building toward the record described here is what the authors spend their time on.*
