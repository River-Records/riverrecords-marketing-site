import seconds from '../../generated/timing/note-was-never-the-point.json';
import { makeTiming } from '../../shared/timing';

export const timing = makeTiming(seconds, { stream: 1.4 });
export const { cue } = timing;
