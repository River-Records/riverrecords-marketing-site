# Problem-first messaging: the record and the project

**What this is:** the positioning that replaces feature-led outreach, and the source for
the homepage "record vs. project" section and `/longitudinal-patient-tracking/`.
Companion to [`content-objection-map.md`](./content-objection-map.md) and the field sheets.

## Why it changed

Cold outreach led with features — "a problem-oriented scribe that tracks problems over
time", "problem-oriented fax triage" — and the most common reply was *"my EHR already does
that."* At the level of the feature, the prospect is right: every EHR has a problem list
tab and a fax inbox. Naming a capability invites them to match it to something they own,
and the conversation ends.

What the EHR does not do is the work *between* the notes: keeping each patient's problems
moving, visit to visit, clinician to clinician. Clinicians who do that well build the
system themselves, by hand, in their notes.

## The position, in one line

> **Your EHR keeps the record. Stream keeps the project.**

Stream is not compared to the EHR. It rides alongside it — no integration, no replacement,
the note is pasted in. It is compared to the system good clinicians already build in their
notes, which works, and which:

1. **doesn't scale** — it holds for the patients you remember, not a full panel;
2. **doesn't transfer** — it lives in your shorthand, so a partner, covering clinician or
   new hire can't pick it up;
3. **takes upkeep** — the running summary has to be re-typed, pruned and carried forward,
   and it is the first thing to slip on a hard week. Copy-forward is how most people keep
   it alive, which is a large part of why half the text in the average chart is
   duplicated (Steinkamp, Kantrowitz et al., *JAMA Netw Open* 2022).

Stream builds that system as a by-product of documenting: every visit's Assessment & Plan
is filed under its problem, so the project file assembles itself, and any clinician in the
practice can open it.

## Say this / not this

| Say | Don't say | Why |
|---|---|---|
| "Rides alongside your EHR" / "works alongside any EHR" | "Integrates with", "replaces", "works with" | We don't integrate or write back. |
| "The EHR keeps the record" | "Your EHR can't…" / "EHRs are just notes" | Absolute EHR claims are falsifiable by one good EHR demo, and they make us the rival. |
| "The system you'd otherwise keep by hand" | "Problem-oriented charting" as the lead | The term is a feature name; keep it for search and second lines. |
| "Any clinician in the practice can pick it up" | "Seamless handoffs" | Specific beats adjective. |
| "Tasks come out of the plan" | "Nothing ever falls through" | Plan item tracking is early access; absolute promises fail once. |

**Concede first.** "You can build a good system in your notes — plenty of people do" is
the opening, not a caveat. It's true, it earns the next sentence, and it matches how the
comparison pages work.

## The test questions

Each one is asked about the prospect's *current workflow*, not their EHR. The honest
"today" answer is usually "re-read notes" or "my own running summary, if I've kept it up".

| Question | What it takes today | With Stream | Proof on site |
|---|---|---|---|
| When did you last change her levothyroxine, and why? | Open notes until you find it, or trust your running summary | Open the problem: every A&P for it, in order | Timeline demo — homepage tour 04 |
| Which of today's patients has a problem nobody has touched in a year? | Re-read each chart before clinic | Huddle's "falling off" view, before the visit | Huddle demo — homepage hero, `/features/huddle/#watch` |
| The A1c in Tuesday's cardiology fax — is it in her diabetes plan? | Someone reads the fax and retypes what matters | Excerpt filed under diabetes, linked to the page it came from | `/intake/#watch` |
| You're covering for a partner. What was the plan for this patient's CKD? | Read the partner's notes and decode their shorthand | The same problem view your partner sees | `/longitudinal-patient-tracking/` |
| The follow-ups you planned last month — which happened? | Memory, or a separate list you keep | Tasks come out of the signed note* | `/features/task-management/` |

\* Plan item tracking (`/referral-tracking/`) is early access. Don't imply closed loops.

## Outbound

Lead with one question, link to the section that answers it, never to a feature list.

> "Quick one: when you open a patient you haven't seen in eight months, how do you find
> out what you were doing for their kidneys? Most people we talk to either re-read notes or
> keep a running summary by hand. Stream builds that summary from the notes you already
> write and rides alongside whatever EHR you're on. 90 seconds: [link]"

When the reply is *"my EHR already does that"*: agree, and move the question from the
software to the workflow. "It keeps the record, for sure. Who keeps the summary up to date
— you, or it?"

## Claims this rests on — all already published

- Per-problem Assessment & Plan every visit; Timeline and Recap — homepage tour
- Huddle: active, falling off past ten months, compliance — homepage, `/features/huddle/`
- Outside records filed under problems with source links — `/intake/`
- Tasks generated from the note — `/for/primary-care/`; plan item tracking early access
- New partner picks up a patient from the problem list — `/for/complex-chronic/`
- No integration, no write-back, paste into any EHR — `faqs.ts` limits group

Do not add claims here that the product pages don't already make.
