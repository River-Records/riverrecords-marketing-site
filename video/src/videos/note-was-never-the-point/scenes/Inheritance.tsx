import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { color, font } from '../../../shared/brand';
import { clamp, pop, rand, ramp } from '../../../shared/anim';
import { cue } from '../timing';

const PAGES = 8;
const LINES = 9;
// Each page's line widths — later pages reuse earlier lines, which is the point.
const widths = Array.from({ length: LINES }, (_, j) => 0.55 + rand(j + 300) * 0.4);

const Page: React.FC<{ p: number; frame: number }> = ({ p, frame }) => {
  const at = cue('inheritance', 0.05) + p * 4;
  const s = pop(frame, at);
  const dupStart = cue('inheritance', 0.6) + p * 5;
  return (
    <div
      style={{
        width: 190,
        height: 250,
        padding: '18px 18px',
        background: color.white,
        border: `1px solid ${color.border}`,
        borderRadius: 6,
        boxShadow: '0 6px 16px rgba(15,26,20,0.08)',
        opacity: s,
        transform: `translateY(${(1 - s) * 30}px)`,
      }}
    >
      <div style={{ fontFamily: font.mono, fontSize: 13, color: color['ink-faint'] }}>
        VISIT {String(p + 1).padStart(2, '0')}
      </div>
      {widths.map((w, j) => {
        // First page is original; afterwards roughly half the lines are carried copies.
        const dup = p > 0 && rand(p * 31 + j) < 0.52;
        const lit = dup ? ramp(frame, dupStart + j * 2, dupStart + j * 2 + 8) : 0;
        return (
          <div
            key={j}
            style={{
              height: 10,
              marginTop: 12,
              width: `${w * 100}%`,
              borderRadius: 5,
              background: lit > 0 ? color.accent : color['surface-mid'],
              opacity: lit > 0 ? 0.35 + 0.65 * lit : 1,
            }}
          />
        );
      })}
    </div>
  );
};

export const Inheritance: React.FC = () => {
  const frame = useCurrentFrame();
  const count = interpolate(frame, [cue('inheritance', 0.58), cue('inheritance', 0.78)], [0, 104], clamp);
  const stat = ramp(frame, cue('inheritance', 0.56), cue('inheritance', 0.62));
  const half = ramp(frame, cue('inheritance', 0.86), cue('inheritance', 0.92));
  return (
    <AbsoluteFill style={{ background: color.surface }}>
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 90,
          fontFamily: font.serif,
          fontSize: 66,
          color: color.ink,
          opacity: ramp(frame, 2, 14),
        }}
      >
        One note per visit. The whole story, retold.
      </div>
      <div style={{ position: 'absolute', left: 120, top: 250, display: 'flex', gap: 22 }}>
        {Array.from({ length: PAGES }, (_, p) => (
          <Page key={p} p={p} frame={frame} />
        ))}
      </div>
      <div style={{ position: 'absolute', left: 120, top: 590, display: 'flex', gap: 140, opacity: stat }}>
        <div>
          <div style={{ fontFamily: font.serif, fontSize: 110, color: color.ink }}>{Math.round(count)} million</div>
          <div style={{ fontFamily: font.sans, fontSize: 30, color: color['ink-muted'] }}>notes analyzed</div>
        </div>
        <div style={{ opacity: half }}>
          <div style={{ fontFamily: font.serif, fontSize: 110, color: color.accent }}>50%</div>
          <div style={{ fontFamily: font.sans, fontSize: 30, color: color['ink-muted'] }}>
            of the text duplicated from earlier notes
          </div>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 800,
          fontFamily: font.mono,
          fontSize: 17,
          color: color['ink-faint'],
          opacity: stat,
        }}
      >
        Steinkamp, Kantrowitz &amp; Airan-Javia · JAMA Network Open, 2022
      </div>
    </AbsoluteFill>
  );
};
