---
title: "The Question That Matters Is About This Patient"
description: "Some AI scribes now describe answering questions beside the note, including about a patient's prior visits. Useful. But retrieval can only read a decision's reason if someone kept it."
author: Jacob Kantrowitz MD, PhD
publishDate: 2026-11-20
tags: [clinical-context, medical-decision-making]
draft: false
linkedinCaption: |-
  Mid-visit. Diabetes, albuminuria, eGFR drifting down. Not on an ACE inhibitor.

  Ask the guidelines and you get a correct answer: start an ACE inhibitor or an ARB.

  Ask the chart and you may find a different one. Say we started it. Potassium went to 5.9. We stopped it, and nephrology agreed it should stay off.

  Some AI scribe vendors now describe a place to ask questions beside the note, and not only about the literature. At least one describes answering questions about the patient's own prior visits. That's genuinely useful, and I'd rather say so plainly.

  But it shows where the real line is. Retrieval reads what's in the chart. If the reason was written down somewhere findable, a good tool will find it, probably faster than I would.

  If it wasn't, no tool can. The med list says "discontinued." The note that day says "holding ACEi." Why it stays off lived in a phone call and a consult letter.

  The question I stall on is "what did we decide for this patient, and why." Answering it on demand is not the same as keeping the decision, with its reason, attached to the problem.

  Search can recover a sentence. It can't recover a reason nobody kept.

  When you go looking for why something was stopped, how often is the reason actually there?
---

A patient with type 2 diabetes, albuminuria and an eGFR that has drifted down over three years. Not on an ACE inhibitor. You notice it halfway through the visit, and the obvious thought arrives: why not?

Ask the literature and you get a clear, correct answer. A patient with diabetes and albuminuric kidney disease should generally be on an ACE inhibitor or an ARB, unless there's a reason not to be.

The whole question is in that last clause. Somewhere in this patient's chart, there probably is a reason. Maybe the potassium went to 5.9 two months after lisinopril was started, the drug was stopped, the potassium came back down, and the nephrologist agreed it should stay off. That decision was made carefully, by people who knew the patient.

The guideline answer is right about the population. It also happens to be the one thing you've already tried.

## Concede first: the new tools are useful

