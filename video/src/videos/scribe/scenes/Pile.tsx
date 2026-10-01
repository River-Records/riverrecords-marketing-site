import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { clamp, pop, rand, ramp } from '../../../shared/anim';
import { color, font } from '../../../shared/brand';
import { DocPage, Eyebrow, Headline } from '../../../shared/ui';
import { cue } from '../timing';

const PILE = ['06/21/26', '03/30/26', '12/19/25', '09/22/25', '06/17/25'];

export const Pile: React.FC = () => {
  const frame = useCurrentFrame();
  const wave = ramp(frame, 4, 12) * (1 - ramp(frame, cue('pile', 0.3), cue('pile', 0.36)));
  const note = pop(frame, cue('pile', 0.22));
  const slide = interpolate(frame, [cue('pile', 0.5), cue('pile', 0.66)], [0, 1], { ...clamp, easing: (x) => x * x * (3 - 2 * x) });
  return (
    <AbsoluteFill style={{ background: color.dark }}>
      <Headline onDark>Every scribe can write a note.</Headline>
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 210,
          fontFamily: font.serif,
          fontStyle: 'italic',
          fontSize: 52,
          color: color['accent-light'],
          opacity: ramp(frame, cue('pile', 0.66), cue('pile', 0.74)),
        }}
      >
        Next visit, you start over.
      </div>

      <div style={{ position: 'absolute', left: 120, top: 420, width: 420 }}>
        <Eyebrow tone={color['surface-mid']}>Visit · listening</Eyebrow>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 160, marginTop: 20 }}>
          {Array.from({ length: 36 }, (_, i) => (
            <div
              key={i}
              style={{
                width: 6,
                borderRadius: 3,
                background: color.accent,
                height: 8 + wave * (20 + 90 * Math.abs(Math.sin(frame / 4 + i * 0.7)) * (0.4 + rand(i))),
              }}
            />
          ))}
        </div>
      </div>

      {PILE.map((d, i) => (
        <DocPage
          key={d}
          label={`VISIT NOTE · ${d}`}
          lines={10}
          seed={i + 10}
          width={380}
          style={{ position: 'absolute', left: 1320 + i * 14, top: 360 + i * 18, transform: `rotate(${(rand(i) - 0.5) * 8}deg)`, opacity: 0.92 }}
        />
      ))}

      <DocPage
        label="VISIT NOTE · 09/14/26"
        lines={10}
        seed={3}
        width={380}
        style={{
          position: 'absolute',
          left: interpolate(slide, [0, 1], [720, 1300]),
          top: interpolate(slide, [0, 1], [340, 330]),
          opacity: note,
          transform: `scale(${0.9 + 0.1 * note}) rotate(${slide * -3}deg)`,
        }}
      />
    </AbsoluteFill>
  );
};
