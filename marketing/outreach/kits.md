# Outbound kits: primary care, DPC, pediatrics, post-acute

**Vera, 28 Nov 2026: PASS on the second read** (round 1 failed on the `/watch/` build note, the "more" link, two DPC lines, the post-acute handoff line and "90 seconds"; all fixed in her wording).

**Draft, 28 Nov 2026. Penn (copy), for Vera (claims) and the owner.** Internal working doc. Nothing
in here sends, posts or builds anything.

**Use:** the owner and Owen prepare emails and build the `/watch/` pages from this file. The copy
inside it is read by sceptical clinicians who clicked a link in Jake's personal email.

**One idea, in all four:** your EHR keeps the record; Stream keeps the project. The project is the
problem-by-problem picture good clinicians keep by hand. It works, but it doesn't scale, it doesn't
transfer, and it takes upkeep. Each kit opens on its type's version of that problem.

**What a kit is** (ai-scribe #1616, section (c), marketing's half): the short video, the `/watch/`
page, and the email angle. The onboarding half is Stream's and isn't built (see the end).

**Where the rest lives.** Email 1 is `outbound-engine-v1.md` section 4a (the corrected body, not the
older "outstanding … the chart" line in `clinician-intro.md`, D5). Email 3 is section 4a and is
unchanged for every kit, so it isn't repeated here. Footer as in section 4a.

## Shared rules (every kit, every line a person reads)

- **One ask:** book 20 minutes. No trial, price or discount on the page or in the video.
- **No time saved:** no hours or minutes, "faster", "in minutes", "get home on time", "before you
  leave the room".
- **No compliance words:** no HIPAA, SOC 2, "secure", "compliant".
- **No write-back:** never "integrates with", "syncs to", "writes back to". The line is "works
  alongside any EHR", and the note pastes in.
- **Nothing against the EHR:** never "your EHR can't…". The comparison is to the system you keep
  by hand.
- Never the word "narrative". Never "thinks like a clinician"; if needed, "organized like
  clinicians think".
- **No customer or prospect names**, practices or quotes. Patients in any line are composites.
- **Plan item tracking is early access and stays out.** No "closing the loop", no tracking each
  plan item to completion, no "outstanding" that implies it.
- **The recording:** never say it "always" stays with its visit, and never say every last word is
  kept. Say nothing about what happens to the recording.
- **Outside-record filing is on practice by practice.** Summarizing an upload is fine to state.
  Filing its contents under problems is stated only as "something we're turning on practice by
  practice".
- **The type slug is for HubSpot only.** `primary_care`, `dpc`, `pediatrics`, `post_acute` never
  appear in email text, page text, a title or a label.

## Building a `/watch/` page (same for all four)

Build once the Loom link exists, about an hour each (`outbound-engine-v1.md` section 5):

- Add the video to `src/config/videos.ts` under the kit's key; render it with `LoomEmbed`
  (click-to-play, so `video_play` fires and nothing loads from Loom until play).
- Give each `videos.ts` entry a person-facing title (the page title), never the Loom key, because
  `LoomEmbed` renders it.
- Say 90 seconds only once that video's duration in `videos.ts` is 1:30 or under. Until then, the
  page and email say "a short video".
- `Base` layout with `noindex`, as `/product-overview/` does, not `Page`. `Page` always renders the
  offer banner (trial and price) and the nav's 'Start free trial', which would put a second ask on a
  one-ask page. Put `data-rr-read="product"` on `<main>` by hand, as `/comparison/freedai/` does.
- Add `/watch/` to the sitemap filter in `astro.config`, which today excludes only
  `/product-overview/`.
- Two sentences under the video, one button, one quiet "more" link. Nothing else.
- Before the first send: make `/book-demo/` pass the stored `utm_content`, so a booking carries
  its test arm (section 5's recommendation). Check with `?rr_debug=1`.
- **The "more" link and D12.** Each kit gives the matching `/for/*` page and the
  `/longitudinal-patient-tracking/` alternative. That page is the safer click, but it isn't clean
  yet: it states outside-record filing as done and gives Huddle's removed ten-month floor. Those
  are fixed in a separate draft PR (`claude/marketing-lpt-filing`). Link all four kits to it once
  that merges. Email 2 in every kit already links there, so no email 2 goes out before that merge.
  One snag: its title says "for Primary Care", which
  reads oddly to a post-acute or pediatric reader. It's still the safer click.

---

## Kit: primary care, covering for a partner

**For Owen:** HubSpot `clinician_type` = `primary_care` · Loom key `primary-care` · page
`/watch/primary-care/`

### Who, and how they're sorted

Spec #1616 (b), row 5: family medicine, general internal medicine, general practice, family or
adult or primary-care NPs, and PAs in primary care, in insurance-based practice. Rows 1–4 win
first: a family physician in a DPC is the DPC kit, and one who mainly rounds in a SNF is the
post-acute kit.

### Lead problem

Covering for a partner: finding their plan for a patient.

### Video

Script (a), "The plan was in your partner's head", `video-scripts.md`. **Status: not recorded.**
Record first (D9). Loom key to add to `src/config/videos.ts`: `primary-care`.

### `/watch/primary-care/` page copy

- **`<title>`:** The plan was in your partner's head | Stream
- **Meta description:** A short video from Jake Kantrowitz, MD, on covering for a partner: every
  Assessment and Plan filed under its problem, in order, with who wrote each one. Works alongside
  any EHR.
- **H1:** The plan was in your partner's head.
- **Under the video:** Stream files each visit's Assessment and Plan under its problem, so when you
  cover, you read every plan for it in order, with who wrote each one. Your EHR keeps the record;
  Stream keeps the project.
- **Button:** Book 20 minutes → `/book-demo/`
- **More link:** "More on Stream for primary care" → `/for/primary-care/`. **Not recommended
  as it stands, and D12 misses it.** That page has "2+ hours per day on documentation… unless the
  notes write themselves", "Pre-charting takes seconds, not minutes", "Faster notes" in its meta,
  a "HIPAA Compliant" proof strip, and an "Automatic Task Tracking" cell. Vera also found "leave
  the office on time", "remembers… everything", "start in minutes", "updates your chart
  automatically", outside-record filing stated as done, and a HIPAA item in the hero.
  **Recommended:** "How the problem view works" → `/longitudinal-patient-tracking/`, once
  `claude/marketing-lpt-filing` merges.

### Email lines

- **`{practice_type_line}`** (unchanged, `clinician-intro.md`): On a full panel, that's the
  difference between the patients you remember and the rest.
- **`{clinician_type_plural}`:** primary care doctors. *New, for Vera:* use "primary care
  clinicians" when the card's credential is NP or PA, since this type includes them.
- **Video sentence (email 1, video arm):** I recorded a short video on what that looks like for
  primary care doctors:
  https://www.riverrecords.ai/watch/primary-care/?utm_source=outreach&utm_medium=email&utm_campaign=outbound-v1&utm_content=<arm>-e1
  Or just reply.
- **Email 2:** the CKD version in section 4a, unchanged. Its link carries
  `utm_content=<arm>-e2` (section 4a shows `e2` with no arm; section 5's pattern adds it).

### HubSpot list and the ask

`Outbound v1 – PC/IM 3-10`. Ask: a 20-minute demo. The list filters to 3–10 clinicians, so solo
clinicians aren't on it. See the owner question at the end for solos who reach a `/watch/` page
from another list.

### Don't say (this kit)

The shared rules, plus, from script (a): that Stream "updates the chart automatically" or
"remembers everything" (older primary care copy); any time figure for pre-charting; the follow-up
task list, which pulls toward plan tracking.

**Source for each claim:** A&P filed under its problem, every plan in order with who wrote each
one, same view for the covering clinician: script (a) and `/longitudinal-patient-tracking/`.
Record/project and "doesn't transfer": the same two. Works alongside any EHR: `faqs.ts` limits
group. 20 minutes: `/book-demo/`.

---

## Kit: membership and DPC practices, the relationship you carry

**For Owen:** HubSpot `clinician_type` = `dpc` · Loom key `dpc` · page `/watch/dpc/`

### Who, and how they're sorted

Spec #1616 (b), row 2: direct primary care, membership and concierge practices, by practice model
on the website. Only row 1 (SNF / LTC as the main work) beats it. A pediatric DPC gets this kit:
it hears about the relationship, not the well visits.

### Lead problem

A long relationship carried in your head, which doesn't transfer.

### Video

Script (b), "Six years with one patient", `video-scripts.md`. **Status: not recorded.** Loom key:
`dpc`.

### `/watch/dpc/` page copy

- **`<title>`:** Six years with one patient | Stream
- **Meta description:** A short video from Jake Kantrowitz, MD, for membership practices: every
  plan you've written for a problem, in order, with a Recap alongside. Works alongside any EHR, or
  on its own.
- **H1:** Six years with one patient.
- **Under the video:** Stream files each visit's Assessment and Plan under its problem, so you walk
  into the long visits already knowing where you left off, including with the patient you last saw
  eight months ago. Your EHR keeps the record; Stream keeps the project.
- **Button:** Book 20 minutes → `/book-demo/`
- **More link:** "More on Stream for membership practices" → `/for/dpc/`. D12: its proof strip
  says "HIPAA Compliant", its FAQ says "fully HIPAA compliant", and it has an "Automatic Task
  Tracking" cell ("nothing falls through between visits"). Vera also found outside-record filing
  stated as done, and a HIPAA item in the hero.
  **Recommended:** "How the problem view works" → `/longitudinal-patient-tracking/`, once
  `claude/marketing-lpt-filing` merges.

### Email lines

- **`{practice_type_line}`**, *new, for Vera* (today DPC shares the primary care line): In a
  membership practice, that's the relationship you built the practice around, and most of it lives
  in your head.
- **`{clinician_type_plural}`:** membership practices.
- **Video sentence:** I recorded a short video on what that looks like for membership practices:
  https://www.riverrecords.ai/watch/dpc/?utm_source=outreach&utm_medium=email&utm_campaign=outbound-v1&utm_content=<arm>-e1
  Or just reply.
- **Email 2**, *new, for Vera.* Two versions; Owen picks from the card. Many DPC practices are one
  clinician, and a new-partner question to a solo practice is a question about a partner they
  don't have.

  **(i) Practice with more than one clinician, or hiring one:**

  > Hi {first_name},
  >
  > One question I should have led with: when a new partner joins and picks up a patient you've carried for six years, how do they find your plan for her diabetes? Usually it means reading years of notes.
  >
  > In Stream, each visit's Assessment & Plan is filed under its problem, from the first visit you document in it. A new partner opens the same problem view you do, with who wrote each entry. This page lays it out, including what Stream doesn't do: https://www.riverrecords.ai/longitudinal-patient-tracking/?utm_source=outreach&utm_medium=email&utm_campaign=outbound-v1&utm_content=<arm>-e2
  >
  > If this isn't useful, tell me and I won't write again.
  >
  > Jake

  **(ii) Solo practice:**

  > Hi {first_name},
  >
  > One question I should have led with: for the patient you haven't seen in eight months, where do you find your last plan for her diabetes? Usually it's the summary at the top of an old note, and it's gone stale.
  >
  > In Stream, each visit's Assessment & Plan is filed under its problem. Open the problem and every plan you've written for it in Stream is there, in order. This page lays it out, including what Stream doesn't do: https://www.riverrecords.ai/longitudinal-patient-tracking/?utm_source=outreach&utm_medium=email&utm_campaign=outbound-v1&utm_content=<arm>-e2
  >
  > If this isn't useful, tell me and I won't write again.
  >
  > Jake

  Neither is about covering a partner's clinic, and neither offers a shorter visit.

### HubSpot list and the ask

`Outbound v1 – DPC`. Ask: a 20-minute demo. This list has no size filter, so it will hold solo
clinicians; see the owner question at the end.

### Don't say (this kit)

The shared rules, plus, from script (b): time saved, more patients or a bigger panel (an offer to
shorten visits reads as undoing the practice); coding or HCC capture (on `/for/dpc/`, but a
different pitch). Don't present Recap as a button you press; it appears when you open the problem.

**Source for each claim:** A&P filed under its problem, every plan in order, Recap alongside, works
alongside any EHR "or on its own", the new partner, the eight-month patient: script (b). Living
problem list: `/for/dpc/` and script (b). Same problem view with who wrote each entry: script (a)
and `/longitudinal-patient-tracking/`. Record/project: `/longitudinal-patient-tracking/`.

---

## Kit: pediatrics, the history a family assumes you remember

**For Owen:** HubSpot `clinician_type` = `pediatrics` · Loom key `pediatrics` · page
`/watch/pediatrics/`

### Who, and how they're sorted

Spec #1616 (b), row 4: pediatricians (NPI taxonomy `2080…`) and pediatric NPs and PAs, in
insurance-based practice. Rows 1–3 win first: a pediatric DPC gets the DPC kit, and an
integrative pediatrician gets the integrative kit.

### Lead problem

The history a family assumes you'll remember from one well visit to the next.

### Video

Script (c), "So, the speech thing we talked about", `video-scripts.md`. **Status: not recorded.**
Loom key: `pediatrics`.

### `/watch/pediatrics/` page copy

- **`<title>`:** "So, the speech thing we talked about" | Stream
- **Meta description:** A short video from Jake Kantrowitz, MD, for pediatricians: each visit
  filed under the problems it touches, so a feeding concern or a milestone question shows its
  trajectory. Works alongside any EHR.
- **H1:** "So, the speech thing we talked about."
- **Under the video:** Stream files each visit under the problems it touches, so a feeding concern,
  a milestone question or asthma gets its own block that updates at every visit where it comes up.
  Your EHR keeps the record; Stream keeps the project.
- **Button:** Book 20 minutes → `/book-demo/`
- **More link:** "More on Stream for pediatrics" → `/for/pediatrics/`. D12: "HIPAA Compliant"
  proof strip and FAQ. Two more for Vera: the page leads with well-visit tracking, which the
  script cut because it ships switched off on 1 Dec (the page phrases it as turned on per account,
  so this may be fine, but the video and the page would disagree on what leads); and its "Outside
  records, filed" cell states filing as done, where the script says practice by practice. Vera
  also found "Automatic task tracking" and "audit any row in about four seconds".
  **Recommended:** "How the problem view works" → `/longitudinal-patient-tracking/`, once
  `claude/marketing-lpt-filing` merges.

### Email lines

- **`{practice_type_line}`** (unchanged, `clinician-intro.md`): In pediatrics it's the history a
  family assumes you'll remember from one well visit to the next.
- **`{clinician_type_plural}`:** pediatricians. *New, for Vera:* "pediatric clinicians" when the
  card's credential is NP or PA.
- **Video sentence:** I recorded a short video on what that looks like for pediatricians:
  https://www.riverrecords.ai/watch/pediatrics/?utm_source=outreach&utm_medium=email&utm_campaign=outbound-v1&utm_content=<arm>-e1
  Or just reply.
- **Email 2:** section 4a's version with "a child's asthma" in place of "a patient's CKD" (Vera
  approved). Nothing else changes. Link carries `utm_content=<arm>-e2`.

### HubSpot list and the ask

`Outbound v1 – Peds`. Ask: a 20-minute demo. No size filter; see the owner question on solos.

### Don't say (this kit)

The shared rules, plus, from script (c): "in my practice" (Jake is an internist); "up to date"
about a child; any well-visit tracking line until it's on for practices and Vera re-checks it; a
filed excerpt from a report (say it's summarized; filing is practice by practice). Never a real
child's name or date of birth, on screen or in a line.

**Source for each claim:** each problem gets its own block that updates at every visit where it
comes up: script (c) and `/for/pediatrics/` ("Tracks development over time"). Report summarized,
filing practice by practice: script (c). Works alongside any EHR: script (c), `faqs.ts`.
Record/project: `/longitudinal-patient-tracking/`.

---

## Kit: post-acute, the admission that started somewhere else

**For Owen:** HubSpot `clinician_type` = `post_acute` · Loom key `post-acute` · page
`/watch/post-acute/`

### Who, and how they're sorted

Spec #1616 (b), row 1, which beats every other row: attendings and medical directors whose main
work is seeing residents in SNF, LTC or on nursing-home rounds. Email the clinician, not the
facility (`outbound-engine-v1.md` section 3).

### Lead problem

Residents seen by several clinicians across shifts; what gets lost at handoff.

### Video

Script (d), "Every admission started somewhere else", `video-scripts.md`. **Status: not
recorded.** Loom key: `post-acute`.

### `/watch/post-acute/` page copy

- **`<title>`:** Every admission started somewhere else | Stream
- **Meta description:** A short video from Jake Kantrowitz, MD, for clinicians in post-acute
  care: outside records summarized on upload, and each rounding visit's plan filed under its
  problem, with who wrote each one.
- **H1:** Every admission started somewhere else.
- **Under the video:** Stream summarizes the discharge summary and outside records you upload, and
  files each rounding visit's Assessment and Plan under its problem, so whoever in your group rounds next reads
  every plan for it, in order, with who wrote each one. Your EHR keeps the record; Stream keeps the
  project.
- **Button:** Book 20 minutes → `/book-demo/`
- **More link:** "More on Stream for post-acute care" → `/for/snf/`. D12, and the worst of the
  four: "in minutes" in the hero, "Not hours. Not days. Minutes.", "Notes are done before you leave
  the room", "takes hours", "HIPAA Compliant" proof strip. It also states problem extraction from a
  discharge summary as done, where the script says practice by practice. Vera also found
  "Automatic Task Tracking", "Within a couple of minutes" and "Every open loop is captured".
  **Recommended:** "How the problem view works" → `/longitudinal-patient-tracking/`, once
  `claude/marketing-lpt-filing` merges.

### Email lines

- **`{practice_type_line}`** (unchanged, `clinician-intro.md`): With residents seen by several
  clinicians across shifts, it's the part that gets lost at handoff.
- **`{clinician_type_plural}`:** clinicians in post-acute care.
- **Video sentence:** I recorded a short video on what that looks like for clinicians in post-acute
  care:
  https://www.riverrecords.ai/watch/post-acute/?utm_source=outreach&utm_medium=email&utm_campaign=outbound-v1&utm_content=<arm>-e1
  Or just reply.
- **Email 2:** section 4a's structure with the round-on-a-colleague line. The first sentence is
  from 4a; Vera checked it 28 Nov. The second-paragraph swap is in her wording:

  > Hi {first_name},
  >
  > One question I should have led with: when you round on a colleague's residents, how do you find their plan for a resident's heart failure? Usually it means decoding their notes.
  >
  > In Stream, each visit's Assessment & Plan is filed under its problem. Whoever in your group rounds next opens the same problem view, with who wrote each entry. This page lays it out, including what Stream doesn't do: https://www.riverrecords.ai/longitudinal-patient-tracking/?utm_source=outreach&utm_medium=email&utm_campaign=outbound-v1&utm_content=<arm>-e2
  >
  > If this isn't useful, tell me and I won't write again.
  >
  > Jake

### HubSpot list and the ask

`Outbound v1 – Post-acute`. Ask: a 20-minute demo, which is also the SNF page's ask. Don't add the
trial.

### Don't say (this kit)

The shared rules, plus, from script (d): "in minutes", "before you leave the room", "reads it so
you don't have to" (all on `/for/snf/`, all time claims); the chart "gets smarter"; referral or
inter-facility tracking (coming soon on the page); extracted problems, unless Jake has confirmed
outside-record filing is on for the practice being shown. Nothing that implies how long
processing takes.

**Source for each claim:** upload and summary, filing practice by practice, A&P filed under its
problem, whoever rounds next reads every plan with who wrote each one, works alongside any EHR:
script (d). Record/project: `/longitudinal-patient-tracking/`. Round-on-a-colleague line:
`outbound-engine-v1.md` section 4a.

---

## Owner question: solo clinicians and a page with one button

The spec (#1616 (b)) and section 3 say a solo clinician's ask is the trial, not a demo. Every
`/watch/` page has one button, Book 20 minutes, and every script ends on it. The PC list filters
solos out; the DPC and Peds lists don't, and DPC especially will be full of them.

Options: (1) a trial button on the page for solos, which breaks one page, one ask; (2) route solos
to the no-video arm with the trial as email 1's link, which breaks the T1 split, because arms are
assigned before research and size is only known after it; (3) keep Book 20 minutes for everyone in
v1.

**Recommendation: (3).** A solo clinician who books 20 minutes can start the trial on the call, and
a solo who replies gets the trial link in Jake's answer. It keeps the test clean and the scripts
true. Revisit after the first month if solo replies show the call is the obstacle.

## Not in these kits

- **Integrative / complex chronic** (`integrative`): its kit is next. Email lines only (the
  `{practice_type_line}` already in `clinician-intro.md`, plus an email 2 variant), linking to
  `/for/complex-chronic/`. No video, so no `/watch/` page. Never time saved; adult and paediatric.
- **`other`:** no kit and no outbound list.
- **Stream's onboarding half** (spec #1616 (c), engineering's): kit visit types and the
  first-login proposals. Not built, and nothing here depends on it.
