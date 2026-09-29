// The closing ask. Switch it with the `cta` prop (Studio sidebar, or
// `--props='{"cta":"book"}'` on render) — the end card, its narration line and
// the video's length all follow from the key.
import { pricing } from '../../../src/config/pricing';
import narration from './narration.json';

export type CtaKey = 'trial' | 'book' | 'demo';

export type Cta = {
  narrationId: string;
  headline: string;
  sub: string;
  url: string;
};

export const CTAS: Record<CtaKey, Cta> = {
  trial: {
    narrationId: 'cta-trial',
    headline: `Try Stream free for ${pricing.trialDays} days.`,
    sub: `${pricing.trustNoCc} · Works alongside any EHR`,
    url: 'riverrecords.ai',
  },
  book: {
    narrationId: 'cta-book',
    headline: 'Read the book. It’s free.',
    sub: 'The Note Was Never the Point',
    url: 'riverrecords.ai/book',
  },
  demo: {
    narrationId: 'cta-demo',
    headline: 'See it on your own patients.',
    sub: 'Book a demo · Works alongside any EHR',
    url: 'riverrecords.ai/book-demo',
  },
};

// The trial length is spoken, and a recording can't follow the pricing config.
// Fail the render rather than ship a voice saying a different number than the card.
const trialLine = narration.lines.find((l) => l.id === 'cta-trial');
if (!trialLine || !trialLine.text.includes(`${pricing.trialDays} days`)) {
  throw new Error(
    `pricing.trialDays is ${pricing.trialDays}; update the cta-trial line in narration.json and re-run npm run narrate`,
  );
}
