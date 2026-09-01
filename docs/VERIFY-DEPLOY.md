# Is it actually working?

A ten-minute check that everything shipped in August 2026 is live and doing its job:
HubSpot tracking, the visitor cookie, the UTM fix, and the product videos.

Written for someone with a browser, not a terminal. For the deeper attribution-only
tests see [TESTING-ATTRIBUTION.md](./TESTING-ATTRIBUTION.md); for the console work see
[GTM-SETUP.md](./GTM-SETUP.md).

**Already confirmed on production on 31 August 2026** — everything below passed. Re-run
it after any deploy that touches `Base.astro`, `attribution.js`, or a CTA component.

---

## The two-minute version

Open a **private/incognito window** — this matters, otherwise you're testing cookies you
already had — and go to:

```
https://www.riverrecords.ai/?utm_source=test&utm_medium=cpc&utm_campaign=check
```

Then press <kbd>F12</kbd> (or <kbd>⌘⌥I</kbd> on Mac) → **Application** tab → **Cookies** →
`https://www.riverrecords.ai`.

You want to see four cookies:

| Cookie | Means | Expires |
|---|---|---|
| `hubspotutk` | HubSpot can recognise this visitor | ~180 days |
| `rr_vid` | Our own visitor id | ~180 days |
| `rr_vids` | The id was issued **by the server** — the Safari fix worked | ~180 days |
| `__hstc` | HubSpot first/last touch | ~180 days |

If `rr_vids` is missing, the Safari fix is not running — see *Test 3*.

Then scroll to the bottom of the page and hover any **Start free trial** button. The
status bar shows the link. It must contain `utm_source=test` — **not** `utm_source=homepage`.
That single check confirms the bug that was corrupting every conversion is fixed.

---

## Test 1 — HubSpot is watching *(the one that matters most)*

This is what turns the website into a call list for Bullpen.

1. In a private window, visit `https://www.riverrecords.ai/comparison/freedai/`.
2. Wait about 10 seconds.
3. In HubSpot, go to **Reports → Analytics Tools → Traffic Analytics → Pages**.
4. Set the date range to **Today**.

**Pass:** `/comparison/freedai/` appears with at least one view.

**Note:** it can take a few minutes to appear. If nothing shows after 15 minutes, view
the page source (<kbd>⌘U</kbd>) and search for `hs-scripts` — it should appear once,
loading `46752060.js`.

### The real payoff, once a prospect is known
When someone clicks a link in a HubSpot email, HubSpot ties `hubspotutk` to their contact
record. From then on their page views appear on their **contact timeline by name**.

To confirm end to end, send yourself a HubSpot email with a link to the site, click it,
browse two or three pages, then open your own contact record in HubSpot and look at the
timeline. You should see the page views listed.

---

## Test 2 — The overwrite bug is fixed

The bug: a paid Google click that landed on the homepage used to be recorded as
`utm_source=homepage`, overwriting the real channel. Every signup was attributed to the
page the button was on rather than where the person came from.

1. Private window → `https://www.riverrecords.ai/blog/?utm_source=google&utm_medium=cpc&utm_campaign=demo`
2. Click through to the homepage.
3. Hover **Start free for 30 days**.

**Pass:** the link contains `utm_source=google`. The homepage's own identity has moved to
`utm_content=hero` (or `pricing` / `final`).

**Fail:** you see `utm_source=homepage`.

Verified on production 31 Aug 2026 — `hero`, `pricing` and `final` all kept their labels
while carrying `utm_source=google`. The nav and top-banner links show no `utm_content`,
which is correct: they never had a creative label to preserve.

---

## Test 3 — The cookie survives Safari *(do this one in Safari)*

Safari caps cookies written by JavaScript at 7 days, which silently reduced a 180-day
cookie to a week for a large share of a clinician audience. A Cloudflare Function now
re-issues it as a real server cookie.

**Quickest check** — paste this into any browser's address bar:

```
https://www.riverrecords.ai/rr/id
```

**Pass:** you get JSON like `{"rr_vid":"…","reused":true}`.

Then in Safari: **Develop → Show Web Inspector → Storage → Cookies**, and check `rr_vid`
has an expiry roughly 180 days out rather than 7.

> If the Develop menu is missing: Safari → Settings → Advanced → "Show features for web
> developers".

---

## Test 4 — The videos

1. Go to `https://www.riverrecords.ai/#see-it-work`.
2. Three thumbnails with play buttons should appear.
3. Open **F12 → Network**, filter for `loom`, and reload.

