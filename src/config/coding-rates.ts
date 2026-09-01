/**
 * Medicare fee-for-service figures behind the undercoding calculator.
 *
 * THESE EXPIRE. The Physician Fee Schedule is republished every January, and a
 * calculator quoting last year's rates is worse than no calculator — it is wrong with
 * a confident face. `effectiveLabel` is rendered on the page itself so a visitor can
 * see how current the numbers are, and `reviewBy` is the date to come back and update.
 *
 * All amounts are national, non-facility, and unadjusted for locality. Real payment
 * varies by geography and, for commercial plans, is typically higher than Medicare —
 * which is why the estimate is deliberately built on Medicare and described as a floor.
 *
 * Sources are listed on the page. Do not change a number here without changing the
 * citation with it.
 */

export const codingRates = {
  effectiveLabel: 'Medicare Physician Fee Schedule, January 2026',
  reviewBy: '2027-01-31',

  /** National non-facility payment, established-patient office visits. */
  em: {
    level3: 95.19,  // 99213
    level4: 135.61, // 99214
    level5: 182.08, // 99215
  },

  /**
   * Visit-complexity add-on for the continuing care relationship. Paid on top of the
   * base E/M. CMS acknowledged in the CY2026 rule that actual reporting came in below
   * its own utilization estimate — practices absorbed the budget-neutrality reduction
   * that funded it and then did not bill it.
   */
  g2211: 16.40,

  /** Conversion factor, for reconciling the RVU arithmetic if anyone checks. */
  conversionFactor: 33.40,

  /**
   * Defaults chosen to be defensible rather than flattering. The undercoding rate in
   * particular is set low on purpose: the published prevalence research (44% of
   * pediatric visits, 33% in a family-physician survey) almost all predates the 2021
   * E/M overhaul, after which coding shifted upward materially. Those studies do not
   * describe 2026 behavior, so the calculator does not lean on them.
   */
  defaults: {
    providers: 3,
    visitsPerProvider: 3500,
    undercodeRatePct: 8,
    /**
     * Share of ALL visits that are Medicare *and* not already billed with G2211 — not
     * simply the Medicare mix. Defaulted to a typical Medicare share on the assumption
     * that the practice bills none of it, which is the common case given documented
     * adoption, but a practice already claiming it should move this down.
     */
    medicareSharePct: 35,
  },

  /** Bounds for the sliders. */
  limits: {
    providersMax: 60,
    visitsMax: 6000,
    undercodeMax: 25,
  },
};

/** One step of E/M level, used as the value of a single undercoded visit. */
export const levelStep = +(codingRates.em.level4 - codingRates.em.level3).toFixed(2); // 40.42
