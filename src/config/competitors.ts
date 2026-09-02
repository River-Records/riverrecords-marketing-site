/**
 * Head-to-head comparison content, derived from the GTM battle cards in
 * `gtm/battle-cards/battle-cards.html`.
 *
 * THE STRUCTURE IS THE ARGUMENT
 * Every page leads with where the competitor is genuinely better, before anything about
 * Stream. That is taken straight from the deck's own instruction — "conceding is what
 * makes the rest credible" — and it is also the only version that survives contact with
 * a clinician who has already used the other product. A comparison page that cannot name
 * a single thing the competitor does better is read as marketing and discarded.
 *
 * CLAIM RULES, from the deck's guardrails page. These are not stylistic:
 *  - **No SOC 2 claim.** We do not have it. Never imply a date.
 *  - **No EHR write-back claim.** We do not have it and will not this year. Copy-paste
 *    is the honest description, and several competitors are in the same position — which
 *    makes it a neutral fact rather than a loss.
 *  - **Competitor pricing is dated and sourced.** It was verified 19 August 2026 from
 *    public pricing pages. Prices move; Heidi's went from ~$99 to ~$150 in Feb 2026. Any
 *    page quoting a competitor's price must show the date and link to their own page so
 *    a reader can check rather than take our word.
 *
 * WHO IS DELIBERATELY ABSENT
 *  - **Tali AI** — Canada only, natively integrated with Canadian EMRs and publicly
 *    funded. The deck's own read is "don't prospect into Canada right now." A page would
 *    attract traffic we have decided not to pursue.
 *  - **Abridge and Nuance DAX** — health-system sales. The deck disqualifies
 *    system-owned practices outright, so ranking for those terms would draw people we
 *    cannot serve.
 *  - **Freed** already has a bespoke page at `/comparison/freedai`.
 */

export type Competitor = {
  slug: string;
  name: string;
  /** Page title / H1 subject. */
  title: string;
  seoTitle: string;
  seoDescription: string;
  /** The honest one-line framing, shown under the H1. */
  lede: string;
  pricing: {
    them: string;
    themNote?: string;
    /** Their own pricing page, so a reader can check rather than trust us. */
    source: string;
    freeTier: string;
    ehr: string;
  };
  /** Named first on the page, on purpose. */
  betterAtIt: string[];
  /** Where Stream differs. Category argument, not feature tennis. */
  whereStreamDiffers: string[];
  /** The single question worth asking yourself. */
  question: string;
  /** Explicit "choose them" guidance. Costs a little traffic, earns the rest. */
  chooseThemIf: string;
  chooseStreamIf: string;
};

/** Verified from public pricing pages on this date. Re-check before editing any price. */
export const PRICING_VERIFIED = '19 August 2026';

