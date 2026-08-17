---
title: "Filed Isn't the Same as Read"
description: "Introducing Stream Inlet. Every record that arrives at Stream gets read, filed to the right patient, and laid out under the problems it concerns — with every fact one click from the page it came from."
seoTitle: "Filed Isn't the Same as Read — Introducing Stream Inlet"
seoDescription: "Most practices have solved fax routing. What isn't solved is what happens after the document reaches the right person. Stream Inlet reads inbound records, files their content under the problem it concerns, and links every fact to its page — reviewed by a human, never written into your note."
author: "Jacob Kantrowitz MD, PhD"
publishDate: "2026-08-18"
featured: true
tags: ["product-updates", "information-chaos", "care-coordination"]
readTime: "6"
draft: false
linkedinCaption: "Somewhere in your charts right now is a specialist letter from four months ago that answers a question you're going to ask again next week. It arrived. Someone looked at it. Someone filed it under the right patient, on the right day, in the right folder. Nothing failed. And when that patient is in front of you and the question comes up, you'll either remember the letter exists and go find it, or you won't. The second outcome is the one nobody counts — there's no error to review, no task left open, no one to tell. Most practices have already solved fax routing: documents land, get assigned, get cleared. What nobody has solved is everything after the document reaches the right person. Reading it. Knowing which of this patient's problems it actually concerns. Carrying it forward to the moment six weeks from now when it matters. The question I've started asking physicians instead of whether they're overwhelmed: does the reading happen before the visit, or during it? If during, you're doing retrieval under time pressure with the patient watching. If before, you're doing it in the evening on your own time. Today we're shipping Stream Inlet — and the part I care most about is what it doesn't do. The code that reads inbound documents is structurally separate from the code that drafts your notes. Not by policy: an automated test fails our build if the note-generating path so much as imports the excerpt reader. It reads the document. It doesn't write your note."
---

*Introducing Stream Inlet.*

Somewhere in your charts right now is a specialist letter from four months ago that answers a question you are going to ask again next week.

It arrived. Someone looked at it. Someone filed it under the right patient, on the right day, in the right folder. Nothing failed. And when that patient is in front of you and the question comes up, you will either remember the letter exists and go find it, or you won't.

The second outcome is the one nobody counts. There's no error to review, no task left open, no one to tell. The information was there and it wasn't retrieved, and the visit proceeds as though it never arrived at all.

## The problem is retrieval, not routing

I want to be careful here, because a lot of practices already have this half solved and they know it.

If you have digital fax, you probably have arrival, assignment, and pending working reasonably well. Documents land, they get routed to a person, the person clears them. That part is a solved problem in a lot of offices, and I'm not going to pretend otherwise to make a point.

What isn't solved is everything after the document reaches the right person. Reading it. Knowing which of this patient's problems it actually concerns. Carrying its content forward to the moment six weeks from now when it matters. A filed document is a container that has to be opened by someone who remembers to open it.

Here's the question I've started asking other physicians instead of asking whether they're overwhelmed: **does the reading happen before the visit, or during it?**

If it happens during, you're doing retrieval under time pressure with the patient watching. If it happens before, you're doing it in the evening on your own time. Either way you're paying for it, and either way the cost is invisible on every dashboard in the practice.

If information has to be resurfaced, it was lost. That's the same failure I've written about elsewhere as [hunting through charts rather than reading them](/blog/i-dont-read-charts-i-hunt-through-them) — the work isn't comprehension, it's locating the thing you already comprehended once.

## What we built

Stream Inlet reads every record that arrives at Stream — by fax or by upload — files it to the right patient, and lays its clinical content out under the problems it belongs to, as excerpts, medications, and proposed follow-ups. Every one of them is a single click from the sentence on the page it came from. Nothing is filed, written, or actioned without a human decision.

In practice that means a few specific things.

**You get a fax number.** We provision it on Sinch, whitelisted and managed on our side. If your practice already runs Spruce Health, Stream Inlet works as an integration on your own Spruce account instead. Inbound faxes process without anyone touching them: the carrier signature is verified, the fax is routed by the number dialed, the file is pulled, and processing begins. A carrier retry never creates a duplicate. Anything that arrives on paper or at your old line can be scanned and uploaded as a PDF from the Documents page and enters the same pipeline — ten at a time, 15MB each.

