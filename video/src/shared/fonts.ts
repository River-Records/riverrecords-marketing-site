import { useEffect, useState } from 'react';
import { continueRender, delayRender } from 'remotion';
import '@fontsource/fraunces/400.css';
import '@fontsource/fraunces/400-italic.css';
import '@fontsource/inter-tight/400.css';
import '@fontsource/inter-tight/500.css';
import '@fontsource/inter-tight/600.css';
import '@fontsource/jetbrains-mono/400.css';

// Fontsource declares the faces; this holds the render until they are loaded, or
// the first frames would draw in a fallback font.
export const useFonts = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(
      ['400 40px "Fraunces"', 'italic 400 40px "Fraunces"', '400 40px "Inter Tight"', '500 40px "Inter Tight"',
        '600 40px "Inter Tight"', '400 40px "JetBrains Mono"'].map((f) => document.fonts.load(f)),
    ).then(() => continueRender(handle));
  }, [handle]);
};