export const competitors: Competitor[] = [
  {
    slug: 'heidi',
    name: 'Heidi',
    title: 'Stream vs. Heidi',
    seoTitle: 'Stream vs. Heidi — An Honest Comparison for Independent Practices',
    seoDescription:
      'Heidi has a real free tier and a polished product. Stream is a problem-based chart, not a cheaper scribe. Where each one wins, and who should pick which.',
    lede: 'Heidi has a genuinely free tier. If all you need is a note, that is a real answer and we would rather say so than pretend otherwise.',
    pricing: {
      them: 'Free · around $150/month',
      themNote: 'Heidi raised its Clinician plan from roughly $99 to around $150 in February 2026.',
      source: 'https://www.heidihealth.com/pricing',
      freeTier: 'Yes — a real one',
      ehr: 'Not on the Free or Clinician plans',
    },
    betterAtIt: [
      'A real free tier, with unlimited basic consults and dictation. Not a trial that expires.',
      'Template flexibility, and a more polished product surface than ours.',
      'A large international footprint, with support for practice patterns outside the US.',
    ],
    whereStreamDiffers: [
      'Free Heidi is a scribe with no chart behind it. That is the same category difference we would argue at any price — it just happens to be at $0.',
      'Their Clinician plan now sits at roughly the same price as Stream Pro, so above the free tier the comparison stops being about money.',
      'Stream ingests inbound documents — faxes, PDFs, pasted records — and files their content under the problems they concern. Heidi does not.',
      'Stream keeps a longitudinal, problem-based chart with care-gap and HCC surfaces. A note generator has nowhere to put that.',
    ],
    question: 'If the free one already does what you need, what is still taking up your evenings?',
    chooseThemIf:
      'You want a good note at no cost, you are happy copying it into your EHR, and the rest of the chart is not the thing eating your time. Take the free tier — genuinely.',
    chooseStreamIf:
      'The note is not the problem. The document pile, the reassessments that quietly lapse, and rebuilding context before every visit are.',
  },
  {
    slug: 'suki',
    name: 'Suki',
    title: 'Stream vs. Suki',
    seoTitle: 'Stream vs. Suki — Comparison for Independent Primary Care',
    seoDescription:
      'Suki offers EHR integrations and voice commands at roughly $299–$399/month. Stream is about half that and organized around problems rather than encounters. An honest comparison.',
    lede: 'Suki is the one comparison where Stream is the lower-priced option — roughly half. That is worth saying plainly, and it is not the main argument.',
    pricing: {
      them: 'Around $299–$399+/month',
      source: 'https://www.suki.ai/pricing/',
      freeTier: 'No',
      ehr: 'Yes — integrations available',
    },
    betterAtIt: [
      'Real EHR integrations, which we do not have and are not promising this year.',
      'A voice command surface for driving the EHR by speech.',
      'A longer track record with larger practices and enterprise buyers.',
    ],
    whereStreamDiffers: [
      'Price. Stream Pro is roughly half, and there is no per-seat surprise.',
      'Suki is a scribe with integrations attached. The note still lands in the EHR as a note, organized by date.',
      'Stream organizes the record by medical problem, so each condition carries its own thread rather than being smeared across encounters.',
      'Inbound documents become part of the chart rather than a filing task.',
    ],
    question: 'At three hundred a month, what are you getting beyond the note?',
    chooseThemIf:
      'EHR write-back is a hard requirement for you. It is a fair requirement, we do not have it, and no amount of comparison changes that.',
    chooseStreamIf:
      'You copy and paste today and are fine continuing, and you would rather spend the difference on a chart that accumulates than on integration you may not use.',
  },
  {
    slug: 'doximity-scribe',
    name: 'Doximity Scribe',
    title: 'Stream vs. Doximity Scribe',
    seoTitle: 'Stream vs. Doximity Scribe — What Happens After the Note',
    seoDescription:
      'Doximity Scribe is free to verified US clinicians. Stream is a problem-based chart with document ingestion. Where each fits, including when the free option is the right answer.',
    lede: 'Doximity Scribe is free to verified US clinicians, which is very likely you already. You cannot beat free with a discount, so we will not try.',
    pricing: {
      them: 'Free',
      themNote: 'Free to verified US clinicians.',
      source: 'https://www.doximity.com/scribe',
      freeTier: 'Entirely free',
      ehr: 'None — copy and paste',
    },
    betterAtIt: [
      'Free, with no procurement, no new vendor and no card. The friction is close to zero.',
      'A brand you already trust and an account you already have.',
    ],
    whereStreamDiffers: [
      'Doximity copies and pastes into your EHR too, so on the EHR question the two are level — this is not a point against Stream.',
      'The recording is discarded once the summary is produced. Nothing accumulates between visits.',
      'Stream keeps what it heard as a problem-based chart, so the third visit is easier than the first.',
      'Inbound faxes and outside records are read and filed under the problems they concern.',
      'Doximity Scribe is English only.',
    ],
    question: 'When you use Doximity Scribe, where does the note go afterwards?',
    chooseThemIf:
      'You want a note, you want it free, and the chart itself is not what is costing you time. That is a perfectly good answer and we would rather you take it than churn off us in a month.',
    chooseStreamIf:
      'You are rebuilding the same context every visit, or the document pile is a job in itself.',
  },
  {
    slug: 'twofold',
    name: 'Twofold',
    title: 'Stream vs. Twofold',
    seoTitle: 'Stream vs. Twofold — Cheapest Scribe, or a Chart?',
    seoDescription:
      'Twofold is around $49–$69/month with coding bundled. Stream is priced like a chart because that is what it is. An honest comparison for independent practices.',
    lede: 'Twofold targets exactly the practices we do, at roughly a third of our price, with coding bundled. If you want the cheapest good scribe, it is probably them.',
    pricing: {
      them: 'Around $49–$69/month',
      source: 'https://www.twofold.health/pricing',
      freeTier: 'No',
      ehr: 'Claims integration available',
    },
    betterAtIt: [
      'Price, straightforwardly. $49 against $149, and CPT/ICD-10 coding is included.',
      'No audio retained, which is a clean answer for privacy-cautious buyers.',
      'They claim EHR integration. We have none.',
    ],
    whereStreamDiffers: [
      'Twofold is a very good, very cheap note generator. That is the whole product.',
      'There is no problem-based chart underneath, no document pipeline, and no care-gap or HCC surface.',
      'We are not trying to be a cheaper scribe. Stream is priced like a chart because that is what it is, and you can do the arithmetic on whether that is worth it.',
    ],
    question: 'At forty-nine dollars unlimited, what happens to the notes after they are written?',
    chooseThemIf:
      'The note is the whole job and price is the deciding factor. We would not try to talk you out of that.',
    chooseStreamIf:
      'You have decided the chart is the problem worth paying to solve, not the typing.',
  },
];

export const bySlug = (slug: string) => competitors.find((c) => c.slug === slug);
