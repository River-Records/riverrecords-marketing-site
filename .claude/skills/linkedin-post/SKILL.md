---
name: linkedin-post
description: Draft a LinkedIn post in Jake's voice from the blog, the book, the website and (if attached) the ai-scribe feature briefs. Optional argument is a topic, an angle, a link, or a rough thought to build from; with no argument it picks a fresh angle itself. Returns ready-to-paste text in chat. Never posts, never commits.
---

Draft one LinkedIn post (plus two alternate hooks) that Jake will edit and post himself from
his personal profile. **Output goes in chat, nothing else.** Do not write files, commit, open a
PR, or call any posting API — the human posts it. Keep the reply short enough to copy on a phone.

## 1. Read the argument, if any

`$ARGUMENTS` may be:
- **empty** → choose an angle yourself (step 3)
- **a topic or theme** ("closing the loop", "chart prep", "why not write-back") → build on it
- **a rough thought or anecdote** → that is the hook; keep its specifics, sharpen the prose
- **a slug, URL or file** → post about that piece
- **a format request** ("short", "a question", "announce Inlet") → honour it

Don't ask clarifying questions unless the argument is genuinely unreadable. Draft first; Jake
corrects a draft faster than he answers a question.

## 2. Sources

Read narrowly — only what the angle needs. Paths are relative to the session's checkouts.

| Source | Path | Use for |
|---|---|---|
| Voice reference | `linkedinCaption` fields in `src/content/blog/*.md` (`grep -l linkedinCaption`) | **Read 3–4 of these first, every time.** They are the voice. |
| Blog posts | `src/content/blog/*.md` | the ideas already published; a post can deepen one |
| The book | `../ai-scribe/docs/book/manuscript/` (*The Note Was Never the Point*) | the philosophy; ch. 10–14 are the core |
| Website claims | `src/config/faqs.ts`, `src/config/pricing.ts`, `src/pages/` | what is safe to say about the product |
| Strategy | `../ai-scribe/docs/features/clinical_graph_northstar.md` | the clinical-graph idea |
| Feature briefs | `../ai-scribe/docs/features/*.md` | the *why* behind a design decision |

If `../ai-scribe` isn't checked out, say so in one line and work from this repo alone — the
blog and website are enough for most posts.

## 3. Picking an angle (no argument given)

Pick something that hasn't just been said. Check `git log --since=60.days -- src/content/blog`
for recent posts and prefer a different theme. Good wells, roughly in order:
1. one specific clinical moment from the book or a post, told concretely (a potassium of 5.6,
   7:45 a.m. chart prep, the specialist letter from four months ago)
2. a reframe — the "layer error", "scatter not overload", "remembers with you"
3. the reasoning behind a product decision (why Inlet can't write the note; why plan items
   become tasks) — the *design principle*, not a feature list
4. a concession or limit stated plainly, which this audience trusts more than a pitch

Say in one line which source the angle came from.

## 4. Voice

Match the `linkedinCaption` examples: physician-to-physician, first person, direct, clinical.
- **Open on something concrete** — a number, a moment, a thing a clinician has done this week.
  No "I'm excited to share", no "In today's healthcare landscape", no rhetorical "Let that sink in."
- Short paragraphs, line breaks between them (LinkedIn collapses after ~3 lines, so the first
  two lines must earn the click on "see more").
- 150–300 words unless asked otherwise. One idea per post.
- Philosophical, not product-led. Stream may appear, usually near the end, often not at all.
- End on a turn or a question, not a CTA stack. At most one link, on its own line, and only to a
  real page with a trailing slash (`https://www.riverrecords.ai/blog/<slug>/`).
- 0–3 hashtags, at the very end, only if natural. No emoji unless Jake asks.

## 5. Claim rules — not stylistic

These come from the site's CLAUDE.md and are why the site is credible. A draft that breaks one
is wrong, not bold.
- Never the word **"narrative"**.
- Stream is **"organized like clinicians think"**, never "thinks like a clinician".
- **"works alongside any EHR"**, never "works with" — and **no EHR write-back** claim.
- **No SOC 2**, no "HIPAA certified/compliant" beyond what `/security/` says.
- **No time-saved figures** ("two hours back a day") — none are measured.
- **Dark features are not live.** Most feature briefs say "Shipped dark" — built but on for no
  customer. Form Filler, plan item / referral tracking, automatic loop closure, persistent
  problems: talk about the *idea* or say "we're building"/"early access", never "Stream now does".
  If a brief's status is ambiguous, treat it as not live.
- No patient details that could identify anyone; anecdotes stay generic or composite.
- Competitors: no disparagement, no prices without `PRICING_VERIFIED` from `src/config/competitors.ts`.

## 6. Reply format

```
**Angle:** <one line> — from <source>

<the post, ready to paste>

---
**Alt hooks:**
1. <alternate first line>
2. <alternate first line>

**Check before posting:** <only if something needs Jake's eyes — a claim, a date, a feature's
status. Omit the line if nothing does.>
```

If Jake replies with edits ("shorter", "less product", "use the second hook"), revise and
return just the new post.
