import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { pop, ramp } from '../../../shared/anim';
import { color, font } from '../../../shared/brand';
import { DocPage, Eyebrow, Headline } from '../../../shared/ui';
import { cue } from '../timing';

// The same fan-out /intake/ draws. CKD is left unstaged: eGFR 58 is G3a, and a
// stage that disagrees with its own number is the kind of thing this audience sees.
export const EXCERPTS = [
  { problem: 'Type 2 diabetes', text: 'A1c 9.1% on admission' },
  { problem: 'Hypertension', text: 'Amlodipine 5 mg added' },
  { problem: 'Chronic kidney disease', text: 'eGFR 58, down from 64' },
];
const ROW_Y = (i: number) => 300 + i * 190;
const DOC_EDGE: [number, number] = [640, 500];
const ROW_X = 980;

export const Fanout: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = ramp(frame, cue('fanout', 0.4), cue('fanout', 0.62));
  return (
    <AbsoluteFill style={{ background: color.surface }}>
      <Headline>One document. Three problems. Three excerpts.</Headline>
      <div style={{ position: 'absolute', left: 120, top: 300, opacity: ramp(frame, 2, 12) }}>
        <DocPage label="DISCHARGE SUMMARY · RIVERSIDE · 3/15/26" width={520} lines={14} seed={21} />
      </div>
      <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
        {EXCERPTS.map((_, i) => {
          const [x0, y0] = DOC_EDGE;
          const y1 = ROW_Y(i) + 56;
          const d = `M ${x0} ${y0} C ${x0 + 200} ${y0}, ${ROW_X - 200} ${y1}, ${ROW_X} ${y1}`;
          return <path key={i} d={d} fill="none" stroke={color.primary} strokeWidth={4} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />;
        })}
      </svg>
      {EXCERPTS.map((e, i) => {
        const s = pop(frame, cue('fanout', 0.5) + i * 6);
        return (
          <div
            key={e.problem}
            style={{
              position: 'absolute',
              left: ROW_X,
              top: ROW_Y(i),
              width: 820,
              padding: '20px 28px',
              borderRadius: 12,
              background: color.white,
              border: `1px solid ${color.border}`,
              borderLeft: `6px solid ${color.primary}`,
              opacity: s,
              transform: `translateX(${(1 - s) * 30}px)`,
            }}
          >
            <div style={{ fontFamily: font.serif, fontSize: 34, color: color.ink }}>{e.problem}</div>
            <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 20 }}>
              <span style={{ fontFamily: font.sans, fontSize: 26, color: color['ink-muted'] }}>{e.text}</span>
              <Eyebrow style={{ fontSize: 15 }}>Excerpt · Riverside discharge</Eyebrow>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
