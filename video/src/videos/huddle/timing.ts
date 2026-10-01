import seconds from '../../generated/timing/huddle.json';
import { makeTiming } from '../../shared/timing';

export const timing = makeTiming(seconds, { close: 1.2 });
export const { cue } = timing;
