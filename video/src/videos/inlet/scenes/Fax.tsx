import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { clamp, pop, ramp } from '../../../shared/anim';
import { color, font } from '../../../shared/brand';
import { DocPage, Eyebrow, Headline } from '../../../shared/ui';
import { cue } from '../timing';

const STEPS = [
  { label: 'Printed', at: 0.14 },
  { label: 'Scanned', at: 0.2 },
  { label: 'Filed', at: 0.26 },
];

export const Fax: React.FC = () => {
  const frame = useCurrentFrame();
  const arrive = interpolate(frame, [4, 22], [-380, 0], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
  const file = interpolate(frame, [cue('fax', 0.26), cue('fax', 0.36)], [0, 1], { ...clamp, easing: (x) => x * x * (3 - 2 * x) });
  const lost = ramp(frame, cue('fax', 0.46), cue('fax', 0.6));
  const coda = ramp(frame, cue('fax', 0.72), cue('fax', 0.8));
  return (
    <AbsoluteFill style={{ background: color.dark }}>
      <Headline onDark>Filed is where information goes to be forgotten.</Headline>

      <div style={{ position: 'absolute', left: 120, top: 210, display: 'flex', gap: 14 }}>
        {STEPS.map((s) => {
          const on = ramp(frame, cue('fax', s.at), cue('fax', s.at) + 6);
          return (
            <div
              key={s.label}
              style={{
                padding: '8px 18px',
                borderRadius: 20,
                fontFamily: font.mono,
                fontSize: 18,
                letterSpacing: 1,
                color: on > 0.5 ? color.dark : color['surface-mid'],
                background: on > 0.5 ? color['surface-mid'] : 'transparent',
                border: `1px solid ${color['surface-mid']}`,
                opacity: 0.4 + 0.6 * on,
              }}
            >
              {s.label.toUpperCase()}
            </div>
          );
        })}
      </div>

      {/* The folder it disappears into */}
      <div style={{ position: 'absolute', left: 140, top: 620, width: 360, opacity: ramp(frame, cue('fax', 0.22), cue('fax', 0.28)) }}>
        <div style={{ width: 150, height: 34, borderRadius: '10px 10px 0 0', background: color['ink-faint'] }} />
        <div style={{ height: 190, borderRadius: '0 12px 12px 12px', background: color['ink-faint'], display: 'flex', alignItems: 'flex-end', padding: 22 }}>
          <Eyebrow tone={color.white}>Scanned documents</Eyebrow>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: interpolate(file, [0, 1], [560, 200]),
          top: interpolate(file, [0, 1], [300 + arrive, 640]),
          transform: `scale(${interpolate(file, [0, 1], [1, 0.42])})`,
          transformOrigin: 'top left',
          opacity: 1 - ramp(frame, cue('fax', 0.34), cue('fax', 0.38)),
        }}
      >
        <DocPage label="FAX · CARDIOLOGY CONSULT · p.1/4" width={460} lines={12} seed={7} lit={[5]}>
          <div style={{ position: 'absolute', left: 'calc(100% + 18px)', top: 166, display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>
            <div style={{ width: 28, height: 3, background: color['accent-light'] }} />
            <span style={{ fontFamily: font.sans, fontSize: 26, color: color['accent-light'] }}>A1c 8.9%</span>
          </div>
        </DocPage>
      </div>

      {/* Where it was needed */}
      <div
        style={{
          position: 'absolute',
          left: 1180,
          top: 360,
          width: 620,
          padding: '28px 32px',
          borderRadius: 14,
          background: color.white,
          opacity: ramp(frame, cue('fax', 0.4), cue('fax', 0.46)),
        }}
      >
        <Eyebrow>Type 2 diabetes · plan</Eyebrow>
        <div style={{ marginTop: 14, fontFamily: font.sans, fontSize: 27, color: color.ink }}>Last A1c 7.9 (Mar 2026). Continue metformin.</div>
        <div
          style={{
            marginTop: 18,
            padding: '12px 16px',
            borderRadius: 8,
            border: `2px dashed ${color.accent}`,
            fontFamily: font.sans,
            fontSize: 24,
            color: color.accent,
            opacity: 1 - lost,
          }}
        >
          A1c 8.9% · cardiology consult, Aug 2026
        </div>
        <div style={{ marginTop: 10, fontFamily: font.mono, fontSize: 16, color: color['ink-faint'], opacity: lost }}>NEVER ARRIVED</div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 1180,
          top: 700,
          width: 620,
          fontFamily: font.serif,
          fontStyle: 'italic',
          fontSize: 40,
          lineHeight: 1.25,
          color: color['accent-light'],
          opacity: coda,
          transform: `translateY(${(1 - pop(frame, cue('fax', 0.72))) * 10}px)`,
        }}
      >
        Everyone did their job. The information is still gone.
      </div>
    </AbsoluteFill>
  );
};
