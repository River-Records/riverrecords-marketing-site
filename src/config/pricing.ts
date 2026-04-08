/**
 * Central pricing config — edit here, updates site-wide.
 * All pricing values and display strings in one place.
 */

export const pricing = {
  // Core numbers
  introMonthly: 59,
  introAnnual: 39,
  introAnnualTotal: 468,
  standardMonthly: 149,
  trialDays: 30,
  introMonths: 12,

  // Competitor
  freedMonthly: 99,

  // Display strings — used directly in templates
  introPrice: '$59/month',
  standardPrice: '$149/month',
  annualPrice: '$39/month',

  // Headlines & descriptions
  introHeadline: '$59/month for your first year.',
  introSubline: 'Then $149/month.',
  trialLine: '30-day free trial, no credit card required.',

  // Trust line items (used in hero sections)
  trustIntro: '$59/month for your first year',
  trustTrial: '30-day free trial',
  trustNoCc: 'No credit card required',
  trustHipaa: 'HIPAA Compliant',

  // Offer banner
  bannerText: '$59/month for your first year — then $149/month.',
  bannerPrefix: 'Limited time:',

  // FAQ
  faqQuestion: 'What does Stream cost?',
  faqAnswer: 'Stream is $59/month per user for your first 12 months — guaranteed. After your first year, pricing moves to the standard rate of $149/month. Every plan starts with a 30-day free trial — no credit card required. Cancel anytime.',

  // Freed comparison
  freedSavings: '$480 in year one',
  freedComparison: '40% less than Freed in year one',

  // CTA body lines
  ctaBody: '$59/month for your first year. Works alongside any EHR.',
  ctaBodyWithTrial: 'Start your 30-day free trial. No credit card. $59/month for your first year. Works alongside any EHR.',
  featureCtaBody: 'No credit card required. $59/month for your first year. Works alongside any EHR.',

  // Pricing card (homepage)
  cardAmount: '59',
  cardPeriod: 'per user / month for your first year',
  cardNormal: 'Then $149/month. 30-day free trial. No credit card required.',
  toggleMonthly: { amt: '59', period: 'per user / month for your first year' },
  toggleAnnual: { amt: '39', period: 'per user / month · billed annually ($468/yr) for your first year' },

  // Specialty page pricing callout
  calloutHeadline: '$59/month for your first year.',
  calloutBody: 'Unlimited visits. Works alongside any EHR. 30-day free trial, no credit card required.',
  calloutSmall: 'Then $149/month. Cancel anytime.',
} as const;
