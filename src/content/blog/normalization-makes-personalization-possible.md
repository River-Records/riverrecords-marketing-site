---
title: "Normalization Is What Makes Personalization Possible"
description: "Consistency versus autonomy is a false tradeoff — it's a layer error. Customize the projection, never the artifact. Why structured data is the precondition for a chart that adapts to every reader."
seoTitle: "Normalization Is What Makes Personalization Possible — Customize the Projection, Not the Artifact"
seoDescription: "Medicine has customization backwards: tunable where it damages every downstream reader, immovable where it would help. The case that normalization is the precondition for personalization, scoped to readership."
author: "Jacob Kantrowitz MD, PhD"
publishDate: "2026-07-09"
featured: true
series: "The Work Before the Work"
seriesPart: 4
tags: ["information-chaos", "clinical-context"]
readTime: "8"
draft: false
linkedinCaption: "Physicians say two things that sound like a contradiction. First: stop making every note a different shape — just make it consistent so I can find what I need. Second: don't touch my templates, I've spent years tuning how I document. These get treated as a tradeoff — consistency versus autonomy, pick one — and that framing is why medicine ended up with the worst of both: notes that vary wildly for the people who read them, tools that stay rigid for the people who write them. But there is no tradeoff. There's a layer error. What creates scatter isn't that clinicians differ — it's that their differences get baked into the artifact and ride along with the note forever. Customize the projection. Never the artifact. Normalization isn't the opposite of personalization. It's the precondition for it — because you cannot reproject a blob of text, but you can render structured data any way each reader likes. Medicine has customization backwards: infinitely tunable where it damages every downstream reader, immovable where it would cost nothing and help enormously. Turn it around."
---

*Consistency versus autonomy is a false tradeoff. It's a layer error — and structured data is the fix.*

Physicians say two things that sound like a contradiction.

The first: *stop making every note different.* Every consult a different shape, every institution a different template, every outside record a wall of undifferentiated text. Just make it consistent so I can find what I need.

The second: *don't touch my templates.* I've spent years tuning how I document. I know where I put things. Leave me alone.

These get treated as a tradeoff — consistency versus autonomy, pick one — and the tradeoff is why medicine has ended up with the worst of both. Notes vary wildly for the people who read them, and the tools remain rigid for the people who write them. We have customization exactly where it hurts and rigidity exactly where it doesn't help.

There is no tradeoff. There's a layer error.

## The problem was never variation

I've argued that normalizing the review surface is what lets a clinician stop hunting through charts — that the standardized chemistry panel takes two seconds precisely because the grid never moves. I stand by that. But I stated the principle imprecisely, and the imprecision matters, because it makes the whole thing sound like an argument for uniformity. It isn't.

What creates scatter is not that clinicians differ. It's that their differences get **baked into the artifact**.

When you choose a template, that choice doesn't stay with you. It rides along with the note, into the chart, out to the referring physician, into the record another clinician will open in four years. Your preference becomes everyone's problem. One physician's idiosyncrasy, multiplied across every reader downstream, forever. Modern EHRs are in fact enormously configurable — and this is exactly why note formats diverge so violently across institutions. Medicine already has abundant customization. It's just customization of the wrong thing.

Now consider a different kind of customization, one that happens at the moment of reading. The note arrives as structured data. It renders into *my* layout, on *my* screen, according to *my* preferences. Nothing about my preference touches the underlying record. Nothing propagates. The next clinician opens the same data and sees it in her layout.

Same information. Two readers. Two shapes. Zero scatter.

## Invariance is personal, not universal

Here's what I got wrong the first time.

I claimed structure becomes invisible when it's consistent across everyone. That's not quite it. Structure becomes invisible when it's consistent **for you** — when your eye lands on the assessment without being told, because in every document you have ever opened, the assessment was in that spot.

Global uniformity was only ever a way of achieving personal invariance. It's a crude way, because it requires everyone to agree, and it makes every reader pay for every writer's choices. If you can deliver personal invariance directly, you don't need the agreement. You get the benefit without the tax.

And that's precisely what normalization unlocks. You cannot reproject a blob of text. Once a note is prose, its structure is fossilized — the only thing a reader can do is read it in the order it was written. But once sentences are extracted, categorized by problem, and sorted into buckets, the arrangement becomes a *rendering decision* rather than a property of the document. It can be made once per reader instead of once per writer.

