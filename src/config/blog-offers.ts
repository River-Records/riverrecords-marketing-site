/**
 * What each blog post asks the reader to do next.
 *
 * Until now all 88 posts ended with the same ask — start a 30-day trial. That is a
 * bottom-funnel request on top-of-funnel writing: 51 of those posts are essays about
 * burnout, note bloat and information chaos, and someone reading one of those at 11pm
 * is not starting a trial. They might take a guide, or run a calculator.
 *
 * ORDER IS THE WHOLE DESIGN
 * Posts carry two or three tags, so the first matching rule wins and the ordering is
 * what makes the result sensible rather than arbitrary. Two orderings were rejected:
 *
 *  - `practice-operations` high in the list. It is a broad tag (17 posts) covering
 *    anything operational, so it put the revenue calculator on burnout essays.
 *  - `medical-decision-making` pointing at the calculator. The Defensible Visit is
 *    *literally* a guide to documenting medical decision-making, so that tag is the
 *    guide's signal, not the calculator's.
 *
 * The series override sits first because the Revenue & Coding posts must reach the
 * calculator even though they also carry tags that would otherwise route to the guide.
 * The undercoding essay already links to the calculator inline; the footer should agree.
 *
 * Current spread: guide 44, book 21, calculator 13, trial 9, demo 1.
 *
 * Adding an offer means adding it to OFFERS and placing a rule. Resist making the list
 * long — a reader gets one ask, and a fourth variant of "read this" is not a new ask.
 */

export type OfferKey = 'calculator' | 'guide' | 'book' | 'demo' | 'trial';

export type Offer = {
  eyebrow: string;
  heading: string;
  body: string;
  cta: string;
  href: string;
  /** Outbound to the app, so attribution.js decorates it and the click is a signup. */
  external?: boolean;
};

export const OFFERS: Record<OfferKey, Offer> = {
  calculator: {
    eyebrow: 'Run the numbers',
    heading: 'What is conservative coding costing you?',
    body: 'Four inputs, published Medicare rates, and every step of the arithmetic shown. It is built to be a floor rather than a forecast.',
    cta: 'Open the calculator',
    href: '/tools/undercoding-calculator/',
  },
  guide: {
    eyebrow: 'Practical guide',
    heading: 'The Defensible Visit',
    body: 'How to document medical decision-making so it survives review — the 2-of-3 rule, what actually counts as data, and the five phrases that quietly cost a level. One-page checklist at the end.',
    cta: 'Read the guide',
    href: '/guides/the-defensible-visit/',
  },
  book: {
    eyebrow: 'The long version',
    heading: 'The Note Was Never the Point',
    body: 'A book about why the clinical note became the wrong unit for the record, and what a chart organized around problems does instead. Free to read, no email required.',
    cta: 'Start reading',
    href: '/book/',
  },
  demo: {
    eyebrow: 'See it working',
    heading: 'Twenty minutes with a physician who uses it daily',
    body: 'Not a sales call. Bring the awkward questions — the ones about what it gets wrong.',
    cta: 'Book a demo',
    href: '/book-demo/',
  },
  trial: {
    eyebrow: 'Try it',
    heading: 'Stream free for 30 days.',
    body: 'The AI medical scribe with memory. Problem-oriented notes, automatic tasks, and a chart that gets smarter with every visit.',
    cta: 'Try it on your next visit',
    href: 'https://stream.riverrecords.ai/onboard/stream-pro',
    external: true,
  },
};

/** First match wins. See the note above on why this order and not another. */
const RULES: Array<{ series?: string; tag?: string; offer: OfferKey }> = [
  { series: 'Revenue & Coding', offer: 'calculator' },
  { tag: 'comparisons', offer: 'demo' },
  { tag: 'medical-decision-making', offer: 'guide' },
  { tag: 'note-bloat', offer: 'guide' },
  { tag: 'burnout', offer: 'guide' },
  { tag: 'information-chaos', offer: 'guide' },
  { tag: 'practice-operations', offer: 'calculator' },
  { tag: 'ehr-design', offer: 'book' },
  { tag: 'longitudinal-care', offer: 'book' },
];

export function offerFor(frontmatter: { tags?: string[]; series?: string }): {
  key: OfferKey;
  offer: Offer;
} {
  const tags = frontmatter.tags || [];
  for (const rule of RULES) {
    if (rule.series && frontmatter.series === rule.series) return { key: rule.offer, offer: OFFERS[rule.offer] };
    if (rule.tag && tags.includes(rule.tag)) return { key: rule.offer, offer: OFFERS[rule.offer] };
  }
  return { key: 'trial', offer: OFFERS.trial };
}
