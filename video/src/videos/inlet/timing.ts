import seconds from '../../generated/timing/inlet.json';
import { makeTiming } from '../../shared/timing';

export const timing = makeTiming(seconds);
export const { cue } = timing;
