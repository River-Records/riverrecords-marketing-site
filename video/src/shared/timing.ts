export const FPS = 30;
// Silence added before and after each line, in seconds. Recorded takes carry
// their own ~0.1s lead-in and ~0.3s tail, so these stay short.
export const LEAD = 0.25;
const TAIL = 0.5;
export const CTA_HOLD = 2.2;

export type Timing = {
  lineSeconds: (id: string) => number;
  sceneFrames: (id: string, extraHold?: number) => number;
  // Frame at which line `id` is fraction `p` of the way through, so visuals
  // land on the words that describe them.
  cue: (id: string, p: number) => number;
};

// `seconds` is a video's generated timing file; `holds` adds seconds after
// particular lines (a title card that should sit after the voice stops).
export const makeTiming = (seconds: Record<string, number>, holds: Record<string, number> = {}): Timing => {
  const lineSeconds = (id: string) => {
    const s = seconds[id];
    if (s === undefined) throw new Error(`No narration timing for "${id}" — run npm run narrate`);
    return s;
  };
  return {
    lineSeconds,
    sceneFrames: (id, extraHold = holds[id] ?? 0) => Math.ceil((LEAD + lineSeconds(id) + TAIL + extraHold) * FPS),
    cue: (id, p) => Math.round((LEAD + p * lineSeconds(id)) * FPS),
  };
};
