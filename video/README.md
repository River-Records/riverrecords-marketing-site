# Videos

Code-built videos (Remotion) for the site and social. Separate package from the
Astro site: nothing here is part of `npm run build` or the Cloudflare deploy.

## "The Note Was Never the Point" — differentiator master

About 63s, 1920×1080, burned-in captions. It follows the book in four beats: time spent
in the EHR (Arndt 2017), the paper inheritance and 50% duplication (our JAMA
Network Open study), problems as the unit, and a stylised Stream problem view.
It closes on the title line and an end card.

```bash
cd video
npm install
npm run studio   # preview and scrub in the browser
npm run render   # → out/note-was-never-the-point.mp4
```

`render` finishes with a loudness pass (`npm run loudness`, -16 LUFS, -1.5 dBTP —
the usual web/social target). Without it the TTS voice lands around -26 dB and is
easy to mistake for no audio at all on a player that opens quiet or muted.

In a cloud session or CI, point Remotion at the preinstalled Chromium:
`REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`.

### Switching the call to action

`src/config/cta.ts` holds `trial` (default), `book` and `demo`. Pick one in the
Studio sidebar, or on render:

```bash
npx remotion render NoteWasNeverThePoint out/book.mp4 --props='{"cta":"book","captions":true}'
```

The end card, its narration line and the video's length all follow the key. The
trial length is read from `src/config/pricing.ts`. If it changes, the render fails
until the spoken `cta-trial` line is updated to match, so a voice can't say a
different number from the card.

### Narration

`src/config/narration.json` is the script: `text` is what the captions show, `say`
(when present) is what the voice speaks. Scene timing is measured from the audio,
so editing a line re-times the video automatically.

The narration is **recorded** (Jacob Kantrowitz, MD, PhD, 29 September 2026).
The takes were trimmed to the speech, cleared of a stray click on two lines, and
level-matched to -20 dB speech RMS with a -1.5 dBFS limiter, so every line sits
at the same loudness. `narration.json` carries `"narrator": "recorded"`, and
`npm run narrate` refuses to overwrite the takes while it does.

**Re-recording a line:** save the new take over `public/narration/<id>.wav`
(master it to the same level), then run `python3 scripts/narrate.py --timing-only`.
The video re-times around it.

**Back to the placeholder voice:** set `"narrator": "tts"` and run `npm run narrate`.
That uses Kokoro (voice `af_heart`) and needs `pip install kokoro-onnx soundfile`,
plus the two model files from the kokoro-onnx GitHub release in `$KOKORO_DIR`.

### Brand

Colours are extracted from `public/shared.css` on every studio/render
(`npm run tokens`); fonts are the site's own (Fraunces, Inter Tight, JetBrains
Mono) via Fontsource. Nothing is hand-copied, so the video follows a site restyle.

### Claim rules

Same as the site: no SOC 2, no EHR write-back, no time-saved pitch, never the word
"narrative", and "organized like clinicians think". Every figure on screen carries
its citation. The clinical content is fictional and deliberately generic (no ICD codes).
