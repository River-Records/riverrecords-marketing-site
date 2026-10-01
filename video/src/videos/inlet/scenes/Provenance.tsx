import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { pop, ramp } from '../../../shared/anim';
import { color, font } from '../../../shared/brand';
import { Chip, Cursor, Eyebrow, Headline, Panel, TextBars } from '../../../shared/ui';
import { cue } from '../timing';

export const Provenance: React.FC = () => {
  const frame = useCurrentFrame();
  const clickAt = cue('provenance', 0.22);
  const open = pop(frame, clickAt + 2);
  const human = ramp(frame, cue('provenance', 0.62), cue('provenance', 0.7));
  return (
    <AbsoluteFill style={{ background: color.surface }}>
      <Headline>One click from the sentence it came from.</Headline>

      <Panel style={{ left: 120, top: 260, width: 760, padding: '28px 34px' }}>
        <div style={{ fontFamily: font.serif, fontSize: 38, color: color.ink }}>Chronic kidney disease</div>
        <div
          style={{
            marginTop: 20,
            padding: '18px 22px',
            borderRadius: 10,
            background: frame >= clickAt ? color['primary-light'] : color.surface,
            border: `2px solid ${frame >= clickAt ? color.primary : color.border}`,
          }}
        >
          <div style={{ fontFamily: font.sans, fontSize: 27, color: color.ink }}>eGFR 58, down from 64</div>
          <Eyebrow style={{ marginTop: 6, fontSize: 15 }}>Excerpt · Riverside discharge · p.3</Eyebrow>
        </div>
        <div style={{ marginTop: 26, opacity: human }}>
          <Chip>Reviewed and confirmed before filing</Chip>
        </div>
      </Panel>
      <Cursor from={[700, 760]} to={[420, 420]} moveAt={4} clickAt={clickAt} />

      <div
        style={{
          position: 'absolute',
          left: 980,
          top: 230,
          width: 820,
          padding: '28px 34px',
          background: color.white,
          borderRadius: 8,
          border: `1px solid ${color.border}`,
          boxShadow: '0 16px 40px rgba(15,26,20,0.14)',
          opacity: open,
          transform: `scale(${0.92 + 0.08 * open})`,
          transformOrigin: 'left center',
        }}
      >
        <Eyebrow style={{ fontSize: 15 }}>Discharge summary · Riverside Medical Center · p.3 of 6</Eyebrow>
        <div style={{ marginTop: 20 }}><TextBars n={5} seed={61} /></div>
        <div
          style={{
            margin: '16px -10px',
            padding: '10px 12px',
            borderRadius: 6,
            background: color['accent-light'],
            fontFamily: font.serif,
            fontSize: 27,
            lineHeight: 1.35,
            color: color.ink,
          }}
        >
          Renal function: eGFR 58 mL/min/1.73m², down from 64 in January.
        </div>
        <TextBars n={6} seed={62} />
      </div>
    </AbsoluteFill>
  );
};
