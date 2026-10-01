import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { Captions } from './Captions';
import { fadeIn } from './anim';
import { type CtaKey, type CtaOverrides, assertTrialLine, resolveCta } from './cta';
import { EndCard } from './EndCard';
import { useFonts } from './fonts';
import { CTA_HOLD, FPS, LEAD, type Timing } from './timing';

export type Narration = { lines: { id: string; text: string }[] };
export type SceneProps = { durationInFrames: number };

// Everything one narrated video needs: its slug (folder for audio), the story
// line ids in order, a scene per line, and its narration and timing.
export type VideoDef = {
  slug: string;
  story: string[];
  scenes: Record<string, React.FC<SceneProps>>;
  narration: Narration;
  timing: Timing;
  ctas: CtaKey[];
  ctaOverrides?: CtaOverrides;
};

export type VideoProps = { cta: CtaKey; captions: boolean };

export const timeline = (def: VideoDef, cta: CtaKey) => {
  if (!def.ctas.includes(cta)) throw new Error(`${def.slug} has no "${cta}" ending; it offers ${def.ctas.join(', ')}`);
  assertTrialLine(def.narration, def.slug);
  let from = 0;
  const parts = [...def.story, `cta-${cta}`].map((id, i) => {
    const durationInFrames = i < def.story.length ? def.timing.sceneFrames(id) : def.timing.sceneFrames(id, CTA_HOLD);
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

export const NarratedVideo: React.FC<VideoProps & { def: VideoDef }> = ({ def, cta, captions }) => {
  useFonts();
  const { parts } = timeline(def, cta);
  const textFor = (id: string) => {
    const line = def.narration.lines.find((l) => l.id === id);
    if (!line) throw new Error(`${def.slug}/narration.json has no line "${id}"`);
    return line.text;
  };
  return (
    <AbsoluteFill>
      {parts.map(({ id, from, durationInFrames }) => {
        const Scene = def.scenes[id];
        return (
          <Sequence key={id} from={from} durationInFrames={durationInFrames} name={id}>
            <FadeIn>
              {Scene ? <Scene durationInFrames={durationInFrames} /> : <EndCard cta={resolveCta(cta, def.ctaOverrides)} />}
            </FadeIn>
            <Sequence from={Math.round(LEAD * FPS)} layout="none">
              <Audio src={staticFile(`narration/${def.slug}/${id}.wav`)} />
            </Sequence>
            {captions ? <Captions seconds={def.timing.lineSeconds(id)} text={textFor(id)} /> : null}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
