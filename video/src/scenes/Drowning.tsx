import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { color, font } from '../brand';
import { clamp, pop, rand, ramp } from '../components/anim';
import { cue } from '../components/cue';
import { interpolate } from 'remotion';

const DATES = ['09/14/26', '08/02/26', '06/21/26', '05/09/26', '03/30/26', '02/11/26', '12/19/25', '11/04/25',
  '09/22/25', '08/08/25', '06/17/25', '05/01/25', '03/12/25', '01/28/25', '12/10/24', '10/29/24'];
const KINDS = ['OFFICE VISIT', 'TELEPHONE', 'CARDIOLOGY', 'OFFICE VISIT', 'LAB RESULT', 'NEPHROLOGY',
  'OFFICE VISIT', 'ED VISIT', 'DISCHARGE', 'OFFICE VISIT', 'TELEPHONE', 'OFFICE VISIT'];

const NoteCard: React.FC<{ i: number; frame: number }> = ({ i, frame }) => {
  const at = 4 + i * 8;
  const p = pop(frame, at);
  if (frame < at) return null;
  const x = 110 + rand(i) * 260;
  const y = 120 + i * 30 + rand(i + 50) * 30;
  const r = (rand(i + 100) - 0.5) * 10;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y - (1 - p) * 80,
        opacity: p,
        transform: `rotate(${r}deg)`,
        width: 520,
        padding: '22px 26px',
        background: color.white,
        borderRadius: 10,
        boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
      }}
    >
      <div style={{ fontFamily: font.mono, fontSize: 17, color: color['ink-faint'], letterSpacing: 1 }}>
        {KINDS[i % KINDS.length]} · {DATES[i % DATES.length]}
      </div>
      {[0.92, 0.8, 0.95, 0.6, 0.85, 0.7].map((w, j) => (
        <div
          key={j}
          style={{
            height: 11,
            width: `${w * (0.8 + rand(i * 7 + j) * 0.2) * 100}%`,
            marginTop: 14,
            borderRadius: 6,
            background: color['surface-mid'],
          }}
        />
      ))}
    </div>
  );
};

export const Drowning: React.FC = () => {
  const frame = useCurrentFrame();
  const bar = ramp(frame, cue('drowning', 0.12), cue('drowning', 0.42));
  const hours = interpolate(bar, [0, 1], [0, 5.9], clamp);
  const hunting = ramp(frame, cue('drowning', 0.62), cue('drowning', 0.7));
  return (
    <AbsoluteFill style={{ background: color.dark }}>
      {Array.from({ length: 16 }, (_, i) => (
        <NoteCard key={i} i={i} frame={frame} />
      ))}
      <div style={{ position: 'absolute', left: 1040, top: 190, width: 760 }}>
        <div
          style={{
            fontFamily: font.serif,
            fontSize: 70,
            lineHeight: 1.08,
            color: color.white,
            opacity: ramp(frame, 4, 18),
          }}
        >
          More than half the workday, inside the EHR.
        </div>
        <div style={{ marginTop: 64, opacity: ramp(frame, cue('drowning', 0.08), cue('drowning', 0.14)) }}>
          <div style={{ fontFamily: font.mono, fontSize: 20, letterSpacing: 2, color: color['surface-mid'] }}>
            AN 11.4-HOUR PRIMARY CARE WORKDAY
          </div>
          <div
            style={{
              marginTop: 16,
              height: 44,
              borderRadius: 8,
              background: 'rgba(250,247,240,0.12)',
              overflow: 'hidden',
            }}
          >
            <div style={{ height: '100%', width: `${(hours / 11.4) * 100}%`, background: color.accent }} />
          </div>
          <div style={{ marginTop: 16, fontFamily: font.sans, fontSize: 32, color: color['accent-light'] }}>
            {hours.toFixed(1)} hours in the EHR
          </div>
        </div>
        <div
          style={{
            marginTop: 56,
            fontFamily: font.serif,
            fontStyle: 'italic',
            fontSize: 50,
            color: color.white,
            opacity: hunting,
          }}
        >
          Much of it isn’t care. It’s hunting.
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 70,
          fontFamily: font.mono,
          fontSize: 17,
          color: color['surface-mid'],
          opacity: 0.8 * ramp(frame, cue('drowning', 0.14), cue('drowning', 0.2)),
        }}
      >
        Arndt et al., Annals of Family Medicine, 2017
      </div>
    </AbsoluteFill>
  );
};
