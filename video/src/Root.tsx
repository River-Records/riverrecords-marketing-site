import React from 'react';
import { Composition } from 'remotion';
import { NoteWasNeverThePoint, timeline, type Props } from './NoteWasNeverThePoint';
import { FPS } from './timing';

export const Root: React.FC = () => (
  <Composition
    id="NoteWasNeverThePoint"
    component={NoteWasNeverThePoint}
    width={1920}
    height={1080}
    fps={FPS}
    durationInFrames={timeline('trial').total}
    defaultProps={{ cta: 'trial', captions: true } satisfies Props}
    calculateMetadata={({ props }) => ({ durationInFrames: timeline(props.cta).total })}
  />
);
