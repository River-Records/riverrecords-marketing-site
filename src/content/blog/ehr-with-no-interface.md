---
title: "An EHR With No Interface Answers the Question and Misses the Patient"
description: "Asking the chart a question gets retrieval right. But a question only returns what you thought to ask, and an answer given to one person is not a place a care team shares. The chart needs better primary views, not fewer."
author: Jacob Kantrowitz MD, PhD
publishDate: 2026-11-20
tags: [ehr-design, clinical-context]
readTime: "6"
draft: false
linkedinCaption: |-
  Say I'm covering for a partner. Her patient with heart failure is up three kilos and short of breath.

  I ask the chart: last ejection fraction? Which loop diuretic, what dose? Two correct answers in a few seconds. That is better than what I do today.

  Here is what I didn't ask, because I didn't know it was there.

  The cardiologist stopped her spironolactone last month for a potassium of 5.6, and wrote down what he would tolerate before trying it again. My partner planned to recheck a metabolic panel before touching the loop diuretic. A nurse recorded that she skips her water pill on the days she takes the bus.

  There is an idea gaining ground in clinical software: that asking and talking could be the main way we meet the record, with very little screen at all.

  I think that gets retrieval right and the job wrong. A question returns an answer to what you thought to ask. Working out who a patient is depends on seeing other people's thinking, in a place the whole team looks at and adds to. An answer given to me is private, and then it is gone.

  Notes do that job badly. So does the chart as most of us know it. Neither is a reason to take the view away.

  What would you want on the first screen of a patient you've never met?
---

Say I'm covering for a partner this week. One of her patients, a woman in her seventies with heart failure, calls in: up three kilos since Monday, more short of breath on the stairs.

Now suppose the record I'm working in has almost no screen. I ask it things. *What was her last ejection fraction? Which loop diuretic is she on, and at what dose?* I get two correct answers in a few seconds, with the source attached. That is better than what I do today, which is open four tabs and scroll.

Here is what I didn't ask, because I didn't know it was there. The cardiologist stopped her spironolactone last month for a potassium of 5.6, and wrote a sentence about what he would tolerate before trying it again. My partner's last plan says to recheck a metabolic panel before touching the loop diuretic. And a nurse took a call two weeks ago and wrote down that the patient skips her water pill on the days she takes the bus.

None of those is an answer to my two questions. All three change what I do next.

## What asking gets right

There is an idea gaining ground in clinical software: that the main way a clinician meets the record could be asking a question or simply talking, with very little screen at all. I want to say what is right about it before I argue with it.

Finding a known thing in a chart is miserable work, and a question is the natural way to do it. If I know I want the last A1c, the date of the colonoscopy or the reason a statin was stopped, asking beats hunting. Talking is easier than typing in front of a patient, and it keeps my eyes on them. And the people drawn to it are reacting to something real. The screens we have are bad enough that getting rid of them sounds like mercy.

So I am not arguing that questions are a gimmick. I am arguing that retrieval is not the job.

## A question returns what you thought to ask

A question is shaped by what the person asking already suspects. That is fine when I know the patient. It fails in the situation where the chart matters most, which is when I don't: the covering visit, the new patient, the person back after a year and three other clinicians.

In that situation I am not looking something up. I am piecing together who this patient is, and most of the material is other people's thinking: the cardiologist's reasoning, the last covering clinician's plan, what the nurse noticed. I can't ask for a thought I don't know someone had. I have to see it.

The obvious reply is that a good system will volunteer what I didn't ask for. I agree, and it should. But the moment it decides what to put in front of me unasked, it is composing a view. The question is whether that view is a designed thing the whole team knows and can correct, or something assembled fresh for one person and then discarded.

## An answer is private, and then it is gone

That second property matters more to me than the first. An answer spoken or typed back to me goes to me. My partner doesn't see what I was told. The nurse can't notice that it left out her phone call. Tomorrow's covering clinician asks slightly different questions and gets a slightly different patient.

Clinical work has long leaned on a representation that sits outside any one head, that the whole team reads and adds to. It is where you find out that someone else already thought about the potassium. It is also where you leave your own thinking for the next person, and where a wrong line gets seen and fixed. The paper chart, for all its faults, [was that kind of shared artifact](/blog/the-paper-chart-was-a-shared-artifact/). A conversation with the record does not give the team that shared place.

## Notes do this badly

It would be easy to conclude that we already have the shared place, and it's the notes. But a note is one person's representation at one moment. It is written for a visit and then frozen. Ten notes are ten separate pictures of the patient, each partly copying the last, and a disagreement between two of them stays invisible unless someone happens to read both. I've argued before that [the note is close to solved and the chart is not](/blog/the-note-is-solved-the-chart-is-not/). This is the same point from the reader's side.

## The chart as we have it does it badly too

The chart is meant to be the shared thing, and in practice it is a commons nobody tends. I called this [the tragedy of the EHR commons](/blog/tragedy-of-the-ehr-commons/) early last year: everyone adds to the record, nobody is responsible for keeping it usable, and someone downstream does the garbage collection.

Part of that is inheritance. The primary views in most clinical software are still the tabs of the paper chart, with notes in one place, labs in another and the medication list in a third, in the order things arrived. The workflows are mostly electronic copies of paper workflows with guard rails added: the order form with checks built in, the in-tray as an inbox, the signed sheet as a signed note. The guard rails were worth having. The shape underneath was never reconsidered.

That is the real grievance behind the no-interface idea, and it is a fair one. The conclusion that the screen should go is wrong.

## Fewer screens is the wrong fix

If the shared view is bad, removing it leaves each clinician alone with their own questions. The fix is to rethink what the primary views are.

I think the first screen should answer what a covering clinician needs before they know what to ask. What are this patient's problems? What does each person involved currently think about each one, and where do they disagree? What changed since I last looked? What is someone waiting on? It should be one place per problem that many people write to and one person can take in.

Voice and questions belong inside that. A question should land me somewhere on the shared view, and its answer should point at something that will still be there for the next person. And workflows should be allowed to grow past their paper originals, so that a plan, once written, does not have to be rewritten on three other lists to get carried out.

The test I would apply to any of this is simple. After I've learned something about a patient, can the next clinician see it without knowing to ask?

*What would you want on the first screen of a patient you've never met?*

---

*Disclosure: this is the problem I work on. Our one line for it is that your EHR keeps the record and Stream keeps the project, and Stream works alongside any EHR. The argument above doesn't depend on that, and not everything I've described exists yet, in Stream or anywhere.*
