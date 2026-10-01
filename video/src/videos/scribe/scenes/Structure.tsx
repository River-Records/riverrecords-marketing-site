import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { pop, ramp } from '../../../shared/anim';
import { color, font } from '../../../shared/brand';
import { Eyebrow, Headline, Panel, TextBars } from '../../../shared/ui';
import { cue } from '../timing';

// What was said, and where each piece lands in the note. `goes` indexes PLAN
// (-1 = subjective/objective).
const SAID = [
  { text: '“Sugars have been better since we went up on the metformin.”', goes: 0 },
  { text: '“BP today is 132 over 84.”', goes: -1 },
  { text: '“My knee still aches on the stairs.”', goes: -1 },
  { text: '“Let’s keep the lisinopril where it is.”', goes: 1 },
  { text: '“I’d like you to try PT for the knee.”', goes: 2 },
];
const PLAN = [
  { title: 'Type 2 diabetes', text: 'A1c 7.4, improved. Continue metformin 1000 mg.' },
  { title: 'Hypertension', text: '132/84 today. Continue lisinopril 10 mg.' },
  { title: 'Osteoarthritis, knee', text: 'Pain on stairs. Refer to physical therapy.' },
];

export const Structure: React.FC = () => {
  const frame = useCurrentFrame();
  const soAt = cue('structure', 0.42);
  const planAt = (i: number) => cue('structure', 0.6 + i * 0.1);
  const landedAt = (goes: number) => (goes < 0 ? soAt : planAt(goes));
  return (
    <AbsoluteFill style={{ background: color.surface }}>
      <Headline>Assessment and plan, split out by problem.</Headline>

      <div style={{ position: 'absolute', left: 120, top: 230, width: 560, display: 'grid', gap: 16 }}>
        <Eyebrow>What was said</Eyebrow>
        {SAID.map((s, i) => {
          const p = pop(frame, 6 + i * 7);
          const lit = frame >= landedAt(s.goes);
          return (
            <div
              key={i}
              style={{
                padding: '14px 20px',
                borderRadius: 12,
                background: color.white,
                border: `2px solid ${lit ? color.accent : color.border}`,
                fontFamily: font.sans,
                fontSize: 24,
                lineHeight: 1.35,
                color: color.ink,
                opacity: p * (lit ? 1 : 0.85),
                transform: `translateX(${(1 - p) * -24}px)`,
              }}
            >
              {s.text}
            </div>
          );
        })}
      </div>

      <Panel enterAt={cue('structure', 0.15)} style={{ left: 760, top: 230, width: 1040, padding: '30px 40px', display: 'grid', gap: 20 }}>
        <div style={{ opacity: ramp(frame, soAt, soAt + 10), display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 34 }}>
          <div>
            <Eyebrow>Subjective</Eyebrow>
            <div style={{ marginTop: 12 }}><TextBars n={2} seed={41} /></div>
          </div>
          <div>
            <Eyebrow>Objective</Eyebrow>
            <div style={{ marginTop: 12 }}><TextBars n={2} seed={42} /></div>
          </div>
        </div>
        <Eyebrow style={{ marginTop: 6, opacity: ramp(frame, planAt(0) - 6, planAt(0)) }}>Assessment &amp; plan</Eyebrow>
        {PLAN.map((p, i) => {
          const s = pop(frame, planAt(i));
          return (
            <div
              key={p.title}
              style={{
                padding: '16px 22px',
                borderRadius: 10,
                background: color['primary-light'],
                borderLeft: `5px solid ${color.primary}`,
                opacity: s,
                transform: `translateY(${(1 - s) * 18}px)`,
              }}
            >
              <div style={{ fontFamily: font.serif, fontSize: 32, color: color.ink }}>{p.title}</div>
              <div style={{ marginTop: 4, fontFamily: font.sans, fontSize: 24, color: color['ink-muted'] }}>{p.text}</div>
            </div>
          );
        })}
      </Panel>
    </AbsoluteFill>
  );
};
