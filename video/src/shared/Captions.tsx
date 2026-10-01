import React from 'react';
import { useCurrentFrame } from 'remotion';
import { color, font } from './brand';
import { FPS, LEAD } from './timing';

// Short phrases, split at punctuation, each timed in proportion to its length.
// Good enough for a single narrator at a steady pace; swap for word timings if a
// recording is ever uneven.
const chunk = (text: string): string[] => {
  const phrases = text.match(/[^.,:;—?!]+[.,:;—?!]*/g) ?? [text];
  const out: string[] = [];
  for (const p of phrases.map((s) => s.trim()).filter(Boolean)) {
    const words = p.split(' ');
    for (let i = 0; i < words.length; i += 9) out.push(words.slice(i, i + 9).join(' '));
  }
  return out;
};

export const Captions: React.FC<{ seconds: number; text: string }> = ({ seconds, text }) => {
  const frame = useCurrentFrame();
  const chunks = chunk(text);
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const start = LEAD * FPS;
  const span = seconds * FPS;
  let at = start;
  let current: string | null = null;
  for (const c of chunks) {
    const len = (c.length / total) * span;
    if (frame >= at && frame < at + len) current = c;
    at += len;
  }
  if (!current) return null;
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 56,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          maxWidth: 1500,
          padding: '14px 30px',
          borderRadius: 14,
          background: 'rgba(15, 26, 20, 0.8)',
          color: color.white,
          fontFamily: font.sans,
          fontWeight: 500,
          fontSize: 40,
          lineHeight: 1.3,
          textAlign: 'center',
        }}
      >
        {current}
      </div>
    </div>
  );
};
