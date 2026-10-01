import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { clamp, pop } from '../../shared/anim';
import { color, font } from '../../shared/brand';
import { Chip, Eyebrow, Panel } from '../../shared/ui';

export type Tab = 'active' | 'falling' | 'hcc';
const TABS: { key: Tab; label: string }[] = [
  { key: 'active', label: 'Active' },
  { key: 'falling', label: 'Falling off' },
  { key: 'hcc', label: 'HCC' },
];
const TAB_W = 250;

// Sample patient. Fictional and deliberately generic: problem names and plans,
// no diagnosis codes.
const CARDS: Record<Tab, { title: string; meta: string; text: string; tag: string }[]> = {
  active: [
    { title: 'Hypertension', meta: 'Addressed in 3 of the last 3 visits', text: 'BP 128/80 on lisinopril 10 mg. Continue; home readings at goal.', tag: 'Your A&P · Aug 2026' },
    { title: 'Hyperlipidemia', meta: 'Addressed Aug 2026', text: 'LDL 96 on atorvastatin 20 mg. Continue; repeat lipids in 12 months.', tag: 'Your A&P · Aug 2026' },
    { title: 'Prediabetes', meta: 'Addressed Jun 2026', text: 'A1c 6.1. Diet and activity counseling; recheck A1c in 6 months.', tag: 'Your A&P · Jun 2026' },
  ],
  falling: [
    { title: 'Osteopenia', meta: 'Last addressed Oct 2025 · 11 months', text: 'DEXA T-score −1.8. Calcium and vitamin D; repeat DEXA in 2 years.', tag: 'Where you left it' },
    { title: 'Vitamin D deficiency', meta: 'Last addressed Sep 2025 · 12 months', text: '25-OH vitamin D 22. Start D3 2000 IU daily; recheck level.', tag: 'Where you left it' },
  ],
  hcc: [
    { title: 'Morbid obesity', meta: 'BMI 41.2 at last visit', text: 'Documented in 2025. Not yet captured in 2026.', tag: 'Not captured this year' },
    { title: 'Major depressive disorder, recurrent', meta: 'On sertraline 50 mg', text: 'Documented in 2025. Not yet captured in 2026.', tag: 'Not captured this year' },
  ],
};

export const HuddleScreen: React.FC<{ tab: Tab; from?: Tab; cardsAt: number; enterAt?: number }> = ({ tab, from = tab, cardsAt, enterAt }) => {
  const frame = useCurrentFrame();
  const idx = (t: Tab) => TABS.findIndex((x) => x.key === t);
  const slide = interpolate(frame, [2, 14], [idx(from), idx(tab)], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
  return (
    <Panel enterAt={enterAt ?? -100} style={{ left: 120, top: 210, width: 1680, height: 560 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '28px 44px 0' }}>
        <div style={{ fontFamily: font.serif, fontSize: 38, color: color.ink }}>Huddle</div>
        <Eyebrow>Sample patient · 58F · visit today 2:40 pm</Eyebrow>
      </div>
      <div style={{ position: 'relative', display: 'flex', padding: '22px 44px 0', borderBottom: `1px solid ${color.border}` }}>
        {TABS.map((t) => (
          <div
            key={t.key}
            style={{
              width: TAB_W,
              paddingBottom: 16,
              fontFamily: font.sans,
              fontWeight: 600,
              fontSize: 26,
              color: t.key === tab ? color.primary : color['ink-faint'],
            }}
          >
            {t.label}
          </div>
        ))}
        <div style={{ position: 'absolute', left: 44 + slide * TAB_W, bottom: -2, width: TAB_W - 40, height: 5, borderRadius: 3, background: color.primary }} />
      </div>
      <div style={{ padding: '26px 44px', display: 'grid', gap: 16 }}>
        {CARDS[tab].map((c, i) => {
          const s = pop(frame, cardsAt + i * 7);
          return (
            <div
              key={c.title}
              style={{
                display: 'grid',
                gridTemplateColumns: '420px 1fr auto',
                alignItems: 'center',
                gap: 30,
                padding: '20px 26px',
                borderRadius: 12,
                border: `1px solid ${color.border}`,
                borderLeft: `6px solid ${tab === 'active' ? color.primary : color.accent}`,
                background: color.white,
                opacity: s,
                transform: `translateY(${(1 - s) * 20}px)`,
              }}
            >
              <div>
                <div style={{ fontFamily: font.serif, fontSize: 32, color: color.ink }}>{c.title}</div>
                <div style={{ marginTop: 4, fontFamily: font.mono, fontSize: 16, color: color['ink-faint'] }}>{c.meta}</div>
              </div>
              <div style={{ fontFamily: font.sans, fontSize: 25, lineHeight: 1.35, color: color['ink-muted'] }}>{c.text}</div>
              <Chip tone={tab === 'active' ? 'quiet' : 'accent'}>{c.tag}</Chip>
            </div>
          );
        })}
      </div>
    </Panel>
  );
};
