---
slug: "record-ingestion"
name: "Record Ingestion"
description: "Outside documents, filed under the problems they're about."
headline: "Record Ingestion — Outside Records, Filed by Problem"
subheadline: "Fax or upload a record. Stream reads it, proposes a patient match, and lays its clinical content out under the problems it belongs to — for a person to review."
seoTitle: "Record Ingestion for Outside Documents | Stream"
seoDescription: "Stream reads inbound faxes and uploaded PDFs and sorts their content under the problems it belongs to. Every fact links to its page. Nothing is auto-filed."
hasPage: true
draft: false
order: 7
tags: []
bullets:
  - "Inbound fax and PDF upload"
  - "Excerpts filed under each problem"
  - "Every fact links to its source page"
  - "Proposed tasks, each with the quote that justifies it"
  - "Nothing reaches your note without an explicit click"
faq:
  - question: "Does Stream store the original documents?"
    answer: "Yes. The original is kept, and every excerpt points back into it — click a fact and the source opens at the sentence it came from, highlighted."
  - question: "Does Stream update the chart automatically?"
    answer: "No, and that's deliberate. Every excerpt, medication list, and proposed task waits for a human decision. Stream's job is to put the right thing in front of the right person, ready to accept in one click."
  - question: "Does it reconcile our medication list?"
    answer: "No. Stream shows the medications each document mentions, tells you it's that one document's view, and leaves reconciliation to you. A reconciled patient medication list is on the roadmap."
  - question: "Does this replace my EHR’s media tab?"
    answer: "No. Stream organizes content for documentation; originals can remain in your EHR's repository."
---

Every clinician knows the feeling — a new patient arrives with years of records from outside systems: scanned PDFs, faxed letters, printouts from old EHRs. You spend half the visit scrolling, searching, and summarizing before you can even begin to plan care.

Stream’s **Record Ingestion** is the pipeline that fixes that. It ships as **[Stream Inlet](/intake)**, available on Stream Pro.

Fax a record to your Stream number, or drag up to 10 PDFs at a time into the Documents page. Every page goes through OCR that captures the text *and its position* — so every fact can point back to its exact spot later. Stream proposes a patient match, and a person confirms it before anything is filed.

From there the document’s clinical content comes out as **excerpts** — one per document, per problem. A discharge summary touching diabetes, hypertension, and CKD produces three excerpts, one filed under each problem, each labeled with who wrote it and where it came from.

They’re extracted, not written. Stream pulls facts and classifies them; it doesn’t compose prose about your patient. Every fact is checked against a verbatim span of the source, and facts that can’t be grounded in the actual text are dropped, not shown.

**Nothing is auto-filed.** Excerpts, medications, and proposed tasks all wait for a human decision.

And outside records inform the clinician — they never write the clinician’s note. The only way outside content enters a note is one explicit click, **Include in note**, which inserts it as an attributed quote.

The next time you see the patient, you’re not digging through attachments — you’re continuing from where someone else left off.

[See the full Stream Inlet page →](/intake)
