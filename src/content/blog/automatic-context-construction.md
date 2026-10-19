---
title: "The Context Should Depend on the Question"
description: "Most EHR work is context reconstruction: rebuilding, by hand, what you need to know before you can answer a lab, a message or a colleague. The EHR's answer is the same bundle for every question. Context should be built from the question itself."
seoTitle: "Automatic Context Construction: Clinical Context Should Depend on the Question"
seoDescription: "Clinicians spend much of their EHR time rebuilding the context a lab result, patient message or colleague's question needs. Why a static bundle of notes and labs fails, and how a clinical knowledge graph can construct context from the input itself."
author: "Jacob Kantrowitz MD, PhD"
publishDate: "2026-10-19"
tags: ["clinical-context", "ehr-design"]
readTime: "7"
draft: false
linkedinCaption: "A potassium of 5.6 lands in my inbox. Answering it takes about ten seconds. Knowing what to answer takes ten minutes: the eGFR trend, whether anyone touched her lisinopril, the NSAID she mentioned in passing, and the line in a two-year-old nephrology note that says spironolactone was stopped for exactly this. None of that is in the result. I have to go and build it. That is most of what EHR work actually is — context reconstruction — and it is expensive, it takes expertise, and it is usually done badly or not at all. The EHR's best offer is the same bundle for every question: last note, all labs, med list, last specialist note. The potassium and the patient asking whether she can take ibuprofen get identical context, and neither gets what it needs. The context should depend on the question. A record built as a clinical knowledge graph can do that, because an input arrives already connected to the things that bear on it. It won't find everything. It doesn't have to — the bar it has to clear is a system that gives every question the same answer:"
---

*Most of the work in the EHR is not answering the question. It is rebuilding what you need to know before you can.*

A potassium of 5.6 lands in my inbox.

Answering it takes about ten seconds. Repeat it, hold the supplement, check a BMP in a week, or send her to the ED. The medicine is not hard.

Knowing *which* of those to do takes ten minutes, because none of what I need is in the result. I need her eGFR, and not just today's — the trend, because a creatinine that has crept up over six months means something different from one that jumped last week. I need to know whether anyone started, stopped or increased an ACE inhibitor, an ARB or a potassium-sparing diuretic, and when. I need to know she has diabetes, and whether anyone has ever raised type 4 RTA. I need to know about the naproxen she mentioned at her last visit, which is in a sentence of the HPI, not on the med list. I need to know whether the sample was hemolysed, and what her potassium usually runs.

And, if I'm lucky, I find the line in a nephrology note from two years ago that says *spironolactone stopped for K 5.9; tolerate up to 5.5 on lisinopril*. That one line changes the answer. It is also the line I am least likely to find.

None of this is the clinical decision. All of it has to happen before the clinical decision can.

## Most EHR work is context reconstruction

We talk about EHR burden as documentation burden, because documentation is what we can see — the note, the clicks, the after-hours charting. But look at where the time actually goes. In one of the larger studies of outpatient EHR use, Overhage and McCallie analysed vendor log data across more than 100 million encounters and found physicians spent an average of about 16 minutes per encounter in the EHR. The largest single share — roughly a third — was **chart review**, more than documentation and more than ordering.

Chart review is the polite name for context reconstruction. It is the work of answering, before anything else, *what do I need to know about this patient to deal with the thing in front of me?*

Every input demands it. A lab result. A patient message asking whether she can take ibuprofen for her knee. A colleague asking why she's on two antihypertensives and not three. A refill request. A fax from the hospital. Each one arrives as a fragment, and each one is only answerable once you have assembled the parts of the record that bear on it.

Three things make that assembly expensive.

**It costs time,** and the time recurs. Context built for this morning's potassium is gone by this afternoon's message. Nobody saves it, because there is nowhere to put it.

**It requires expertise.** Knowing that a potassium needs the RAAS medications, the kidney trend, the diabetes and the NSAID is itself clinical knowledge. That is why it can't be handed to an MA and why it falls, every time, on the most expensive and most interrupted person in the building.

**It is mostly not done.** Not because clinicians are careless, but because the cost is paid in minutes nobody has. So the potassium gets the default response, the ibuprofen question gets a generic answer, and the nephrology note goes unread. The reconstruction that does happen is partial, done under time pressure, and invisible: nothing in the record shows what was checked and what was not.

## The lazy version, and why it doesn't work

EHRs do offer something here. Open the result and you get a context pane: the last note, all the labs, the active med list, maybe the most recent specialist note. Some newer tools summarise the chart before a visit.

What these have in common is that **the context is the same whatever the question.** The potassium, the ibuprofen question and the colleague's question about blood pressure all get the identical bundle.

That bundle fails both ways at once. It is too much — every lab ever drawn, a med list padded with things she stopped taking in 2022 — and it is too little, because the thing that matters is often not in the most recent note. The spironolactone decision lives in a nephrology note from two years ago. The naproxen lives in an HPI. The fact that she declined a third antihypertensive because of orthostatic dizziness lives in a phone note. None of these is "recent", and none of them is in the bundle.

A static bundle answers the question *what has happened to this patient lately?* That is almost never the question being asked.

