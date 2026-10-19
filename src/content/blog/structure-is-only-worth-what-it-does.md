---
title: "Structure Is Only Worth What It Does for You"
description: "Many clinicians want an AI scribe that fills every field their EHR template offers. But most of those fields do nothing with what you put in them. Structure earns its clicks only when something downstream uses it — and that is a different thing from the boxes."
seoTitle: "Should an AI Scribe Fill Every EHR Field? Structure Is Only Worth What It Does"
seoDescription: "Clicking into separate Subjective, Objective, Assessment and Plan boxes is EHR design, not a billing or regulatory requirement. Why note-section fields rarely earn their clicks, which discrete data still does, and where structure actually pays off."
author: "Jacob Kantrowitz MD, PhD"
publishDate: "2026-10-19"
tags: ["ehr-design", "ai-scribe"]
readTime: "6"
draft: false
linkedinCaption: "One of the most common requests I hear about AI scribes: \"Will it fill in all my EHR's fields?\" The Subjective box, the Objective box, the Assessment box, the Plan box, and the four others the template insists on. I understand why. Those boxes are where the clicks go, and anything that takes the clicks away sounds like relief. But it's worth asking what those boxes actually do. In most EHRs, the answer is: nothing. Text typed into a Subjective box sits in a Subjective box. It isn't tracked, it doesn't trigger anything, and it doesn't come back to help you next visit. The heading \"Subjective\" in a single block of text carries the same information, minus three clicks. Separate section fields aren't a billing requirement and they aren't a regulatory one. They're a design choice. Structure is worth having — but only when something downstream uses it. That's the test, and most template fields fail it:"
---

*A section field is only worth the clicks if something downstream uses it.*

One of the most common things I hear from clinicians evaluating an AI scribe is some version of: *will it fill in all my fields?*

They mean the template. The Subjective box. The Objective box. The Assessment box, the Plan box, and the four others the template insists on — each one a click to open, a click to focus, and often a click to save. Many EHRs are built this way, and many clinicians spend a meaningful part of every visit moving text from one box to the next.

I understand the request completely. Those boxes are where the clicks go. Anything that promises to take the clicks away sounds like relief, and a scribe that fills each box automatically sounds like the most relief of all.

But before asking a tool to fill the boxes, it's worth asking a simpler question: **what do the boxes do?**

## Most section fields do nothing with what you put in them

In most EHRs, the honest answer is: not much.

Text typed into a Subjective field sits in a Subjective field. It is not parsed, tracked or reasoned over. It doesn't trigger a reminder, populate a registry or surface at the next visit. When the note is printed, signed or faxed, the fields are concatenated into a single document with the section names as headings — which is to say, the end product is exactly what you would have had if you'd typed the word *Subjective* and kept going.

That is the test I'd apply to any piece of structure in a chart: **does anything downstream use it?** If the answer is no, the structure isn't structure. It's a form. You pay for it in clicks on every visit and get nothing back on any of them.

The heading "Subjective" in a block of free text carries the same information as a Subjective field. A reader can find it. A colleague can find it. An auditor can find it. It just doesn't cost three clicks to produce.

## It isn't a billing or regulatory requirement

This is the part that surprises people, because the fields feel mandatory. They are presented as the shape a note must take.

They aren't. Since the 2021 E/M changes, office visit level is selected on medical decision-making or total time, and what has to be documented is the content that supports that choice — the problems addressed, the data reviewed, the risk of the management decisions — not the box it was typed into. The medical record has to be complete, legible, attributable and signed. Nothing in the coding rules or in Medicare's documentation requirements says the assessment must live in a separate field from the history.

SOAP is a sound way to organise a note. It is a convention, not a regulation. A note with clear headings in a single field meets it. The click-through template is a design choice the EHR made, and like any design choice it can be judged on whether it earns its cost.

It's worth being precise about what this does *not* include. Some of what an EHR asks you to enter really is discrete data that the system uses: medication orders, allergies, immunizations, vitals, lab orders, the problem list in some systems, and the specific fields that feed quality measures. Those are worth entering in the EHR, because something reads them. The argument here is about the *note sections* — the boxes for history, exam, assessment and plan that hold prose and then do nothing with it.

## Where structure actually earns its keep

None of this is an argument against structure. It's an argument for putting structure where it does work.

A note becomes genuinely more useful when its contents are organised by **problem** and connected to the rest of the record. When the assessment and plan for hypertension are linked to the hypertension itself — not just filed under a heading in today's note — then the next visit can start from that problem's current state. The plan made in March is still there in June. The repeat BMP you said you'd check is attached to the problem it was for, so if it never happened, something can notice.

That kind of structure does things:

- **It maintains a problem list tied to real documentation.** Each problem carries the notes, results and decisions behind it, so the list reflects what has actually been addressed rather than whatever was clicked into it once.
- **It surfaces what's falling off.** A follow-up written into a plan becomes something that can resurface when it's due, instead of something you have to personally remember across hundreds of patients.
- **It reminds you what you're working on.** The open questions and in-progress changes for each problem are visible at the start of the next visit, without rereading three notes to rebuild them.
- **It becomes context for the next piece of writing.** The next note, or the referral letter to a specialist, can draw on the specific problem's history rather than on everything in the chart.

This is structure that is worth having, because something downstream reads it — usually you, a few weeks later, at the moment you need it.

The difference between this and the template is not whether there's structure. It's who builds it and whether it's used. The template asks you to build structure by hand, field by field, and then mostly ignores it. Useful structure should be built *for* you, from what you already said and wrote, and then put to work.

## What this means for the boxes

So here is the practical alternative, and it is deliberately unglamorous.

We don't write back into each of your EHR's fields. That is a real limitation, and if automated field-by-field write-back is a hard requirement for you, it's a legitimate reason to choose a different product. What Stream produces instead is a single, well-organised note in one block of text, with clear headings, that copies in one click.

Paste it into the one free-text field your template will inevitably have — often labelled *Other*, *Note* or *Free text* — or ask your EHR administrator for a blank template with a single body field. Most EHRs support one. Then let your EHR do what it is genuinely good at: holding the signed legal record, the orders, the medications and the billing.

Meanwhile, the structure that matters is built and maintained on our side, where it can work alongside any EHR: problems linked to the documentation behind them, plans that persist, follow-ups that come back, and the context the next note or letter needs.

Yes, this suits us. A product without field-level write-back has an obvious reason to argue that field-level write-back isn't the point. I'd ask you to judge the argument on its own terms rather than on who's making it, and the terms are simple: for each field your template makes you click into, ask what it does for you later. If the answer is nothing, it isn't worth the click — whether a person fills it or a scribe does.

## The test is downstream

The question isn't whether a note is structured. The question is whether the structure ever gives anything back.

A field that holds text and does nothing with it is a cost with no return, and automating it only hides the cost. A record that organises what you documented by problem, remembers what you planned and hands it back when it matters is structure doing its job.

Let the EHR keep the record. Let the structure be built for you, somewhere it's actually used. And stop clicking into boxes that never click back.

*Related: [The Bridge, Not the Destination](/blog/the-bridge-not-the-destination/) is the longer version of why the structured, problem-organised record lives alongside the EHR today rather than inside it.*
