---
title: "The Bridge, Not the Destination"
description: "Why the patient-organized chart is hard to ship today — EHR integration limits, FHIR, and double validation — and the pragmatic bridge clinicians can build right now."
seoTitle: "The Bridge, Not the Destination | A Pragmatic Path to the Patient-Organized Chart"
seoDescription: "The next-generation, problem-organized chart can't fully ship today: most EHRs block structured write-back and automated FHIR charting. Here's the honest bridge clinicians can build in the meantime."
author: "Jacob Kantrowitz"
publishDate: "2026-06-15"
featured: false
tags: ["ehr-design", "clinical-context", "longitudinal-care"]
draft: false
linkedinCaption: "Last time I argued the medical record should organize around the patient, not the note. Fair enough — but I owe that argument an honest footnote: in its full form, it can't ship today. Most EHRs won't let outside software write structured data back into the chart, and the few that do make you validate the same fact twice. So we're left waiting on incumbents who aren't especially incentivized to fix it, or on whole new systems that are years away. There's a pragmatic third option: keep pushing unstructured notes into the EHR for the medical-legal and billing record, but maintain a clean, problem-organized copy outside it. It's not free — now there are two places the truth can live, and a real risk of drift. But you get most of the value now: automate the busywork, and finally see what's active, what's quietly falling off, and what needs readdressing before it becomes a problem. A bridge is not the destination. But bridges carry people across while the real road is still being built."
---

*Why the next-generation chart is hard to ship today — and what clinicians can actually do in the meantime.*

In a previous post, I argued that the note is the wrong thing to organize a medical record around. The real work is the chart: a record where the things that matter about a patient persist on their own, so a clinician never has to *know to look* for a prior heart attack or a failed medication. Organize around the patient's problems and topics, let the note and the bill fall out as byproducts, and you get a record that still makes sense ten clinicians and ten years from now.

I still believe that. But I owe the argument an honest footnote: in its full form, that vision is out of reach today. Here's why — and what I think we can do about it right now.

## Why the full vision can't ship yet

The persistence layer I described depends on software being able to write structured information back into the chart — to push, update, and resolve problems automatically. Most EHRs simply don't permit that depth of integration. And almost none allow automated, problem-based charting through FHIR, the standard that's supposed to make this kind of interoperability possible.

Where some version of it *is* technically possible, it usually arrives with a catch that quietly kills it: every piece of data has to be validated by a human the moment it crosses the EHR's threshold. So the clinician validates the same information twice — once in the outside system that generated the structure, and again inside the EHR that has to accept it. Double the review for the same fact. For essentially every clinician, that's untenable. It's slower than the broken status quo, and the whole point was to make care simpler to see, not harder to enter.

## The two waiting games

That leaves two ways to wait, and neither is satisfying.

The first is to wait for the incumbent EHRs to fix this themselves. But they aren't especially incentivized to. Deep, open, problem-level integration isn't where their commercial interests point, and "we made it easier for an outside tool to write to our chart" is not a roadmap item most of them are racing toward.

The second is to wait for entirely new systems that solve persistence *and* the rest of the end-to-end workflow at once — billing, orders, results, scheduling, the whole stack. That's the right long-term answer. It's also a long road, and clinicians need help before it's paved.

## The pragmatic third option

So here's the less elegant thing we can do today. Keep pushing unstructured documentation into the EHR, where it satisfies the medical-legal and billing record. But maintain a well-structured, genuinely easy-to-use copy *outside* the EHR — one organized around problems and topics the way the chart should be.

I won't pretend this is free. It worsens information scatter: now there are two places the truth can live. And it introduces a risk of drift between the two copies that doesn't exist when everything sits in a single system. Those are real costs, and anyone who tells you otherwise is selling something.

But look at what you get in return. With structured documentation outside the EHR, it becomes far easier to actually keep track of what's going on with a patient. You can automate the busywork clinicians do by hand today. And you can produce something genuinely useful — a daily huddle view, for instance: one place to see what's active, what's quietly falling off, and what needs to be readdressed before it becomes a problem.

That's not nothing. That's most of the day-to-day value of the persistence vision, available now, without waiting for the ecosystem to grant permission.

## Why the bridge is worth building

A bridge is not the destination, and it's worth being clear-eyed about that. The structured copy outside the EHR is a workaround — a better one, but a workaround. The destination is still a single system where documentation, structure, and the record are the same thing, and where nothing has to be entered twice.

But bridges matter. They carry people across while the real road is still being built. If we can give clinicians most of the benefit of a well-organized, persistent chart today — and accept the honest tradeoffs of doing it alongside an EHR that won't fully cooperate yet — that's a better place to stand than waiting for incumbents who aren't coming, or for a future that isn't here.

The destination hasn't changed. We just have to be honest about the terrain between here and there.

---

*Disclosure: building toward this is what I spend my time on. As with the last post, I've kept the argument product-agnostic — the idea should stand on its own.*
