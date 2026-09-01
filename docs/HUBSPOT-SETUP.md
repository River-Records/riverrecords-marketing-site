# Switching on the HubSpot half

The calculator endpoint (`functions/api/calculator.js`) is live and inert. It writes to
the CRM the moment `HUBSPOT_FORM_GUID` exists, and does nothing before then.

**About 30 minutes.** No secrets involved — the Forms API endpoint this uses needs no
token, and a form GUID is not sensitive.

Order matters: properties, then form, then workflow, then the Cloudflare variable. The
form cannot reference properties that do not exist yet.

---

## Step 1 — Create three contact properties (~10 min)

HubSpot has `email` already. The other three must be created, and **their internal names
must match exactly** or the submission is rejected.

Go to **Settings (gear) → Data Management → Properties → Create property**, and make each
of these with *Object type: Contact*:

| Label | Internal name | Field type |
|---|---|---|
| Practice providers | `practice_providers` | Number |
| Annual visits per provider | `annual_visits_per_provider` | Number |
| Undercoding estimate | `undercoding_estimate` | Single-line text |

> **Check the internal name.** HubSpot generates it from the label, and it is shown in
> small grey text under the label field while you type. If it comes out as anything other
> than the value above — a trailing number, a different separator — click the edit icon
> next to it and correct it. This is the single most common reason a Forms API submission
> silently fails.

`undercoding_estimate` is deliberately text, not number: it stores `$94,223` as displayed,
so the follow-up email and the CRM record show the visitor exactly the figure they saw.

---

## Step 2 — Create the form (~5 min)

**Marketing → Lead Capture → Forms → Create form → Embedded form → Blank template.**

Add exactly four fields, all of which now exist:

- `email` (required)
- `practice_providers`
- `annual_visits_per_provider`
- `undercoding_estimate`

You will never display this form. It exists so the Forms API has somewhere to deliver, so
do not spend time styling it. The visible form stays the one on the site.

Name it something findable, e.g. **"Undercoding calculator (API)"**, then **Publish**.

### Getting the GUID
Open the form and look at the browser address bar:

```
https://app.hubspot.com/forms/46752060/<THIS-IS-THE-GUID>/edit/...
```

It looks like `3f2b9c14-7a8e-4d21-b0c9-5e6a1d8f4c73`. Copy it.

---

## Step 3 — Attach the follow-up email (~10 min)

Marketing Hub Starter includes **simple workflows attached to forms**: one per form, up to
ten actions. That is enough to send the follow-up, and it means you can edit the email
later without a deploy.

On the form, open the **Automation** tab (or *Follow-up* depending on your view) and
create a simple workflow with two actions:

**Action 1 — Send a marketing email.** Compose one that includes:
- a link to `https://www.riverrecords.ai/guides/the-defensible-visit/`
- their figures, using personalization tokens for the three properties above
- the caveat that the estimate is a floor, not a forecast
- a `/book-demo` link

**Action 2 — Send an internal email notification** to yourself. This restores the
`hello@` notification that calculator submissions had before the endpoint change.

> **Marketing email requires the contact to be a marketing contact.** See Step 5.

---

## Step 4 — Set the variable in Cloudflare (~2 min)

**Cloudflare dashboard → Workers & Pages → riverrecords-marketing-site → Settings →
Environment variables.**

Add to **Production** (and to Preview if you want to test there first):

```
HUBSPOT_FORM_GUID = <the guid from step 2>
```

Then **redeploy** — environment variables are read at request time, but a deployment is
the reliable way to be sure the value is picked up. Deployments → the latest one →
*Retry deployment*.

---

## Step 5 — The marketing-contact guard *(do this before Bullpen imports anything)*

Starter includes **1,000 marketing contacts**. The CRM already holds around **3,440**
contacts. Only marketing contacts can receive marketing email, and the allowance is
billed once exceeded.

Go to **Settings → Data Management → Objects → Contacts → Marketing Contacts** and check
whether new contacts are automatically set as marketing contacts.

- A calculator submitter is worth the slot. They ran their own numbers and asked for a guide.
- A bought cold-outreach list generally is not, and cold outbound should not be going
  through marketing email in any case.

If auto-designation is on and a large import lands, the allowance can be consumed without
anyone deciding to.

---

## Verifying it worked

Submit the real form at
[/tools/undercoding-calculator/](https://www.riverrecords.ai/tools/undercoding-calculator/)
with your own address, then check three things.

**1. The endpoint reports success.** Every response carries a diagnostic header:

```bash
curl -s -o /dev/null -D - -X POST https://www.riverrecords.ai/api/calculator \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data "email=you@riverrecords.ai&providers=3&estimate_total=%2494%2C223" \
  | grep -i x-rr-fanout
```

| You see | Meaning |
|---|---|
| `hubspot:ok` | working |
| `hubspot:skipped` | the variable is not set, or the email was malformed |
| `hubspot:failed` | HubSpot rejected it — almost always a property name mismatch, see Step 1 |

**2. The contact exists**, with the three properties populated.

**3. The timeline shows their history.** This is the part that matters. Because the
submission carries the `hubspotutk` cookie, HubSpot attaches everything that visitor
already browsed *before* they identified themselves. Open the contact and look at the
activity timeline — you should see the pages they read prior to submitting, including any
`/engagement/video/*` entries if they watched a walkthrough.

That retroactive stitching is the whole point of routing through the Forms API rather than
just emailing ourselves.

---

## What this does not change

- **Collected Forms keeps working regardless.** It captures these submissions by watching
  native form submissions in the browser, independently of anything above. That is why
  the form must keep posting natively — see `CLAUDE.md`.
- **`/contact` is untouched.** It still posts to formsubmit.co from the browser.
- **Mandrill stays optional.** With the workflow above, HubSpot sends the follow-up and
  Mandrill is not needed. It remains wired for sends that must be transactional, or to
  avoid spending the marketing-contact allowance.
