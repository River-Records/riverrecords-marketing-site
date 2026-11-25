# Outbound engine v1: brief

**Draft, 24 Nov 2026. Mara, with Quinn (research), Penn (copy) and Vera (claims).** Nothing in
here sends, posts or contacts anyone.

**Summary (for a phone).** Yes, warming up the domains is the main blocker, and it takes about three
weeks, so start this week. Buy nothing new. Of the four domains you own, send from
**stream-riverrecords.com** and **chart-riverrecords.com**, and add **mail-riverrecords.com** as the
third. Keep riverrecords.online parked. All four are currently locked so they can't send mail
(checked 25 Nov, section 1a), so each one needs about five DNS changes. Put two mailboxes on each,
point each domain at riverrecords.ai, and connect them to one sending tool with warm-up built in. Smartlead Basic (about
$39/month) or Instantly Growth (about $47/month), plus Google Workspace at about $8.40 per mailbox.
If you start by Friday, cold sending can begin around **15–17 December** at 10 a day per mailbox.
In practice the first real week is **5 January**, because nobody reads cold email over Christmas.
The first list is independent practices with three or more clinicians, in primary care, DPC,
pediatrics and integrative care. The three-email sequence below passed Vera's check once two lines
were fixed. You still send or approve every first email, and every reply lands in your own inbox.
After 30 days, judge it on replies and booked demos. Opens don't count. **Needed from you:** the
DNS changes in section 1a, and the decisions in section 6.

---

## 1. Domain warm-up: the checklist you do yourself

The rule: **never send cold email from riverrecords.ai.** If a cold domain gets burned, the
company's real mail (support, invoices, the app's notifications) has to keep landing.

