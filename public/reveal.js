/*
 * reveal.js — make `.reveal` actually reveal, on every page.
 *
 * WHY THIS EXISTS
 * shared.css sets `.reveal { opacity: 0 }` and only `.reveal.visible` brings it back.
 * Nothing global added that class: each page was expected to ship its own
 * IntersectionObserver in an inline script, and a page that forgot simply rendered the
 * element invisible. `CtaDark` hardcodes the `reveal` class, so the failure mode was a
 * page with no call to action at all — and it was silent, because the markup is present,
 * the build passes, and every functional test passes. Only looking at the page catches it.
 *
 * Found on /research/, which had been shipping an invisible CTA, and reproduced
 * immediately on a new page that used the same component.
 *
 * This runs everywhere from Base.astro, so the class can no longer be a trap. Pages that
 * still carry their own observer are harmless: both add the same class, and adding it
 * twice does nothing.
 *
 * TWO FALLBACKS, because content that never appears is worse than content that appears
 * without animation:
 *   - no IntersectionObserver support: show everything immediately
 *   - the element is already in view at load: it is revealed on the first callback,
 *     which the observer does fire for initial intersections
 *
 * There is also a <noscript> rule in Base.astro for JS being off entirely. Between the
 * three, there is no path where `.reveal` content stays hidden.
 */
(function () {
  "use strict";

  function showAll(nodes) {
    for (var i = 0; i < nodes.length; i++) nodes[i].classList.add("visible");
  }

  function init() {
    var nodes = document.querySelectorAll(".reveal:not(.visible)");
    if (!nodes.length) return;

    if (typeof IntersectionObserver !== "function") {
      showAll(nodes);
      return;
    }

    try {
      // Same threshold and margin the per-page observers used, so pages that already
      // had one animate identically and nothing shifts visually.
      var obs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
      );
      for (var i = 0; i < nodes.length; i++) obs.observe(nodes[i]);
    } catch (err) {
      // Anything unexpected: fail open. Never leave content invisible.
      showAll(nodes);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
