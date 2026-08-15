/**
 * Central pricing config — edit here, updates site-wide.
 * All pricing values and display strings in one place.
 */

export const pricing = {
  // Core numbers
  monthly: 149,
  annual: 99,
  annualTotal: 1188,
  trialDays: 30,

  // Competitor
  freedMonthly: 99,

  // Display strings — used directly in templates
  introPrice: '$149/month',
  annualPrice: '$99/month',

  // Canonical pricing copy — homepage banner, pricing section, and FAQ must match exactly
  pricePhrase: '$149/month, or $99/month billed annually.',
  priceLine: '$149/month, or $99/month billed annually. 30-day free trial, no credit card.',

  // Headlines & descriptions
  introHeadline: '$149/month. Start free.',
  introSubline: 'Annual billing available at $99/month.',
  trialLine: '30-day free trial, no credit card required.',

  // Trust line items (used in hero sections)
  trustIntro: '$149/month after trial',
  trustTrial: '30-day free trial',
  trustNoCc: 'No credit card required',
  trustHipaa: 'HIPAA Compliant',

  // Offer banner
  bannerText: '$149/month. Annual billing at $99/month.',
  bannerPrefix: 'Try Stream free for 30 days.',

  // FAQ
  faqQuestion: 'What does Stream cost?',
  faqAnswer: '$149/month, or $99/month billed annually. 30-day free trial, no credit card. Staff seats: your first non-clinician team member is free; additional staff are $25/month each.',

  // Freed comparison
  freedSavings: 'Same price as Freed with annual billing',
  freedComparison: 'Same price as Freed, more features',

  // CTA body lines
  ctaBody: '$149/month after trial. Works alongside any EHR.',
  ctaBodyWithTrial: 'Start your 30-day free trial. No credit card. $149/month after trial. Works alongside any EHR.',
  featureCtaBody: 'No credit card required. $149/month after trial. Works alongside any EHR.',

  // Pricing card (homepage)
  cardAmount: '149',
  cardPeriod: 'per user / month · billed monthly',
  cardNormal: '30-day free trial. No credit card required. Annual billing at $99/month.',
  toggleMonthly: { amt: '149', period: 'per user / month · billed monthly' },
  toggleAnnual: { amt: '99', period: 'per user / month · billed annually ($1,188/yr)' },

  // Specialty page pricing callout
  calloutHeadline: '$149/month. Start free.',
  calloutBody: 'Unlimited visits. Works alongside any EHR. 30-day free trial, no credit card required.',
  calloutSmall: 'Cancel anytime. Annual billing available at $99/month.',
} as const;

/**
 * Stream Inlet — metered fax and records intake, added on top of a Stream Pro
 * subscription. Page allowances are per month. Bespoke and founding-customer
 * terms (first-month metering, setup waivers, the Spruce-path rate) are
 * deliberately not here: they belong in a quote, not on the public page.
 */
export const inletPricing = {
  setupFee: 299,
  setupFeeDisplay: '$299',
  overagePerPage: 0.14,
  tiers: [
    { name: 'Starter',   pages: 500,   monthly: 89,  display: '$89',  fit: 'Typically a solo or two-clinician office' },
    { name: 'Practice',  pages: 1500,  monthly: 199, display: '$199', fit: 'Typically a small group' },
    { name: 'Practice+', pages: 3000,  monthly: 349, display: '$349', fit: 'Typically a larger clinic — or heavy referral, imaging and records traffic at any size' },
  ],
  includes: 'Every plan includes your fax number, unlimited users, and processing of every page in your plan. Extra pages $0.14. We notify you at 80% of your allowance. Junk faxes are filtered and never billed.',
  addOnNote: 'Stream Inlet is metered, and sits on top of your Stream Pro subscription.',
} as const;
