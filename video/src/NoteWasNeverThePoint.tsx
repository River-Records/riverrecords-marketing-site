import React, { useEffect, useState } from 'react';
import { AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile, useCurrentFrame } from 'remotion';
import '@fontsource/fraunces/400.css';
import '@fontsource/fraunces/400-italic.css';
import '@fontsource/inter-tight/400.css';
import '@fontsource/inter-tight/500.css';
import '@fontsource/inter-tight/600.css';
import '@fontsource/jetbrains-mono/400.css';
import { Captions } from './components/Captions';
import { fadeIn } from './components/anim';
import { CTAS, type CtaKey } from './config/cta';
import narration from './config/narration.json';
import { Drowning } from './scenes/Drowning';
import { EndCard } from './scenes/EndCard';
import { Inheritance } from './scenes/Inheritance';
import { Library } from './scenes/Library';
import { ProblemUnit } from './scenes/ProblemUnit';
import { StreamView } from './scenes/StreamView';
import { CTA_HOLD, FPS, LEAD, STORY, sceneFrames } from './timing';

export type Props = { cta: CtaKey; captions: boolean };

const SCENES: Record<(typeof STORY)[number], React.FC<{ durationInFrames: number }>> = {
  drowning: Drowning,
  inheritance: Inheritance,
  unit: ProblemUnit,
  aside: Library,
  stream: StreamView,
};

const textFor = (id: string) => {
  const line = narration.lines.find((l) => l.id === id);
  if (!line) throw new Error(`narration.json has no line "${id}"`);
  return line.text;
};

export const timeline = (cta: CtaKey) => {
  let from = 0;
  const parts = [...STORY, CTAS[cta].narrationId].map((id, i) => {
    const durationInFrames = i < STORY.length ? sceneFrames(id) : sceneFrames(id, CTA_HOLD);
    const part = { id, from, durationInFrames };
    from += durationInFrames;
    return part;
  });
  return { parts, total: from };
};

const FadeIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: fadeIn(frame) }}>{children}</AbsoluteFill>;
};

// Fontsource declares the faces; this holds the render until they are loaded, or
// the first frames would draw in a fallback font.
const useFonts = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(
      ['400 40px "Fraunces"', 'italic 400 40px "Fraunces"', '400 40px "Inter Tight"', '500 40px "Inter Tight"',
        '600 40px "Inter Tight"', '400 40px "JetBrains Mono"'].map((f) => document.fonts.load(f)),
    ).then(() => continueRender(handle));
  }, [handle]);
};

export const NoteWasNeverThePoint: React.FC<Props> = ({ cta, captions }) => {
  useFonts();
  const { parts } = timeline(cta);
  return (
    <AbsoluteFill>
      {parts.map(({ id, from, durationInFrames }) => {
        const Scene = SCENES[id as keyof typeof SCENES];
        return (
          <Sequence key={id} from={from} durationInFrames={durationInFrames} name={id}>
            <FadeIn>{Scene ? <Scene durationInFrames={durationInFrames} /> : <EndCard cta={CTAS[cta]} />}</FadeIn>
            <Sequence from={Math.round(LEAD * FPS)} layout="none">
              <Audio src={staticFile(`narration/${id}.wav`)} />
            </Sequence>
            {captions ? <Captions id={id} text={textFor(id)} /> : null}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
