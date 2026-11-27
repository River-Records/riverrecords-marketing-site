# Prospecting outside Stream: the plan, and what 50 real practices showed

**Draft, 27 Nov 2026. Mara, with Quinn (research) and Lane (rules).** Nothing in here sends,
posts or contacts anyone. It builds on the outbound brief (`outbound-engine-v1.md`, PR 133) and
the privacy line (PR 134). It doesn't repeat either one.

**Summary (for a phone).**

- **Not reachable yet.** 10–20 emailable practices a day can't be had from the free public data
  as we tried it. In a test on 50 real practices, search alone found **no usable email for any
  of them**.
- **The NPI registry is the wrong starting list.** 22 of the 50 turned out to be owned by a
  health system or a corporate group, not primary care, or not operating.
- **The test is incomplete.** This session can't open ordinary websites, so the step most
  likely to find an email, reading the practice's own site, was never tried.
- **Next:** re-run the test on Monday with three changes: a list from Medicare's files instead
  of the registry, practice websites reachable, and the free tiers of two email vendors run on
  the same practices. Then decide public sources versus a vendor on real numbers.
- **What to build** is unchanged by the result: a finder script, an agent that researches each
  practice, your daily yes/skip list, Smartlead to send, and HubSpot as the record and the
  suppression list. Only where the emails come from is still open.

---

## 1. The 50-practice yield test

### Method

- **Source.** The public NPI registry, organization records with a primary taxonomy of family
  medicine, internal medicine or general practice, in **New Jersey and Texas**. Active,
  non-subpart records only. Names matching a hospital, health system, urgent care, specialty or
  corporate-chain list were dropped.
- **Size.** Estimated by counting individual NPI records at the same street address. An
  established practice had to count 3–10. A record registered in the last 12 months could
  count 1–10.
- **Sample.** Seeded random draw, 25 per state: 17 established and 8 registered in the last
  12 months. The second group tests whether the registration date finds new practices.
- **Research.** Five agents, 10 practices each, one practice at a time, the way a person would
  do it:
  - find the practice's own website;
  - check that it is independent;
  - look for a published email, without guessing addresses;
  - look for three signals: newly opened, hiring a clinician or a referral/office manager, and
    taking new patients.
- **Timing.** Each practice was timed.
- **Where the details are.** Practice-level results are outside the repo and went to the owner
  by email. This file holds counts only.

**Two limits that change how to read the numbers:**

1. **No practice website could be opened.** This cloud session's network allows only listed
   hosts. Every practice's own site was refused, so everything came from search-result
   snippets, mostly directory listings (WebMD, Vitals, NPI aggregators). The contact page, team
   page and careers page were never read. That is where a role address or a job opening would
   be.
2. **The sample is skewed by name.** The registry's API returns organizations alphabetically
   and silently stops at 1,200 per query (Quinn tested it), so the pool covered names from A to
   about P.

### Results (n = 50)

| | Count | Notes |
|---|---|---|
| Qualified: independent primary care, operating | **17** (34%) | Texas 13, New Jersey 6. Several are tentative because there's no website to confirm them. |
| Disqualified | **22** (44%) | Health-system or large-group owned (Optum, Penn Medicine, Atlantic Health, Jefferson, St. Luke's, Advocare and others), national telehealth or employer-clinic companies, not primary care (nephrology, men's health, behavioural health), billing entities, dormant records |
| Couldn't be determined | 11 | No web presence at all |
| Own website found in search | **0 of the 17 qualified** | The 9 websites found belonged to systems or corporate owners |
| **Usable email found** | **0 of 50** | 47 none found, 3 contact form only (all on system sites) |
| At least one signal, among the 17 qualified | 8 | Almost all "taking new patients", read from directory listings, which is weak evidence |
| Hiring a clinician | 3 | None useful: national telehealth roles, or a disqualified owner |
| Hiring a referral or office manager | 0 | Not findable without reading careers pages or job boards |
| **Registered in the last 12 months (16):** genuinely new practice | **3** (about 1 in 5) | The rest were renames and reorganizations, new entities of large groups, personal billing companies, or unclear |
| Research time per practice | median 0.3 min | Search only, 1–3 searches each. A lower bound, not an estimate; reading a site would take several minutes. |

### What it means

