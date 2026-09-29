import { FPS, LEAD, lineSeconds } from '../timing';

// Frame at which the narration for `id` is fraction `p` of the way through, so
// visuals land on the words that describe them.
export const cue = (id: string, p: number) => Math.round((LEAD + p * lineSeconds(id)) * FPS);
