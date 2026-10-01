import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { clamp, pop, rand, ramp } from './anim';
import { color, font } from './brand';

// Building blocks the feature videos share, so each one reads as part of a set.

export const Headline: React.FC<{ children: React.ReactNode; at?: number; onDark?: boolean; top?: number }> = ({
  children,
  at = 2,
  onDark = false,
  top = 80,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        left: 120,
        top,
        width: 1680,
        fontFamily: font.serif,
        fontSize: 66,
        lineHeight: 1.1,
        color: onDark ? color.white : color.ink,
        opacity: ramp(frame, at, at + 12),
      }}
    >
      {children}
    </div>
  );
};

export const Eyebrow: React.FC<{ children: React.ReactNode; tone?: string; style?: React.CSSProperties }> = ({
  children,
  tone = color['ink-faint'],
  style,
}) => (
  <div style={{ fontFamily: font.mono, fontSize: 18, letterSpacing: 2, color: tone, textTransform: 'uppercase', ...style }}>
    {children}
  </div>
);

// Grey bars standing in for running text; `seed` keeps each block's widths stable.
export const TextBars: React.FC<{ n: number; seed?: number; tone?: string; height?: number; gap?: number; lit?: number[]; litTone?: string }> = ({
  n,
  seed = 0,
  tone = color['surface-mid'],
  height = 11,
  gap = 13,
  lit = [],
  litTone = color.accent,
}) => (
  <div style={{ display: 'grid', gap }}>
    {Array.from({ length: n }, (_, i) => (
      <div
        key={i}
        style={{
          height,
          width: `${(0.62 + rand(seed * 17 + i) * 0.36) * 100}%`,
          borderRadius: height / 2,
          background: lit.includes(i) ? litTone : tone,
        }}
      />
    ))}
  </div>
);

// A document page: header line, then text. Children render over the text area.
export const DocPage: React.FC<{
  label: string;
  width?: number;
  lines?: number;
  seed?: number;
  lit?: number[];
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ label, width = 420, lines = 12, seed = 0, lit, style, children }) => (
  <div
    style={{
      position: 'relative',
      width,
      padding: '26px 28px',
      background: color.white,
      borderRadius: 8,
      border: `1px solid ${color.border}`,
      boxShadow: '0 16px 40px rgba(15,26,20,0.14)',
      ...style,
    }}
  >
    <div style={{ fontFamily: font.mono, fontSize: 15, letterSpacing: 1, color: color['ink-faint'], marginBottom: 18 }}>{label}</div>
    <TextBars n={lines} seed={seed} lit={lit} />
    {children}
  </div>
);

// A stylised app window. Stylised on purpose: it shows the shape of the idea
// and nothing that dates when the real UI moves.
export const Panel: React.FC<{ style?: React.CSSProperties; children: React.ReactNode; enterAt?: number }> = ({
  style,
  children,
  enterAt = 0,
}) => {
  const frame = useCurrentFrame();
  const s = pop(frame, enterAt);
  return (
    <div
      style={{
        position: 'absolute',
        background: color.white,
        borderRadius: 16,
        border: `1px solid ${color['border-strong']}`,
        boxShadow: '0 24px 60px rgba(15,26,20,0.12)',
        overflow: 'hidden',
        opacity: s,
        transform: `translateY(${(1 - s) * 36}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Chip: React.FC<{ children: React.ReactNode; tone?: 'brand' | 'accent' | 'quiet'; style?: React.CSSProperties }> = ({
  children,
  tone = 'brand',
  style,
}) => {
  const bg = tone === 'brand' ? color.primary : tone === 'accent' ? color.accent : color['surface-warm'];
  const fg = tone === 'quiet' ? color['ink-muted'] : color.white;
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '6px 14px',
        borderRadius: 20,
        background: bg,
        color: fg,
        fontFamily: font.sans,
        fontWeight: 600,
        fontSize: 18,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  );
};

// A pointer that glides from `from` to `to` and clicks at `clickAt`.
export const Cursor: React.FC<{ from: [number, number]; to: [number, number]; moveAt: number; clickAt: number; showAt?: number }> = ({
  from,
  to,
  moveAt,
  clickAt,
  showAt = moveAt - 8,
}) => {
  const frame = useCurrentFrame();
  if (frame < showAt) return null;
  const t = interpolate(frame, [moveAt, clickAt - 4], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
  const x = from[0] + (to[0] - from[0]) * t;
  const y = from[1] + (to[1] - from[1]) * t;
  const ring = ramp(frame, clickAt, clickAt + 12);
  const press = frame >= clickAt && frame < clickAt + 5 ? 0.88 : 1;
  return (
    <>
      {frame >= clickAt ? (
        <div
          style={{
            position: 'absolute',
            left: to[0] - 30,
            top: to[1] - 30,
            width: 60,
            height: 60,
            borderRadius: 30,
            border: `3px solid ${color.accent}`,
            opacity: 1 - ring,
            transform: `scale(${0.4 + ring})`,
          }}
        />
      ) : null}
      <svg
        width="34"
        height="40"
        viewBox="0 0 34 40"
        style={{ position: 'absolute', left: x - 4, top: y - 2, opacity: ramp(frame, showAt, showAt + 6), transform: `scale(${press})` }}
      >
        <path d="M4 2 L4 32 L12 25 L18 38 L24 35 L18 23 L29 23 Z" fill={color.ink} stroke={color.white} strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
    </>
  );
};

// The closing line on a dark field, fading up over whatever is behind it.
export const TitleCard: React.FC<{ at: number; durationInFrames: number; children: React.ReactNode; sub?: React.ReactNode; subAt?: number }> = ({
  at,
  durationInFrames,
  children,
  sub,
  subAt = at + 10,
}) => {
  const frame = useCurrentFrame();
  const o = ramp(frame, at, at + 8);
  if (o === 0) return null;
  return (
    <AbsoluteFill style={{ background: color.dark, opacity: o, justifyContent: 'center', alignItems: 'center', padding: '0 140px' }}>
      <div
        style={{
          fontFamily: font.serif,
          fontStyle: 'italic',
          fontSize: 104,
          lineHeight: 1.1,
          textAlign: 'center',
          color: color.white,
          transform: `scale(${0.96 + 0.04 * ramp(frame, at, durationInFrames)})`,
        }}
      >
        {children}
      </div>
      {sub ? (
        <div style={{ marginTop: 34, fontFamily: font.sans, fontSize: 32, color: color['surface-mid'], opacity: ramp(frame, subAt, subAt + 12) }}>
          {sub}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
