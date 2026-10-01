import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { color, font } from '../../../shared/brand';
import { rand, ramp } from '../../../shared/anim';
import { cue } from '../timing';

const SHELVES = 4;
const PER_SHELF = 64;
const TOTAL = SHELVES * PER_SHELF;
const SPINE_TONES = ['surface', 'surface-warm', 'surface-mid', 'white'];

export const Library: React.FC = () => {
  const frame = useCurrentFrame();
  // Accelerating: the shelves fill faster the longer it runs.
  const t = ramp(frame, 4, cue('aside', 0.95));
  const shown = Math.floor(TOTAL * t * t);
  return (
    <AbsoluteFill style={{ background: color.dark }}>
      <div style={{ position: 'absolute', left: 120, top: 80, width: 1680 }}>
        <div style={{ fontFamily: font.mono, fontSize: 20, letterSpacing: 2, color: color['accent-light'], opacity: ramp(frame, 0, 10) }}>
          AN AI SCRIBE: THE SAME NOTE, FASTER
        </div>
        <div style={{ marginTop: 18, fontFamily: font.serif, fontSize: 66, color: color.white, opacity: ramp(frame, cue('aside', 0.45), cue('aside', 0.55)) }}>
          Faster notes fill a broken library faster.
        </div>
      </div>
      {Array.from({ length: SHELVES }, (_, s) => (
        <div key={s} style={{ position: 'absolute', left: 120, top: 300 + s * 124, width: 1680 }}>
          <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 104 }}>
            {Array.from({ length: PER_SHELF }, (_, b) => {
              const n = s * PER_SHELF + b;
              if (n >= shown) return <div key={b} style={{ width: 22 }} />;
              return (
                <div
                  key={b}
                  style={{
                    width: 22,
                    height: 70 + rand(n) * 34,
                    borderRadius: 2,
                    background: color[SPINE_TONES[Math.floor(rand(n + 7) * SPINE_TONES.length)]],
                    opacity: 0.85,
                  }}
                />
              );
            })}
          </div>
          <div style={{ height: 6, background: color['dark-mid'], borderTop: `2px solid ${color['ink-faint']}` }} />
        </div>
      ))}
    </AbsoluteFill>
  );
};
