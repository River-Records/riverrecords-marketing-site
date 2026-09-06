// normalize.mjs — organisation-name handling for the keyword exclusions and the fuzzy
// MSSP join.
//
// Every join in this pipeline that is not on NPI is on a name a human typed into an
// enrolment form, so "SPRINGFIELD FAMILY MEDICINE, P.C." and "Springfield Family
// Medicine PC" have to collapse to the same thing before anything is compared.

const SUFFIXES = new Set([
  'LLC','L L C','LLP','PLLC','PC','P C','PA','P A','INC','INCORPORATED','CORP','CORPORATION',
  'LTD','LP','LLP','CO','COMPANY','GROUP','THE','OF','AND','ASSOC','ASSOCIATES','ASSOCIATION',
]);

export function normOrg(name) {
  if (!name) return '';
  return String(name)
    .toUpperCase()
    .replace(/&/g, ' AND ')
    .replace(/\./g, '')            // "P.C." -> "PC" before punctuation becomes whitespace
    .replace(/[^A-Z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Token set with corporate boilerplate removed — what actually identifies the practice.
export function orgTokens(name) {
  const t = normOrg(name).split(' ').filter((w) => w.length > 1 && !SUFFIXES.has(w));
  return new Set(t);
}

export function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

export const zip5 = (z) => String(z || '').replace(/[^0-9]/g, '').slice(0, 5);

export const digitsOnly = (s) => String(s || '').replace(/[^0-9]/g, '');

// Title Case for display, leaving obvious initialisms alone.
export function titleCase(s) {
  if (!s) return '';
  return String(s).toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase());
}

export const num = (v) => {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  if (s === '' || s === '*' || s === 'NA' || s === 'N/A') return null; // CMS suppression markers
  const n = Number(s.replace(/[$,%]/g, ''));
  return Number.isFinite(n) ? n : null;
};
