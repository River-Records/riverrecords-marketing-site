// match.mjs — how the exclusion keyword lists are matched against a practice name.
//
// Both matchers run against the normalised name (upper case, punctuation removed). Matching
// on bare substrings is what makes a keyword list quietly wrong: 'CLINIC' matches 'CLINICAL',
// 'HCA' matches 'ARCHCARE', 'MAYO' matches 'MAYORAL FAMILY MEDICINE'. Each of those is an
// independent practice dropped for a reason nobody would ever spot in a list of 40,000.

const isBoundary = (s, i) => i < 0 || i >= s.length || s[i] === ' ';

/**
 * Whole-phrase match: "MEDICAL CENTER" matches "SPRINGFIELD MEDICAL CENTER" and its plural,
 * but not "MEDICAL CENTERPOINT".
 */
export function phraseHit(name, phrases) {
  for (const p of phrases) {
    let from = 0, i;
    while ((i = name.indexOf(p, from)) !== -1) {
      from = i + 1;
      if (!isBoundary(name, i - 1)) continue;
      const end = i + p.length;
      if (isBoundary(name, end)) return p;
      if (name[end] === 'S' && isBoundary(name, end + 1)) return p; // simple plural
    }
  }
  return null;
}

// Brand names may prefix a word — 'OPTUM' should catch 'OPTUMCARE' — but a short name that
// did the same would match half the file, so anything under this length must end a word too.
const PREFIX_MIN_LEN = 5;

/** Named-system match: starts a word, and ends one unless the name is long enough to be safe. */
export function nameHit(name, needles) {
  for (const n of needles) {
    let from = 0, i;
    while ((i = name.indexOf(n, from)) !== -1) {
      from = i + 1;
      if (!isBoundary(name, i - 1)) continue;
      const end = i + n.length;
      if (isBoundary(name, end) || n.length >= PREFIX_MIN_LEN) return n;
    }
  }
  return null;
}
