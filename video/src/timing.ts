import timing from './generated/narration-timing.json';

export const FPS = 30;
// Silence before each line starts and after it ends, in seconds.
export const LEAD = 0.35;
const TAIL = 0.8;
// Scenes that need to hold after the voice stops (the title card, the end card).
const EXTRA_HOLD: Record<string, number> = { stream: 1.4 };
export const CTA_HOLD = 2.6;

export const STORY = ['drowning', 'inheritance', 'unit', 'aside', 'stream'] as const;

export const lineSeconds = (id: string): number => {
  const s = (timing as Record<string, number>)[id];
  if (s === undefined) throw new Error(`No narration timing for "${id}" — run npm run narrate`);
  return s;
};

export const sceneFrames = (id: string, hold = EXTRA_HOLD[id] ?? 0): number =>
  Math.ceil((LEAD + lineSeconds(id) + TAIL + hold) * FPS);
