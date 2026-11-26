# Outbound v1: small and personal

**Draft, rewritten 26 Nov 2026 (first version 24 Nov). Mara, with Penn (copy) and Vera (claims).**
Nothing in here sends, posts or contacts anyone.

**Summary (for a phone).** Start with about **10 emails a day, each one researched and approved by
you**. Don't start with 300–600 a week. The aim is to stop playing the email numbers game: fewer emails,
each one obviously written to one clinician. Every prospect gets a **research card**: specialty, practice and size from the
public NPI registry, the rest from the practice's own website. The card produces the one personal
line, and it's stored in HubSpot. Record **one 60–90 second video per clinician type**: primary
care (covering for a partner), DPC, pediatrics, post-acute. Each video goes on its own short page with a booking link.
The email links to that page and never embeds the video. The scripts are in `video-scripts.md`, next to this file.
**Test only big differences**: video or no video, which problem leads, which clinician type.
Judge them on replies and booked demos. At 10 a day, a month of sending shows you what clearly
fails. It can't prove a winner (section 6). The domain work you've already done (section 1) still
applies. **Needed from you:** the decisions in section 7, and four recordings.

**What changed from the 24 Nov version.** The plan was 300–600 first touches a week across six
mailboxes. It's now about 50 a week, every one approved by you, with research behind the
personal line and a video per clinician type. The domains, DNS, warm-up and the three-email
sequence's claims carry over. The old volume table and the 30-day "1,500 touches" yardstick are
gone.

---

## 0. A day, start to finish

1. **Morning, before you see anything:** Owen picks the day's 10 from an approved HubSpot list
   (section 3) and splits them between the two versions of the current test, *before* any research
   (section 6 says why). For each one he fills in a research card (section 2) and writes email 1
   with its personal line. If the card turns up nothing true, he drops that prospect and picks
   the next one.
2. **You review the 10 on your phone.** Owen puts the day's batch in **one Gmail draft addressed
   to you only**, with each card above its email. Reply with what you approve, edit or skip
   ("1–4 ok, 5 skip, 6 change the second line to …"). Nothing goes to anyone you didn't approve by
   name. Owen never writes a cold email as a draft in your riverrecords.ai mailbox, because
   pressing send there would send cold mail from the company domain.
3. **The approved emails go out from a sending mailbox** (stream- or chart-riverrecords.com).
   The approved rows go into the sending tool as a CSV, and you upload it. Owen gets no access to
   the tool. The tool sends emails 2 and 3 in the same thread unless the person has replied, and
   you can stop any thread. Once you approve, the session writes the card to the contact's record
   in HubSpot. Owen's HubSpot access is read-only.
4. **Replies land in your inbox.** Owen reads them in his next morning sweep, records the outcome
   on the card, and drafts a response as a Gmail draft. You answer every reply yourself.

Weekly: the test log (section 6) is updated with sends, replies and bookings per version.

---

## 1. Domain warm-up: the checklist you do yourself

The rule: **never send cold email from riverrecords.ai.** If a cold domain gets burned, the
company's real mail (support, invoices, the app's notifications) has to keep landing.

