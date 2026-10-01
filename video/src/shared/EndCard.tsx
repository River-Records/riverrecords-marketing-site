import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { color, font } from './brand';
import { pop, ramp } from './anim';
import type { Cta } from './cta';

export const EndCard: React.FC<{ cta: Cta }> = ({ cta }) => {
  const frame = useCurrentFrame();
  const head = pop(frame, 6);
  return (
    <AbsoluteFill style={{ background: color.primary, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, opacity: ramp(frame, 0, 10) }}>
        <div style={{ width: 76, height: 76, borderRadius: 16, background: color.white, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Img src={staticFile('logo-icon.png')} style={{ width: 56, height: 56 }} />
        </div>
        <div style={{ fontFamily: font.sans, fontWeight: 600, fontSize: 36, color: color.white }}>
          Stream <span style={{ opacity: 0.5 }}>·</span> River Records
        </div>
      </div>
      <div
        style={{
          marginTop: 56,
          fontFamily: font.serif,
          fontSize: 104,
          color: color.white,
          opacity: head,
          transform: `translateY(${(1 - head) * 24}px)`,
        }}
      >
        {cta.headline}
      </div>
      <div style={{ marginTop: 22, fontFamily: font.sans, fontSize: 34, color: color['primary-light'], opacity: ramp(frame, 14, 26) }}>
        {cta.sub}
      </div>
      <div
        style={{
          marginTop: 56,
          padding: '18px 40px',
          borderRadius: 999,
          background: color.white,
          fontFamily: font.mono,
          fontSize: 40,
          color: color.primary,
          opacity: ramp(frame, 22, 34),
        }}
      >
        {cta.url}
      </div>
    </AbsoluteFill>
  );
};
