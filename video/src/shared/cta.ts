// The closing ask. Switch it with the `cta` prop (Studio sidebar, or
// `--props='{"cta":"demo"}'` on render) — the end card, its narration line and
// the video's length all follow from the key. A video offers only the endings it
// has narration for.
import { pricing } from '../../../src/config/pricing';

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

// Per-video wording for an ending, e.g. Inlet's demo card names Inlet.
export type CtaOverrides = Partial<Record<CtaKey, Partial<Cta>>>;

export const resolveCta = (key: CtaKey, overrides: CtaOverrides = {}): Cta => ({ ...CTAS[key], ...overrides[key] });

type Narration = { lines: { id: string; text: string }[] };

// The trial length is spoken, and a recording can't follow the pricing config.
// Fail the render rather than ship a voice saying a different number than the card.
export const assertTrialLine = (narration: Narration, video: string) => {
  const line = narration.lines.find((l) => l.id === 'cta-trial');
  if (line && !line.text.includes(`${pricing.trialDays} days`)) {
    throw new Error(
      `pricing.trialDays is ${pricing.trialDays}; update cta-trial in ${video}/narration.json and re-record it`,
    );
  }
};
