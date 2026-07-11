---
title: "Normalize the Surface, Personalize the Projection"
chapterLabel: "Chapter 12"
part: "Part III — After the Note"
order: 13
description: "Consistency versus clinician autonomy is a layer error. Customize the projection, never the artifact — and scope personalization to readership."
seoTitle: "Normalize the Chart Review Surface, Personalize the Projection"
seoDescription: "Consistency versus clinician autonomy is a layer error. Customize the projection, never the artifact — and scope personalization to readership."
relatedPosts:
  - slug: "i-dont-read-charts-i-hunt-through-them"
    title: "I Don't Read Charts. I Hunt Through Them."
  - slug: "normalization-makes-personalization-possible"
    title: "Normalization Is What Makes Personalization Possible"
draft: false
---

Chapter 9 established that chart review is a re-orientation problem: the BMP
takes two seconds because the grid never moves; the outside consult takes four
minutes because its structure must be re-derived before its content can be
judged. The remedy seems obvious — make every document predictable — and it
immediately collides with an objection every physician will raise. This
chapter states the remedy precisely, answers the objection, and derives the
design constraints that keep the remedy from curdling into harm.

## 12.1 The proposal

**Every note, when you are reviewing it, appears in the same form. Every lab,
when you are reviewing it, appears in the same form.**

Not the same *content* — the content is sacred and it varies. The same *form*.
Assessment always in the same place. Plan always in the same place. Medication
changes always surfaced the same way. Outside records rendered into the same
structure as internal ones. A rheumatologist's note, a nephrologist's note,
and your own note from last March all presenting themselves with the same
architecture, so your eye stops having to ask where things are.

The point of normalization is that structure becomes **invisible** — and when
structure is invisible, one hundred percent of attention is available for
content. This is exactly what the standardized chemistry panel already does,
and why it takes two seconds. Nobody thinks the rigid grid flattens the nuance
of electrolyte disorders; the rigid, boring, utterly predictable grid is
precisely what allows an experienced clinician to see subtlety instantly. Form
discipline is what makes content discernment possible. We have this for labs.
We have it for vitals. We have never had it for the thing physicians spend
most of their review time on: each other's prose.

## 12.2 "But my notes are how I think"

This is the honest objection, and it deserves a straight answer.