| # | Step | Detail |
|---|---|---|
| 1 | **Pick 2–3 domains you already own** | Done. See section 1a: stream-, chart- and mail-riverrecords.com. |
| 2 | **2–3 mailboxes per domain** | Use real names only: `jake@`, `jacob@`, and at most one other. No `sales@` or `info@`. Google Workspace Business Starter costs $8.40 per user/month on the flexible plan, or $7.00 on annual ([Google](https://knowledge.workspace.google.com/admin/billing/compare-flexible-and-annual-fixed-term-payment-plans)). Six mailboxes come to about $50/month. Give each a photo and the same signature. |
| 3 | **SPF** | One TXT record per domain: `v=spf1 include:_spf.google.com ~all`. Only one SPF record per domain. |
| 4 | **DKIM** | Generate a 2048-bit key in Workspace Admin (Gmail → Authenticate email), add the TXT record, then click *Start authentication*. |
| 5 | **DMARC** | `_dmarc` TXT: `v=DMARC1; p=none; rua=mailto:<a mailbox you read>`. Move to `p=quarantine` after 4 clean weeks. Google requires at least `p=none` with alignment ([Google](https://support.google.com/mail/answer/81126)). |
| 6 | **Redirect to the site** | 301 each domain's root to `https://www.riverrecords.ai/`. Anyone who checks the sender's domain should land on the real company. |
| 7 | **Tracking domain** | A CNAME such as `go.<domain>` pointed at the sending tool, so links aren't served on the tool's shared domain. **Leave open tracking off** (see section 5). |
| 8 | **Sending tool with warm-up** | See the comparison below. Connect every mailbox and turn on warm-up the same day DNS checks out. |
| 9 | **Ramp** | Weeks 1–3: warm-up only, starting at 1/day and ending around 10/day. Week 4: 10 cold sends per mailbox per day. Week 5 onward: 15–20. The ceiling is 30. Keep warm-up running the whole time. Smartlead and Instantly both advise at least 2 weeks for new inboxes and about 4 for new domains ([Instantly](https://instantly.ai/blog/30-day-warmup-hygiene-system-for-primary-inbox/), [Smartlead](https://api.smartlead.ai/guides/email-warmup)). |
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

Separately, **riverrecords.ai's own DMARC is `p=none`**. That's fine for now. Tightening it is a
separate job and shouldn't be done during this setup, because it affects HubSpot and app mail.

**Dates if you start this week.** By Fri 28 Nov: domains chosen, mailboxes created, DNS set.
Mon 1 Dec: warm-up on. Around Mon 15 Dec: cold sending can start at 10/day/mailbox. **Recommended
start for real volume: Mon 5 Jan.** The weeks of 22 and 29 Dec are poor weeks to reach a practice.
Warm-up continues through them at no cost.

At our volume (6–9 mailboxes, at most about 270/day) we stay far below Google's bulk-sender line
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
its lead allowance fits the first month. Instantly is the equivalent alternative. Choose lemlist only
if you want its LinkedIn steps, which we don't recommend yet. None of these tools offers a BAA, so
**never put patient information in an email or a reply template.** Nothing in this sequence does.

---

## 2. Who to target first

These come from `gtm/problem-first-messaging.md`, the battle cards' "when to walk away" list and
the field sheets.

**First wave, in this order:**
1. **Independent primary care and internal medicine, 3–10 clinicians.** This is the core of the
   field sheets. It has a full panel and partners who cover for each other, which is the problem
   email 2 is about.
2. **DPC / membership practices.** They have long patient relationships and run their own systems.
3. **Pediatrics.** Use the well-visit line from the template.
4. **Integrative / complex chronic, adults and children.** Small network, so it moves by referral.
   Email only people who are already in HubSpot, and expect a reply to turn into a referral rather
   than a booking.

**Don't email:** health-system-owned groups or practices with an IT department; anyone who needs
EHR write-back or SOC 2 to sign; solo clinicians (under 3 clinicians goes to the self-serve trial,
not a demo ask); current customers; open deals; anyone emailed in the last 14 days; anyone marked
do-not-contact. SNF is a demo-led sale and a different buyer, so leave it out of v1.

**HubSpot lists to build.** Owen proposes them and you approve each by name in `approved-lists.md`:
- `Outbound v1 – PC/IM 3-10` · `Outbound v1 – DPC` · `Outbound v1 – Peds` · `Outbound v1 – Integrative`
- Each list excludes customers, open deals, unsubscribes and contacts emailed in the last 14 days.
- About 50–150 contacts per list for the first month. Our connector couldn't read existing list
  names today (it needs reconnecting with list permissions), so sizes are not checked yet.

**Marketing-contact limit.** Starter includes 1,000 marketing contacts and the CRM holds about
3,440. Cold contacts are emailed **from the sending tool**, so they don't need to be HubSpot
marketing contacts. **Don't mark the cold list as marketing contacts.** Mark a contact only once
they reply or book.

---

## 3. The sequence

Penn drafted it from the approved template, and Vera checked it against this site's pages.
**Caveat:** ai-scribe wasn't attached to this session, so the claims are traced to published site
pages, not to the product's code. Every claim below is already made on a product page. The emails
are plain text with no images and one link at most. They make no time-saved claims and no
prices, compliance words or write-back claims, and never position Stream against the EHR.

Vera first returned FAIL: 12 claims, 10 verified, 2 unverified. Both unverified lines are fixed
below. One of the fixes changes a line in the approved template, so it's an owner decision (D5).

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

---

## 4. Volume, replies, and what stays human

- **Volume:** 10 new contacts per mailbox per day in week 1, then 15–20. With 6 mailboxes that's
  about 60–120 first touches a day at most, or 300–600 a week. Day-one sends cap at 60 until bounce
  and spam numbers are known.
- **Replies reach you:** every mailbox is yours, and replies land there and in the sending tool's
  unified inbox. Forward each sending mailbox to your main inbox, or check the unified inbox daily.
  The tool's auto-reply is off. Owen reads replies in his morning sweep, files signal as proposed
  issues, and drafts responses as **Gmail drafts only**.
- **What stays human:** you approve each list by name; you approve the sequence copy once; you
  send or approve the first batch of every new list; you answer every reply yourself (Owen's draft
  is a starting point). Nothing is sent by an agent. Owen's tools have no send, and the sending
  tool is under your login only.
- **Stop rules:** pause a mailbox if bounces go over 3% or spam complaints show up in Postmaster.
  Pause everything if any domain appears on a blocklist.

---

## 5. Measurement

- **Site:** every link carries `utm_source=outreach&utm_medium=email&utm_campaign=outbound-v1`
  with `utm_content=e1|e2`. `attribution.js` keeps that as first touch, `rr_vid` follows the
  visitor, and `/book-demo/` passes it into Calendly. Check it with `?rr_debug=1` before the first
  send.
- **HubSpot:** the visitor's `hubspotutk` only ties to a contact when they identify themselves (a
  booking, a form). Cold clicks from a non-HubSpot tool stay anonymous until then.
- **App:** `tenant.utm_source` / `utm_campaign` record the signup source. **The app still drops
  `rr_vid`** (`docs/APP-RR-VID-TICKET.md`). Until that ships, a trial that started from an email
  only matches the email if the UTM survived the click.
- **Open rates are not a metric.** Image proxies inflate them and tracking pixels hurt placement.
  Open tracking stays off.

**What counts as working after 30 days** (about 1,500 first touches, if it ramps as planned):

| Measure | Working | Stop and rethink |
|---|---|---|
| Bounce rate | < 2% | > 3% |
| Gmail spam rate (Postmaster) | < 0.1% | ≥ 0.3% |
| Positive reply rate | ≥ 1% (about 15 people) | < 0.3% |
| Demos booked from `outbound-v1` | ≥ 3 | 0 |
| Trials with `utm_campaign=outbound-v1` | any | — |

Last week's six intros (no replies, no bounces) are too few to read anything from. Thirty days at
this volume is the first sample that means something.

---

## 6. Owner decisions

| # | Decision | Recommendation |
|---|---|---|
| D1 | Which domains to send from | **stream-riverrecords.com and chart-riverrecords.com first, mail-riverrecords.com third. Leave riverrecords.online parked.** (Answered 25 Nov; see 1a.) |
| D2 | Sending tool | **Smartlead Basic**, monthly at first. Switch to annual once it's working. |
| D3 | Start date for volume | Warm up from 1 Dec. **First cold sends 5 Jan.** |
| D4 | Unsubscribe route | **Reply "unsubscribe"**, with same-day suppression. It keeps each email to one link. Switch to a one-click footer link if volume ever nears 5,000/day to Gmail. |
| D5 | Change one line in the approved `clinician-intro.md` (email 1's "outstanding … the chart" sentence) | **Yes.** Vera flagged it, and the same sentence goes to the 1:1 intros too. |
| D6 | Postal address in the footer | A business address you're willing to publish (registered office or a PO box). Not a home address. |
| D7 | Is Bullpen still sending? | **Open question.** The site's CLAUDE.md says Bullpen links prospects to Loom. If they're still active, the two programs must not email the same contacts, and they should use their own UTMs. |
| D8 | Lists in HubSpot | Approve the four `Outbound v1 – …` lists by name once Owen proposes them with counts. |

### What has to change in Owen's approvals

Today `approved-lists.md` has one one-off approval: up to 10 contacts, sent by you from Gmail, from
`clinician-intro.md`. v1 needs:

1. **Standing approvals by list name** (D8), with a weekly cap per list, replacing the one-off.
2. **A second channel.** Owen still drafts only in Gmail. The sending tool is new, so the approval
   has to say whether Owen may *prepare* CSVs and personalised `{personal_line}` fields for upload
   (recommended) or whether you build them. Owen gets no access to the sending tool.
3. **The sequence as an approved template.** Add `outbound-v1-sequence.md` (the three emails
   above) next to `clinician-intro.md` once D5 is decided.
4. **A suppression rule.** Anyone who opts out on any domain is marked do-not-contact in HubSpot
   the same day, and Owen checks that flag before every list.
