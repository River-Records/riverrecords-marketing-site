import React from 'react';
import { NarratedVideo, type VideoDef, type VideoProps } from '../../shared/NarratedVideo';
import narration from './narration.json';
import { Close } from './scenes/Close';
import { Pile } from './scenes/Pile';
import { Structure } from './scenes/Structure';
import { Tasks } from './scenes/Tasks';
import { Thread } from './scenes/Thread';
import { timing } from './timing';

// "Most scribes stop at the note." Claims follow /features/ and the FAQ.
export const scribe: VideoDef = {
  slug: 'scribe',
  story: ['pile', 'structure', 'thread', 'tasks', 'close'],
  scenes: { pile: Pile, structure: Structure, thread: Thread, tasks: Tasks, close: Close },
  narration,
  timing,
  ctas: ['trial', 'demo'],
};

export const Scribe: React.FC<VideoProps> = (props) => <NarratedVideo def={scribe} {...props} />;
