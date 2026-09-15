---
title: "You Shouldn't Have to Trust the AI Scribe. You Should Be Able to Check It."
description: "Every AI scribe makes the same seven quiet errors, ours included. Reliability isn't a vendor's accuracy percentage — it's whether you can find the mistakes before you sign. How to review a note in ninety seconds, and what to ask a vendor."
seoTitle: "How Reliable Are AI Medical Scribes? The Errors They Make and How to Check"
seoDescription: "AI medical scribes fail quietly: omissions, misattributed history, flipped negations, invented normals, wrong doses. A physician on why the accuracy number can't help you, how to review a note in ninety seconds, and what makes a scribe checkable."
author: "Jacob Kantrowitz MD, PhD"
publishDate: "2026-09-15"
featured: true
tags: ["ai-scribe", "medical-decision-making", "clinical-context"]
readTime: "8"
draft: false
linkedinCaption: "The question I get asked most about AI scribes is some version of 'how reliable is it?' and I've stopped answering it with a number. Every vendor has a number. None of them tells you which two percent is wrong, and the two percent is never random — it clusters in exactly the visits where the most was going on. The errors that actually happen aren't the dramatic fabrications everyone worries about. Those are rare and easy to spot. The dangerous ones are quiet: the thing the patient said that never made the note. The sister's DVT that became the patient's DVT. The 'no chest pain' that lost its 'no.' The normal abdominal exam you didn't perform. The 25 that was 2.5. Every scribe I have used or built makes these, ours included. So reliability isn't a property of the model. It's a property of the workflow: can you find the errors before you sign, and how long does it take? A note you can't check is a note you're trusting, and trust is what you extend when checking is too expensive. The design goal should be to make checking cheap enough that trust is never required. New post: the seven errors, why the accuracy percentage can't help you, how to review a note in ninety seconds, and the five questions I'd ask any vendor, including us."
---

The question I get asked most about AI scribes is some version of "how reliable is it?"

I have stopped answering it with a number. Every vendor has one, and I could give you ours, and it would tell you almost nothing. A ninety-eight percent figure does not tell you which two percent is wrong. It does not tell you whether the two percent is a misspelled surname or a dose of anticoagulant off by a factor of ten. And it does not tell you the thing that matters most, which is that the errors are not evenly spread. They cluster in the visits where the most was going on, which are the visits where a wrong note does the most damage.

So I want to answer the question a different way. Reliability is not a property of the model. It is a property of the workflow. The question is not "how often is it wrong" but "when it is wrong, will I catch it before I sign, and how long will that take me?"

Everything below follows from that.

## The errors that actually happen

The failure everyone worries about is the dramatic one: the scribe invents a procedure, or a diagnosis, or a conversation that never took place. That happens. It is also rare, and it is the easiest kind of error to spot, because it reads as obviously foreign the moment you see it.

The errors that get signed are quiet. They read fluently. They look like a note. Every scribe I have used or built makes them, ours included, and they fall into a small number of families.

**1. Omission.** The most common error and the least visible, because you cannot see what is not there. The patient mentioned the new knee pain on the way out. You said you would recheck the potassium in two weeks. The scribe caught neither, and the note reads complete, because a note has no way of showing you the sentence it dropped. Every other error on this list is something you might notice while reading. Omission is the one you only notice by remembering.

**2. Misattribution.** "My sister had a clot on the pill" becomes a personal history of DVT. Your own thinking aloud, "could be a PE, but I doubt it," becomes an assessment. The scribe hears words and has to decide who said them, about whom, and whether they were a fact or a hypothetical. It gets most of these right. When it gets one wrong, a family history becomes a diagnosis and a possibility you dismissed becomes a diagnosis you made.

**3. Negation and laterality.** "No chest pain" loses its "no." The left knee becomes the right. These are single-word flips, and the sentence reads perfectly well either way, which is exactly why they survive a fast read. Your eye is checking whether the sentence is well-formed. It is.

**4. Plausible defaults.** The note contains a normal abdominal exam. You did not examine the abdomen. Nobody said anything about the abdomen. The scribe filled in what a note like this usually says. This is the same failure as [pre-templated text in the EHR](/blog/templated-ehr-notes-patient-safety-risks/), arriving by a different route: a record that asserts something nobody checked. The medication version is "continue current medications" on a visit where you changed a dose.

**5. Numbers and near-homophones.** Twenty-five milligrams and two point five. Metoprolol and metformin, said quickly, in a room with a fan running. Hydroxyzine and hydralazine. The audio was ambiguous and the model resolved the ambiguity confidently, because producing a confident sentence is what it is built to do. Harm concentrates here more than anywhere else on the list.

**6. Lost time.** "I had a heart attack in 2015" becomes "MI," present tense, on the problem list. A resolved problem is written as active. A medication the patient stopped last year is written as current because they mentioned it. The scribe captured the fact and dropped the tense, and in a chart the tense is most of the meaning.

