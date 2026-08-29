# How to test attribution after deploy

**What this covers:** verifying that `public/attribution.js` is working — i.e. that the
channel a visitor actually came from reaches the signup form and lands in the app's
database.

**Time needed:** about 5 minutes for the browser checks. Test 5 needs a database query.

**Before you start:** open a **fresh incognito/private window**. Attribution is
first-touch and write-once, so a window that has already visited the site will keep
whatever it captured the first time. Every test below assumes a clean window.

---

## The one-minute version

1. Incognito window → open
   `https://www.riverrecords.ai/blog/the-work-before-the-work/?utm_source=TEST&utm_medium=cpc&utm_campaign=verify&gclid=ABC123&rr_debug=1`
2. Open the browser console (F12 → Console). Expand the `[rr] attribution` group.
3. Look at the **signup links rewritten** table. `utm_source after` must say `TEST`.
4. Click through to the homepage. Console should say
   *"inferred source ignored — a real campaign is already stored"*, and first touch
   should still be `TEST`.

If both of those are true, the fix is live and working. The rest of this document is
the thorough version.

---

## What was broken (so you know what you're confirming)

Most signup buttons carried no campaign information at all — including every one of
the 87 blog posts, because they all share one layout. The two pages that *did* carry
it hardcoded `utm_source=homepage`, which **overwrote** the real channel.

So the app's `tenant.utm_source` column has been recording *which page the button was
on*, not *where the visitor came from*. These tests confirm that's fixed.

---

## Test 1 — Links get the real channel

Where: preview or production.

1. Fresh incognito window.
2. Go to:
   ```
   https://www.riverrecords.ai/blog/the-work-before-the-work/?utm_source=TEST&utm_medium=cpc&utm_campaign=verify&gclid=ABC123&rr_debug=1
   ```
3. Open the console and expand `[rr] attribution — /blog/…`.

**Expect**
- `visit classified as: explicit URL parameters`
- first touch shows `utm_source: TEST`, `gclid: ABC123`
- the **signup links rewritten** table lists the CTAs, with `utm_source after` = `TEST`

**If nothing prints at all** — the script isn't loading. Check the Network tab for
`/attribution.js` returning 200. If it 404s, the deploy didn't include it.

---

## Test 2 — The overwrite bug is fixed *(the important one)*

Continue in the same window, don't close it.

1. Click any link to the homepage (navigate internally — do **not** retype the URL).
2. Read the console again.

**Expect**
- `visit classified as: inferred source ignored — a real campaign is already stored`
- `first touch (existing):` still shows `utm_source: TEST`
- in the rewritten table, the hero CTA shows `utm_source before: homepage` →
  `utm_source after: TEST`, and `utm_content: hero`

**Failure looks like** `utm_source after: homepage`. That means the old behaviour is
still live — most likely a stale build or a cached copy of `attribution.js`. Hard-refresh
(Ctrl/Cmd-Shift-R) before concluding anything.

---

## Test 3 — The cookie reaches the app *(production only)*

This one **cannot be tested on a `*.pages.dev` preview or on localhost** — the cookie is
scoped to `.riverrecords.ai`, and a preview is on a different domain. The debug output
tells you when this happens, with a warning.

1. On production, still in the same window: F12 → Application → Cookies →
   `https://www.riverrecords.ai`.
2. Look for **`rr_vid`** and **`rr_attr`**, both with Domain `.riverrecords.ai`.
3. Now open `https://stream.riverrecords.ai` in the same window and check its cookies.

**Expect** `rr_vid` present on the app's origin too. That's the cross-domain link working.

**Expect on a preview** the console warning *"The .riverrecords.ai cookie did not stick"*.
That is correct and expected there. Seeing it **on production** means the cross-domain
join is genuinely broken — worth chasing.

---

## Test 4 — Events reach Google Tag Manager

1. Console: `window.dataLayer.filter(e => e.event && e.event.indexOf('rr_') === 0 || e.event === 'cta_click_signup')`
2. You should see `rr_attribution_ready` with the first/last source fields.
3. Click a "Start free trial" button — a `cta_click_signup` event appears.
4. For the full check, use GTM Preview (Tag Assistant) pointed at `www.riverrecords.ai`.

> **Important:** these events land in the `dataLayer`, but **GTM does nothing with them
> until someone creates triggers and tags for them.** Making the data available is done;
> wiring it to GA4 and Google Ads conversions is a job in the GTM console, not in this
> repo. Hand this section to whoever owns GTM.

Events available: `rr_attribution_ready`, `cta_click_signup`, `cta_click_demo`.

---

## Test 5 — End to end into the database *(the only complete proof)*

Everything above proves the link is correct. This proves the value actually lands.

1. From a tagged link (as in Test 1), complete a real signup with a disposable email.
2. Query the master database:
   ```sql
   select name, created_at, utm_source, utm_medium, utm_campaign,
          utm_content, referral_source, promo_code_used
   from tenant
   order by created_at desc
   limit 5;
   ```

**Expect** `utm_source = 'TEST'` on the new row — not `homepage`, not null.

**Note:** this creates a real trial tenant and a real Stripe customer. Use a disposable
email and clean both up afterwards.

---

## Test 6 — Things that should *not* have changed

1. The **Log In** link in the nav has no `rr_vid` or `utm_*` parameters on it.
   (Debug output lists it under *"app links deliberately skipped"*.)
2. Clicking **Log In** does **not** push a `cta_click_signup` event. If it did, returning
   customers would be counted as new acquisitions and your conversion numbers would be
   inflated.
3. With cookies and site data blocked, the CTA buttons still work and still carry the
   URL's campaign parameters. Nothing on the page breaks.

---

## Knowing it worked, a week later

```sql
select utm_source, count(*)
from tenant
where created_at > now() - interval '30 days'
group by 1
order by 2 desc;
```

**The tell:** `utm_source = 'homepage'` stops appearing for newly created tenants, and
real channel names show up instead. If `homepage` is still arriving, something is
serving a stale build.

---

## Turning debug off

`?rr_debug=1` sticks for the browser session so it survives clicking between pages.
To clear it, visit any page with `?rr_debug=0`, or just close the window.

Debug is **silent for everyone else** — a normal visitor never sees console output, and
the script does no extra work when the flag is off.

---

## If you need to roll it back

One line in `src/layouts/Base.astro`:

```html
<script is:inline src="/attribution.js"></script>
```

Delete it and redeploy. The site returns to its previous behaviour immediately. There is
no data migration and nothing to undo — the cookie and localStorage entries are inert
once the script stops running.

---

## Known gap

The app does **not** yet read `rr_vid`. Until it does, you get correct *channel*
attribution but not *visitor journeys* — you can see that a signup came from LinkedIn,
but not that the person read four blog posts over nine days first. Closing that needs one
column on `tenant` in the `ai-scribe` repo.

---

*Related: `CLAUDE.md` → "Acquisition attribution" for how the script decides things, and
`scripts/verify-attribution.mjs` for the automated browser test (6 scenarios, 22 checks).*