**Pass:** *no* requests to loom.com until you click a thumbnail. That is the click-to-play
design working — Loom is not loaded, and sets no cookies, for people who never watch.

4. Click one. It should start playing inside the same box, with no page jump.

---

## Test 4b — Video plays reach HubSpot

Watching a walkthrough is the strongest buying signal the site produces, and it is sent
to HubSpot directly rather than waiting on a GTM tag.

1. Open `https://www.riverrecords.ai/#see-it-work`.
2. Open **F12 → Network** and filter for `__ptq`.
3. Play any video.
4. A `__ptq.gif` request appears. Click it and read the **Query String Parameters**.

**Pass:** `po` is `/engagement/video/huddle` (or `intake` / `scribe`).

> **Look at `po`, not `pu`.** `pu` is the browser's real URL and never changes — it will
> say `https://www.riverrecords.ai/` no matter what, which looks like a failure and is
> not. `po` is the path HubSpot records. This cost an hour the first time; it is the only
> non-obvious thing about verifying this feature.

Confirmed on production 31 Aug 2026: a real click on the Huddle video sent
`po=/engagement/video/huddle`.

A few minutes later these appear in HubSpot under **Reports → Traffic Analytics → Pages**,
listed among real pages. That is expected — they are recorded as page views because
HubSpot's cleaner mechanism, Custom Behavioral Events, needs Marketing Hub Enterprise.
They are all namespaced under `/engagement/` so they can be filtered out of page reports.

Once the visitor is a known contact, the same events appear on their **contact timeline**
— which is the entire point.

---

## Test 5 — The demo booking carries its source *(after PR #35 merges)*

1. Private window → `https://www.riverrecords.ai/?utm_source=linkedin&utm_medium=social&utm_campaign=x`
2. Navigate to **Book a Demo**.
3. Wait for the Calendly form to appear — **this is the first thing to check**, because
   the page now initialises Calendly itself rather than letting it auto-start. If the box
   is empty, stop and report it; that costs bookings, not just data.
4. Right-click the booking area → **Inspect**, find the `<iframe>`, and read its `src`.

**Pass:** the URL contains `utm_source=linkedin` and a `salesforce_uuid` (that is `rr_vid`
riding along — Calendly's generic passthrough field, misleadingly named).

---

## Test 6 — Nothing that used to work is broken

- Every page still loads; the nav and footer are unchanged.
- `https://www.riverrecords.ai/login` links still go straight to login **without** UTM
  parameters. Decorating those would attribute returning customers as new acquisitions.
- The contact form still sends and still lands on `/contacted`.

---

## A week later — the check that actually proves it

The tests above prove the plumbing. This proves the value.

In HubSpot, filter contacts on **Original source is not "Offline sources"** and set
**Create date = last 7 days**.

Before this work, that filter returned nothing at all for eleven months — the last
web-attributed contact was created 9 October 2025. Any new contact appearing there is a
person the website is now telling you about, that it previously could not.

---

## If something looks wrong

Add `?rr_debug=1` to any page and open the console (F12). It prints how the visit was
classified, first and last touch, whether each cookie stuck, and a before/after table of
every rewritten link. `?rr_debug=0` turns it off. It is silent for everyone else.

For engineers, the repo scripts run the same checks automatically against a local build:

```bash
npm run build
npx --yes http-server dist -p 4321 --silent &
node scripts/verify-vid-cookie.mjs          # no browser needed
CHROME_PATH=... node scripts/verify-attribution.mjs
CHROME_PATH=... node scripts/verify-hubspot-tracking.mjs
CHROME_PATH=... node scripts/verify-video-embeds.mjs
```

They need Playwright (`npm i playwright` in a scratch directory) and expect a **local**
build. Pointing them at production mostly fails on `networkidle`, because the live
analytics scripts keep the network busy indefinitely — that is a limitation of the test,
not a fault on the site.

---

## Rolling back

Each piece is independent and removable:

| To disable | Remove |
|---|---|
| HubSpot tracking | the `hs-script-loader` tag in `src/layouts/Base.astro` |
| Attribution + `rr_vid` | the `attribution.js` tag in `src/layouts/Base.astro` |
| The server cookie only | `functions/rr/id.js` |
| The videos | the `#see-it-work` section in `src/pages/index.astro` |

Deleting one script tag disables that piece entirely on the next deploy.
