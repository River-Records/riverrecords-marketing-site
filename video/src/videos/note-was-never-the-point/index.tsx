import React from 'react';
import { NarratedVideo, type VideoDef, type VideoProps } from '../../shared/NarratedVideo';
import narration from './narration.json';
import { Drowning } from './scenes/Drowning';
import { Inheritance } from './scenes/Inheritance';
import { Library } from './scenes/Library';
import { ProblemUnit } from './scenes/ProblemUnit';
import { StreamView } from './scenes/StreamView';
import { timing } from './timing';

// The book's thesis in four beats, then the product. See video/README.md.
export const noteWasNeverThePoint: VideoDef = {
  slug: 'note-was-never-the-point',
  story: ['drowning', 'inheritance', 'unit', 'aside', 'stream'],
  scenes: { drowning: Drowning, inheritance: Inheritance, unit: ProblemUnit, aside: Library, stream: StreamView },
  narration,
  timing,
  ctas: ['trial', 'book', 'demo'],
};

export const NoteWasNeverThePoint: React.FC<VideoProps> = (props) => (
  <NarratedVideo def={noteWasNeverThePoint} {...props} />
);
