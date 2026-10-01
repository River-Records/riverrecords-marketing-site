import React from 'react';
import { NarratedVideo, type VideoDef, type VideoProps } from '../../shared/NarratedVideo';
import narration from './narration.json';
import { Fanout } from './scenes/Fanout';
import { Fax } from './scenes/Fax';
import { Provenance } from './scenes/Provenance';
import { Read } from './scenes/Read';
import { timing } from './timing';

// "Filed is where information goes to be forgotten." Claims follow /intake/.
// Demo, not trial: Inlet is a metered add-on, and /intake/ leads with Book a demo.
export const inlet: VideoDef = {
  slug: 'inlet',
  story: ['fax', 'read', 'fanout', 'provenance'],
  scenes: { fax: Fax, read: Read, fanout: Fanout, provenance: Provenance },
  narration,
  timing,
  ctas: ['demo'],
  ctaOverrides: {
    demo: { headline: 'See Inlet on your own documents.', sub: 'Keep your fax number · Book a demo' },
  },
};

export const Inlet: React.FC<VideoProps> = (props) => <NarratedVideo def={inlet} {...props} />;