**7. Compression.** "We stopped the lisinopril because of the cough" becomes "lisinopril discontinued." Technically true, and six months from now the next clinician restarts it. [I have written before about why compression is the wrong default](/blog/summarization-is-a-tool/) for a chart. In a scribe it shows up as a note that is shorter than the visit in precisely the places where the reason mattered.

None of these are exotic. If you have used a scribe for a month you have seen most of them. The point of naming them is not to alarm. It is that an error you can name is an error you can look for, and an error you can look for takes seconds to catch rather than a re-listen of the recording.

## Why the accuracy number cannot help you

Vendor accuracy figures are measured on some set of visits, by some reviewers, against some definition of correct, usually on clean audio. I do not say this to be cynical about them. Many are honestly produced. But an average over all visits is dominated by the visits where nothing much happened, and those are not the visits you are worried about.

The visit you are worried about has four active problems, two medication changes, a family member talking over the patient, and a decision you made and then partly reversed. Error rates in that visit are not the headline number. They are worse, and they are worse in every product, because the difficulty is in the visit rather than in the software.

So the number answers "how good is it on average," and you need the answer to "how bad is it at its worst, and will I know." Those come apart. Reliability in the sense that protects you is the second one.

## The property that matters is checkability

If the errors are quiet, then the useful design question is how quickly a clinician can find one. Three things decide that, and they are worth more than any accuracy claim.

**Structure makes omissions visible.** In a single block of prose, an omitted problem is simply absent, and absence has no shape. When the note is organized problem by problem, with an assessment and plan under each, an omitted problem is a missing heading. You discussed six things; you count five. That takes three seconds and requires no re-listening. It is the reason Stream writes the assessment and plan per problem rather than as one paragraph, and it was a checkability decision before it was anything else.

**Provenance makes verification cheap.** A sentence you can trace to where it came from can be checked in the time it takes to click. A sentence you cannot trace can only be checked by going back to the source and searching. When we built Stream's document intake, we made every extracted fact link to the sentence on the page it came from, and that decision came from watching how long it took a physician to verify a fact that did not. The difference is between a review that happens and a review that gets skipped.

**Separation keeps the note honest.** A scribe that also suggests diagnoses is mixing what was said with what it thinks should have been said, in the same paragraph, in the same voice. You cannot check that, because there is no longer a fact of the matter to check against. This is why Stream has no clinical decision support and why the code that reads inbound documents is kept separate from the code that drafts your notes. The thing that records should not be the thing that opines. If you want a decision-support tool, and many clinicians sensibly do, it should be a different tool.

## How to review a note in ninety seconds

The review is not optional. Any vendor that frames it as optional is describing a liability with your name on it. But it does not have to take long if you know where to look, and the order matters.

1. **Medications and numbers first.** Every drug name, every dose, every value. This is where the harm is, so it gets the first and freshest thirty seconds.
2. **Count the problems.** Go down the assessment and plan against your own memory of the visit. You know how many things you decided. Check that many headings exist.
3. **Look for what is not there.** The thing said at the door. The follow-up you promised. This is a memory check, not a reading check, so do it before the note overwrites your memory of the visit.
4. **Delete every normal you did not examine.** If you did not touch it, it does not belong in your record, however plausible it reads.
5. **Read negations and sides slowly.** Every "no," every "denies," every "left" and "right." Say them to yourself.
6. **Treat anything you do not remember saying as unverified.** Not wrong, necessarily. But not yours until you have confirmed it.

Do this for two weeks and you will learn your scribe's particular habits, because each one has them. After that the review gets faster, not because you trust it more, but because you know where it fails.

## What to ask a vendor, including us

If you are evaluating a scribe, these questions get closer to reliability than any accuracy figure will. We do not answer all of them perfectly, and I would rather you asked.

- **How does it show me what it left out?** If the answer is "it doesn't," then omission, the most common error, is invisible in that product by design.
- **Can I get from a sentence in the note to where it came from?** If verification means re-listening to the recording, verification will not happen.
- **What does it do when the audio is bad?** A product that guesses confidently and a product that flags uncertainty have very different failure modes, and only one of them is safe.
- **Does it ever add content that was not said?** Ask specifically about exam findings and "continue current medications." Ask them to show you the setting that turns it off.
- **What can't it do?** A vendor with no list of noes has not thought hard about the product. Ours is [on the FAQ page](/faq/): no EHR write-back, no clinical decision support, no SOC 2. Those are real limitations. They are also the reason the rest of what we say is worth checking.

## You should not have to trust it

Trust is what you extend when checking is too expensive. It is a reasonable thing to extend to a colleague whose judgment you have watched for years. It is not a reasonable thing to extend to a language model on the strength of a percentage, and no clinician I know actually does. What they do instead is skim, sign, and hope, because the alternative is a review that takes longer than writing the note would have.

That is the design failure, and it belongs to the product, not to the clinician. The goal of a scribe should not be to earn trust. It should be to make checking so cheap that trust is never required: a note whose structure shows its gaps, whose facts point back to their source, and which never blends what you said with what it thinks.

You should not have to trust the AI scribe. You should be able to check it, in ninety seconds, every time. Anything less is a note you are signing on faith.

*— Jake*
