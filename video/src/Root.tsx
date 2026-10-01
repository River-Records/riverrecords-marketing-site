import React from 'react';
import { Composition } from 'remotion';
import { type VideoDef, type VideoProps, timeline } from './shared/NarratedVideo';
import { FPS } from './shared/timing';
import { Huddle, huddle } from './videos/huddle';
import { Inlet, inlet } from './videos/inlet';
import { NoteWasNeverThePoint, noteWasNeverThePoint } from './videos/note-was-never-the-point';
import { Scribe, scribe } from './videos/scribe';

// One entry per video. `id` is the composition name used by `npm run render`.
const VIDEOS: { id: string; def: VideoDef; component: React.FC<VideoProps>; cta: VideoProps['cta'] }[] = [
  { id: 'NoteWasNeverThePoint', def: noteWasNeverThePoint, component: NoteWasNeverThePoint, cta: 'trial' },
  { id: 'Scribe', def: scribe, component: Scribe, cta: 'trial' },
  { id: 'Huddle', def: huddle, component: Huddle, cta: 'trial' },
  { id: 'Inlet', def: inlet, component: Inlet, cta: 'demo' },
];

export const Root: React.FC = () => (
  <>
    {VIDEOS.map(({ id, def, component, cta }) => (
      <Composition
        key={id}
        id={id}
        component={component}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={timeline(def, cta).total}
        defaultProps={{ cta, captions: true } satisfies VideoProps}
        calculateMetadata={({ props }) => ({ durationInFrames: timeline(def, props.cta).total })}
      />
    ))}
  </>
);
