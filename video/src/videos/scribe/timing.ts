import seconds from '../../generated/timing/scribe.json';
import { makeTiming } from '../../shared/timing';

export const timing = makeTiming(seconds, { close: 1.4 });
export const { cue } = timing;
