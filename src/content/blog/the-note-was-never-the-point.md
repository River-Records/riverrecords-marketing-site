---
title: "The Note Was Never the Point"
description: "A reflection on AI scribes, legacy EHRs, and why the next generation of clinical software needs to organize itself around the patient, not the note."
seoTitle: "The Note Was Never the Point | Organizing the EHR Around the Patient"
seoDescription: "AI scribes are growing a patient object late, and legacy EHRs can't retrofit fast enough. Why the next system of record should organize around the patient, not the note."
author: "Jacob Kantrowitz"
publishDate: "2026-06-12"
featured: false
tags: ["ai-medical-scribe", "longitudinal-care", "clinical-context"]
draft: false
linkedinCaption: "Yesterday a nurse practitioner showed me her new AI scribe, and its design quietly revealed what its makers think documentation is for: generating notes faster, with little regard for how the chart is organized afterward. Notes were first-class citizens on every screen; patients had been bolted on late. Legacy EHRs aren't better — ten to twenty clicks to write a single note. The next generation of clinical software won't come from retrofitting either. It'll come from systems built around the patient — their goals, their problems, their history — not the note. A chart is not a pile of notes. The note was never the point. The patient is."
---

*A reflection on AI scribes, legacy EHRs, and what the next generation of clinical software needs to organize itself around.*

> A note on this post: it was drafted with AI, in consultation with my own thinking. That's deliberate. I'm not skeptical of generated content — I think it's essential. My argument isn't with the technology. It's with the thing we keep organizing the technology around.

Yesterday I spent an hour with a nurse practitioner, walking her through Stream, our AI documentation platform. She'd recently started using a competitor scribe, and partway through she turned the tables and showed it to me. What struck me wasn't the demo — it was how much each product's design revealed about what its makers believe documentation is *for*.

She stayed for an hour. Not because of the software, but because of the premise: that documentation is the clinician's actual workspace — the all-in-one for billing, clinical reasoning, reminders, what's working and what isn't, the history-telling. *When was the diabetes diagnosed? Which HTN meds have already failed?* If we take documentation seriously as that workspace, then we should build the workflows around what it needs to be — not around the paper-era habits we've spent decades digitizing.

## What the competitor revealed

The competitor was about what I expected. Notes were first-class citizens. They were visible from every screen — a scrolling feed of visits, always present. Patients, by contrast, had clearly been added later. They lived at the bottom of the hierarchy, visually deprioritized, and weren't even visible from inside a given note.

But ask the obvious question: when I'm looking at the note for the patient in front of me, why would I want a feed of *other* patients' notes? I wouldn't. I can think of almost no clinical reason to design it that way — except one. This product was built to generate notes faster, with little regard for how the chart is organized afterward.

Predictably, it also has an AI summary feature. And here's the tell: the summary didn't seem to preserve any structure from what had already been documented. The originally generated AI note gets fed through *another* AI to produce a summary — losing the texture and nuance of whatever the clinician had already edited, written, and signed off on. AI summarizing AI, with the clinician's judgment quietly washed out in between.

I don't raise this because I dislike generated content. I raise it because it shows a product team thinking hard about how to leverage the information they have — but doing it around the *note*, not the patient, and not the chart as a whole.

## What the legacy EHR revealed

The same client was running a fully deployed, clinically mature EHR — one that's been around a couple of decades, which I won't name. It is relentlessly click-heavy. Writing a single note takes, conservatively, ten to twenty clicks. You click into a window for the HPI. You click into the assessment and plan. You click again to attach medical problems to the visit. None of it is automated, though the vendor does offer a scribe that may smooth some of it over. But the underlying UX is just: click, click, click, click.

The juxtaposition was the interesting part. The AI scribe the client used *outside* the EHR was essentially hands-free — one click to start recording, one to stop. The EHR they used to actually store the work was so click-laden that even entering automatically generated content was painful.

## A patient-shaped object is emerging — but late

What caught my attention in that competitor was that it had grown a patient object at all. That now seems true across more or less the entire spectrum of AI scribes: they're beginning to develop a concept of the patient and to organize the chart around it.

That tells me something. Traditional EHRs probably can't update their workflows fast enough to become the next generation. They may try to stand up entirely new products, but retrofitting decades-old interfaces — and embedding AI meaningfully inside them — is going to be very hard. So the next generation will likely come from AI-native systems: voice-heavy, simple to navigate, and, I hope, better organized.

But I have a worry. Many of these scribes did not begin with the chart as their purpose. They began with the note. And so even as they grow patient objects, they're still built around the note as the primary organizing structure for information — which is precisely the wrong structure for longitudinal information management.

## Organize around the patient, not the note

A chart is not a pile of notes. Information in a clinic should be organized around the patient: their goals, the topics they want to discuss, and the medical problems they carry — whether those are short-lived or lifelong.

This is the observation Stream is built on. Information *persists* in documentation. And documentation, as it exists today, is a stack of workarounds — clinicians adapting themselves to the software instead of the software adapting to them. The alternative isn't to make clinicians work around the note, or around the EHR's design. It's to build the system of record to reflect the clinical workflow in the first place. Build software that matches the needs of its users.

Practically, those systems will be adopted first by smaller groups — the settings where the person buying the software sits close to, or *is*, the clinician using it. That's where the gap between user need and product design is smallest, and where better design gets rewarded fastest.

## The trap to avoid

I'm genuinely excited for the next evolution of the EHR. My one hope is that we don't repeat the original mistake: building a skeuomorphic version of the paper chart, still centered on the note, just with a voice interface bolted on top.

We have a rare chance to build something simpler and better organized — a system of record flexible enough to fit clinician workflows instead of forcing clinicians to invent workarounds inside it.

The note was never the point. The patient is. Let's build like we believe that.
