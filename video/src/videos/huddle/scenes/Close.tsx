import React from 'react';
import { AbsoluteFill } from 'remotion';
import type { SceneProps } from '../../../shared/NarratedVideo';
import { TitleCard } from '../../../shared/ui';
import { cue } from '../timing';

export const Close: React.FC<SceneProps> = ({ durationInFrames }) => (
  <AbsoluteFill>
    <TitleCard at={0} durationInFrames={durationInFrames} sub="Huddle comes with every Stream subscription." subAt={cue('close', 0.45)}>
      Your own words. Not an AI paraphrase.
    </TitleCard>
  </AbsoluteFill>
);
