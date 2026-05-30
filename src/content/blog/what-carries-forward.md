---
title: "What Carries Forward: On Building Documentation That Knows the Difference"
description: "Not everything in a clinical note belongs to the patient. The key to better documentation is knowing what to carry forward — and what to leave in the visit."
seoTitle: "What Should Clinical Notes Carry Forward? Building Better Documentation"
seoDescription: "Not everything in a clinical note belongs to the patient. The key to better documentation is knowing what to carry forward and what to leave behind."
author: "Jacob Kantrowitz MD, PhD"
publishDate: "2026-05-30"
tags: ["product-updates", "clinical-context"]
readTime: "6"
draft: false
---

## The Problem With Treating Every Word the Same

Most clinical documentation tools treat everything in a note identically. The results section for a routine lab review gets the same status as the updated management plan for a patient's heart failure. They're both text. They both live in the note. They'll both be there, unranked and undifferentiated, when the next clinician opens the chart six months from now.

This is a structural mistake.

Some information in a clinical note is *visit-specific*: a procedure description, an acute complaint note, context about why this encounter happened today. That information has done its job once the visit is documented. It doesn't need to follow the patient indefinitely. Forcing it forward clutters the chart and buries the signal.

Other information is *patient-specific*: the ongoing management of hypertension, the adjusted dosing for a diabetic patient's metformin, the evolving picture of someone's knee pain. That information needs to carry. It needs to update, accumulate, and be available the next time you see this person — not just the encounter details, but the clinical thinking behind each problem.

Current documentation systems don't make this distinction. They treat the note as the unit. Everything in the note lives and dies together.

## The Visit Is Not the Patient

There's a conceptual error embedded in how most EHRs are built. They're organized around *encounters*: a visit on a date, a note filed for that date, another note filed for the next date. You become good at navigating your own mental index of what you said when. You build your own memory of the patient on top of a system that doesn't really have one.

The patient, of course, isn't organized by encounter date. The patient is a set of problems. Hypertension has a history. Diabetes has a trajectory. Back pain has a context that started before the last note you filed. Problems have continuity even when notes don't.

Stream has always been organized by medical problem — not by encounter date. But knowing *where* to put information only solves part of the problem. The harder question is *what* should carry forward for each problem, and what should stay behind.

## Designing for the Difference

This is the central design challenge: how do you build a structure that honors both the visit and the patient?

The visit needs its own space. When a patient presents with an acute issue — a fall, a respiratory illness, a concern that surfaced mid-appointment — that context matters for the record of that encounter. It doesn't need to dominate the chart forever.

The patient's problems need a different kind of space. They need to accumulate intelligently. The hypertension documentation from today's visit should connect to the hypertension documentation from three months ago. The updated medication plan should flow from the previous one. The problem's documentation should be a thread, not a pile.

And both of these need to coexist in the same visit — because that's what actually happens in a clinical encounter. You're managing the acute and the chronic in the same conversation, often in the same breath.

## What This Looks Like in Practice

In Stream, we're building toward a structure where every visit has a defined shape — a skeleton of documentation slots that can be arranged in any order that makes sense for the type of encounter.

Some of those slots are *custom sections*: visit-specific documentation that lives in the note but doesn't get carried forward. A procedure note. An intake description. A contextual detail that's relevant today and not tomorrow.

Other slots are *default cards*: problem-based documentation organized by medical topic. These do carry forward. They're the continuing threads of care. When you document hypertension today, that documentation becomes the foundation for the hypertension section at the next visit.

And at the center of each visit sits the *problem block* — a dedicated section that can live anywhere in the note and that contains every medical problem addressed in the encounter. Not buried in a list at the bottom. Not extracted retroactively. Present and explicit, wherever it fits best in the visit's flow.

The structure is flexible by design. Not every visit has the same shape. An acute visit looks different from a complex multi-problem chronic care follow-up. A nursing home assessment follows different conventions than a primary care check-in. Visit types let clinicians — or practices — define the skeleton for each encounter type, and then fill it with the right mix of carry-forward and visit-specific content.

## The Deeper Point

Documentation tools should reflect the structure of clinical thinking, not impose a single structure on top of it.

Clinicians already know the difference between what's relevant today and what's relevant to this patient's ongoing care. We make that distinction constantly and automatically, in the conversation and in our heads. The failure of most documentation systems is that they don't capture that distinction — they collapse it.

Getting it right is harder than it sounds. You have to know what to carry. You have to know what to let go. You have to preserve the flexibility for a visit to look the way a visit actually looks — which is rarely the same twice.

This is the work. The result, we hope, is documentation that doesn't just record what happened, but preserves what matters.

---

*Stream works alongside any EHR and is free to try for 30 days. [Start here](https://stream.riverrecords.ai/onboard/stream-pro) — no credit card required.*

*— Jake*
