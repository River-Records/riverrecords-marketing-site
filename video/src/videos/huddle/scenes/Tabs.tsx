import React from 'react';
import { AbsoluteFill } from 'remotion';
import { color } from '../../../shared/brand';
import { Headline } from '../../../shared/ui';
import { HuddleScreen } from '../HuddleScreen';
import { cue } from '../timing';

// The narration names each lens; its cards land on those words.
export const Active: React.FC = () => (
  <AbsoluteFill style={{ background: color.surface }}>
    <Headline>What you’ve been working on.</Headline>
    <HuddleScreen tab="active" cardsAt={cue('active', 0.42)} enterAt={cue('active', 0.05)} />
  </AbsoluteFill>
);

export const Falling: React.FC = () => (
  <AbsoluteFill style={{ background: color.surface }}>
    <Headline>What’s falling off.</Headline>
    <HuddleScreen tab="falling" from="active" cardsAt={cue('falling', 0.3)} />
  </AbsoluteFill>
);

export const Hcc: React.FC = () => (
  <AbsoluteFill style={{ background: color.surface }}>
    <Headline>What hasn’t been captured this year.</Headline>
    <HuddleScreen tab="hcc" from="falling" cardsAt={cue('hcc', 0.3)} />
  </AbsoluteFill>
);
