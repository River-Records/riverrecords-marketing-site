import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { pop, ramp } from '../../../shared/anim';
import { color, font } from '../../../shared/brand';
import { Chip, Cursor, DocPage, Eyebrow, Headline, Panel } from '../../../shared/ui';
import { cue } from '../timing';

export const Read: React.FC = () => {
  const frame = useCurrentFrame();
  const scan = ramp(frame, 6, cue('read', 0.38));
  const match = pop(frame, cue('read', 0.48));
  const clickAt = cue('read', 0.86);
  const confirmed = frame >= clickAt + 3;
  return (
    <AbsoluteFill style={{ background: color.surface }}>
      <Headline>Read, matched, and confirmed by a person.</Headline>

      <div style={{ position: 'absolute', left: 120, top: 230 }}>
        <DocPage label="DISCHARGE SUMMARY · p.1 of 6" width={520} lines={16} seed={21}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${8 + scan * 86}%`,
              height: 4,
              background: color.accent,
              boxShadow: `0 0 24px ${color.accent}`,
              opacity: scan > 0 && scan < 1 ? 1 : 0,
            }}
          />
        </DocPage>
        <div style={{ marginTop: 16, fontFamily: font.mono, fontSize: 17, color: color['ink-faint'], opacity: ramp(frame, cue('read', 0.36), cue('read', 0.42)) }}>
          6 pages read · every sentence located
        </div>
      </div>

      <Panel enterAt={cue('read', 0.3)} style={{ left: 780, top: 260, width: 1020, padding: '30px 38px' }}>
        <Eyebrow>Documents · awaiting confirmation</Eyebrow>
        <div style={{ marginTop: 16, fontFamily: font.serif, fontSize: 34, color: color.ink }}>Discharge Summary — Riverside Medical Center, 3/15/26</div>
        <div
          style={{
            marginTop: 26,
            padding: '20px 24px',
            borderRadius: 12,
            background: color['primary-light'],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            opacity: match,
            transform: `translateY(${(1 - match) * 16}px)`,
          }}
        >
          <div>
            <Eyebrow>Proposed match</Eyebrow>
            <div style={{ marginTop: 6, fontFamily: font.sans, fontSize: 28, fontWeight: 600, color: color.ink }}>Maria Rodriguez · 64F · DOB 05/11/1962</div>
            <div style={{ marginTop: 4, fontFamily: font.sans, fontSize: 21, color: color['ink-muted'] }}>Name and date of birth from page 1</div>
          </div>
          {confirmed ? (
            <Chip>Confirmed by front desk ✓</Chip>
          ) : (
            <div style={{ padding: '12px 22px', borderRadius: 10, background: color.primary, color: color.white, fontFamily: font.sans, fontWeight: 600, fontSize: 22 }}>
              Confirm patient
            </div>
          )}
        </div>
      </Panel>
      <Cursor from={[1500, 800]} to={[1690, 475]} moveAt={cue('read', 0.66)} clickAt={clickAt} />
    </AbsoluteFill>
  );
};