**Every document gets read.** Each one comes back with a name, a date, a short clinical summary, and a type. Stream proposes a patient match — an existing patient, a new patient created from the name and date of birth on the page, or not a patient document at all. If a batch turns out to contain several documents, or several patients, Stream detects that and holds it for a person rather than guessing. A clinician can release the hold explicitly. And a person confirms the patient before any clinical extraction proceeds.

**Content lands under the problem it concerns.** One excerpt per document, per problem, canonicalized onto the problems already on the Stream chart rather than spawning near-duplicates of them. Each excerpt carries a status line and three groups — what the data says, what was done, what happens next — plus ICD codes where the document provides them. Author, institution, and date come off the letterhead and signature block and get stamped on every excerpt from that document; correct one of those fields once and the correction propagates to all of them.

Facts are extracted and classified, not composed. If a fact can't be grounded in a verbatim span of the source, it's dropped rather than shown to you. That is a deliberate trade: I would rather Stream Inlet miss something than hand you a sentence that reads like a finding and isn't one.

**Follow-ups come with their receipts.** Each proposed task carries an imperative action, a type, the problem it belongs to, and the exact quote from the document that justifies it. No verbatim quote, no task. Timeframes are taken word-for-word from the source, and where the source doesn't give one, the field stays empty rather than getting filled in with a plausible interval.

The extractor excludes continuation of existing medications, safety-net boilerplate, plan-of-care summaries, prose rephrased as an action, and duplicate actions. Most consult letters ask you to do approximately nothing, and an empty list is a valid and common result. Three real follow-ups, not thirty plausible ones. A list short enough to trust is a list you'll actually read.

Proposals stay proposals. Accept, edit, or delete, and the session commits on one Save with a conflict check. The ones you accept become tracked items rather than sentences in a document nobody will reopen, which is most of what it takes to stop [a referral loop from dying quietly](/blog/where-referrals-go-to-die).

## It reads the document. It doesn't write your note.

This is the part I care most about, so I'll be plain about it.

The code that reads excerpts is structurally separate from the code that drafts your notes. Not by policy, not by convention — an automated test fails our build if the note-generating path so much as imports the excerpt reader. Outside content cannot reach your note by accident, because there is no path it can travel on its own.

There is exactly one path, and you have to take it on purpose: **Include in note**, one click, which inserts the content as an attributed quote.

I've talked to enough physicians about ambient AI to know that the fear isn't that the tool will be useless. It's that something will end up in your note, over your signature, that you didn't write and didn't check. Stream Inlet is built so that can't happen quietly.

The same principle runs through everything else. Nothing is auto-filed. Excerpts, medications, and proposed tasks all wait for a human decision. "No action" and "Dismiss" both preserve the underlying data and both tell you where it remains visible. Each practice's data sits in its own database, and carrier credentials are write-only — never displayed again after entry.

## What it doesn't do

Worth saying clearly, because I'd rather you find out here than in month two.

Stream Inlet **does not reconcile your medication list.** It surfaces the medications a document mentions, each one verified against the source with its own page location, in the Review Required view only. That's one document's snapshot at one point in time, not a reconciled list — there's no Accept button on it, because Accept would imply a write to a reconciled list that doesn't exist yet. It's on the roadmap. It isn't here.

It also doesn't pull labs, vitals, or imaging into structured data. Not built yet.

## Getting started

There's no cutover day. You get a Stream number and your existing line keeps running exactly as it does now — we're not porting anything at launch, and nothing breaks on a Tuesday because of us.

We also make the calls. As part of setup, we contact your highest-volume senders with the new number — usually around ten of them: the hospital records department, the two or three specialty groups you refer to most, the imaging center. Your front desk doesn't have to do it. The rest migrate over time as you update directory listings and referral forms.

Stream Inlet is available on Stream Pro as a metered add-on, and it runs on the Stream chart itself. Starter is $89/month for 500 pages, Practice is $199/month for 1,500, and Practice+ is $349/month for 3,000. Setup is $299 and covers routing, testing, a staff walkthrough, and those outreach calls. Overage runs $0.14 per page and you're notified at 80% of your allowance. Junk faxes are filtered and never billed.

Stream remembers your patient. Stream Inlet is the part that makes that true for everything that arrives — including the letter from four months ago that answers the question you're about to ask again.

Stream Inlet ships August 18, 2026.

[See how Stream Inlet works →](/intake)
