import React from 'react';
import { AbsoluteFill } from 'remotion';
import type { SceneProps } from '../../../shared/NarratedVideo';
import { TitleCard } from '../../../shared/ui';

export const Close: React.FC<SceneProps> = ({ durationInFrames }) => (
  <AbsoluteFill>
    <TitleCard at={0} durationInFrames={durationInFrames}>
      A scribe that builds the chart, not just the note.
    </TitleCard>
  </AbsoluteFill>
);
