// attribution.js — first-party acquisition attribution for riverrecords.ai
//
// Why this exists: the site is a static Astro build on www.riverrecords.ai and the
// app lives on stream.riverrecords.ai. Signup CTAs were hardcoded at build time, so
// the visitor's real inbound source never reached the app — the app recorded which
// PAGE the button was on (utm_source=homepage), overwriting the actual channel.
//
// This runs on every page and does three things:
//   1. Captures inbound UTM + ad click IDs, storing FIRST touch (write-once) and
//      LAST touch (overwritten) in localStorage and a .riverrecords.ai cookie.
//   2. Rewrites every outbound signup link so it carries that attribution.
//   3. Pushes a cta_click event to the GTM dataLayer.
//
// The cookie is scoped to the parent domain, so it reaches the app even when the
// URL params are lost (bookmark, new tab, return visit days later).
//
// DEBUGGING IN PRODUCTION: add ?rr_debug=1 to any URL. The script then prints what
// it captured, how it classified the visit, and every link it rewrote. The flag
// persists for the browser session (so it survives internal navigation) until you
// visit ?rr_debug=0. See CLAUDE.md → Acquisition attribution.

(function () {
  "use strict";

  var APP_HOST = "stream.riverrecords.ai";
  var ACQUISITION_PATH = "/onboard"; // signup only — /login is an existing
                                     // customer returning, not an acquisition
  var COOKIE_DOMAIN = ".riverrecords.ai";
  var STORE_KEY = "rr_attr";
  var VID_KEY = "rr_vid";
  var MARKER_KEY = "rr_vids"; // set by /rr/id — "a durable cookie has been issued"
  var DEBUG_KEY = "rr_debug";
  var COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

  var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  var CLICK_IDS = ["gclid", "fbclid", "msclkid", "li_fat_id", "ttclid"];
  var REF_KEYS = ["ref", "referral"];

  // --- storage (all access guarded: private mode throws outright) ---

  function readStore(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function writeStore(key, value) {
    try { window.localStorage.setItem(key, value); return true; } catch (e) { return false; }
  }
  function readSession(key) {
    try { return window.sessionStorage.getItem(key); } catch (e) { return null; }
  }
  function writeSession(key, value) {
    try { window.sessionStorage.setItem(key, value); } catch (e) { /* non-fatal */ }
  }
  function clearSession(key) {
    try { window.sessionStorage.removeItem(key); } catch (e) { /* non-fatal */ }
  }

  function readCookie(name) {
    try {
      var match = document.cookie.match(new RegExp("(^|;\\s*)" + name + "=([^;]*)"));
      return match ? decodeURIComponent(match[2]) : null;
    } catch (e) { return null; }
  }
  function writeCookie(name, value) {
    try {
      document.cookie =
        name + "=" + encodeURIComponent(value) +
        ";domain=" + COOKIE_DOMAIN +
        ";path=/;max-age=" + COOKIE_MAX_AGE +
        ";samesite=lax" +
        (location.protocol === "https:" ? ";secure" : "");
      return readCookie(name) !== null; // did it actually stick?
    } catch (e) { return false; }
  }

  // --- debug ---

  // Enabled by ?rr_debug=1, and remembered for the session so it survives internal
  // navigation (checking the first-touch-survives-the-homepage case needs two pages).
  var DEBUG = (function () {
    var q;
    try { q = new URLSearchParams(location.search).get(DEBUG_KEY); } catch (e) { q = null; }
    if (q === "1" || q === "true") { writeSession(DEBUG_KEY, "1"); return true; }
    if (q === "0" || q === "false") { clearSession(DEBUG_KEY); return false; }
    return readSession(DEBUG_KEY) === "1";
  })();

  function canLog() {
    return DEBUG && typeof console !== "undefined" && console && typeof console.log === "function";
  }
  function logGroup(title) {
    if (!canLog()) return;
    var style = "color:#0b7285;font-weight:600";
    if (console.groupCollapsed) console.groupCollapsed("%c" + title, style);
    else console.log("%c" + title, style);
  }
  function logEnd() {
    if (canLog() && console.groupEnd) console.groupEnd();
  }
  function log(label, value) {
    if (!canLog()) return;
    if (value === undefined) console.log(label); else console.log(label, value);
  }
  function logTable(rows) {
    if (!canLog()) return;
    if (console.table) console.table(rows); else console.log(rows);
  }
  function warn(msg) {
    if (!DEBUG || typeof console === "undefined" || !console) return;
    (console.warn || console.log).call(console, msg);
  }

  function uuid() {
    try {
      if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    } catch (e) { /* fall through */ }
    return "rr-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
  }

  // A stable anonymous id for this browser. This is what later lets us join
  // "read four posts over nine days" to "signed up" — impossible with UTM alone.
  var health = { localStorage: true, cookie: true, vidRestored: false };

  function visitorId() {
    var id = readCookie(VID_KEY) || readStore(VID_KEY);
    health.vidRestored = !!id;
    if (!id) id = uuid();
    health.localStorage = writeStore(VID_KEY, id);
    health.cookie = writeCookie(VID_KEY, id); // parent-domain: the app can read this
    persistServerSide();
    return id;
  }

  // Safari's ITP caps cookies written by script at 7 days, so the 180-day max-age
  // above is silently ignored on much of a clinician audience. Ask the server to
  // re-issue the same value as a real Set-Cookie, which is not capped that way.
  //
  // Fire-and-forget, and deliberately AFTER the cookie is written client-side: the
  // browser then sends that cookie with this request, so /rr/id reuses the id rather
  // than minting a different one. The rr_vids marker means the server has already
  // done this, so it is one request per visitor rather than one per page view.
  function persistServerSide() {
    try {
      if (readCookie(MARKER_KEY)) return;      // already durable
      if (location.protocol !== "https:") return; // Secure cookie needs https
      if (typeof fetch !== "function") return;
      fetch("/rr/id", { credentials: "same-origin", cache: "no-store" })
        .catch(function () { /* endpoint absent or offline — client cookie still stands */ });
    } catch (e) { /* never let this break a CTA */ }
  }

  function paramsFromUrl() {
    var q;
    try { q = new URLSearchParams(location.search); } catch (e) { return {}; }
    var found = {};
    UTM_KEYS.concat(CLICK_IDS).forEach(function (k) {
      var v = q.get(k);
      if (v) found[k] = v;
    });
    REF_KEYS.forEach(function (k) {
      var v = q.get(k);
      if (v && !found.referral_source) found.referral_source = v;
    });
    return found;
  }

  // A visit counts as "attributed" if it carried any UTM, ad click id, or ref param.
  function hasAttribution(p) {
    for (var k in p) if (Object.prototype.hasOwnProperty.call(p, k)) return true;
    return false;
  }

  // Classify traffic that arrives with no params, so organic/referral/direct are
  // distinguishable instead of all collapsing into "(none)".
  function inferredSource() {
    var ref = document.referrer;
    if (!ref) return { utm_source: "direct", utm_medium: "none" };
    var host;
    try { host = new URL(ref).hostname.replace(/^www\./, ""); } catch (e) { return { utm_source: "direct", utm_medium: "none" }; }
    if (host === location.hostname.replace(/^www\./, "")) return null; // internal navigation
    var engines = /^(google|bing|duckduckgo|yahoo|ecosia|brave|search\.marginalia)\./;
    return { utm_source: host, utm_medium: engines.test(host + ".") ? "organic" : "referral" };
  }

  function loadStored() {
    var raw = readStore(STORE_KEY) || readCookie(STORE_KEY);
    if (!raw) return { first: null, last: null };
    try { return JSON.parse(raw) || { first: null, last: null }; }
    catch (e) { return { first: null, last: null }; }
  }

  // Returns { store, decision } — decision explains WHY, which is the whole point
  // of the debug flag. Silent attribution is how the original bug survived.
  function record() {
    var store = loadStored();
    var hadFirst = !!store.first;
    var found = paramsFromUrl();
    var decision;

    if (hasAttribution(found)) {
      decision = "explicit URL parameters";
    } else {
      var inferred = inferredSource();
      if (!inferred) {
        return { store: store, decision: "internal navigation — attribution left unchanged", hadFirst: hadFirst };
      }
      found = inferred;
      decision = "inferred from referrer (" + found.utm_medium + ")";
      // Only let an inferred source create a first touch; never let it overwrite a
      // real campaign on a later pageview.
      if (store.last && store.last.utm_source && store.last.utm_source !== "direct") {
        if (store.first) {
          return { store: store, decision: "inferred source ignored — a real campaign is already stored", hadFirst: hadFirst };
        }
      }
    }

    var touch = {};
    Object.keys(found).forEach(function (k) { touch[k] = found[k]; });
    touch.landing_page = location.pathname;
    touch.referrer = document.referrer || null;
    touch.ts = new Date().toISOString();

    if (!store.first) store.first = touch;  // write-once: the acquiring touch
    store.last = touch;                      // always the most recent

    var serialized = JSON.stringify(store);
    if (!writeStore(STORE_KEY, serialized)) health.localStorage = false;
    if (!writeCookie(STORE_KEY, serialized)) health.cookie = false;
    return { store: store, decision: decision, hadFirst: hadFirst };
  }

  // Build the params appended to app links.
  //
  // Precedence rule that fixes the original bug: a REAL inbound source always wins
  // over the page's hardcoded value. The page identity moves to utm_content, where
  // it belongs — it describes the creative, not the channel.
  function outboundParams(store, vid) {
    var touch = store.first || store.last;
    var out = {};
    if (touch) {
      UTM_KEYS.forEach(function (k) { if (touch[k]) out[k] = touch[k]; });
      CLICK_IDS.forEach(function (k) { if (touch[k]) out[k] = touch[k]; });
      if (touch.referral_source) out.ref = touch.referral_source;
      if (touch.landing_page) out.rr_landing = touch.landing_page;
    }
    if (store.last && store.last !== touch && store.last.utm_source) {
      out.rr_last_source = store.last.utm_source;   // first vs last touch, both preserved
    }
    out.rr_vid = vid;
    out.rr_page = location.pathname;                 // which page the CTA was clicked from
    return out;
  }

  // Only signup links are acquisition. Decorating /login pollutes the app's UTM
  // columns with a channel for someone who converted months ago, and firing a
  // signup conversion on a login click corrupts the conversion count outright.
  function isAcquisitionLink(url) {
    return url.hostname === APP_HOST && url.pathname.indexOf(ACQUISITION_PATH) === 0;
  }

  function decorate(anchor, params) {
    var url;
    try { url = new URL(anchor.href, location.href); } catch (e) { return; }
    if (!isAcquisitionLink(url)) return;

    Object.keys(params).forEach(function (k) {
      // Don't clobber a value the page deliberately set, EXCEPT utm_source — that is
      // the hardcoded page name we are specifically here to correct.
      if (k === "utm_source" || !url.searchParams.get(k)) {
        url.searchParams.set(k, params[k]);
      }
    });

    // The page's own hardcoded source is useful as creative context, not as channel.
    var original = anchor.getAttribute("data-rr-original-source");
    if (original && !url.searchParams.get("utm_content")) {
      url.searchParams.set("utm_content", original);
    }
    anchor.href = url.toString();
  }

  function allAppLinks() {
    return Array.prototype.slice.call(document.querySelectorAll('a[href*="' + APP_HOST + '"]'));
  }

  function report(vid, store, decision, hadFirst, rewritten, skipped) {
    logGroup("[rr] attribution — " + location.pathname);
    log("visit classified as:", decision);
    log("visitor id:", vid + (health.vidRestored ? "  (restored)" : "  (new this browser)"));
    log("first touch " + (hadFirst ? "(existing)" : "(created on this visit)") + ":", store.first);
    log("last touch:", store.last);
    log("storage:", {
      localStorage: health.localStorage ? "ok" : "BLOCKED (private mode?) — URL params still work",
      parentDomainCookie: health.cookie ? "ok (.riverrecords.ai)" : "NOT SET"
    });
    if (!health.cookie) {
      warn("[rr] The .riverrecords.ai cookie did not stick. Expected on a *.pages.dev " +
           "preview or localhost — the app will not see rr_vid there. On production this " +
           "means the cross-domain join is broken.");
    }
    if (rewritten.length) {
      log("signup links rewritten (" + rewritten.length + "):");
      logTable(rewritten);
    } else {
      log("signup links rewritten: none found on this page");
    }
    if (skipped.length) {
      log("app links deliberately skipped (not acquisition):");
      logTable(skipped);
    }
    log("Turn this off with ?rr_debug=0");
    logEnd();
  }

  function init() {
    var vid = visitorId();
    var result = record();
    var store = result.store;
    var params = outboundParams(store, vid);
    var rewritten = [];
    var skipped = [];

    allAppLinks().forEach(function (a) {
      var url;
      try { url = new URL(a.href, location.href); } catch (e) { return; }

      if (!isAcquisitionLink(url)) {
        if (DEBUG) skipped.push({ href: a.href, reason: "not " + ACQUISITION_PATH + "*" });
        return;
      }

      // Stash the build-time source before we overwrite it.
      if (!a.hasAttribute("data-rr-original-source")) {
        var existing = url.searchParams.get("utm_source");
        if (existing) a.setAttribute("data-rr-original-source", existing);
      }

      var before = DEBUG ? a.href : null;
      decorate(a, params);
      if (DEBUG) {
        var after = new URL(a.href, location.href);
        rewritten.push({
          label: (a.textContent || "").trim().slice(0, 30),
          "utm_source before": before ? (new URL(before, location.href).searchParams.get("utm_source") || "(none)") : "",
          "utm_source after": after.searchParams.get("utm_source"),
          utm_content: after.searchParams.get("utm_content") || "(none)",
          href: a.href
        });
      }
    });

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "rr_attribution_ready",
      rr_vid: vid,
      rr_first_source: store.first ? store.first.utm_source || null : null,
      rr_first_medium: store.first ? store.first.utm_medium || null : null,
      rr_first_campaign: store.first ? store.first.utm_campaign || null : null,
      rr_last_source: store.last ? store.last.utm_source || null : null,
      rr_landing_page: store.first ? store.first.landing_page || null : null
    });

    if (DEBUG) report(vid, store, result.decision, result.hadFirst, rewritten, skipped);

    document.addEventListener("click", function (e) {
      var a = e.target && e.target.closest ? e.target.closest("a") : null;
      if (!a || !a.href) return;
      var isSignup = false;
      try { isSignup = isAcquisitionLink(new URL(a.href, location.href)); } catch (e2) {}
      var isDemo = (a.getAttribute("href") || "").indexOf("/book-demo") === 0;
      if (!isSignup && !isDemo) return;

      var payload = {
        event: isSignup ? "cta_click_signup" : "cta_click_demo",
        cta_label: (a.textContent || "").trim().slice(0, 80),
        cta_page: location.pathname,
        cta_section: a.closest("[data-section]") ? a.closest("[data-section]").getAttribute("data-section") : null,
        rr_vid: vid
      };
      window.dataLayer.push(payload);
      if (DEBUG) { log("[rr] dataLayer event pushed:", payload); log("[rr] destination:", a.href); }
    }, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
