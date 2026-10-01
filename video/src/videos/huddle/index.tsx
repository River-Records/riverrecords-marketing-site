import React from 'react';
import { NarratedVideo, type VideoDef, type VideoProps } from '../../shared/NarratedVideo';
import narration from './narration.json';
import { Close } from './scenes/Close';
import { Summary } from './scenes/Summary';
import { Active, Falling, Hcc } from './scenes/Tabs';
import { timing } from './timing';

// "Summarization is a tool, not a default." Claims follow /features/huddle/.
export const huddle: VideoDef = {
  slug: 'huddle',
  story: ['summary', 'active', 'falling', 'hcc', 'close'],
  scenes: { summary: Summary, active: Active, falling: Falling, hcc: Hcc, close: Close },
  narration,
  timing,
  ctas: ['trial', 'demo'],
};

export const Huddle: React.FC<VideoProps> = (props) => <NarratedVideo def={huddle} {...props} />;
