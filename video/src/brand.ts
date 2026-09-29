// Colour tokens are extracted from public/shared.css (npm run tokens) — never
// hand-copied — so the video and the site cannot drift apart.
import tokens from './generated/brand.json';

export const color = tokens as Record<string, string>;

export const font = {
  serif: '"Fraunces", Georgia, serif',
  sans: '"Inter Tight", sans-serif',
  mono: '"JetBrains Mono", monospace',
};