Yes. Notes carry voice, nuance, hedging, uncertainty — the texture of clinical
judgment. A note flattened into rigid fields becomes a checkbox exercise, and
we all know how those read: technically complete, clinically useless
(Chapter 5's perfect-looking notes). Physicians have spent years tuning how
they document, and they are right to defend it.

But notice the sleight of hand in the objection. It conflates the **authoring
surface** with the **review surface**. They don't have to be the same thing.

Write however you think best. Dictate, dictate badly, use your shorthand,
hedge in prose, put the thing you're worried about in the place that means
something to you. Then let the *review* surface be normalized — the same
underlying content, rendered consistently for whoever has to consume it: your
partner, the covering NP, or you in eight months. Normalizing review doesn't
require flattening authorship. It requires the system to do the work of
translation — which is exactly the kind of work a system should do and a
physician never should.

## 12.3 The layer error

Push one level deeper and the whole apparent conflict dissolves.

Physicians say two things that sound like a contradiction. First: *stop making
every note a different shape* — every consult a different layout, every
institution a different template, every outside record a wall of
undifferentiated text; just make it consistent so I can find what I need.
Second: *don't touch my templates* — I've spent years tuning how I document;
leave me alone.

These get treated as a tradeoff — consistency versus autonomy, pick one — and
that framing is why medicine ended up with the worst of both: notes that vary
wildly for the people who *read* them, tools that stay rigid for the people
who *write* them. Customization exactly where it hurts, rigidity exactly where
it doesn't help.

There is no tradeoff. There is a **layer error**. What creates scatter is not
that clinicians differ — it's that their differences get *baked into the
artifact*. When you choose a template, the choice doesn't stay with you; it
rides along with the note, into the chart, out to the referring physician,
into the record another clinician opens in four years. Your preference becomes
everyone's problem. Modern EHRs are in fact enormously configurable — which is
precisely why note formats diverge so violently across institutions. Medicine
already has abundant customization. It's customization of the wrong layer.

Now consider customization at the moment of *reading*. The record arrives as
structured data. It renders into your layout, on your screen, according to
your preferences. Nothing about your preference touches the underlying record;
nothing propagates. The next clinician opens the same data and sees it in her
layout. Same information, two readers, two shapes, zero scatter.

And here is the key dependency: **you cannot reproject a blob of text.** Once
a note is prose, its structure is fossilized — the only thing a reader can do
is read it in the order it was written. Once information is extracted,
categorized by problem, and sorted into named buckets, arrangement becomes a
*rendering decision* rather than a property of the document — made once per
reader instead of once per writer. The same logic runs in reverse on the
authoring side: if writing emits structured data rather than a text blob, the
input surface can be anything the writer wants, because nothing idiosyncratic
escapes into the record.

So the principle, in four words: **customize the projection, never the
artifact.** Normalization is not the opposite of personalization. It is the
precondition for it. The reason today's EHR cannot adapt to you is not that
it's rigid — it's that its contents are unstructured, and unstructured
contents can only be presented one way: the way they were typed. Rigidity is
downstream of formlessness. Give the data form, and every reader can have it
their way.

## 12.4 Three constraints

Powerful ideas in clinical software have a way of becoming harmful without
much fanfare. Three constraints keep this one safe.

**Arrangement, not inclusion.** Let clinicians reorder, emphasize, collapse,
gray out, push to the bottom. Do not let them make a bucket disappear. The
temptation will be enormous — users will ask (*I never look at social history,
hide it*) and it will feel like respecting their expertise. It isn't. A system
that solves scatter by letting clinicians hide categories has traded one
component of information chaos for another: the physician who suppressed
social history in 2024 is the physician who doesn't know the patient became
homeless in 2026. And there is something here too valuable to squander:
**absence is clinical information.** A normalized surface is the first tool in
the history of the chart that can show you what *isn't* there — no
colonoscopy, ever; no documented social history; no recorded reasoning for a
stopped medication. The empty bucket, displayed, is a finding.

**Defaults are the product.** Most clinicians will never open the settings
panel. Whatever ships as the default surface is what nearly everyone
experiences, permanently. The default therefore has to be defensible on its
own — thought through, argued over, tested — with customization as the escape
hatch for the minority who need it, not the pitch. Any product whose value
proposition is "configure it however you want" has quietly outsourced its
hardest design decision to people who are already running behind.

**Customization is scoped to readership.** Not every surface has one reader.
Your private chart-review view does — arrange it to the pixel. But a handoff
has a receiving clinician; a sign-out has a night team; a teaching view has a
resident; a screen-share has a room. The moment a surface has more than one
reader, personal arrangement stops being a courtesy to the reader and becomes
an imposition on them. Two physicians looking at the same chart should be able
to say *it's in the box under the assessment* and mean the same thing; if
layouts differ, pointing at locations stops working — precisely at the seams
where medicine is most fragile: teaching, sign-out, coverage, handoff. So the
rule follows the audience. A surface with one reader belongs to that reader. A
surface with a team belongs to the team — agreed once, arranged the way the
unit actually works, not overridable by whoever opens it. A surface with
unbounded readership — the record itself, the thing someone you will never
meet reads in four years — belongs to nobody and never moves at all. You may
customize exactly as far as your readership extends. Past that line, your
preference is someone else's scatter.

A naming discipline helps at every scope: refer to *things*, not *places* —
"look at the outstanding items," never "look at the top right." This is
already how we talk about the BMP: nobody says "the third number down";
everyone says "the creatinine." Shared vocabulary is a sturdier foundation
than shared geometry. But naming is the safeguard; scoping is the design.

## 12.5 What this closes

Chapter 9 promised two directions out of the work before the work.
Externalizing the system (Chapters 10–11) makes the work of care
*transferable*: it lives in a durable, problem-organized workspace instead of
in one exhausted mind. Normalizing the surface makes it *reviewable*:
whatever the workspace contains presents itself to every reader in a
predictable — and, within scope, personal — shape. You need both. A shared
system that every clinician has to re-orient to is barely shared at all; a
beautifully consistent surface over an unstructured record is a coat of paint.

Together, they retire the hallway. Find the thing, review it, move on — with
your full attention spent where you trained to spend it.

Medicine has customization backwards: infinitely tunable where it damages
every downstream reader, immovable where it would cost nothing and help
enormously. Turn it around.
