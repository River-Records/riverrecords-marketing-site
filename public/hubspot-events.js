/*
 * hubspot-events.js — put high-intent site behaviour onto the HubSpot contact timeline.
 *
 * WHY THIS EXISTS
 * The site pushes ten events to the dataLayer and, as of August 2026, no GTM tag listens
 * to any of them. So the strongest buying signal the site can produce — someone watching
 * four minutes of a product walkthrough — is currently observed by nothing.
 *
 * That signal is most valuable to the outbound team, and they work in HubSpot, not GA4.
 * So the high-intent subset is sent straight to HubSpot, where it lands on the person's
 * contact timeline by name the moment they are a known contact. "Dr. K watched the Huddle
 * walkthrough on Tuesday" is a different call from "Dr. K opened an email."
 *
 * HOW, AND THE TRADEOFF
 * HubSpot's clean mechanism for this is Custom Behavioral Events, which requires Marketing
 * Hub Enterprise. Failing that, the documented SPA pattern — setPath + trackPageView — is
 * the only way to get an event onto the timeline from the browser. So these are recorded
 * as page views at synthetic paths.
 *
 * The cost is real and worth stating: HubSpot's Pages report will show these alongside
 * genuine pages, and page view totals will include them. They are all namespaced under
 * /engagement/ precisely so they can be recognised and filtered out. If the portal is on
 * Enterprise, switch SEND to trackCustomBehavioralEvent and the tradeoff disappears.
 *
 * VERIFYING IT
 * In the Network tab, filter for __ptq and read the `po` parameter — that is the path
 * HubSpot records. Do NOT read `pu`, which is the browser's real URL and never changes.
 * Confirmed on production 31 Aug 2026: a real video play sends
 * po=/engagement/video/huddle, and restoring the path immediately afterwards does not
 * clobber it, because HubSpot builds the beacon synchronously on trackPageView.
 *
 * TO TURN OFF
 * Remove the script tag from src/layouts/Base.astro, or set ENABLED to false below.
 * Nothing else depends on this — it only reads the dataLayer, and never writes to it.
 */
(function () {
  "use strict";

  var ENABLED = true;
  if (!ENABLED) return;

  // Only genuinely high-intent behaviour. Every entry here becomes a line on a real
  // person's CRM timeline, so this list stays short on purpose — a timeline cluttered
  // with scroll depth is a timeline nobody reads.
  var TRACKED = {
    video_play: function (e) {
      return { path: "/engagement/video/" + (e.video_key || "unknown"),
               title: "Watched: " + (e.video_title || "product walkthrough") };
    },
    intake_video_complete: function () {
      return { path: "/engagement/video/intake-provenance-complete",
               title: "Watched the Intake provenance demo to the end" };
    },
    post_read: function (e) {
      // Fires once a post has genuinely been read, not merely opened. Worth a timeline
      // line: "read three posts on undercoding" is a call, "visited the blog" is not.
      return { path: "/engagement/read/" + (e.post_slug || "unknown"),
               title: "Read: " + (e.post_slug || "a post") };
    },
    cta_click_demo: function (e) {
      return { path: "/engagement/demo-cta",
               title: "Clicked through to book a demo" + (e.cta_page ? " from " + e.cta_page : "") };
    }
  };

  function hsq() {
    // HubSpot's queue exists as soon as its loader runs; pushes before the library is
    // ready are replayed by HubSpot itself, so there is nothing to wait for.
    window._hsq = window._hsq || [];
    return window._hsq;
  }

  function send(entry) {
    var q = hsq();
    try {
      q.push(["setPath", entry.path]);
      q.push(["trackPageView"]);
      // Restore the real path immediately. Leaving it set would make the visitor's NEXT
      // genuine page view report the synthetic path instead — turning one extra row into
      // corrupted page data.
      q.push(["setPath", location.pathname + location.search]);
    } catch (err) { /* tracking must never break the page */ }
  }

  // Read the dataLayer rather than intercepting it. Wrapping dataLayer.push would race
  // with GTM installing its own push — whoever assigns last wins, and gtm.js is async,
  // so the order is not knowable. Polling is immune to that and costs nothing measurable.
  var seen = 0;
  function drain() {
    var dl = window.dataLayer;
    if (!dl || typeof dl.length !== "number") return;
    while (seen < dl.length) {
      var item = dl[seen++];
      try {
        if (!item || typeof item !== "object") continue;
        var build = TRACKED[item.event];
        if (build) send(build(item));
      } catch (err) { /* one malformed entry must not stop the rest */ }
    }
  }

  drain(); // anything already queued before this script ran
  setInterval(drain, 500);
})();
