/**
 * The questions clinicians actually ask, in one place.
 *
 * `/faq` used to 301 to the homepage, so long-tail question queries — "is an AI scribe
 * HIPAA compliant", "do AI scribes work with Epic", "can an AI scribe fill out forms" —
 * had nowhere to land. Question-shaped queries are also what AI answer engines quote
 * most readily, and they quote pages that answer plainly rather than sell.
 *
 * TWO RULES FOR EDITING THIS FILE
 *
 * 1. **Do not duplicate the pricing page.** `/pricing` is the canonical answer for cost
 *    questions and should stay that way; two pages competing for the same query split
 *    the signal and neither wins. Cost answers here are one line plus a link.
 *
 * 2. **Answer honestly, including no.** The `limits` category exists because the
 *    questions in it get asked on sales calls anyway, and answering them here is
 *    cheaper than answering them late. Never soften an entry into a maybe — PR #27
 *    had to remove EHR claims the product did not back, and this is where that would
 *    recur first.
 */

/**
 * `onHomepage` marks the subset the homepage renders. Google requires FAQPage schema to
 * reflect content actually visible on that page, so the homepage must declare exactly
 * what it shows — not the full list. Both the visible section and its schema read from
 * this flag, which is the only way they stay in agreement.
 */
export type Faq = { q: string; a: string; onHomepage?: boolean };
export type FaqGroup = { id: string; title: string; blurb?: string; items: Faq[] };

export const faqGroups: FaqGroup[] = [
  {
    id: 'getting-started',
    title: 'Getting started',
    items: [
      {
        q: 'How long does it take to set up?',
        a: 'Minutes. There is no integration to configure, no software to install and no implementation project. You sign in, open a patient, and record your next visit.',
      },
      {
        q: 'Do I need to change my EHR?',
        onHomepage: true,
        a: 'No. Stream works alongside any EHR rather than replacing it. The finished note copies over in one click, formatted to paste into any field. Some clinicians use Stream as their standalone documentation layer instead.',
      },
      {
        q: 'Do I need a credit card to try it?',
        a: 'No. The 30-day trial requires no card, and if you do nothing at the end of it nothing is charged.',
      },
      {
        q: 'What does it cost?',
        a: '$149/month per clinician, or $99/month billed annually. Unlimited visits, no per-encounter charges. Full detail, including the metered fax intake add-on, is on the pricing page.',
      },
    ],
  },
  {
    id: 'how-it-works',
    title: 'How it works',
    items: [
      {
        q: 'How is Stream different from other AI scribes?',
        onHomepage: true,
        a: 'Most AI scribes stop at the note. Stream structures every note by medical problem, so each visit updates a living problem-oriented chart rather than adding another document to a pile. Six months in, you have a longitudinal record organized the way clinicians actually think about patients — by problem, not by date.',
      },
      {
        q: 'Can I customize how my notes look?',
        onHomepage: true,
        a: 'Yes. Stream supports fully customizable templates — structure, sections and formatting — to match your specialty, your EHR’s requirements, or your own style.',
      },
      {
        q: 'What happens to documents that arrive by fax?',
        a: 'With Stream Inlet, inbound faxes and uploaded records are read, summarized, and their clinical content filed under the problems it concerns, with every extracted fact linking back to the page it came from. Nothing is auto-filed into the chart without review.',
      },
      {
        q: 'Does it work in languages other than English?',
        a: 'Yes. Stream supports 22 languages for capture.',
      },
      {
        q: 'What is Journal Club?',
        a: 'Each week Stream looks at the conditions you actually documented and delivers a short reading list about them from the published literature. It is not connected to any individual patient’s chart, offers no guidance on specific cases, and carries no CME credit — it is a way to keep reading when the week has not left room for it.',
      },
    ],
  },
  {
    id: 'security',
    title: 'Security and privacy',
    items: [
      {
        q: 'Is Stream HIPAA compliant?',
        onHomepage: true,
        a: 'Yes. We sign a Business Associate Agreement with every subscriber — on every plan, including trials, with no minimum seat count and no extra charge. Data is encrypted at rest and in transit.',
      },
      {
        q: 'Do you train models on patient data?',
        a: 'No. We never train our models on your patient data.',
      },
      {
        q: 'What security controls are in place beyond HIPAA?',
        onHomepage: true,
        a: 'Encryption at rest and in transit, audit controls, and access logging across the platform. Our security overview goes into detail.',
      },
    ],
  },
  {
    id: 'limits',
    title: 'What Stream does not do',
    blurb: 'These get asked on calls anyway. Answering them here is cheaper for everyone than answering them late.',
    items: [
      {
        q: 'Does Stream write notes back into my EHR automatically?',
        a: 'No. There is no EHR write-back and none is planned for this year. The note copies to your clipboard in one click and pastes into any field. If automatic write-back is a hard requirement, that is a genuine reason to choose a different product.',
      },
      {
        q: 'Is Stream SOC 2 certified?',
        a: 'No. Stream is HIPAA compliant and signs a BAA, but is not SOC 2 certified. If your organization requires SOC 2 to sign, we are not able to meet that today and would rather say so now.',
      },
      {
        q: 'Does Stream offer clinical decision support?',
        a: 'No. Stream has no clinical decision support: no literature search you can query, no differential suggestions, no guidance on an individual patient, and nothing at the point of care. Journal Club delivers weekly reading based on conditions you documented, which is a different thing — it answers no question and comments on no case. Many clinicians sensibly use a decision-support tool alongside Stream.',
      },
      {
        q: 'Can Stream fill out forms for me?',
        a: 'Not yet. Stream can generate documents — referral summaries, patient instructions, supporting documentation — but filling in structured forms such as school physicals, FMLA or prior authorization paperwork is in development and not available today.',
      },
      {
        q: 'Is Stream right for a large health system?',
        a: 'Probably not. Stream is built for independent practices, typically one to twenty clinicians, and is sold and supported accordingly. Health systems generally need EHR-integrated enterprise products, and there are good ones.',
      },
    ],
  },
];

/** Flattened — every question, for /faq and its schema. */
export const allFaqs: Faq[] = faqGroups.flatMap((g) => g.items);

/** Only what the homepage renders, so its schema matches what a visitor can see. */
export const homepageFaqs: Faq[] = allFaqs.filter((f) => f.onHomepage);
