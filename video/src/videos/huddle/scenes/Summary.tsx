import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ramp } from '../../../shared/anim';
import { color } from '../../../shared/brand';
import { Eyebrow, Headline, TextBars } from '../../../shared/ui';
import { cue } from '../timing';

// The thing Huddle is not: a wall of generated summary scrolling past.
export const Summary: React.FC = () => {
  const frame = useCurrentFrame();
  const scroll = frame * 6;
  const blur = 3 * ramp(frame, cue('summary', 0.72), cue('summary', 0.85));
  return (
    <AbsoluteFill style={{ background: color.dark }}>
      <Headline onDark>Eighteen months, compressed and paraphrased.</Headline>
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 220,
          width: 1680,
          height: 640,
          borderRadius: 16,
          background: color['dark-mid'],
          border: `1px solid ${color['ink-faint']}`,
          overflow: 'hidden',
          opacity: ramp(frame, 0, 10),
        }}
      >
        <div style={{ padding: '26px 40px', borderBottom: `1px solid ${color['ink-faint']}`, background: color['dark-mid'], position: 'relative', zIndex: 1 }}>
          <Eyebrow tone={color['accent-light']}>AI summary · last 18 months · generated</Eyebrow>
        </div>
        <div style={{ padding: '0 40px', transform: `translateY(${-scroll}px)`, filter: `blur(${blur}px)` }}>
          {Array.from({ length: 22 }, (_, i) => (
            <div key={i} style={{ marginTop: 34 }}>
              <TextBars n={5} seed={i + 90} tone="rgba(250,247,240,0.22)" height={12} gap={14} />
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
