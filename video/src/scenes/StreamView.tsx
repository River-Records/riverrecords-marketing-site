import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { color, font } from '../brand';
import { pop, ramp } from '../components/anim';
import { cue } from '../components/cue';

// Stylised, not a screenshot: it shows the shape of the idea (problems on the
// left, one thread per problem, the change this visit marked) and nothing that
// dates when the real UI moves.
const PROBLEMS = ['Type 2 diabetes', 'Hypertension', 'Chronic kidney disease', 'Osteoarthritis, knee'];
const ENTRIES = [
  { date: 'OCT 2025', text: 'A1c 8.6. Start metformin 500 mg.' },
  { date: 'JAN 2026', text: 'A1c 8.1. Increase metformin to 1000 mg.' },
  { date: 'JUN 2026', text: 'eGFR stable at 52. Metformin dose appropriate.' },
  { date: 'TODAY', text: 'A1c 7.4. Continue current plan. Recheck in 3 months.', changed: true },
];

export const StreamView: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const panel = pop(frame, 2);
  const titleAt = cue('stream', 0.66);
  const title = ramp(frame, titleAt, titleAt + 8);
  return (
    <AbsoluteFill style={{ background: color.surface }}>
      <div style={{ position: 'absolute', left: 120, top: 80, fontFamily: font.serif, fontSize: 66, color: color.ink, opacity: ramp(frame, 2, 14) }}>
        Organized like clinicians think.
      </div>
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 210,
          width: 1680,
          height: 640,
          display: 'flex',
          borderRadius: 16,
          overflow: 'hidden',
          background: color.white,
          border: `1px solid ${color['border-strong']}`,
          boxShadow: '0 24px 60px rgba(15,26,20,0.12)',
          opacity: panel,
          transform: `translateY(${(1 - panel) * 40}px)`,
        }}
      >
        <div style={{ width: 460, background: color['surface-warm'], padding: '34px 0' }}>
          <div style={{ padding: '0 34px 18px', fontFamily: font.mono, fontSize: 17, letterSpacing: 2, color: color['ink-faint'] }}>
            PROBLEMS
          </div>
          {PROBLEMS.map((p, i) => (
            <div
              key={p}
              style={{
                padding: '20px 34px',
                fontFamily: font.sans,
                fontSize: 28,
                fontWeight: i === 0 ? 600 : 400,
                color: i === 0 ? color.white : color.ink,
                background: i === 0 ? color.primary : 'transparent',
                opacity: ramp(frame, 8 + i * 4, 18 + i * 4),
              }}
            >
              {p}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: '38px 54px' }}>
          <div style={{ fontFamily: font.serif, fontSize: 44, color: color.ink }}>Type 2 diabetes</div>
          <div style={{ marginTop: 6, fontFamily: font.mono, fontSize: 17, color: color['ink-faint'] }}>
            ONE THREAD · EVERY VISIT
          </div>
          <div style={{ marginTop: 30 }}>
            {ENTRIES.map((e, i) => {
              const s = pop(frame, cue('stream', 0.12) + i * 7);
              return (
                <div
                  key={e.date}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 28,
                    padding: '18px 22px',
                    marginBottom: 12,
                    borderRadius: 10,
                    background: e.changed ? color['primary-light'] : 'transparent',
                    borderLeft: `5px solid ${e.changed ? color.accent : color.border}`,
                    opacity: s,
                    transform: `translateX(${(1 - s) * 30}px)`,
                  }}
                >
                  <div style={{ width: 130, fontFamily: font.mono, fontSize: 18, color: e.changed ? color.accent : color['ink-faint'] }}>
                    {e.date}
                  </div>
                  <div style={{ flex: 1, fontFamily: font.sans, fontSize: 27, color: color.ink }}>{e.text}</div>
                  {e.changed ? (
                    <div
                      style={{
                        padding: '6px 14px',
                        borderRadius: 20,
                        background: color.accent,
                        color: color.white,
                        fontFamily: font.sans,
                        fontWeight: 600,
                        fontSize: 18,
                      }}
                    >
                      Changed this visit
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <AbsoluteFill
        style={{
          background: color.dark,
          opacity: title,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontFamily: font.serif,
            fontStyle: 'italic',
            fontSize: 124,
            color: color.white,
            transform: `scale(${0.96 + 0.04 * ramp(frame, titleAt, durationInFrames)})`,
          }}
        >
          The note was never the point.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
