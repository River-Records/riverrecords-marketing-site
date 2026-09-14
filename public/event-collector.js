/*
 * event-collector.js — keep the anonymous behaviour the site already produces.
 *
 * WHY THIS EXISTS
 * The site pushes ten dataLayer events and no GTM tag listens to any of them. Someone
 * can read three posts, watch a walkthrough and land on pricing, and the only durable
 * trace is an anonymous +1 in Cloudflare's aggregate, which cannot be joined to
 * anything. hubspot-events.js rescues a short high-intent subset, but only for people
 * who are already known contacts — which is nobody, until they identify themselves.
 *
 * This sends the same events to our own endpoint keyed by rr_vid, so the history exists
 * *before* anyone gives us their name. The moment they fill in a form, everything they
 * did beforehand is already recorded against the id that becomes theirs.
 *
 * FIVE THINGS TO KNOW BEFORE CHANGING IT
 *
 * 1. It reads the dataLayer by polling and never wraps `dataLayer.push`. Wrapping races
 *    GTM installing its own — gtm.js is async, whoever assigns last wins, and the order
 *    is not knowable. Same reasoning as hubspot-events.js.
 *
 * 2. rr_vid comes from window.rrAttribution, never re-derived. Two definitions of who a
 *    visitor is drift apart, and the entire point is that one answer reaches every
 *    system. If attribution never resolves, this sends nothing rather than inventing an
 *    id that would fragment the same person across rows.
 *
 * 3. Props are allow-listed, not forwarded. An event object is whatever the pushing
 *    code decided to include, and a future push could reasonably carry an email address.
 *    Nothing reaches the endpoint unless its key is in FIELDS below — so adding a field
 *    to an event is a deliberate act, not a side effect.
 *
 * 4. It flushes on a timer, not only on exit. Exit is the least reliable moment to send
 *    anything; the page may be torn down before a listener runs. The visibilitychange
 *    beacon is a backstop for whatever is still queued, not the main path.
 *
 * 5. Failures are silent and never retried. A retry loop would turn one bad deploy into
 *    a request storm against our own origin, and no analytics event is worth that.
 *
 * TO TURN OFF: remove the tag from src/layouts/Base.astro, or set ENABLED to false.
 */
(function () {
  "use strict";

  var ENABLED = true;
  if (!ENABLED) return;

  var ENDPOINT = "/api/events";
  var FLUSH_MS = 1500;
  var MAX_QUEUE = 20;

  /*
   * Every field allowed to leave the browser. Deliberately explicit: the rule is that a
   * field cannot start being collected merely because someone added it to a dataLayer
   * push. Nothing identifying belongs here — an email address in this list would send
   * personal data to our own store under an anonymous id, which is exactly the thing
   * that makes an anonymous id stop being anonymous.
   */
  var FIELDS = [
    // video_play
    "video_key", "video_title", "video_context", "video_trigger", "video_page",
    // post_read and scroll milestones
    "post_slug", "engaged_seconds", "scroll_depth", "milestone",
    // CTAs
    "cta_label", "cta_page", "offer", "offer_key",
    // /intake
    "intake_cta", "intake_faq", "intake_section",
    // attribution, as classified by attribution.js
    "rr_first_source", "rr_first_medium", "rr_first_campaign",
    "rr_last_source", "rr_last_medium", "landing_page",
    // synthesised by this script
    "referrer_host", "title"
  ];

  /* GTM's own lifecycle events. Noise in this table; GTM has its own reporting. */
  function isInternal(name) {
    return typeof name !== "string" || name.indexOf("gtm.") === 0;
  }

  var queue = [];
  var timer = null;
  var vid = null;

  function pick(source) {
    var out = {};
    var found = false;
    for (var i = 0; i < FIELDS.length; i++) {
      var key = FIELDS[i];
      var value = source[key];
      if (value === undefined || value === null) continue;
      var type = typeof value;
      if (type !== "string" && type !== "number" && type !== "boolean") continue;
      out[key] = value;
      found = true;
    }
    return found ? out : null;
  }

  function enqueue(name, props) {
    if (!vid) return; // no id yet — see rule 2 in the header
    queue.push({
      rr_vid: vid,
      event: name,
      path: location.pathname,
      props: props || undefined
    });
    if (queue.length >= MAX_QUEUE) flush();
    else schedule();
  }

  function schedule() {
    if (timer !== null) return;
    timer = setTimeout(function () {
      timer = null;
      flush();
    }, FLUSH_MS);
  }

  function flush(useBeacon) {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    if (!queue.length) return;

    var batch = queue.splice(0, queue.length);
    var body = JSON.stringify({ events: batch });

    try {
      if (useBeacon && navigator.sendBeacon) {
        // Blob rather than a bare string: without an explicit type the browser sends
        // text/plain, and the handler parses JSON.
        navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }));
        return;
      }
      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
        keepalive: true,
        credentials: "same-origin"
      }).catch(function () { /* silent, never retried — rule 5 */ });
    } catch (err) {
      /* analytics must never break the page */
    }
  }

  /*
   * Read the dataLayer rather than intercepting it — rule 1. `seen` is a high-water
   * mark, so entries pushed before this script ran are picked up on the first drain.
   */
  var seen = 0;
  function drain() {
    var dl = window.dataLayer;
    if (!dl || typeof dl.length !== "number") return;
    while (seen < dl.length) {
      var item = dl[seen++];
      try {
        if (!item || typeof item !== "object") continue;
        if (isInternal(item.event)) continue;
        enqueue(item.event, pick(item));
      } catch (err) { /* one malformed entry must not stop the rest */ }
    }
  }

  function start(api) {
    vid = api && api.vid;
    if (!vid) return;

    // A baseline page view, which nothing else pushes. Without it the table holds only
    // the remarkable moments and there is no denominator to judge them against.
    var referrerHost = "";
    try {
      if (document.referrer) referrerHost = new URL(document.referrer).hostname;
    } catch (e) { /* malformed referrer */ }

    enqueue("page_view", {
      title: document.title ? document.title.slice(0, 200) : undefined,
      referrer_host: referrerHost || undefined
    });

    drain();
    setInterval(drain, 500);

    // Backstop for whatever is queued when the tab goes away — not the main path.
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") flush(true);
    });
  }

  // attribution.js owns the visitor id; whenReady fires immediately if it has already
  // resolved. If attribution never publishes, nothing here ever sends — by design.
  try {
    if (window.rrAttribution && typeof window.rrAttribution.whenReady === "function") {
      window.rrAttribution.whenReady(start);
    }
  } catch (err) { /* never break the page */ }
})();
