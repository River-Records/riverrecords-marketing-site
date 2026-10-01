import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { pop, ramp } from '../../../shared/anim';
import { color, font } from '../../../shared/brand';
import { Chip, Eyebrow, Headline, Panel } from '../../../shared/ui';
import { cue } from '../timing';

const EXISTING = [
  { text: 'Obtain UACR — annual screen', state: 'Done' },
  { text: 'Retinal exam — overdue 6 months', state: 'Snoozed' },
];

export const Tasks: React.FC = () => {
  const frame = useCurrentFrame();
  const sweep = ramp(frame, cue('tasks', 0.18), cue('tasks', 0.42));
  const task = pop(frame, cue('tasks', 0.56));
  return (
    <AbsoluteFill style={{ background: color.surface }}>
      <Headline>Said out loud. Tracked under the problem.</Headline>

      <div style={{ position: 'absolute', left: 120, top: 300, width: 700 }}>
        <Eyebrow>In the visit</Eyebrow>
        <div
          style={{
            marginTop: 18,
            padding: '30px 34px',
            borderRadius: 14,
            background: color.white,
            border: `1px solid ${color.border}`,
            fontFamily: font.serif,
            fontSize: 44,
            lineHeight: 1.3,
            color: color.ink,
          }}
        >
          “Everything looks good. Let’s{' '}
          <span
            style={{
              backgroundImage: `linear-gradient(${color['accent-light']}, ${color['accent-light']})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: `${sweep * 100}% 100%`,
              borderRadius: 6,
              padding: '0 4px',
            }}
          >
            recheck the A1c in three months
          </span>
          .”
        </div>
      </div>

      <Panel enterAt={4} style={{ left: 940, top: 300, width: 860, padding: '30px 36px' }}>
        <Eyebrow>Type 2 diabetes · tasks</Eyebrow>
        <div style={{ marginTop: 20, display: 'grid', gap: 12 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              padding: '18px 22px',
              borderRadius: 10,
              background: color['primary-light'],
              border: `2px solid ${color.accent}`,
              opacity: task,
              transform: `translateY(${(1 - task) * -24}px)`,
            }}
          >
            <div style={{ width: 26, height: 26, borderRadius: 6, border: `3px solid ${color.primary}` }} />
            <div style={{ flex: 1, fontFamily: font.sans, fontSize: 27, color: color.ink }}>Recheck A1c · due Dec 2026</div>
            <Chip tone="accent">From today’s plan</Chip>
          </div>
          {EXISTING.map((t) => (
            <div
              key={t.text}
              style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 22px', borderRadius: 10, background: color.white, border: `1px solid ${color.border}` }}
            >
              <div style={{ width: 26, height: 26, borderRadius: 6, border: `3px solid ${color['ink-faint']}`, background: t.state === 'Done' ? color['ink-faint'] : 'transparent' }} />
              <div style={{ flex: 1, fontFamily: font.sans, fontSize: 25, color: color['ink-muted'] }}>{t.text}</div>
              <Chip tone="quiet">{t.state}</Chip>
            </div>
          ))}
        </div>
      </Panel>
    </AbsoluteFill>
  );
};