In the last few months, AI scribe vendors have been announcing a place to ask questions beside the note. Some describe it as a literature or reference lookup that cites its sources. And at least one goes further. [Freed describes its AI Chat](https://help.getfreed.ai/en/articles/12693058-introducing-ai-chat-with-clinical-evidence) as answering questions about a patient's prior visits as well as clinical evidence questions.

I want to say plainly that both are good things.

Looking something up mid-visit used to mean a second window, a search bar and a guess about which source would load fastest. Putting a well-sourced answer one click from where you're already working is a real improvement. Being able to ask "when was the lisinopril stopped?" and get an answer drawn from the earlier notes, without opening a dozen encounters in reverse order, is a real improvement too, and it goes straight at a problem I've complained about for years. Plenty of good physicians will use these tools every day, and they should.

So this isn't an argument against them. It's an argument about what retrieval can and can't give back.

## Two kinds of question

There are, roughly, two kinds of question you ask during a visit.

The first is about medicine. What's the first-line agent? What's the screening interval? Does this drug interact with that one? These questions have general answers, the answers live in the literature, and a good reference tool returns them quickly.

The second is about this patient. Why was the ACE inhibitor stopped? What did the last nephrology visit conclude? Why aren't we screening for colon cancer anymore? Did we already try the second agent, and what happened? These questions have answers too, but no textbook holds them. They're decisions, made by you or a colleague, with reasons, at a specific point in a specific person's care.

In my experience the first kind is rarely where a visit stalls. Most of us know the first-line agent, or know exactly where to look it up. Where we stall is the second kind. Not because the medicine is hard, but because the answer is a fact about our own past work and we can't find it.

A chat over prior notes is aimed squarely at that second kind. Which is exactly why it's worth being precise about what it does.

## Retrieval reads what's there

A tool that answers from the patient's prior notes is reading the record. When the record holds the answer in plain words, a good tool will find it, and probably faster than I would.

Suppose the 2023 note says: "K 5.9 on lisinopril. Stopped. Discussed with nephrology, agree do not restart." Ask the chat why this patient isn't on an ACE inhibitor and that sentence should come back. That's a good outcome, and I'd take it.

Now suppose the decision was recorded the way decisions usually are. The medication list says lisinopril, discontinued. The note from that day says "hyperkalemia, holding ACEi, recheck BMP." The recheck was normal, and the plan at the next visit doesn't mention the drug at all. The nephrologist's view, that it should stay off given how fast the potassium rose, is in a consult letter filed under a different date, if it was written down rather than said on the phone. And the patient's own part, that they'd rather not go through that again, was a conversation in the room.

Ask the same question of that chart and the honest answer is a set of fragments. It was stopped. Potassium was high. Then nothing. Whether it was a hold or a decision, whether anyone meant it to be permanent, whether the patient had a view: none of that is in a sentence anyone wrote, so nothing can read it back.

That's the line. Retrieval reads what's there. It can't recover a reason nobody kept.

## When the reason isn't there

When the reason is missing, one of three things happens, and none of them shows up as an error.

**You re-derive it.** You work the problem from first principles and arrive, eventually, at the conclusion someone already reached. That's judgment spent producing something the chart already should have contained.

**You re-litigate it.** You reopen a decision that was settled, with the patient, for good reasons you can't see. The patient who agreed two years ago to stop screening after a long conversation now has to have the conversation again.

**You reverse it.** You follow the guideline and restart the drug that was stopped for a reason, without knowing the reason. The literature didn't steer you wrong, and neither did the search over old notes. Each answered from what it had. What it had was a "holding ACEi" with no why attached.

## On demand is not the same as kept

There's a second difference, quieter than the first.

Retrieval happens when someone asks. To ask why the ACE inhibitor was stopped, you have to notice it's missing, suspect there was a reason, and stop to ask. On a full afternoon, the more likely path is the guideline prompt that arrives without being asked for, and a prescription.

And each time you ask, the answer is assembled fresh from whatever notes match the question. It's a reconstruction, not a record. Two clinicians asking in slightly different words, a year apart, may get back slightly different fragments.

A decision that's kept is different in kind. It sits with the problem it belongs to, the reason attached, and it's there whether or not anyone thinks to ask: open the chronic kidney disease and the line reads "ACEi stopped 2023, K 5.9, nephrology agrees, do not restart." Nobody has to reconstruct it, because nobody let it scatter in the first place.

## What the record is for

None of this is a complaint about the EHR. The record does its job. It holds every note, every result and every letter, and it holds them reliably. Nothing was lost.

The trouble is that a record built to keep everything isn't automatically built to keep a decision whole. Clinicians who carry patients closely solve this by hand. They keep a running line at the top of their notes, "ACEi stopped 2023, K 5.9, nephro agrees, do not restart", because they've learned that otherwise the reason has nowhere to live. I've written before about [how much of chart review is hunting rather than reading](/blog/i-dont-read-charts-i-hunt-through-them/), and about that habit in [The Running Summary](/blog/the-running-summary/). It's a good habit. It also depends on someone remembering to write the line and carry it forward, every visit, indefinitely.

Better search makes that line easier to find. It doesn't write it. The question worth asking isn't only how to look things up faster. It's how a decision made about a patient, with its reason attached, can stay with the problem it belongs to, so the next clinician to open the chart, or you in eight months, starts from what was already decided rather than from the guideline.

## The question worth answering

The new tools are built to tell you what medicine knows, and increasingly what the chart says. Both have real value, and I'm glad they exist.

But most of the hard thinking in primary care is about what *we* know about *this* person, which we worked out over years and wrote down one visit at a time, sometimes completely and often not. A search can only return the part we wrote. The reason is the most specific clinical information that exists about the patient in front of you, and it's the part most likely to go unrecorded.

*Next time a visit stalls on a decision someone already made, notice whether the reason was in the chart at all, or only the fact that something changed.*

---

*Disclosure: this is the problem I work on. Our one line for it is that your EHR keeps the record and Stream keeps the project. Stream organizes the note by medical problem and works alongside any EHR. It offers no clinical decision support, and the argument above doesn't depend on it.*
