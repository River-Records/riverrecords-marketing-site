import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { pop, ramp } from '../../../shared/anim';
import { color, font } from '../../../shared/brand';
import { Chip, Eyebrow, Headline, Panel } from '../../../shared/ui';
import { cue } from '../timing';

const EARLIER = [
  { date: 'OCT 2025', text: 'A1c 8.6. Start metformin 500 mg.' },
  { date: 'JAN 2026', text: 'A1c 8.1. Increase metformin to 1000 mg.', decision: true },
  { date: 'JUN 2026', text: 'eGFR stable at 52. Metformin dose appropriate.' },
];

const Row: React.FC<{ date: string; text: string; tone: 'plain' | 'decision' | 'today'; style?: React.CSSProperties; right?: React.ReactNode }> = ({
  date,
  text,
  tone,
  style,
  right,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 28,
      padding: '20px 24px',
      borderRadius: 10,
      background: tone === 'today' ? color['primary-light'] : color.white,
      border: `2px solid ${tone === 'decision' ? color.primary : 'transparent'}`,
      borderLeft: `6px solid ${tone === 'today' ? color.accent : tone === 'decision' ? color.primary : color.border}`,
      ...style,
    }}
  >
    <div style={{ width: 130, fontFamily: font.mono, fontSize: 18, color: tone === 'today' ? color.accent : color['ink-faint'] }}>{date}</div>
    <div style={{ flex: 1, fontFamily: font.sans, fontSize: 27, color: color.ink }}>{text}</div>
    {right}
  </div>
);

export const Thread: React.FC = () => {
  const frame = useCurrentFrame();
  const today = pop(frame, cue('thread', 0.18));
  const decided = frame >= cue('thread', 0.5);
  const changed = ramp(frame, cue('thread', 0.78), cue('thread', 0.86));
  return (
    <AbsoluteFill style={{ background: color.surface }}>
      <Headline>Each plan joins its problem’s thread.</Headline>
      <Panel style={{ left: 120, top: 220, width: 1680, padding: '34px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 22 }}>
          <div style={{ fontFamily: font.serif, fontSize: 46, color: color.ink }}>Type 2 diabetes</div>
          <Eyebrow>One thread · every visit</Eyebrow>
        </div>
        <div style={{ marginTop: 26, display: 'grid', gap: 12 }}>
          {EARLIER.map((e) => (
            <Row
              key={e.date}
              date={e.date}
              text={e.text}
              tone={e.decision && decided ? 'decision' : 'plain'}
              right={e.decision ? <Chip tone="quiet" style={{ opacity: decided ? 1 : 0 }}>What you decided</Chip> : null}
            />
          ))}
          <Row
            date="TODAY"
            text="A1c 7.4, improved. Continue metformin 1000 mg."
            tone="today"
            style={{ opacity: today, transform: `translateX(${(1 - today) * 80}px)` }}
            right={<Chip tone="accent" style={{ opacity: changed }}>Changed: A1c 8.1 → 7.4</Chip>}
          />
        </div>
      </Panel>
    </AbsoluteFill>
  );
};
