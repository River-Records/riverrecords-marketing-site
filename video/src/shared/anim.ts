import { interpolate, spring } from 'remotion';
import { FPS } from './timing';

export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// 0→1 over [from, to] frames.
export const ramp = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], clamp);

export const pop = (frame: number, at: number) =>
  spring({ frame: frame - at, fps: FPS, config: { damping: 18, stiffness: 120 } });

// Deterministic pseudo-random, so every render draws the same pile.
export const rand = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

export const fadeIn = (frame: number) => ramp(frame, 0, 10);