- **The registry's practice records are stale and noisy.** Three established New Jersey
  addresses are now Optum, Penn Medicine or Atlantic Health locations under their old names.
  New Jersey lost 9 of its 17 established practices to the exclusions; Texas lost 4. Counting
  NPIs at an address overstates size, because it counts everyone in the building. **The finder
  should start from Medicare's files, not the registry.** The Doctors and Clinicians file and
  the reassignment list group clinicians by practice, give a group size, and are refreshed
  monthly from Medicare enrolment (Quinn; read through search snippets, because the session
  couldn't reach data.cms.gov). The September target-list pipeline (branch
  `claude/primary-care-target-list-mhvvgu`, never merged) already reads those files. Medicare's
  files miss practices that don't bill Medicare, which is most pediatrics and much of DPC, so
  those types need the registry plus a website check.
- **The registration date alone isn't a new-practice signal.** It finds about 1 genuinely new
  practice in 5. It is still worth keeping as a *candidate* flag, because the three real ones
  were among the best leads in the test: a physician who left a large group to open their own
  practice, a concierge clinic whose build-out shows in a state licensing filing, and a
  single-physician start-up. **None of the three had a website or an email**, which is normal
  for a practice a few months old. Their channels are phone, postal mail or a referral. Fax is
  not allowed (section 4).
- **Emails: unmeasured where it matters.** Zero from search is a real finding: snippets and
  directories don't carry practice emails. But it says nothing about what the practice's own
  site carries. Small practices often publish only a contact form or an office address. That is
  the open question, and it decides whether a vendor is needed.
- **The honest arithmetic, until Monday's re-run.** With 1 in 3 registry rows qualifying, ten
  emailable practices a day needs about 30 qualified practices researched a day if a third of
  them yield an email. If one in ten does, it needs about 100. An agent can research 100 a day;
  the cost is agent time, not your time, because you only see the rows that made it. **The
  number that decides it is the email yield on practice websites, which nobody has measured.**

### The re-run (Monday, one session)

1. **List.** About 50 Texas independent primary care practices of 3–10 clinicians, taken from
   Medicare's Doctors and Clinicians file. That needs data.cms.gov allowed (D4).
2. **Website access.** Practice websites reachable (D4).
3. **The same research, plus the free tiers of Hunter and Apollo** on the same qualified
   practices, so public-source and vendor yield are compared on one list. This costs nothing:
   both have free tiers, and you create the accounts. Lane: use the domain search, not
   name-guessing "email finder" features, which come close to what CAN-SPAM calls a dictionary
   attack.
4. **Report** per practice: own-site email yield (named, role or form), vendor yield, verifier
   result, and minutes with site reading. Then D1 is decided on those numbers.

---

## 2. The pipeline

**Buy:** the record (HubSpot, already paid for) and the sending (Smartlead, decided in PR 133).
**Build:** the finder and the agent routines. **No custom CRM, sender or database.** The practice
profile, the clinician types and the kits come from the shared spec the engineering worker is
writing in ai-scribe. This plan uses that spec; it doesn't define a second one.

