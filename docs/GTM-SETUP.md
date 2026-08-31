# Setting up the GTM container

Container **GTM-N767QFHJ**. Jay built it and is no longer on the project, so nobody has
looked inside it for some time. This is the console work the site is currently waiting
on, written click by click.

**Total time: about 45 minutes.** Part 1 is the most valuable and takes ten.

The site pushes **ten** events to the dataLayer. None of them do anything yet, because no
tag in the container is listening. That is the gap this closes.

Site-wide — wire these first:

| Event | Fires when | Carries |
|---|---|---|
| `rr_attribution_ready` | every page, once attribution resolves | `rr_vid`, first/last source, medium, campaign, landing page |
| `cta_click_signup` | a signup CTA is clicked | `cta_label`, `cta_page`, `rr_vid` |
| `cta_click_demo` | a link to `/book-demo` is clicked | `cta_label`, `cta_page`, `rr_vid` |
| `video_play` | a product walkthrough is played | `video_key`, `video_title`, `video_context` |
| `contact_form_submit` | the contact form is submitted | `rr_vid`, `rr_first_source` |

`/intake` only — these predate the recent work and have been firing into the void the
whole time. Lower priority, but they exist and they are free engagement data:

| Event | Fires when | Carries |
|---|---|---|
| `intake_cta_click` | a CTA on `/intake` is clicked | `intake_cta` |
| `intake_faq_expand` | an FAQ on `/intake` is opened | `intake_faq` |
| `intake_scroll_depth` | a section of `/intake` is reached | `intake_section` |
| `intake_video_play` | the provenance demo video starts | — |
| `intake_video_complete` | that video is watched to the end | — |

> Careful: `/intake` now has **two** kinds of video. `video_play` is the Loom walkthrough
> (with `video_context: "intake"`), while `intake_video_play` is the small silent
> provenance demo further down the page. They are different things; do not merge them
> into one GA4 event or the numbers will not mean anything.

---

## Before you start

