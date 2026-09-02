/*
 * read-tracking.js — measures whether a post was actually read.
 *
 * WHY
 * The blog is the largest asset on the site and, until now, reported only that a page
 * loaded. A page view cannot tell a bounce from a six-minute read, so every one of the
 * 88 posts looked identical in the data and "which pages are high value" was
 * unanswerable. This is the measurement that makes that question answerable, and it is
 * also the targeting signal for anything shown to a reader later.
 *
 * WHAT COUNTS AS ENGAGED TIME
 * Not time-with-the-tab-open. The timer stops when the tab is hidden and when there has
 * been no interaction for IDLE_AFTER. A post left open in a background tab overnight
 * must not read as the most engaging thing on the site — which is exactly what naive
 * time-on-page produces.
 *
 * SCROLL IS MEASURED AGAINST THE ARTICLE, NOT THE PAGE
 * The footer, CTA and series navigation are not the post. Measuring against document
 * height would let someone who scrolled past the end of the prose to the footer look
 * like a completed read.
 *
 * WHEN THE READ EVENT FIRES
 * The moment both thresholds are crossed, mid-read — not on exit. Exit is the least
 * reliable moment to send anything: the page may be torn down before a listener runs.
 * A final summary is attempted on hide as well, but the read itself is already recorded
 * by then.
 *
 * The raw numbers travel with every event, so the READ_* thresholds below are a
 * convenience flag rather than the only thing preserved — a different definition of
 * "read" can be applied later to data already collected.
 */
(function () {
  "use strict";

  var ARTICLE = '.blog-post, article';
  var IDLE_AFTER = 30000;   // no interaction for this long and the clock stops
  var TICK = 1000;
  var READ_SECONDS = 60;    // engaged seconds before it counts as read
  var READ_DEPTH = 70;      // percent of the article body reached
  var MILESTONES = [25, 50, 75, 100];
  var PROFILE_KEY = 'rr_reader';
  var PROFILE_MAX = 60;     // slugs retained; bounded so storage cannot grow forever

  var article = document.querySelector(ARTICLE);
  if (!article) return;

  var slug = location.pathname.replace(/^\/|\/$/g, '').split('/').pop() || 'unknown';
  var engaged = 0;
  var lastActivity = Date.now();
  var maxDepth = 0;
  var hit = {};
  var readFired = false;

  function dl(event, extra) {
    var payload = {
      event: event,
      post_slug: slug,
      post_path: location.pathname,
      engaged_seconds: Math.round(engaged),
      scroll_depth: maxDepth,
    };
    for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) payload[k] = extra[k];
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  }

  // --- reader profile -------------------------------------------------------
  // Which posts this browser has genuinely read, so a later offer can be shown to
  // someone on their third post rather than their first pageview. Bounded, and holds
  // slugs only — nothing about the person.
  function profile() {
    try {
      var raw = window.localStorage.getItem(PROFILE_KEY);
      var p = raw ? JSON.parse(raw) : null;
      if (!p || typeof p !== 'object') p = {};
      if (!Array.isArray(p.read)) p.read = [];
      return p;
    } catch (e) { return { read: [] }; }
  }
  function recordRead() {
    try {
      var p = profile();
      if (p.read.indexOf(slug) === -1) p.read.push(slug);
      if (p.read.length > PROFILE_MAX) p.read = p.read.slice(-PROFILE_MAX);
      p.count = p.read.length;
      p.last = new Date().toISOString().slice(0, 10);
      if (!p.first) p.first = p.last;
      window.localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
      return p.count;
    } catch (e) { return 0; }
  }

  // --- scroll ---------------------------------------------------------------
  function depth() {
    var box = article.getBoundingClientRect();
    var top = box.top + window.scrollY;
    var readable = box.height - window.innerHeight;
    if (readable <= 0) return 100; // article shorter than the viewport
    var through = ((window.scrollY - top) / readable) * 100;
    return Math.max(0, Math.min(100, Math.round(through)));
  }

  function onScroll() {
    var d = depth();
    if (d > maxDepth) maxDepth = d;
    MILESTONES.forEach(function (m) {
      if (maxDepth >= m && !hit[m]) {
        hit[m] = true;
        dl('post_scroll', { milestone: m });
      }
    });
    maybeRead();
  }

  // --- engaged time ---------------------------------------------------------
  function active() {
    return document.visibilityState !== 'hidden' && Date.now() - lastActivity < IDLE_AFTER;
  }
  ['scroll', 'mousemove', 'keydown', 'click', 'touchstart', 'wheel'].forEach(function (e) {
    window.addEventListener(e, function () { lastActivity = Date.now(); }, { passive: true });
  });
  window.addEventListener('scroll', onScroll, { passive: true });

  setInterval(function () {
    if (active()) { engaged += TICK / 1000; maybeRead(); }
  }, TICK);

  function maybeRead() {
    if (readFired) return;
    if (engaged < READ_SECONDS || maxDepth < READ_DEPTH) return;
    readFired = true;
    var n = recordRead();
    // The one event worth a line on someone's CRM timeline. Scroll milestones are
    // deliberately not forwarded — a timeline full of "reached 25%" is a timeline
    // nobody reads.
    dl('post_read', { posts_read_total: n });
  }

  // Best-effort summary. The read itself has already fired by now if it qualified;
  // this is for the analysis of everything that did not.
  function summarise() {
    if (document.visibilityState === 'hidden') dl('post_engagement');
  }
  document.addEventListener('visibilitychange', summarise);

  onScroll();
})();
