import timing from './generated/narration-timing.json';

export const FPS = 30;
// Silence added before and after each line, in seconds. Recorded takes carry
// their own ~0.1s lead-in and ~0.3s tail, so these stay short.
export const LEAD = 0.25;
const TAIL = 0.5;
// Scenes that need to hold after the voice stops (the title card, the end card).
const EXTRA_HOLD: Record<string, number> = { stream: 1.4 };
export const CTA_HOLD = 2.2;

export const STORY = ['drowning', 'inheritance', 'unit', 'aside', 'stream'] as const;

export const lineSeconds = (id: string): number => {
  const s = (timing as Record<string, number>)[id];
  if (s === undefined) throw new Error(`No narration timing for "${id}" — run npm run narrate`);
  return s;
};

export const sceneFrames = (id: string, hold = EXTRA_HOLD[id] ?? 0): number =>
  Math.ceil((LEAD + lineSeconds(id) + TAIL + hold) * FPS);
