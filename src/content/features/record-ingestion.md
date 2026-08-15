---
slug: "record-ingestion"
name: "Record Ingestion"
description: "Outside documents, filed under the problems they're about."
headline: "Record Ingestion — Outside Records, Filed by Problem"
subheadline: "Fax, upload or paste a record. Stream reads it, proposes a patient match, and lays its clinical content out under the problems it belongs to — for a person to review."
seoTitle: "Record Ingestion for Outside Documents | Stream"
seoDescription: "Stream reads inbound faxes, uploads and pasted text, and sorts their content under the problems it belongs to. Every fact links to its page. Nothing is auto-filed."
hasPage: false
draft: false
order: 7
tags: []
bullets:
  - "Inbound fax, PDF upload, text files or pasted text"
  - "A short clinical summary of every document"
  - "Excerpts filed under each problem"
  - "Every fact links to its source page"
  - "Proposed tasks you approve, never auto-created"
faq:
  - question: "Does Stream store the original documents?"
    answer: "Yes. The original is kept, and every excerpt points back into it — click a fact and the source opens at the sentence it came from, highlighted."
  - question: "Do I review things before they land?"
    answer: "Yes. You approve excerpts and proposed tasks, and you decide whether an extracted medication list goes into your documentation. Nothing is auto-filed and nothing is created behind your back."
  - question: "Does Stream update the chart automatically?"
    answer: "No, and that's deliberate. Every excerpt, medication list, and proposed task waits for a human decision. Stream's job is to put the right thing in front of the right person, ready to accept in one click."
  - question: "Does it reconcile our medication list?"
    answer: "No. Stream shows the medications each document mentions, tells you it's that one document's view, and leaves reconciliation to you. A reconciled patient medication list is on the roadmap."
  - question: "Does this replace my EHR’s media tab?"
    answer: "No. Stream organizes content for documentation; originals can remain in your EHR's repository."
---

<!--
This page is no longer generated. /features/record-ingestion 301s to /intake
(see public/_redirects) so the two pages stop competing for the same search.
hasPage: false keeps the entry as a card on the features index — where the
pinned Stream Inlet card carries the link — and stops Astro building the
standalone page, which is what lets the redirect fire on Cloudflare Pages.

The body below is kept, corrected and unrendered, in case the page is restored.
-->

Every clinician knows the feeling — a new patient arrives with years of records from outside systems: scanned PDFs, faxed letters, printouts from old EHRs. You spend half the visit scrolling, searching, and summarizing before you can even begin to plan care.

Stream’s **Record Ingestion** is the pipeline that fixes that. It ships as **[Stream Inlet](/intake)**, a metered add-on to Stream Pro.

Get a record in however it reaches you. Fax it — Stream provisions a number on Sinch, whitelisted and managed by River Records, or connects to your clinic’s own Spruce Health account if you already run one. Or upload PDFs and text files from the Documents page, or paste text straight in. Everything goes down the same pipeline from there.

Every page goes through OCR that captures the text *and its position* — so every fact can point back to its exact spot later. Stream proposes a patient match, and a person confirms it before anything is filed.

Then the document’s content comes out in four forms.

A **summary** — every document gets a name, a date, and a short clinical summary, so you know what arrived without reading twelve pages of it.

**Excerpts** — one per document, per problem. A discharge summary touching diabetes, hypertension, and CKD produces three excerpts, one filed under each problem, each labeled with who wrote it and where it came from. They’re extracted, not written: Stream pulls facts and classifies them rather than composing prose about your patient, every fact is checked against a verbatim span of the source, and facts that can’t be grounded in the actual text are dropped rather than shown.

**Medications** — what that one document says, each verified against the source and linked to its line on the page. It isn’t a reconciled list, and Stream says so rather than implying otherwise.

**Proposed tasks** — the follow-ups the document is actually asking for, each carrying the exact quote that justifies it. Proposals stay proposals until you accept them.

**Nothing is auto-filed.** You approve excerpts and proposed tasks, and you decide whether an extracted medication list goes into your documentation.

And outside records inform the clinician — they never write the clinician’s note. The only way outside content enters a note is one explicit click, **Include in note**, which inserts it as an attributed quote. The summary, the full document, and a document’s medication list can go in the same way, by the same click — the medication list attributed as *from external records*.

The next time you see the patient, you’re not digging through attachments — you’re continuing from where someone else left off.

[See the full Stream Inlet page →](/intake)
