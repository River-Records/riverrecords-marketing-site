// Copies the site's :root colour tokens out of public/shared.css so the video
// uses exactly the brand the site renders — change a token there, re-render here.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const css = readFileSync(new URL('../../public/shared.css', import.meta.url), 'utf8');
const root = css.match(/:root\s*{([^}]*)}/);
if (!root) throw new Error('No :root block in public/shared.css');

const tokens = {};
for (const [, name, value] of root[1].matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
  tokens[name] = value.trim();
}
for (const required of ['primary', 'accent', 'surface', 'dark', 'ink', 'white']) {
  if (!tokens[required]) throw new Error(`shared.css is missing --${required}`);
}

mkdirSync(new URL('../src/generated/', import.meta.url), { recursive: true });
writeFileSync(new URL('../src/generated/brand.json', import.meta.url), JSON.stringify(tokens, null, 2) + '\n');
console.log(`brand.json: ${Object.keys(tokens).length} tokens`);
