import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { color, font } from '../../../shared/brand';
import { pop, ramp } from '../../../shared/anim';
import { cue } from '../timing';

const VISITS = ['OCT 2025', 'JAN 2026', 'MAR 2026', 'JUN 2026', 'AUG 2026'];
const THREADS = [
  { title: 'Type 2 diabetes', hits: [1, 1, 0, 1, 1] },
  { title: 'Hypertension', hits: [1, 0, 1, 1, 0] },
  { title: 'Chronic kidney disease', hits: [0, 1, 0, 1, 1] },
];
const X0 = 620;
const STEP = 230;
const TODAY_X = X0 + STEP * VISITS.length;
const rowY = (i: number) => 400 + i * 150;

export const ProblemUnit: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = ramp(frame, cue('unit', 0.28), cue('unit', 0.5));
  const today = ramp(frame, cue('unit', 0.66), cue('unit', 0.72));
  const delta = pop(frame, cue('unit', 0.74));
  const pulse = 1 + 0.12 * Math.sin((frame - cue('unit', 0.74)) / 5) * Math.min(1, delta);
  return (
    <AbsoluteFill style={{ background: color.surface }}>
      <div style={{ position: 'absolute', left: 120, top: 90, fontFamily: font.serif, fontSize: 66, color: color.ink }}>
        <span style={{ opacity: ramp(frame, cue('unit', 0.02), cue('unit', 0.1)) }}>Visits are events. </span>
        <span style={{ color: color.primary, opacity: ramp(frame, cue('unit', 0.3), cue('unit', 0.38)) }}>
          Problems are the unit.
        </span>
      </div>

      {VISITS.map((v, k) => (
        <React.Fragment key={v}>
          <div
            style={{
              position: 'absolute',
              left: X0 + k * STEP - 60,
              width: 120,
              top: 280,
              textAlign: 'center',
              fontFamily: font.mono,
              fontSize: 18,
              color: color['ink-faint'],
              opacity: ramp(frame, 6 + k * 4, 16 + k * 4),
            }}
          >
            {v}
          </div>
          <div
            style={{
              position: 'absolute',
              left: X0 + k * STEP,
              top: 320,
              height: 460,
              borderLeft: `2px dashed ${color.border}`,
              opacity: ramp(frame, 6 + k * 4, 16 + k * 4),
            }}
          />
        </React.Fragment>
      ))}

      <div
        style={{
          position: 'absolute',
          left: TODAY_X - 60,
          width: 120,
          top: 280,
          textAlign: 'center',
          fontFamily: font.mono,
          fontSize: 18,
          color: color.accent,
          opacity: today,
        }}
      >
        TODAY
      </div>
      <div
        style={{
          position: 'absolute',
          left: TODAY_X,
          top: 320,
          height: 460,
          borderLeft: `3px solid ${color.accent}`,
          opacity: today,
        }}
      />

      {THREADS.map((t, i) => (
        <React.Fragment key={t.title}>
          <div
            style={{
              position: 'absolute',
              left: 120,
              top: rowY(i) - 26,
              fontFamily: font.serif,
              fontSize: 38,
              color: color.ink,
              opacity: ramp(frame, cue('unit', 0.28) + i * 4, cue('unit', 0.34) + i * 4),
            }}
          >
            {t.title}
          </div>
          <div
            style={{
              position: 'absolute',
              left: X0 - 60,
              top: rowY(i) - 3,
              height: 6,
              borderRadius: 3,
              width: (TODAY_X - X0 + 120) * draw,
              background: color.primary,
            }}
          />
          {t.hits.map((h, k) =>
            h ? (
              <div
                key={k}
                style={{
                  position: 'absolute',
                  left: X0 + k * STEP - 14,
                  top: rowY(i) - 14,
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  background: color.white,
                  border: `6px solid ${color.primary}`,
                  transform: `scale(${pop(frame, cue('unit', 0.4) + k * 4 + i * 2)})`,
                }}
              />
            ) : null,
          )}
          {i > 0 ? (
            <div
              style={{
                position: 'absolute',
                left: TODAY_X + 22,
                top: rowY(i) + 14,
                fontFamily: font.mono,
                fontSize: 16,
                color: color['ink-faint'],
                opacity: ramp(frame, cue('unit', 0.82), cue('unit', 0.88)),
              }}
            >
              unchanged
            </div>
          ) : null}
        </React.Fragment>
      ))}

      <div
        style={{
          position: 'absolute',
          left: TODAY_X - 20,
          top: rowY(0) - 20,
          width: 40,
          height: 40,
          borderRadius: 20,
          background: color.accent,
          transform: `scale(${delta * pulse})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 170,
          top: rowY(0) + 34,
          padding: '12px 20px',
          borderRadius: 10,
          background: color.white,
          border: `2px solid ${color.accent}`,
          fontFamily: font.sans,
          fontSize: 24,
          color: color.ink,
          opacity: delta,
          transform: `translateY(${(1 - delta) * 12}px)`,
        }}
      >
        A1c 8.1 → 7.4 · continue metformin
      </div>
    </AbsoluteFill>
  );
};