| # | Step | Detail |
|---|---|---|
| 1 | **Pick 2–3 domains you already own** | Done. See section 1a: stream-, chart- and mail-riverrecords.com. |
| 2 | **2–3 mailboxes per domain** | Use real names only: `jake@`, `jacob@`, and at most one other. No `sales@` or `info@`. Google Workspace Business Starter costs $8.40 per user/month on the flexible plan, or $7.00 on annual ([Google](https://knowledge.workspace.google.com/admin/billing/compare-flexible-and-annual-fixed-term-payment-plans)). Four mailboxes (two domains) come to about $34/month; six to about $50. Give each a photo and the same signature. |
| 3 | **SPF** | One TXT record per domain: `v=spf1 include:_spf.google.com ~all`. Only one SPF record per domain. |
| 4 | **DKIM** | Generate a 2048-bit key in Workspace Admin (Gmail → Authenticate email), add the TXT record, then click *Start authentication*. |
| 5 | **DMARC** | `_dmarc` TXT: `v=DMARC1; p=none; rua=mailto:<a mailbox you read>`. Move to `p=quarantine` after 4 clean weeks. Google requires at least `p=none` with alignment ([Google](https://support.google.com/mail/answer/81126)). |
| 6 | **Redirect to the site** | 301 each domain's root to `https://www.riverrecords.ai/`. Anyone who checks the sender's domain should land on the real company. |
| 7 | **Tracking domain** | A CNAME such as `go.<domain>` pointed at the sending tool, so links aren't served on the tool's shared domain. **Leave open tracking off** (see section 5). |
| 8 | **Sending tool with warm-up** | See the comparison below. Connect every mailbox and turn on warm-up the same day DNS checks out. |
| 9 | **Ramp** | Weeks 1–3: warm-up only, starting at 1/day and ending around 10/day. From week 4: the plan's ~10 first emails a day *in total*, spread across the mailboxes, plus their follow-ups. That is far under the usual 30-per-mailbox ceiling, which is the point. Keep warm-up running the whole time. Smartlead and Instantly both advise at least 2 weeks for new inboxes and about 4 for new domains ([Instantly](https://instantly.ai/blog/30-day-warmup-hygiene-system-for-primary-inbox/), [Smartlead](https://api.smartlead.ai/guides/email-warmup)). |
| 10 | **Verify every list** | Run each list through a verifier before upload. Send only to addresses marked "valid", never to catch-alls in week 1. MillionVerifier costs about $3.70 per 1,000. ZeroBounce and NeverBounce cost about $7–10 per 1,000 (prices unconfirmed; check before paying). Keep bounces under 2%. |
| 11 | **Monitoring** | Google Postmaster Tools, one property per domain (v2 shows Compliance Status; [Google](https://support.google.com/mail/answer/16594218)). Spam rate must stay **below 0.1% and never reach 0.3%** ([Google](https://support.google.com/mail/answer/14229414)). Each week, run a free blocklist lookup at [check.spamhaus.org](https://check.spamhaus.org/) and MXToolbox. |
| 12 | **CAN-SPAM** | Every email needs a real postal address and an opt-out that actually works and is honoured within 10 business days (we'll do it the same day). The opt-out has to keep working for 30 days after sending. No misleading subject lines or headers. The penalty is up to $53,088 per email ([FTC](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business)). |

### 1a. Your four domains, as their public DNS stood on 25 Nov 2026

Checked read-only through Google's public DNS. Nothing was changed.

| Domain | DNS host | Website (root) | MX | SPF | DMARC | Google DKIM |
|---|---|---|---|---|---|---|
| stream-riverrecords.com | Squarespace Domains (ns-cloud-b*.googledomains.com) | Squarespace IPs | none | `v=spf1 -all` | `p=reject`, strict | none |
| chart-riverrecords.com | Squarespace Domains (ns-cloud-d*) | Squarespace IPs | none | `v=spf1 -all` | `p=reject`, strict | none |
| mail-riverrecords.com | Squarespace Domains (ns-cloud-c*) | Squarespace IPs | none | `v=spf1 -all` | `p=reject`, strict | none |
| riverrecords.online | Squarespace Domains (ns-cloud-e*) | Squarespace IPs | none | `v=spf1 -all` | `p=reject`, strict | none |

**What this means.** All four are set up as *parked, never sends mail*. There's no MX record, the
SPF record says no server may send for the domain, and DMARC tells receivers to reject anything that
claims to come from it. For a parked domain that's correct. As things stand, any mail sent from these
domains would be rejected. Each one also carries a `google-site-verification` record, so the domains
have probably been verified with Google already, which would speed up adding them to Workspace.

**Which to use.** `stream-` and `chart-riverrecords.com` read as the company and the product. Use
`mail-riverrecords.com` third: it works, but "mail-" reads slightly like infrastructure. **Keep
riverrecords.online parked as it is.** `.online` domains carry more spam on average, and filters
weigh that. It still protects the brand by staying locked.

**The changes, per sending domain** (in Squarespace → Domains → DNS):

1. **Workspace:** add the domain to the existing riverrecords.ai Google Workspace as a *secondary
   domain*, so there's one admin and one bill. Create `jake@` and `jacob@` on it. Six mailboxes
   cost about $50/month.
2. **MX:** add `smtp.google.com`, priority 1. Replies need somewhere to land.
3. **SPF:** *replace* `v=spf1 -all` with `v=spf1 include:_spf.google.com ~all`. Edit the existing
   record; don't add a second one.
4. **DKIM:** in Workspace Admin → Gmail → Authenticate email, generate a 2048-bit key for the
   domain. Add the `google._domainkey` TXT record, then click *Start authentication*.
5. **DMARC:** replace the current `p=reject` with
   `v=DMARC1; p=quarantine; rua=mailto:jake@<domain>; adkim=s; aspf=s`. Google's mail still passes
   strict alignment. Quarantine plus reports means a setup mistake shows up in a report instead of
   mail silently disappearing. Move back to `p=reject` after four clean weeks if you like.
6. **Root and www:** the domains currently point at Squarespace. Use Squarespace's domain
   forwarding to send them, with a 301, to `https://www.riverrecords.ai/`. We couldn't load the
   pages from here to see what they currently show.
7. **Tracking:** after choosing the sending tool, add the CNAME it gives you (e.g. `go.<domain>`).

When those are in, tell us and we'll re-check all three domains read-only before warm-up starts.

**Status, 25 Nov (re-checked read-only):** stream-riverrecords.com and chart-riverrecords.com are
done. Each has Google MX, SPF `include:_spf.google.com ~all` (the old `-all` line is gone),
DMARC `p=quarantine` with reports to jake@ on the same domain, and a complete 2048-bit Google
DKIM key. Each is forwarded to riverrecords.ai and has jake@ and jacob@ mailboxes. Still to do:
click *Start authentication* in Google Admin, fix www (doesn't resolve), then set up the sending
tool and turn on warm-up. mail-riverrecords.com is not set up yet; it's optional for v1.

Separately, **riverrecords.ai's own DMARC is `p=none`**. That's fine for now. Tightening it is a
separate job and shouldn't be done during this setup, because it affects HubSpot and app mail.

**Dates if you start this week.** By Fri 28 Nov: domains chosen, mailboxes created, DNS set.
Mon 1 Dec: warm-up on. Around Mon 15 Dec: the first researched emails can go. **Recommended first
week: Mon 5 Jan**, with a few in mid-December only if you want to test the workflow end to end. The weeks of 22 and 29 Dec are poor weeks to reach a practice.
Warm-up continues through them at no cost.

At about 10 first emails a day plus follow-ups we stay far below Google's bulk-sender line
of roughly 5,000/day to Gmail, which is where one-click unsubscribe becomes mandatory. We include
an unsubscribe route anyway.

### Sending tools (prices seen 24 Nov 2026)

Quinn could only see these through search snippets, because the vendor sites were blocked from our
session. **Check the pricing page before paying.**

| | Smartlead | Instantly | lemlist |
|---|---|---|---|
| Entry plan | Basic, ~$39/mo (~$32.50 annual) | Growth, ~$47/mo (~$37.60 annual) | Unclear; tiers renamed in 2026 (~$55/user/mo reported) |
| Warm-up | Included, unlimited | Included on paid plans ([help](https://help.instantly.ai/en/articles/7920548)) | lemwarm, bundled or ~$29/seat |
| Mailboxes | Unlimited | Unlimited | About 3 senders per user |
| Volume on entry plan | ~2,000 active leads, 6,000 emails/mo | ~1,000 contacts, 5,000 emails/mo | ~5,000 emails/mo |
| Custom tracking domain | Yes | Yes | Yes |
| Tracking off / plain text | Yes; plain-text send drops tracking | Yes, per campaign | Yes |
| BAA / HIPAA statement | None found | None found | None found |

**Recommendation: Smartlead Basic.** It costs the least, has unlimited mailboxes and warm-up, and
its lead allowance fits many months at 10 a day. At this volume you could send by hand from Gmail, but you'd still need a warm-up tool, and the sending tool also threads emails 2 and 3 and stops them when someone replies. One tool does all three. Instantly is the equivalent alternative. Choose lemlist only
if you want its LinkedIn steps, which we don't recommend yet. None of these tools offers a BAA, so
**never put patient information in an email or a reply template.** Nothing in this sequence does.

---

## 2. The research card

One per prospect, filled in before the email is written. Its job is to produce **one true,
specific sentence**: the personal line in email 1. A card that can't produce one means that
prospect isn't emailed today.

| Field | Source | Notes |
|---|---|---|
| Name, credential | NPI registry (NPPES, public) | Match on name + state. If two records fit, stop. |
| Specialty | NPI registry taxonomy | The primary taxonomy picks the clinician type, and therefore the video and the problem line. |
| Practice name and address | NPI registry, then the practice website | The website wins if they disagree. NPI addresses go stale. |
| Practice size | Count of clinicians on the website's "our team" page. NPI records at the same address as a check. | NPPES has no "works at" link, so the address count is approximate. Write "about N". Under 3 clinicians goes to the trial, not a demo ask (section 3). |
| Practice model | Website | Insurance-based, DPC/membership, concierge, hybrid. |
| Who they see | Website | Adults, children or both; any stated focus (complex chronic, geriatrics, newborns, nursing-home rounds). |
| EHR, if the site names one | Website (patient portal links often show it) | For our context only, never mentioned in the email. We don't pitch against the EHR. |
| Something they did or said | Website: a clinician bio, a post, a talk, a newsletter | This is where the personal line usually comes from. |
| **Personal line** | Written from the fields above | One sentence. Quote nothing you can't link to. |
| Source links | — | A URL for every fact on the card. |
| Test version, video page | Assigned before research (section 6) | e.g. `T1-A`, `/watch/primary-care/` |
| Outcome | Filled in later | No reply / reply: positive, not now, no, unsubscribe / demo booked / bounced |

**Rules for the personal line.** Use only professional, public facts: the practice, its model,
something the clinician published or said in a professional setting. Never their family, home,
personal social media, reviews by patients, or anything about a patient. Don't flatter. "I read
your practice's page on why you went membership-only" beats "I'm impressed by your work". If it
would feel odd said across a table at a conference, it's out.

**Where it lives.** HubSpot, on the contact. Four contact properties, which you create once
(Settings → Properties). The names must match exactly:

| Internal name | Type | Holds |
|---|---|---|
| `outreach_research_card` | Multi-line text | The card, as plain text, with its source links |
| `outreach_personal_line` | Single-line text | The line that was sent |
| `outreach_test_arm` | Single-line text | e.g. `T1-A` |
| `outreach_outcome` | Dropdown | The outcome values above |

Nothing from a card goes in this repo, a PR or an issue. The test log (section 6) holds counts
only.

**One access gap.** This session couldn't reach the NPI registry's public API
(`npiregistry.cms.hhs.gov`, refused 26 Nov). For Owen or the session to look prospects up, that one
host has to be allowed in this cloud environment's network settings (section 7, D10). Until then,
cards are built from the practice website alone. That works, but the specialty and size fields
are less reliable.

---

## 3. Who, and how many

**Volume:** about 10 new first emails a day, five days a week, so ~50 a week and ~200 a month.
Follow-ups (emails 2 and 3) go only to people who haven't replied, in the same thread. Hold at
10 a day for the first month. Raise it only if you're approving faster than prospects get
researched, and never past what you can read yourself.

**Clinician types, one video each.** These come from `gtm/problem-first-messaging.md` and the
`/for/*` pages:

| Type | Lead problem | Video page | Note |
|---|---|---|---|
| Independent primary care / IM, 3–10 clinicians | Covering for a partner: finding their plan for a patient | `/watch/primary-care/` | The core of the field sheets |
| DPC / membership | A long relationship carried in your head, which doesn't transfer | `/watch/dpc/` | Never pitch time saved; they built the practice around time with patients |
| Pediatrics | The history a family assumes you'll remember from one well visit to the next | `/watch/pediatrics/` | |
| Post-acute (SNF / LTC) | Residents seen by several clinicians across shifts; what gets lost at handoff | `/watch/post-acute/` | Email the attending or medical director, not the facility. The SNF page's ask is a demo, and so is this one. |

The 24 Nov version left SNF out because it's a demo-led sale to a different buyer. At 10 a day,
researched one at a time, that concern is handled by choosing the person carefully, so it's back
in with its own video. **Integrative / complex chronic stays referral-only.** Email only people
already in HubSpot, use the `/for/complex-chronic/` page, and don't record a video for it yet. The
segment is small and moves physician to physician.

**Don't email:** health-system-owned groups or practices with an IT department; anyone who needs
EHR write-back or SOC 2 to sign; current customers; open deals; anyone emailed in the last 14
days; anyone marked do-not-contact. Solo clinicians are fine to research, but the ask is the trial,
not a demo.

**HubSpot lists.** You approve each by name in `approved-lists.md`. Owen proposes them with
counts:
`Outbound v1 – PC/IM 3-10` · `Outbound v1 – DPC` · `Outbound v1 – Peds` · `Outbound v1 – Post-acute`.
Each excludes customers, open deals, unsubscribes and anyone emailed in the last 14 days. At 10 a
day, 50–100 contacts per list covers the first month. Approving a list lets Owen *research and
prepare* from it. Each email still needs your approval by name.

**Marketing-contact limit.** Cold contacts are emailed from the sending tool, so they don't need
to be HubSpot marketing contacts. Mark a contact only once they reply or book.

---

## 4. The emails

The three-email sequence from the 24 Nov version carries over unchanged. Vera checked it then
against the site's pages: 12 claims, and the 2 she flagged are fixed. The full text is in
section 4a. What changes is what goes around it:

- **`{personal_line}` comes from the research card**, never from a guess. With no true line, the
  prospect isn't emailed.
- **The problem line follows the clinician type** (`{practice_type_line}` in
  `clinician-intro.md`, plus a post-acute variant that already exists there).
- **In the video version, one sentence links to the video page** in place of the booking link in
  email 1. Email 1 still carries one link at most:

  > I recorded 90 seconds on what that looks like for {clinician_type_plural}: {video_page_url} Or just reply.

  The URL is the video page with the UTMs (section 5). The booking link is on the page itself.
  **Never put the video in the email**: no embedded player, no animated thumbnail, no attachment.
  Those hurt deliverability, and an email that only links to a page is the one the test compares
  (section 6).
- `{clinician_type_plural}`: "primary care doctors", "membership practices", "pediatricians",
  "clinicians in post-acute care". Penn's wording; Vera to check it with the scripts.

Plain text, one link at most, no images, no prices, no time-saved claims, no compliance words, no
write-back, and nothing positioned against the EHR. That's the same rule as before.

### 4a. The sequence (carried over, for reference)

**Email 1, day 0.** Subject: *The list you keep by hand*. This is `clinician-intro.md` with its
fields unchanged.

> Hi {first_name},
>
> {history_line} {personal_line}
>
> Most good clinicians I know keep each patient's problems, plans and loose ends by hand, in their notes. It works. It doesn't scale past the patients you remember, and it doesn't transfer: a partner covering for you starts from scratch. {practice_type_line}
>
> Your EHR keeps the record. Stream keeps the project. It's an AI scribe that files each visit under the problems it touches, so every plan for a problem is there, in order, when you open it in Stream. It works alongside any EHR.
>
> If that sounds familiar, I'd value 20 minutes: https://www.riverrecords.ai/book-demo/?utm_source=outreach&utm_medium=email&utm_campaign=outbound-v1&utm_content=e1 Or just reply.
>
> If this isn't useful, tell me and I won't write again.
>
> Jake

The changed sentence was "so the plan and what's still outstanding are there when you open the
chart". Vera flagged it: "outstanding" suggests tracking each plan item to completion, which is
early access (`/referral-tracking/`), and "the chart" reads as the EHR's chart.

**Email 2, day 4, same thread.**

> Hi {first_name},
>
> One question I should have led with: when you cover for a partner, how do you find their plan for a patient's CKD? Usually it means decoding their notes.
>
> In Stream, each visit's Assessment & Plan is filed under its problem. The covering clinician opens the same problem view, with who wrote each entry. This page lays it out, including what Stream doesn't do: https://www.riverrecords.ai/longitudinal-patient-tracking/?utm_source=outreach&utm_medium=email&utm_campaign=outbound-v1&utm_content=e2
>
> If this isn't useful, tell me and I won't write again.
>
> Jake

For pediatrics, use "a child's asthma" in place of "a patient's CKD". Vera approved the swap.

**Email 3, day 9–10, same thread, no link.**

> Hi {first_name},
>
> Last note from me. If you keep each patient's problems and loose ends by hand and it's holding up, that's a good system and I'll leave it there. If it's started to slip, reply "show me" and I'll find a time.
>
> If this isn't useful, tell me and I won't write again.
>
> Jake

**Footer on all three:** Jake Kantrowitz, MD, PhD · Co-Founder & CEO, River Records ·
{postal_address} · "Don't want these? Reply 'unsubscribe' and you won't hear from us again."

**Where the claims come from** (Vera's sources): record/project, `index.astro` and
`/longitudinal-patient-tracking/`. Hand-kept system doesn't scale or transfer, the same two pages.
A&P filed under each problem, and the same view for a covering clinician with who wrote each entry,
`/longitudinal-patient-tracking/`. Works alongside any EHR, `faqs.ts` limits group. 20-minute demo,
`/book-demo/`.

Penn and Vera both noted that "you won't hear from us again" is a promise about how opt-outs are
handled. Anyone who replies "unsubscribe", "no" or "tell me" gets suppressed **across every
sending domain and in HubSpot** the same day.


**Email 2 for post-acute.** "Cover for a partner … a patient's CKD" doesn't fit a facility. Use:
"when you round on a colleague's residents, how do you find their plan for a resident's heart
failure?" This is new wording, and Vera checks it with the scripts.

---

## 5. The videos and their pages

**Scripts:** `marketing/outreach/video-scripts.md`, one per clinician type, 60–90 seconds, for you
to record. Vera's check of each claim is noted in the file. They use the same rules as the
emails, plus the copy rule Mara set on 26 Nov: never say a recording "always" stays with its
visit, and never say every last word is kept.

**Recording.** Talk to camera, with Stream on screen showing the fictional demo patient, never a
real chart. One take is fine; these should look like you, not like an advert. Loom is already
how the site's videos are hosted, and `src/config/videos.ts` holds their metadata.

**One short page per video**, at `/watch/<type>/`, built once you've recorded:
- the video, using the site's existing click-to-play `LoomEmbed`, so nothing from Loom loads until
  someone presses play, and `video_play` is recorded;
- two sentences under it, then **Book 20 minutes** (`/book-demo/`) as the only button, and a quiet
  link to the matching `/for/*` page for anyone who wants more;
- `noindex`: these are destinations for email, not search pages, and four thin pages shouldn't
  compete with `/for/*`;
- left out of the sitemap too: the sitemap filter in `astro.config` excludes only
  `/product-overview/` today, so `/watch/` has to be added to it;

**Before email traffic goes to the `/for/*` pages**, note that Vera found lines on them that the
scripts deliberately avoid: time claims on `/for/snf/` ("in minutes", "Notes are done before you
leave the room") and a "HIPAA Compliant" proof strip on `/for/dpc/`, `/for/pediatrics/` and
`/for/snf/`. The `/watch/` pages link to `/for/*` only as a quiet "more" link, but someone
clicking through from your email lands on those lines (D12).

The pages aren't built today, because there's nothing to put on them until a video exists. Building
one takes about an hour per video, once you send the Loom link.

**Why a page, not a Loom link.** A loom.com link is a dead end: no booking button, no HubSpot page
view, no `rr_vid`, and no way to see that the person watched. (The same reason the site's `#watch`
links exist; see `CLAUDE.md`, "Deep links for outbound".)

**Measurement.** Every link carries
`utm_source=outreach&utm_medium=email&utm_campaign=outbound-v1&utm_content=<arm>-e<n>`, e.g.
`T1-A-e1`. `attribution.js` stores it as first touch if this is the visitor's first visit, and
always as last touch. `/book-demo/` passes first-touch source, medium and campaign into Calendly
but overwrites `utm_content` with `book-demo`, so today a booking does not carry its test arm.
Before the first send, either change `/book-demo/` to pass the stored `utm_content`, or match
bookings to arms through `rr_vid`, which `/book-demo/` already passes to Calendly as
`salesforce_uuid`. *Recommendation:* the `/book-demo/` change, built with the first `/watch/`
page. Check with `?rr_debug=1` before the first send. Open
tracking stays off: image proxies make open rates meaningless and tracking pixels hurt placement.

---

## 6. Testing: only big differences

**What's tested, one at a time, in this order:**

| Test | A | B | Why first |
|---|---|---|---|
| T1 | No video: email 1 asks for 20 minutes | Video: email 1 links to the clinician type's video page | The biggest unknown and the biggest cost (your recording time) |
| T2 | The clinician type's own problem leads | The general "list you keep by hand" problem leads | Whether personalising the problem matters beyond the personal line |
| T3 | (no split) | Compare clinician types against each other on the same email | Which segment to spend the research on |

Subject lines, word choice and send times aren't tested. At this volume, differences that small
can't be seen.

**Judged on:** positive replies and booked demos per first email sent. Not opens, and not clicks.
A "not now" reply counts as a reply, but is logged separately.

**How prospects are split.** Each day's 10 are alternated A, B, A, B *before* anyone researches
them, and the arm goes on the card. If the split happens after research, the prospects with the
best personal lines drift into whichever version you like more, and the test then measures the
research, not the email.

**What this volume can and can't show.** Be honest with yourself about this before the first
number comes in:

- About 200 first emails a month means about **100 per version**. Cold reply rates for
  personal, researched email are commonly a few percent, so expect **2–10 replies a month in
  total**, and demos in single figures.
- With 100 per version, 2 replies against 6 looks like "three times better", but it could easily
  be chance. A standard test puts it at roughly a 1-in-4 chance of a gap that big with no real
  difference (Fisher's exact, p ≈ 0.28). Even 2 against 8 is only p ≈ 0.10.
- To reliably detect a jump from 3% to 9% you need about **250 per version, about 10 weeks** at 10 a
  day. To detect 2% against 4%, about 1,100 per version, which this plan never reaches.
- Booked demos are rarer still, so **no test here can be decided on demos alone**. Read demos as a
  check on the reply winner, not as the result.

**So the rule is:** run each test for at least 4 weeks (~100 per version). Switch to B only if it
is clearly ahead on replies *and* nothing in the replies themselves argues against it. Otherwise
keep the simpler version and move to the next test. Read every reply. At this volume, what
people actually write back tells you more than the counts do.

**The log** is `marketing/outreach/test-log.md`: one row per week per version, counts only.

| Week | Test | Version | First emails | Replies (positive / not now / no) | Unsubscribes | Demos booked | Bounces |
|---|---|---|---|---|---|---|---|

No names, practices or quotes from replies go in the log. Those stay on the HubSpot card.

**Stop rules (deliverability):** pause a mailbox if bounces go over 3% or spam complaints show up
in Google Postmaster. Pause everything if any domain appears on a blocklist. At this volume, a
single complaint is worth reading closely.

---

## 7. Owner decisions

| # | Decision | Recommendation |
|---|---|---|
| D1 | Sending domains | **Answered 25 Nov:** stream- and chart-riverrecords.com. mail-riverrecords.com isn't needed at 10 a day. |
| D2 | Sending tool | **Smartlead Basic**, monthly. You need a warm-up tool anyway, and it also threads emails 2–3 and stops them on reply. You review each day's 10 before upload, so nothing sends without you. |
| D3 | Start date | Warm up from 1 Dec. **First researched emails Mon 5 Jan**, with a handful in mid-December only to test the workflow. |
| D4 | Unsubscribe route | **Reply "unsubscribe"**, suppressed the same day on every domain and in HubSpot. Keeps each email to one link. |
| D5 | Change one line in `clinician-intro.md` ("outstanding … the chart") | **Yes.** Vera flagged it on 24 Nov, and the same line goes to the 1:1 intros too. |
| D6 | Postal address in the footer | A business address you're willing to publish (registered office or a PO box). Not a home address. CAN-SPAM requires one. |
| D7 | Is Bullpen still sending? | **Find out before 5 Jan.** Their invoice is due today, so they may still be active. If they are, the two must not email the same people, and Bullpen links should go to the site's `#watch` pages with their own UTMs, not to loom.com. |
| D8 | HubSpot lists | Approve the four `Outbound v1 – …` lists by name once Owen proposes them with counts. Approval lets him research from a list. Each email still needs your yes. |
| D9 | Record four videos | **Primary care first** (T1 can start with one type), then the rest before T3. About 10 minutes each with retakes; this isn't a measured figure. |
| D10 | Let research reach the NPI registry | **Yes:** allow `npiregistry.cms.hhs.gov` in this cloud environment's network settings. It's one public government host. Without it, cards rely on practice websites alone. |
| D11 | Create the four HubSpot contact properties (section 2) and reconnect HubSpot with notes and lists permissions | **Yes.** Without the properties, cards have nowhere to live. Without the reconnect, Owen can't read lists or past notes (he couldn't today). |
| D12 | The time and "HIPAA Compliant" lines on `/for/snf/`, `/for/dpc/`, `/for/pediatrics/` (section 5) | **Review before 5 Jan.** Either soften them, or link the `/watch/` pages to `/longitudinal-patient-tracking/` instead of `/for/*`. That page carries none of them. |

---

## 8. What changes elsewhere

**Owen's approvals (`approved-lists.md`).** Today it holds one one-off approval. This plan needs:
1. Standing approvals **by list name** (D8), with a cap of 10 prepared per day across all lists.
2. A line saying Owen may *research and prepare* a daily batch as one Gmail draft **to you
   only**, and may never draft a cold email to a prospect in your riverrecords.ai mailbox.
3. The sequence as an approved template: `outbound-v1-sequence.md` (section 4a plus the video
   sentence and the post-acute email 2), added next to `clinician-intro.md` once D5 is decided.
4. A suppression rule: anyone who opts out on any domain is marked do-not-contact in HubSpot the
   same day, and Owen checks that flag before every batch.

**Two pieces going to engineering in ai-scribe (today, not built here):**
- **New-signup research and welcome draft.** When someone signs up for the trial, a research
  card like section 2's is built for them, along with a welcome email drafted for you to send.
  It's the same "researched, personal, you approve it" idea, applied to people who came to us.
  The card format here should be the one it uses, so that HubSpot holds one kind of card.
- **The app's dropped visitor id** (`docs/APP-RR-VID-TICKET.md`). The site already sends `rr_vid`
  on every signup link; as of 28 Sep the app dropped it. Until that's fixed, a trial started from one of
  these emails links back to the email only if the UTM survived the click. At about 50 emails a
  week, every signup matters, so this one matters more than it did at 600.

**Displaced:** the fax-handling and task-tracking one-pager planned for Friday (week plan, item
4) is moved down unless you say otherwise.
