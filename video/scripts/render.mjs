// Render one or more videos and loudness-normalise each.
//   node scripts/render.mjs                 # every composition
//   node scripts/render.mjs Scribe Huddle   # just these
//   node scripts/render.mjs Inlet --props='{"cta":"trial","captions":true}'
// Output: out/<kebab-case id>.mp4, normalised to -16 LUFS / -1.5 dBTP (the usual
// web/social target; a TTS voice otherwise lands quiet enough to read as silent).
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';

const run = (args) => execFileSync('npx', args, { stdio: ['ignore', 'pipe', 'inherit'] }).toString();
const passthrough = process.argv.slice(2).filter((a) => a.startsWith('--'));
let ids = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (ids.length === 0) ids = run(['remotion', 'compositions', '--quiet']).trim().split(/\s+/);

mkdirSync('out', { recursive: true });
for (const id of ids) {
  const name = id.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  const raw = `out/.${name}.raw.mp4`;
  console.log(`rendering ${id} → out/${name}.mp4`);
  run(['remotion', 'render', id, raw, '--log=error', ...passthrough]);
  run(['remotion', 'ffmpeg', '-y', '-loglevel', 'error', '-i', raw, '-c:v', 'copy',
    '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '48000', '-c:a', 'aac', '-b:a', '192k',
    '-movflags', '+faststart', `out/${name}.mp4`]);
  rmSync(raw);
}
