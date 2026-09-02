// verify-pediatric-coding.mjs — the coding guide must stay correct and stay licensed.
//
// This page states CPT code-to-age mappings to pediatric clinicians and their billers.
// A wrong band here is immediately visible to the exact audience it is meant to earn,
// so the table is asserted row by row against values verified from AAP and AAPC sources.
//
// It also asserts what the page must NOT contain. River Records licenses CPT for use in
// the product; that is not automatically a licence to publish AMA descriptors on a public
// page. Descriptors are therefore paraphrased, and this check fails if official wording
// creeps back in during an edit.
//
//   npm run build && node scripts/verify-pediatric-coding.mjs
//   (static — no browser needed)

import { readFileSync } from 'node:fs';

const FILE = 'dist/guides/pediatric-visit-coding/index.html';
let fails = 0;
const check = (n, c, d) => { console.log((c ? '  PASS  ' : '  FAIL  ') + n + (d ? '\n          ' + d : '')); if (!c) fails++; };
const html = readFileSync(FILE, 'utf8');
const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

const EXPECT = {
  99391: 'Younger than 1 year', 99392: 'Ages 1 through 4', 99393: 'Ages 5 through 11',
  99394: 'Ages 12 through 17', 99395: 'Ages 18 through 39',
  99381: 'Younger than 1 year', 99382: 'Ages 1 through 4', 99383: 'Ages 5 through 11',
  99384: 'Ages 12 through 17', 99385: 'Ages 18 through 39',
};

console.log('\nCode-to-age mappings, asserted row by row');
const rows = [...html.matchAll(/<tr[^>]*>\s*<td[^>]*>\s*(\d{5})\s*<\/td>\s*<td[^>]*>\s*([^<]+?)\s*<\/td>\s*<td[^>]*>\s*([^<]+?)\s*<\/td>/g)];
check('all ten codes present', rows.length === 10, rows.length + ' rows found');
const wrong = rows.filter(([, code, , ages]) => EXPECT[code] !== ages);
check('every age band correct', wrong.length === 0,
  wrong.map(([, c, , a]) => `${c} rendered "${a}", expected "${EXPECT[c]}"`).join('; '));

console.log('\nLicensing: no AMA descriptors reproduced');
const descriptors = [
  'periodic comprehensive preventive medicine reevaluation',
  'comprehensive preventive medicine evaluation and management of an individual',
  'initial comprehensive preventive medicine',
];
const found = descriptors.filter((d) => text.toLowerCase().includes(d));
check('official CPT descriptors absent', found.length === 0, found.join('; '));
check('CPT trademark acknowledged', /registered trademark of the American Medical Association/i.test(text));

console.log('\nClinical claims that must not soften');
check('states the three-year rule', /three-year rule/i.test(text));
check('says preventive codes are not time-based', /not.{0,40}selected by time|not\s+selected by time|not\*{0,2}\s*selected/i.test(text) || /are <strong>not<\/strong> selected by time/i.test(html));
check('modifier 25 requires significant and separately identifiable',
  /significant and separately identifiable/i.test(text));
// The page says "None of this IS an argument…"; an earlier version of this assertion
// looked for "not an argument" and failed against correct copy.
check('carries the anti-upcoding guardrail',
  /is an argument for billing a level you did not earn/i.test(text) &&
  /not a coding optimisation, it is a false claim/i.test(text));
check('says Stream does not choose codes or submit claims',
  /does not choose your codes and does not submit claims/i.test(text));

console.log('\nDisclaimer and sources');
check('educational-not-advice disclaimer', /not coding or compliance advice/i.test(text));
check('links AAP preventive coding resource', html.includes('downloads.aap.org'));
check('links AAFP modifier 25 guidance', html.includes('aafp.org'));

console.log('\nConnected to the work it builds on');
check('links The Defensible Visit', html.includes('/guides/the-defensible-visit/'));
check('links the calculator', html.includes('/tools/undercoding-calculator/'));
check('links the pediatrics page', html.includes('/for/pediatrics/'));

console.log('\n' + (fails ? `${fails} CHECK(S) FAILED` : 'ALL CHECKS PASSED'));
process.exit(fails ? 1 : 0);
