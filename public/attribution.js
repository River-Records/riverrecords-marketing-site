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
//   2. Rewrites every outbound link to the app so it carries that attribution.
//   3. Pushes a cta_click event to the GTM dataLayer.
//
// The cookie is scoped to the parent domain, so it reaches the app even when the
// URL params are lost (bookmark, new tab, return visit days later).

(function () {
  "use strict";

  var APP_HOST = "stream.riverrecords.ai";
  var ACQUISITION_PATH = "/onboard"; // signup only — /login is an existing
                                     // customer returning, not an acquisition

  var COOKIE_DOMAIN = ".riverrecords.ai";
  var STORE_KEY = "rr_attr";
  var VID_KEY = "rr_vid";
  var COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

  var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  var CLICK_IDS = ["gclid", "fbclid", "msclkid", "li_fat_id", "ttclid"];
  var REF_KEYS = ["ref", "referral"];

  // localStorage throws outright in some privacy modes — never let that break the page.
  function readStore(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function writeStore(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* non-fatal */ }
  }

  function readCookie(name) {
    var match = document.cookie.match(new RegExp("(^|;\\s*)" + name + "=([^;]*)"));
    return match ? decodeURIComponent(match[2]) : null;
  }
  function writeCookie(name, value) {
    try {
      document.cookie =
        name + "=" + encodeURIComponent(value) +
        ";domain=" + COOKIE_DOMAIN +
        ";path=/;max-age=" + COOKIE_MAX_AGE +
        ";samesite=lax" +
        (location.protocol === "https:" ? ";secure" : "");
    } catch (e) { /* non-fatal */ }
  }

  function uuid() {
    try {
      if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    } catch (e) { /* fall through */ }
    return "rr-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
  }

  // A stable anonymous id for this browser. This is what later lets us join
  // "read four posts over nine days" to "signed up" — impossible with UTM alone.
  function visitorId() {
    var id = readCookie(VID_KEY) || readStore(VID_KEY);
    if (!id) id = uuid();
    writeStore(VID_KEY, id);
    writeCookie(VID_KEY, id); // parent-domain cookie: the app can read this directly
    return id;
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

  function record() {
    var store = loadStored();
    var found = paramsFromUrl();

    if (!hasAttribution(found)) {
      var inferred = inferredSource();
      if (!inferred) return store;    // internal navigation — leave attribution alone
      found = inferred;
      // Only let an inferred source create a first touch; never let it overwrite a
      // real campaign on a later pageview.
      if (store.last && store.last.utm_source && store.last.utm_source !== "direct") {
        if (store.first) return store;
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
    writeStore(STORE_KEY, serialized);
    writeCookie(STORE_KEY, serialized);
    return store;
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

  function appLinks() {
    var all = Array.prototype.slice.call(document.querySelectorAll('a[href*="' + APP_HOST + '"]'));
    return all.filter(function (a) {
      try { return isAcquisitionLink(new URL(a.href, location.href)); } catch (e) { return false; }
    });
  }

  function init() {
    var vid = visitorId();
    var store = record();
    var params = outboundParams(store, vid);

    appLinks().forEach(function (a) {
      // Stash the build-time source before we overwrite it.
      if (!a.hasAttribute("data-rr-original-source")) {
        var existing = null;
        try { existing = new URL(a.href, location.href).searchParams.get("utm_source"); } catch (e) {}
        if (existing) a.setAttribute("data-rr-original-source", existing);
      }
      decorate(a, params);
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

    document.addEventListener("click", function (e) {
      var a = e.target && e.target.closest ? e.target.closest("a") : null;
      if (!a || !a.href) return;
      var isSignup = false;
      try { isSignup = isAcquisitionLink(new URL(a.href, location.href)); } catch (e) {}
      var isDemo = (a.getAttribute("href") || "").indexOf("/book-demo") === 0;
      if (!isSignup && !isDemo) return;

      window.dataLayer.push({
        event: isSignup ? "cta_click_signup" : "cta_click_demo",
        cta_label: (a.textContent || "").trim().slice(0, 80),
        cta_page: location.pathname,
        cta_section: a.closest("[data-section]") ? a.closest("[data-section]").getAttribute("data-section") : null,
        rr_vid: vid
      });
    }, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
