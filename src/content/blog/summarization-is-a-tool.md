---
title: "Summarization is a tool, not a default"
description: "Why Stream won't summarize your patient's chart — and what it does instead. The case for structure over compression in clinical AI."
seoTitle: "Why AI Chart Summarization Is the Wrong Default | Stream"
seoDescription: "Generic chart summarization loses texture, certainty, and signal. Stream's Huddle answers the real pre-visit questions with structure, not compression."
author: "Jacob Kantrowitz MD, PhD"
publishDate: "2026-04-22"
featured: true
tags: ["clinical-context", "product-updates", "information-chaos"]
readTime: "7"
draft: false
---

The most common question I hear about AI in clinical documentation is some version of this: "Why can't it just summarize the chart for me?"

It's a fair question. Patient charts are long. Office visits are short. You walk into the room with whatever context your memory served up on the way down the hall, hoping you didn't miss anything important from the last time you saw this person. An AI that read the whole chart and told you what mattered — that'd solve it, right?

I thought so too for a while. Then I started building it, and I realized something. The question isn't really "can AI summarize a chart." The question is "what are you actually trying to do when you ask for a summary?"

The answer, most of the time, is something specific. You want to know what's active. You want to know if there's something overdue. You want to know what you said last time so you don't repeat yourself. You want to know what the patient wants to talk about. You want to know if there's a task you forgot to close.

Each of those is a different question. And none of them is really "summarize everything." Summarizing everything is what you ask for when you don't know how to ask for what you actually want.

## Why generic chart summarization is worse than it sounds

Ask an LLM to summarize a 200-page patient chart and three things happen, none of them good.

**First, you lose texture.** The way a clinician notes an assessment carries meaning that isn't captured when you compress it. "BP 148/92, likely white coat given 128/82 at home" becomes "hypertension, suspected white coat." Technically correct. Clinically impoverished. Six months from now, the summary version doesn't tell you what the last doctor was thinking. The original does.

**Second, you lose certainty.** Every LLM summary is an interpretation. It might be accurate, but you can't tell from reading it — and in clinical work, the difference between "the patient denied chest pain" and "the patient reported no significant cardiac symptoms" is the difference between a clean ROS and a subtle liability. When a human writes and signs an assessment, you know what they meant. When an AI rewrites it, you know what the AI thought they meant. Those are different things.

**Third, and most importantly, you lose signal.** The things that matter most in a chart — the things that might change what you do today — are often small and specific. A medication that was stopped four months ago because of a side effect. A test that was ordered but never resulted. A specialist referral that never came back. These facts don't survive summarization. They get rolled up into aggregate statements that hide the thing you needed to see.

Summarization is compression. Compression works when most of the detail is noise. In a clinical chart, the details are the signal.

## What clinicians actually need, five minutes before a visit

I've watched a lot of primary care physicians prepare for a visit. The ritual is almost always the same.

You open the chart. You look at the problem list. You scan the last note or two. You check labs. You look for anything flagged. You check your task list for anything you owe this patient. You might glance at the messages queue to see if they reached out recently. Then you walk in.

That sequence is not "read a summary." It's a series of specific, bounded questions:

- What problems is this person dealing with right now?
- What did I say about them last time?
- What's falling through the cracks?
- What did I leave open?

Each of those questions has a structural answer. Problems come from the problem list. "What I said last time" comes from the most recent Assessment & Plan for each problem. "What's falling through" comes from time-since-addressed. "What's open" comes from task state.

None of those requires an LLM. They require structure.

## Huddle: what happens when you answer the real questions

This is the idea behind Huddle, the feature we're shipping at Stream this week.

Huddle is a pre-visit review surface. Three tabs:

- **Active** — problems you've addressed in the last three visits
- **Falling Off** — problems you haven't addressed in ten months or more
- **HCC** — HCC-relevant problems you haven't yet captured this calendar year

For each problem, you see the most recent Assessment & Plan — the one you wrote and signed, or that a colleague working on Stream with you did. Prior A&Ps for that problem across the last three visits are one click away. Tasks related to each problem sit inline under it, ready to complete, snooze, or pull into today's visit. Nothing is rewritten. Nothing is paraphrased. The structure does the work.

This isn't possible with most AI scribes because most AI scribes generate a single unstructured note per visit — a SOAP blob that mixes everything together. To build a view like Huddle, you'd have to re-parse that blob with another LLM call, which means summarization again, which means losing signal again. Stream's scribe produces structured notes — Subjective, Objective, then Assessment & Plan split out per medical problem — because that's the foundation everything else downstream depends on.

## So we don't use AI to summarize? Not exactly.

The honest version of Stream's position is: summarization is a tool, and we use it where it's the right tool.

We have a feature called Recap, available inside any problem's Timeline view. If you want to see the full history of a patient's diabetes — not just the last three visits, but every A&P, every medication change, every relevant lab value, across however many years you've been their PCP — you click Recap and an LLM produces a narrative summary, a medication history with outcome badges, and the key metrics. The summarization is intentional. It's scoped to one problem. It complements the underlying structured data, rather than replacing it.

Recap is summarization with a specific job: "tell me the story of this one problem over this one patient's course." That's a job summarization is actually good at. Pre-visit prep isn't that job. Neither is chart review. Neither is finding a task you forgot to close.

## The bigger point

I spent years as a clinician asking myself why EHR workflows felt so alien to the way I actually thought about patients. Part of the answer, I've come to believe, is that EHRs were built without a clear theory of what clinicians do. They capture data. They bill. They comply. But they don't particularly help you take care of the person in front of you.

AI in clinical documentation is at risk of repeating this mistake — being applied generically, without a specific theory of what it's for. "Summarize the chart" is the AI-native version of "let's just put all the data in the record." It's a non-answer to a non-question.

Stream's bet is that the useful AI moves in clinical documentation are the specific ones. Generate a structured note. Flag what's falling off. Dedupe tasks before recommending new ones. Summarize one problem across its history when the clinician asks for it.

The product isn't defined by what it won't do. It's defined by what it's willing to think carefully about.

Huddle is that thinking, made into a screen.

---

*Huddle ships this week to all Stream users. If you're not on Stream yet, you can [start a 30-day free trial](https://stream.riverrecords.ai/onboard/stream-pro?utm_source=blog&utm_medium=post&utm_campaign=huddle-launch&utm_content=summarization-post-cta) with no credit card.*

*— Jake*