Normalization is not the opposite of personalization. It is the precondition for it.

The same logic runs in reverse on the documentation side. If authoring emits structured data rather than a text blob, then the input surface can be anything a clinician wants — dictation, a form, a scratchpad, wild prose, whatever fits the way you think — because nothing idiosyncratic escapes into the record. The system translates. Write however you like. Read however you like. The artifact in the middle stays clean.

**Customize the projection. Never the artifact.**

## Three constraints

This is a powerful idea, and powerful ideas in clinical software have a way of becoming harmful without much fanfare. Three things I'd hold onto.

**Arrangement, not inclusion.**

Let clinicians reorder. Let them emphasize, collapse, gray out, push things to the bottom. Do not let them make a bucket disappear.

The temptation will be enormous, because users will ask for it — *I never look at social history, hide it* — and it will feel like respecting their expertise. It isn't. Beasley and colleagues, when they described information chaos in primary care, named five components: overload, underload, scatter, conflict, and erroneous information. A system that solves scatter by letting clinicians hide categories has simply traded one component for another. The physician who suppressed social history in 2024 is the physician who doesn't know the patient became homeless in 2026.

Absence is clinical information. A normalized surface is the first tool in the history of the chart that can show you what *isn't* there — no colonoscopy, ever; no documented social history; no reasoning recorded for a stopped medication. Squandering that to satisfy a customization request would be a genuine loss.

**Defaults are the product.**

Most clinicians will never open the settings panel. Whatever ships as the default surface is what nearly everyone will experience, permanently. That means the default has to be defensible on its own — thought through, argued about, tested — and customization is the escape hatch for the minority who need it, not the pitch. Any product whose value proposition is "configure it however you want" has quietly outsourced its hardest design decision to people who are already running behind.

**Customization is scoped to readership.**

This is the constraint I nearly missed, and it's the one that makes the whole thing coherent.

Not every surface has one reader. My chart review does — nobody else looks at it, so I should be able to arrange it down to the pixel. But a handoff has a receiving clinician. A sign-out has a night team. A teaching view has a resident. A screen-share has whoever is in the room. The moment a surface has more than one reader, personal arrangement stops being a courtesy to the reader and starts being an imposition on them.

Watch what happens if you ignore this. Two physicians looking at the same chart can say *it's in the box under the assessment* and mean the same thing. If our layouts differ, that sentence becomes false. Deictic reference — pointing at a location — stops working the moment location is personal. The attending who tells a resident to look at the top right has just created confusion where none existed. And it fails precisely where this series has said the seams are: teaching, sign-out, coverage, handoff.

That looks like the cost of personalization. It isn't. It's the boundary condition telling you where personalization ends.

So the rule follows the audience. **A surface with one reader belongs to that reader.** A surface with a team belongs to the team — shared handoff templates, agreed once, arranged the way that unit actually works, and not overridable by whoever happens to open it. And a surface with unbounded readership — the artifact, the record itself, the thing someone you will never meet reads in four years — belongs to nobody and never moves at all.

Three scopes, one principle: you may customize exactly as far as your readership extends. Past that line, your preference is someone else's scatter.

The naming discipline still helps. Refer to *things*, not *places* — "look at the outstanding items," never "look at the top right." Shared vocabulary is a better foundation than shared geometry anyway; it's how we already talk about the BMP, where nobody says "the third number down," everyone says "the creatinine." But naming is the safeguard. Scoping is the design.

## What this reframes

If you've followed this series, you've watched an argument accumulate: physicians build private systems that don't scale, spend their days hunting through incompatible documents, and lose their attention to the work that comes before the work.

Normalization has been the thread through all of it. What I want to add is that normalization isn't a constraint we accept in exchange for consistency. It's what finally makes the chart *malleable*.

The reason your EHR can't adapt to you is not that it's rigid. It's that its contents are unstructured, and unstructured contents can only be presented one way — the way they were typed. Rigidity is downstream of formlessness. Give the data form, and every reader can have it their way.

Medicine has customization backwards. Infinitely tunable where it damages every downstream reader. Immovable where it would cost nothing and help enormously.

Turn it around.

*If your chart could be arranged any way you liked — but you couldn't hide anything — what would you put first?*
