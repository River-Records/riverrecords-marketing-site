/**
 * Who we are, in one place, for every machine-readable description of the site.
 *
 * This used to be hardcoded inside an `is:inline` JSON-LD block in Base.astro. It is now
 * config because there are two consumers — that inline block and the standalone document
 * at /organization.jsonld — and two hand-maintained copies of "what is River Records"
 * would drift the way every other pair in this repo would. Same reasoning as pricing.ts,
 * faqs.ts and videos.ts.
 *
 * Keep it to things that are true and stable. This is the description an AI agent is
 * most likely to quote verbatim, because it is the cheapest thing on the site to fetch —
 * roughly 1KB against 10KB for the homepage in markdown.
 *
 * Tone rules apply here as much as anywhere: "organized like clinicians think", never
 * "thinks like a clinician"; "works alongside any EHR", never "works with".
 */

import { press } from './press';

export const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'River Records',
  url: 'https://www.riverrecords.ai',
  description:
    'Stream is an AI medical scribe with memory that generates problem-based clinical notes.',
  foundingDate: '2019',
  sameAs: ['https://linkedin.com/company/riverrecordshq/'],
} as const;

/**
 * The standalone document served at /organization.jsonld, which the homepage's
 * `Link: rel="describedby"` header points at.
 *
 * Deliberately a superset of the inline Organization block rather than a different
 * shape: an agent that fetches this instead of the page should not get a worse answer
 * than one that parses the page. The extra entries are the things a description is
 * actually asked for — what the product is, and where to read more.
 */
export const organizationDocument = {
  ...organization,
  makesOffer: {
    '@type': 'Offer',
    itemOffered: {
      '@type': 'SoftwareApplication',
      name: 'Stream',
      applicationCategory: 'HealthApplication',
      description:
        'An AI medical scribe that structures every note by medical problem, so each visit updates a longitudinal problem-oriented chart rather than adding another dated document. Works alongside any EHR.',
    },
  },
  // Only pages that describe the company or the product, and only ones that will not be
  // renamed casually. verify-internal-links.mjs does not read this file, so a stale
  // entry here fails silently — which is why the list is short.
  subjectOf: [
    { '@type': 'WebPage', name: 'Pricing', url: 'https://www.riverrecords.ai/pricing/' },
    { '@type': 'WebPage', name: 'FAQ', url: 'https://www.riverrecords.ai/faq/' },
    { '@type': 'WebPage', name: 'About', url: 'https://www.riverrecords.ai/about/' },
    // Third-party interviews, from src/config/press.ts — the same list /about/ renders.
    // `subjectOf` is the right relation for them: these are works about this organization
    // that this organization did not publish, which is the only kind of corroboration an
    // answer engine can weigh differently from our own copy. Generated rather than
    // retyped, so the document and the page cannot disagree about what exists.
    ...press.map((item) => ({
      '@type': item.kind === 'podcast' ? 'PodcastEpisode' : 'Article',
      name: item.title,
      url: item.url,
      publisher: { '@type': 'Organization', name: item.outlet },
      ...(item.date ? { datePublished: item.date } : {}),
    })),
  ],
} as const;