The question is what was asked. The context has to come from it.

## Context should be built from the input

Run the same patient through three different inputs and see what each one actually needs.

**A potassium of 5.6** needs the kidney function trend, the RAAS and potassium-sparing medications with their change dates, diabetes, recent NSAIDs, prior potassium values, and any earlier decision about how high a potassium is acceptable for her.

**"Can I take ibuprofen for my knee?"** needs the kidney function, the antihypertensives, any anticoagulant or antiplatelet, any history of GI bleed or ulcer, whether she's on a PPI — and, if it exists, the time someone already advised her against NSAIDs and why.

**"Why is she on two antihypertensives and not three?"** needs the blood pressure trend, the medications tried and stopped with the reason for each, the orthostatic symptoms, and the hyperkalemia that ended the spironolactone.

Those are three different slices of one chart. They overlap — the kidney function shows up in all three, and the spironolactone in two — but no one slice is the right answer to all three questions. That is the whole point. A good clinician does this slicing automatically. It is a large part of what experience *is*: knowing, for any given input, which parts of a record bear on it.

The question is whether a record can do that slicing too.

## Why a knowledge graph can

A record organised as a stack of dated documents can't, because a document has no idea what is in it. The potassium and the nephrology note are just two items in a timeline. Nothing connects them except a clinician who happens to remember.

A record organised as a **clinical knowledge graph** is different in kind. Problems, medications, results, decisions and the evidence behind them are nodes, and the relationships between them are explicit. Spironolactone is connected to the hyperkalemia that ended it. The hyperkalemia is connected to the CKD. The CKD is connected to the eGFR results, to the lisinopril, to the nephrologist's plan. The decision "tolerate up to 5.5" is a node, with the note it came from attached as its source.

In that structure, an input does not arrive as a fragment. A new potassium attaches to the graph where potassium already lives, and the things that bear on it are already one or two steps away: the kidney trend, the medications that move potassium, the prior decision about how high is acceptable. The context is not reconstructed. It is *traversed*.

The clinical knowledge of what bears on what — potassium to kidney function to RAAS medications — is encoded once, in the relationships, rather than re-applied from memory every time an inbox item arrives. That is the expertise problem answered: the expertise is not removed, it is stored where it can be used again.

And the result is specific to the question. The ibuprofen message starts from a different node and walks a different path. It reaches the GI bleed history and the anticoagulant the potassium never needed, and it skips the potassium trend the ibuprofen question never needed.

## Better is good enough

The objection writes itself: *what if it misses something?*

It will. A graph only knows what was recorded and linked. It won't know the naproxen if nobody ever wrote it down, and it won't always pull the one oblique fact that turns out to matter. Clinical judgment still decides, and the clinician still reviews. Nothing about this removes the review step, and nothing should.

But that is the wrong comparison. The alternative to constructed context that is 85% right is not a perfect alternative. It is what we have now: the same bundle for every question, or no context at all, plus a clinician who rebuilds the rest by hand on a good day and doesn't have time to on a bad one. Measured against that, getting most of the relevant context, specific to the question, in front of the clinician the moment the input arrives is not a compromise. It is a large improvement on a system whose current answer is effectively none.

Two things make an incomplete answer safe to use. The first is that the context should show where it came from: each fact linked to the note or result it was drawn from, so the clinician can check it rather than trust it. The second is that a structured slice makes gaps visible in a way a pile of documents never does. If the potassium context shows no NSAID history, *no NSAIDs recorded* is a fact you can see and question. In a stack of forty notes, the absence of a mention is invisible.

We should be removing work from clinicians where it hurts the most, and context reconstruction is near the top of that list: expensive, repeated, expert, and mostly not done. It is also a place where better is certainly good enough. A tool that has to be perfect before it helps will never ship, and in the meantime every question still gets the same answer.

## The question is the specification

The EHR treats the question as the thing you have to answer once you have rebuilt the context. It is the other way round. The question tells you what the context has to be.

The potassium tells you to look at the kidneys and the medications that move potassium. The ibuprofen tells you to look at the kidneys, the bleeding risk and the stomach. The colleague's question tells you to look for the decisions already made and why. A clinician does that translation instinctively, because that is what years of practice teach. It is the expensive part, and it happens before any of the medicine.

A record that is organised like clinicians think can do the first pass of that translation itself. Not all of it, and not instead of the clinician — but enough that the ten minutes before the ten-second decision start to disappear.

That is what we are building toward at River Records. If you've felt those ten minutes, you already know why. The work we would most like to take away is not the decision. It is everything you have to rebuild before you can make it.

*If this resonated, [I Don't Read Charts. I Hunt Through Them.](/blog/i-dont-read-charts-i-hunt-through-them/) is about the other half of the same problem: once you know what you need, why finding it in the chart takes so long. [Chart Prep Shouldn't Take Your Staff an Hour Per Patient](/blog/chart-prep-shouldnt-take-an-hour/) covers the version of this that happens before every visit.*

**References**

- Overhage JM, McCallie D Jr. Physician Time Spent Using the Electronic Health Record During Outpatient Encounters: A Descriptive Study. *Annals of Internal Medicine.* 2020;172(3):169–174.