| Step | What | Bought or built | Where it runs |
|---|---|---|---|
| **Find** | Monthly: Medicare's Doctors and Clinicians file plus the reassignment list → independent groups of 3–10 primary care clinicians in the chosen states; the NPI registry's monthly file for phone, fax, authorized official and new registrations. Reuses the September pipeline. | Built (a script) | **A private repo** (ai-scribe or a new one), never this public repo. Writes new practices to HubSpot as companies. |
| **Qualify** | Rules in the script (health-system names, subparts, parent organizations, clinicians who also bill under a large group), then the agent's website check. Drop customers, open deals and do-not-contact. | Built | Script, then agent |
| **Enrich** | The practice's website, the email on it (or a vendor's, per D1), phone, fax. Verify the email (Reoon or MillionVerifier, a few dollars per thousand). | Agent, plus a verifier (bought) | Research session that can open websites |
| **Research** | The research card from PR 133 (section 2), plus the signals: newly opened, hiring a clinician, hiring a referral or office manager, taking new patients. Each with a source link. One personal line. | Agent | Same session; card stored on the HubSpot record |
| **Approve** | One list a day on your phone, yes or skip per row (D2) | — | Gmail draft to you only (PR 133's design) |
| **Send** | Three-email sequence for the clinician type, from stream- or chart-riverrecords.com | Smartlead (bought) | You upload the approved rows (D9 says when that could be automatic) |
| **Reply** | Replies land in your inbox. Opt-outs are suppressed the same day in HubSpot and Smartlead's block list. | Bought, plus Owen's sweep | — |
| **Learn** | `test-log.md`, weekly, counts only | — | This repo |
| **Hand off** | When a prospect signs up, the HubSpot card goes one way into Stream's setup, per the shared spec | Spec in ai-scribe | — |

**Signals, ranked by what the test showed:**

1. **Newly opened.** Strongest and rarest. Find candidates with a new NPI registration and
   confirm them with Medicare's reassignment data (clinicians moving from another group). Most
   have no website yet.
2. **Hiring a clinician or a referral manager.** Not findable from search snippets. Needs the
   practice's careers page (website access) or a job-search API. SerpApi's Google Jobs and
   JSearch both have free tiers of about 200–250 searches a month (Quinn; prices from
   snippets). Never Indeed or LinkedIn directly: both terms bar automated access. Add it in
   week 3, after the basics work.
3. **Taking new patients.** Common and cheap, but weak: directories state it by default. Use it
   only to break ties.

---

## 3. Build order

1. **Before any email goes out (by 5 Jan):**
   - The HubSpot `do_not_contact` property (D5) and the four card properties from PR 133.
   - The privacy paragraph for prospects (D6).
   - The ad-identification line in the sequence (D7).
2. **Mon 30 Nov: the re-run** (section 1). It decides D1.
3. **Finder v1** in the private repo: Texas, primary care, monthly, writing to HubSpot. Smaller than
   it sounds, because it reuses the September pipeline; not estimated. Needs D4 and D8.
4. **Research routine:** a skill that takes N practices from HubSpot, researches each one, and
   writes the card. Built on the signup researcher (`signup-researcher` in ai-scribe), so the
   cards are one kind of card.
5. **Daily list:** Owen's morning batch to you, as designed in PR 133.
6. **Send:** Smartlead, manual upload. Warm-up starts 1 Dec (PR 133), so the first send is 5 Jan.
7. **Replies and suppression:** Owen's sweep reads replies; opt-outs are set the same day.
8. **Weekly test log.**
9. **Job signals** (SerpApi free tier), week 3.
10. **Automatic loading of approved rows** (D9), not before February.

The four clinician-type kits move to Monday, as planned. Pediatrics and DPC need the
registry-plus-website path, because Medicare's files mostly miss them.

---

## 4. The rules (Lane; not legal advice)

The full table with sources is in ai-scribe, `docs/research/prospecting-data-sources.md`.

- **Cold email is allowed** under CAN-SPAM with accurate headers, an honest subject, a postal
  address, a working opt-out honoured within 10 business days, and **a clear identification
  that the email is an advertisement**. The PR 133 sequence has the address and the opt-out.
  **It doesn't have the identification** (D7). $53,088 per email.
- **"Reply unsubscribe" is a valid opt-out.** The law names a return email address as a
  mechanism.
- **No fax outreach, ever.** An unsolicited fax advertisement is banned without an existing
  business relationship. A listing in NPPES isn't one. $500–1,500 per fax, and medical
  practices bring class actions. Since a 2025 Supreme Court decision, assume online fax counts
  too.
- **Phone:** manual calls to a business landline are fine. Check the do-not-call list before
  calling a cell phone.
- **Email collection:**
  - No automated harvesting from websites. A person, or an agent working one practice at a
    time, reads the page.
  - Skip any site with a "we don't give out addresses" notice.
  - No tools that guess name@domain combinations.
  - Harvesting alone isn't a violation. It turns any other slip into treble damages.
- **NPPES and Medicare data** are public, with no marketing restriction that Quinn could find.
- **State privacy laws:** California is the only one that covers people at work. Its law
  applies only to companies far larger than River Records; counsel to confirm (ad pixels count
  as "sharing"). Data-broker laws need a sale, except Texas, whose revenue tests we don't meet.
  Counsel to confirm Texas.
- **Privacy policy.** The current "Professional Information from Public Sources" paragraph (PR
  134) says we keep no email address found in public sources. That stays true for account
  holders, but prospecting does keep them. It needs a separate paragraph for prospects (D6).
  Lane's draft:

  > **Prospective customers.** If you are a clinician or practice we think Stream could help, we
  > may contact you about it. To do that we keep a short business profile: your name,
  > credential, specialty and NPI; your practice's name, address, phone, fax and website; a work
  > email address your practice publishes, or that we get from a commercial business-contact
  > provider; and public signals such as job postings or whether you are taking new patients.
  > Our sources are the NPPES NPI Registry, Medicare's public provider data, your practice's
  > website and, possibly, a commercial data provider. We use this only to contact you about
  > Stream, and we do not sell or share it. If we hear nothing back, we delete it within 12
  > months of our last message, keeping only your email on a do-not-contact list if you opt
  > out. To opt out or ask for deletion, reply "unsubscribe" or email hello@riverrecords.ai.

  Also start the existing paragraph with "When you create an account…", so each paragraph
  covers one group.

---

## 5. Owner decisions

| # | Decision | Recommendation |
|---|---|---|
| D1 | **Emails: public sources only, or a vendor** | **Decide after Monday's re-run.** If the practices' own sites give a usable email for at least about a third of qualified practices, stay public-only. If not, buy **Hunter Starter** ($49/month, monthly, 2,000 credits; price from snippets, check before paying), with Apollo's free tier as the comparison. Not Definitive Healthcare or IQVIA: quote-only, $25k+ a year, built for pharma. Not bought lists: they go stale fast. Doximity doesn't sell its data. |
| D2 | **The approval model** | **One list a day, yes or skip per row**, as PR 133 designed: a Gmail draft to you only, with each card above its email. Up to 10 rows a day in the first month. Approving a row sets a HubSpot property, which is the only thing that lets a row be sent. Approval by rule ("send every row that meets X") only after two months, and only if you rarely skip. |
| D3 | **Where to start** | **Independent primary care, 3–10 clinicians, Texas.** In the test, Texas kept 13 of 25 practices through the exclusions and New Jersey kept 6, because so much of New Jersey primary care is now system-owned. It's a small sample, so revisit after the first month. Add a second state then, not now. |
| D4 | **Network access for research** | **Yes, two changes.** (a) Allow `data.cms.gov` and `download.cms.gov` in this environment, so the finder can read Medicare's files and the registry's monthly file. (b) A separate personal environment, "Prospect research", whose network can open any website. Only the research routine uses it, because practice websites can't be listed in advance. You create (b) in Settings; the session tools can only add named hosts. |
| D5 | **A do-not-contact property in HubSpot** | **Yes.** Owen found none. Today only 8 contacts carry HubSpot's own unsubscribe flag, because almost nothing is sent through HubSpot marketing email. A "please stop" reply to a one-to-one email would otherwise never be recorded. One checkbox, `do_not_contact`, set the same day, and checked before every batch. |
| D6 | **The privacy paragraph for prospects** | **Yes, before 5 Jan**, with Lane's draft in section 4. **Choose the retention period**; 12 months is a placeholder, and the policy and the practice must match. Have counsel read it with the items in section 4. |
| D7 | **An ad-identification line in the three emails** | **Yes.** CAN-SPAM requires one and the sequence has none. Suggested footer line, for counsel: "This is a sales email from River Records." It goes in the footer, so the body still reads as one person writing to another. |
| D8 | **Where the finder runs** | **ai-scribe** (private), as `tools/prospecting/`, or a new private repo. Never this public repo: its Actions logs are public, and a prospect list must not end up in one. Move the September pipeline there; it holds code, no data. |
| D9 | **When approved rows load into Smartlead automatically** | **Not before February.** It would take three things: a Smartlead API key saved as a network secret; a loader that adds only rows carrying your approval property; and a change to the team's rule from "never sends" to "loads only rows you approved by name". That is sensible after four weeks of manual sending with bounces under 2%, no spam complaints, and every opt-out suppressed the same day. Until then you upload the CSV yourself, once a day. |
| D10 | **Postal letters to new practices** | **Optional, try 5 in January.** The three genuinely new practices in the test had no email, and fax is out. CAN-SPAM and the fax rules don't apply to a letter. A short signed letter to a physician who just opened their own practice is the channel that fits. Not costed. |

---

## 6. What was checked, and how well

- **The registry's API caps, fields and missing email/website fields** were tested live (Quinn).
- **Medicare's file contents, the vendor prices and the job-API prices** come from search
  snippets, because those hosts were refused. They are graded down in the research file. Check
  prices before paying.
- **Lane's statute citations** come from excerpts and reference knowledge (ftc.gov and the
  regulation sites were refused), with counsel items listed.
- **The 50-practice counts** are as measured, with the two limits in section 1.
