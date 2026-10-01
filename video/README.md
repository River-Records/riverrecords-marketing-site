# Videos

Code-built videos (Remotion) for the site and social. Separate package from the
Astro site: nothing here is part of `npm run build` or the Cloudflare deploy.

| Composition | Video | Ending | Narration |
|---|---|---|---|
| `NoteWasNeverThePoint` | The book's thesis, then the product (~63s) | trial · book · demo | recorded |
| `Scribe` | "Most scribes stop at the note" | trial · demo | placeholder |
| `Huddle` | "Summarization is a tool, not a default" | trial · demo | placeholder |
| `Inlet` | "Filed is where information goes to be forgotten" | demo | placeholder |

Every claim in them is one the site already makes (`/intake/`, `/features/huddle/`,
`faqs.ts`, the book), so a video cannot say more than the page it sits next to.
Inlet ends on a demo rather than the trial because it is a metered add-on, and
`/intake/` leads with Book a demo.

```bash
cd video
npm install
npm run studio                     # preview and scrub in the browser
npm run render                     # every video → out/<name>.mp4
npm run render -- Scribe Inlet     # just these
```

`render` finishes each video with a loudness pass (-16 LUFS, -1.5 dBTP — the usual
web/social target). Without it a TTS voice lands around -26 dB and is easy to
mistake for no audio at all on a player that opens quiet or muted.

In a cloud session or CI, point Remotion at the preinstalled Chromium:
`REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`.

### Layout

```
src/shared/        sequencer, captions, end card, timing, brand, UI pieces
src/videos/<slug>/ narration.json, timing.ts, scenes/, index.tsx (the VideoDef)
public/narration/<slug>/<line id>.wav
src/generated/     brand tokens and per-video timing (both regenerated)
```

**Adding a video:** write `src/videos/<slug>/narration.json` (story lines, then a
`cta-<key>` line per ending it offers), run `npm run narrate`, write a scene per
story line, export a `VideoDef` from its `index.tsx`, and add it to `VIDEOS` in
`src/Root.tsx`. Visuals land on their words with `cue(lineId, fraction)`.

### Switching the call to action

`src/shared/cta.ts` holds the `trial`, `book` and `demo` cards; a video can reword
one (`ctaOverrides`, as Inlet does) and offers only the endings it has narration
for. Pick one in the Studio sidebar, or on render:

```bash
npm run render -- NoteWasNeverThePoint --props='{"cta":"book","captions":true}'
```

The end card, its narration line and the video's length all follow the key. The
trial length is read from `src/config/pricing.ts`. If it changes, the render fails
until the spoken `cta-trial` line is updated to match, so a voice can't say a
different number from the card.

### Narration

Each video's `narration.json` is its script: `text` is what the captions show,
`say` (when present) is what the voice speaks. Scene timing is measured from the
audio, so editing a line, or swapping in a slower human read, re-times the video.

**Placeholder voice:** `npm run narrate` generates every video whose
`narration.json` says `"narrator": "tts"`, using Kokoro (voice `af_heart`). It needs
`pip install kokoro-onnx soundfile` and the two model files from the kokoro-onnx
GitHub release in `$KOKORO_DIR`. Videos marked `"recorded"` are never overwritten.

**Recorded takes:** read each line from the recording page (cue cards with a drop
slot per line; the takes are stored with that page). Then, with one file per line
named `<line id>.<ext>` in a folder:

```bash
python3 scripts/master_takes.py <slug> <folder>
```

That trims each take to its speech, removes a stray click from the record button,
level-matches every line to -20 dB speech RMS behind a -1.5 dBFS limiter, marks the
video `"recorded"` and re-times it. The master was recorded by Jacob Kantrowitz, MD,
PhD, on 29 September 2026; the script reproduces those takes exactly.

### Brand

Colours are extracted from `public/shared.css` on every studio/render
(`npm run tokens`); fonts are the site's own (Fraunces, Inter Tight, JetBrains
Mono) via Fontsource. Nothing is hand-copied, so the video follows a site restyle.

### Claim rules

Same as the site: no SOC 2, no EHR write-back, no time-saved pitch, never the word
"narrative", and "organized like clinicians think". Every figure on screen carries
its citation. The clinical content is fictional and deliberately generic (no ICD codes).

Sample clinical values have to be internally consistent, because this audience reads
them. Inlet's fan-out says "chronic kidney disease" rather than the "CKD stage 2" that
`/intake/` uses: eGFR 58 is stage G3a, and a stage that disagrees with its own number
costs more credibility than the scene earns.