Go to [tagmanager.google.com](https://tagmanager.google.com) and open **GTM-N767QFHJ**.

**If you cannot get in, stop and sort that out first.** If the container was created
under Jay's personal Google account rather than a River Records one, access can disappear
without warning and the Ads conversion history goes with it. Check **Admin → User
Management** and make sure your own account has *Publish* rights, not just *Edit*.

Everything below happens in a workspace and changes nothing live until you press
**Submit** at the end. You can explore safely.

---

## Part 1 — Fix the duplicate GA4 *(10 minutes, do this first)*

**The problem:** every page load sets two GA4 session cookies, `_ga_39BPK056ZB` and
`_ga_F2ZN4Z3VK3`. Two configuration tags are firing into two different properties, so
sessions and page views are being double-counted or split. **Every GA4 traffic number
you have looked at recently is unreliable**, and there is no way to tell in which
direction without opening the container.

Nothing in the site's code sets a GA4 ID, so both come from here.

The cookie names map directly to measurement IDs: the two properties are
**G-39BPK056ZB** and **G-F2ZN4Z3VK3**.

1. **Tags** in the left sidebar.
2. Look for tags of type **Google Tag** or **Google Analytics: GA4 Configuration**.
   (GTM renamed this; you may have one of each, which is itself a likely cause.)
3. Open each and note its Measurement ID / Tag ID.
4. Decide which property is the real one. In [analytics.google.com](https://analytics.google.com),
   open both and compare — keep the one with the longer, more complete history and the
   reporting you actually use.
5. On the tag for the property you are **not** keeping: open it, click the **⋮** menu top
   right, choose **Pause**. Pause rather than delete, so it can be undone.
6. Leave the workspace open — you will publish once at the end.

> Do not delete the losing GA4 *property* in Analytics. Pausing the tag stops new
> double-counting; the old data is still worth keeping for comparison.

---

## Part 2 — Make the dataLayer values available

GTM cannot read values from the dataLayer until you declare each one. This is tedious but
mechanical.

**Variables** → scroll to **User-Defined Variables** → **New** → **Data Layer Variable**.

Create one for each. The *Data Layer Variable Name* must match exactly — these are
case-sensitive and come straight from the site's code:

| Name the variable | Data Layer Variable Name |
|---|---|
| `DL - rr_vid` | `rr_vid` |
| `DL - rr_first_source` | `rr_first_source` |
| `DL - rr_first_medium` | `rr_first_medium` |
| `DL - rr_first_campaign` | `rr_first_campaign` |
| `DL - rr_landing_page` | `rr_landing_page` |
| `DL - cta_label` | `cta_label` |
| `DL - cta_page` | `cta_page` |
| `DL - video_key` | `video_key` |
| `DL - video_title` | `video_title` |
| `DL - video_context` | `video_context` |

Leave *Data Layer Version* at **Version 2** and save each one.

---

## Part 3 — Create the triggers

**Triggers** → **New** → **Trigger Configuration** → **Custom Event**.

Create four. The *Event name* must match exactly, and leave "This trigger fires on: All
Custom Events":

| Trigger name | Event name |
|---|---|
| `CE - Signup CTA click` | `cta_click_signup` |
| `CE - Demo CTA click` | `cta_click_demo` |
| `CE - Video play` | `video_play` |
| `CE - Contact form submit` | `contact_form_submit` |

You do not need a trigger for `rr_attribution_ready` unless you go on to do Part 6.

---

## Part 4 — Create the GA4 event tags

**Tags** → **New** → **Tag Configuration** → **Google Analytics: GA4 Event**.

For each tag: set the *Measurement ID* to the property you kept in Part 1, set the event
name, add the parameters, and attach the trigger.

### Tag: `GA4 - Signup CTA click`
- Event Name: `signup_cta_click`
- Event Parameters:
  - `cta_label` → `{{DL - cta_label}}`
  - `cta_page` → `{{DL - cta_page}}`
  - `rr_vid` → `{{DL - rr_vid}}`
- Trigger: `CE - Signup CTA click`

### Tag: `GA4 - Demo CTA click`
- Event Name: `demo_cta_click`
- Same three parameters
- Trigger: `CE - Demo CTA click`

### Tag: `GA4 - Video play`
- Event Name: `video_play`
- Event Parameters:
  - `video_key` → `{{DL - video_key}}`
  - `video_title` → `{{DL - video_title}}`
  - `video_context` → `{{DL - video_context}}`
- Trigger: `CE - Video play`

### Tag: `GA4 - Contact form submit`
- Event Name: `contact_form_submit`
- Event Parameters:
  - `rr_vid` → `{{DL - rr_vid}}`
  - `rr_first_source` → `{{DL - rr_first_source}}`
- Trigger: `CE - Contact form submit`

> **Watching a walkthrough is the strongest buying signal on the site.** Of the four,
> `video_play` is the one to prioritise if you only do some of them.

---

## Part 5 — Test before publishing

1. Click **Preview** (top right).
2. Enter `https://www.riverrecords.ai` and click **Connect**. A new tab opens with a
   debug banner, and Tag Assistant opens alongside it.
3. In the site tab, scroll to **See it work** and play a video.
4. In Tag Assistant, a `video_play` event appears in the left timeline. Click it and
   check `GA4 - Video play` is under **Tags Fired** — not *Tags Not Fired*.
5. Click the **Variables** tab for that event and confirm `DL - video_key` has a real
   value (`intake`, `scribe` or `huddle`) rather than `undefined`.

**If a tag shows under Tags Not Fired**, the trigger's event name does not match. Check
spelling and case against the table at the top of this document.

**If a variable is `undefined`**, the Data Layer Variable Name is wrong. It must be the
raw key (`video_key`), not the variable's display name (`DL - video_key`).

Repeat for a signup CTA click and a contact form submit.

### Then publish
**Submit** (top right) → give the version a name like *"Wire site events, pause duplicate
GA4"* → **Publish**.

---

## Part 5b — Optional: the `/intake` events

Same pattern, if you want engagement data on that page. Three more Data Layer Variables
(`intake_cta`, `intake_faq`, `intake_section`), five more Custom Event triggers matching
the event names in the second table above, and GA4 event tags for each.

`intake_video_complete` is the interesting one — someone who watched the provenance demo
to the end is a materially warmer prospect than someone who started it.

---

## Part 6 — Optional: stamp attribution onto every GA4 session

Once the above works, `rr_attribution_ready` can set user properties so that GA4 reports
can be broken down by original channel. Add a trigger for `rr_attribution_ready`, then on
your main GA4 tag set User Properties: `rr_first_source` → `{{DL - rr_first_source}}`, and
the same for medium and campaign.

Useful, but not required for anything else here to work.

---

## Part 7 — The Ads conversions *(only when ads restart)*

No ad spend is running as of August 2026, so this is not urgent. **Do it before switching
ads back on, not after** — a restarted campaign learns fastest in its first weeks, and
whatever you call a conversion is what Google will go and buy.

Two of the three conversions currently measure intent rather than outcome:

| Conversion | Currently fires on | Should fire on |
|---|---|---|
| Book a demo — $200 | **page view** of `/book-demo` | an actual Calendly booking |
| Contacted — $50 | page view of `/contacted` | fine as is ✅ |
| Signup — $150 | **click** on a link to the app | an actual trial signup |

The demo one can be fixed here: Calendly's embed posts a message to the page when a
booking completes, so a Custom Event trigger can be wired to it. The signup one cannot be
fixed in GTM at all — a click is not a signup, and only the app knows whether onboarding
finished. That needs a server-side conversion from the `ai-scribe` repo, keyed on `rr_vid`.

---

## While you are in the consoles: two HubSpot settings

Not GTM, but both are quick and both multiply what the tracking is worth.

**1. Revisit notifications.** *Settings → Notifications*, or a saved contact view filtered
on recent page views. The classic outbound play is to call a prospect the day they come
back to the site. That is now possible and it is the highest-value routing rule available.

**2. Collected Forms.** *Settings → Tracking Code → Collected Forms*. If this is on,
HubSpot automatically captures submissions from non-HubSpot forms on pages carrying the
tracking script — which would mean the contact form is already creating CRM records
without any code change. Worth checking before building a HubSpot form to replace it.

---

## What is still not measurable after all this

Being straight about the remaining gap: `rr_vid` is written, carried across to the app,
and attached to bookings — but **the app does not read it yet**. Until a `tenant.rr_vid`
column exists in the `ai-scribe` repo, you can see which channel produced a *click*, but
not which channel produced *revenue*. That is the last link in the chain, and it is a
change in the product repo rather than anything here.
