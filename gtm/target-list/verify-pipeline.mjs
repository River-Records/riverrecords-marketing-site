// verify-pipeline.mjs — asserts the pipeline's arithmetic against hand-computed values.
//
//   node gtm/target-list/verify-pipeline.mjs
//
// A target list that is wrong is worse than no target list: it sends Bullpen at the wrong
// practices with a confident face, and the acceptance test cannot tell a scoring bug from
// a scoring disagreement. So every rollup, weighting, exclusion and tier boundary is
// checked against a fixture whose expected values are worked out by hand below.
//
// It needs no network and no CMS download, which is the point — the real files are large,
// republished annually, and unreachable from some environments.

import { mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { build } from './02-build.mjs';
import { readCsv } from './lib/csv.mjs';
import { phraseHit, nameHit } from './lib/match.mjs';
import { SYSTEM_KEYWORDS, SYSTEM_NAMES } from './config/exclusions.mjs';

let fails = 0;
const check = (name, cond, detail) => {
  console.log((cond ? '  PASS  ' : '  FAIL  ') + name + (detail && !cond ? `\n          ${detail}` : ''));
  if (!cond) fails++;
};
const near = (a, b, eps = 1e-6) => a !== null && a !== '' && Math.abs(Number(a) - Number(b)) < eps;

const dir = join(tmpdir(), `rr-target-list-verify-${process.pid}`);
mkdirSync(dir, { recursive: true });
const dataDir = join(dir, 'data');
const outDir = join(dir, 'out');
mkdirSync(dataDir, { recursive: true });

// ── Fixtures ────────────────────────────────────────────────────────────────────────
// Source B uses the *newer* CMS spellings ("Provider Last Name", "Facility Name",
// "City/Town") and source A uses the TitleCase of the CSV download rather than the
// lowercase of the JSON API, so the alias resolution and header normalisation are
// exercised rather than assumed.
const B_HEADER = 'NPI,Ind_PAC_ID,Provider Last Name,Provider First Name,Cred,Pri_spec,Sec_spec_all,Facility Name,org_pac_id,num_org_mem,adr_ln_1,adr_ln_2,City/Town,State,ZIP Code,Telephone Number';
const b = (npi, ind, last, first, cred, spec, org, orgPac, size, city, st, zip) =>
  `${npi},${ind},${last},${first},${cred},${spec},,"${org}",${orgPac},${size},1 Main St,,${city},${st},${zip},5551234567`;

const clinicians = [B_HEADER,
  // Riverbend: three primary care NPIs plus a cardiologist who must not be counted.
  b('1000000001', 'I1', 'Adams', 'Jane', 'M.D.', 'Family Practice', 'Riverbend Family Medicine, P.C.', '1000', 3, 'Cambridge', 'MA', '02138'),
  b('1000000002', 'I2', 'Brown', 'Sam', 'N.P.', 'Nurse Practitioner', 'Riverbend Family Medicine, P.C.', '1000', 3, 'Cambridge', 'MA', '02138'),
  b('1000000003', 'I3', 'Chen', 'Lee', 'M.D.', 'Internal Medicine', 'Riverbend Family Medicine, P.C.', '1000', 3, 'Cambridge', 'MA', '02138'),
  b('1100000001', 'I4', 'Doyle', 'Ray', 'M.D.', 'Cardiology', 'Riverbend Family Medicine, P.C.', '1000', 3, 'Cambridge', 'MA', '02138'),
  // Lakeside: one member's risk score is suppressed, one member has no source A row at all.
  b('2000000001', 'I5', 'Diaz', 'Ana', 'M.D.', 'Internal Medicine', 'Lakeside Internal Medicine LLC', '2000', 2, 'Nashua', 'NH', '03060'),
  b('2000000002', 'I6', 'Evans', 'Kyle', 'P.A.', 'Physician Assistant', 'Lakeside Internal Medicine LLC', '2000', 2, 'Nashua', 'NH', '03060'),
  b('2000000003', 'I7', 'Ford', 'Nia', 'M.D.', 'Internal Medicine', 'Lakeside Internal Medicine LLC', '2000', 2, 'Nashua', 'NH', '03060'),
  b('1200000001', 'I8', 'Gray', 'Tom', 'M.D.', 'Internal Medicine', 'Lakeside Internal Medicine LLC', '2000', 2, 'Nashua', 'NH', '03060'),
  // Summit: survives, but its panel is under the tier floor.
  b('3000000001', 'I9', 'Hall', 'Ada', 'M.D.', 'Family Practice', 'Summit Primary Care', '3000', 2, 'Burlington', 'VT', '05401'),
  b('3000000002', 'I10', 'Ito', 'Ken', 'M.D.', 'Family Practice', 'Summit Primary Care', '3000', 2, 'Burlington', 'VT', '05401'),
  b('3000000003', 'I11', 'Jones', 'Eve', 'M.D.', 'Family Practice', 'Summit Primary Care', '3000', 2, 'Burlington', 'VT', '05401'),
  // Solo: blank org, highest risk score on the list. Must survive and must be Tier 3.
  b('4000000001', 'I12', 'Foster', 'Gail', 'M.D.', 'Family Practice', '', '', '', 'Portland', 'ME', '04102'),
  // Three practices that must be excluded, one per rule.
  b('5000000001', 'I13', 'King', 'Ivo', 'M.D.', 'Family Practice', 'Mercy Hospital Family Care', '5000', 4, 'Springfield', 'MA', '01103'),
  b('5000000002', 'I14', 'Lane', 'Mia', 'M.D.', 'Family Practice', 'Mercy Hospital Family Care', '5000', 4, 'Springfield', 'MA', '01103'),
  b('6000000001', 'I15', 'Moss', 'Ann', 'M.D.', 'Family Practice', 'Northside Community Health Center', '6000', 5, 'Lowell', 'MA', '01852'),
  b('7000000001', 'I16', 'Nash', 'Rob', 'M.D.', 'Family Practice', 'Optum Primary Care of the Valley', '7000', 6, 'Holyoke', 'MA', '01040'),
  // Harbor: this clinician also has a row at a 25-member group in another state. The ZIP in
  // source A says Harbor is the real practice, so the moonlighting row must not exclude them.
  b('9000000001', 'I17', 'Grant', 'Ivy', 'M.D.', 'Family Practice', 'Harbor Family Practice', '9000', 4, 'Portland', 'ME', '04101'),
  b('9000000001', 'I17', 'Grant', 'Ivy', 'M.D.', 'Family Practice', 'Bigtown Medical Associates', '8000', 25, 'Fargo', 'ND', '58102'),
  b('9000000002', 'I18', 'Patel', 'Dev', 'M.D.', 'Family Practice', 'Harbor Family Practice', '9000', 4, 'Portland', 'ME', '04101'),
  // Cedar Ridge: the Tier 1 case.
  b('9500000001', 'I19', 'Quinn', 'Lea', 'M.D.', 'Family Practice', 'Cedar Ridge Family Practice', '9500', 2, 'Newton', 'MA', '02458'),
  b('9500000002', 'I20', 'Reed', 'Omar', 'M.D.', 'Family Practice', 'Cedar Ridge Family Practice', '9500', 2, 'Newton', 'MA', '02458'),
].join('\n') + '\n';

const A_HEADER = 'Rndrng_NPI,Rndrng_Prvdr_Last_Org_Name,Rndrng_Prvdr_First_Name,Rndrng_Prvdr_Crdntls,Rndrng_Prvdr_Ent_Cd,Rndrng_Prvdr_Type,Rndrng_Prvdr_City,Rndrng_Prvdr_State_Abrvtn,Rndrng_Prvdr_Zip5,Tot_Benes,Bene_Avg_Age,Bene_Dual_Cnt,Bene_CC_PH_HF_NonIHD_V2_Pct,Bene_CC_PH_CKD_V2_Pct,Bene_CC_PH_COPD_V2_Pct,Bene_CC_PH_Diabetes_V2_Pct,Bene_Avg_Risk_Scre';
const a = (npi, ent, st, zip, benes, age, dual, chf, ckd, copd, dm, risk) =>
  `${npi},Last,First,M.D.,${ent},Family Practice,City,${st},${zip},${benes},${age},${dual},${chf},${ckd},${copd},${dm},${risk}`;

const physician = [A_HEADER,
  a('1000000001', 'I', 'MA', '02138', 400, 72, 80, 0.30, 0.40, 0.20, 0.50, 2.10),
  a('1000000002', 'I', 'MA', '02138', 200, 70, 20, 0.10, 0.20, 0.10, 0.30, 1.50),
  a('1000000003', 'I', 'MA', '02138', 400, 75, 100, 0.20, 0.20, 0.20, 0.20, 1.00),
  a('1000000003', 'O', 'MA', '02138', 999999, 99, 9999, 0.99, 0.99, 0.99, 0.99, 9.99), // org row: must be skipped
  a('1100000001', 'I', 'MA', '02138', 500, 74, 50, 0.50, 0.50, 0.50, 0.50, 3.00),      // cardiologist: never joined
  a('2000000001', 'I', 'NH', '03060', 300, 71, 30, 0.10, 0.10, 0.10, 0.10, 1.20),
  a('2000000002', 'I', 'NH', '03060', 100, 69, 10, 0.10, 0.10, 0.10, 0.10, 0.80),
  a('2000000003', 'I', 'NH', '03060', 100, 70, 5, '', '', '', '', ''),                  // suppressed risk
  a('3000000001', 'I', 'VT', '05401', 80, 68, 5, 0.10, 0.10, 0.10, 0.10, 0.60),
  a('3000000002', 'I', 'VT', '05401', 60, 68, 5, 0.10, 0.10, 0.10, 0.10, 0.60),
  a('3000000003', 'I', 'VT', '05401', 5, 68, 1, 0.10, 0.10, 0.10, 0.10, 0.60),          // under the bene floor
  a('4000000001', 'I', 'ME', '04102', 500, 76, 50, 0.20, 0.20, 0.20, 0.20, 2.50),
  a('5000000001', 'I', 'MA', '01103', 300, 72, 30, 0.20, 0.20, 0.20, 0.20, 2.00),
  a('5000000002', 'I', 'MA', '01103', 300, 72, 30, 0.20, 0.20, 0.20, 0.20, 2.00),
  a('6000000001', 'I', 'MA', '01852', 300, 66, 200, 0.30, 0.30, 0.30, 0.30, 2.40),
  a('7000000001', 'I', 'MA', '01040', 300, 73, 30, 0.20, 0.20, 0.20, 0.20, 2.30),
  a('9000000001', 'I', 'ME', '04101', 250, 74, 25, 0.20, 0.20, 0.20, 0.20, 1.80),
  a('9000000002', 'I', 'ME', '04101', 250, 74, 25, 0.20, 0.20, 0.20, 0.20, 1.80),
  a('9500000001', 'I', 'MA', '02458', 300, 77, 60, 0.30, 0.30, 0.30, 0.30, 2.20),
  a('9500000002', 'I', 'MA', '02458', 300, 77, 60, 0.30, 0.30, 0.30, 0.30, 2.20),
].join('\n') + '\n';

const mssp = ['ACO_ID,ACO_Name,Participant_Name,State',
  'A1,"Aledade Massachusetts ACO, LLC","Riverbend Family Medicine PC",MA',
  'A2,"Granite State Community ACO","Lakeside Internal Medicine, LLC",NH',
].join('\n') + '\n';

writeFileSync(join(dataDir, 'doctors-and-clinicians.csv'), clinicians);
writeFileSync(join(dataDir, 'physician-by-provider.csv'), physician);
writeFileSync(join(dataDir, 'mssp-aco-participants.csv'), mssp);

// ── Run ─────────────────────────────────────────────────────────────────────────────
console.log('\nBuilding against the fixture...\n');
const { summary } = await build({ dataDir, outDir, log: () => {} });

const rows = [];
let header = null;
await readCsv(join(outDir, 'practices.csv'), {
  onHeader: (h) => { header = h; },
  onRow: (f) => { rows.push(Object.fromEntries(header.map((k, i) => [k, f[i]]))); },
});
const byName = (needle) => rows.find((r) => r.org_name.includes(needle));

const drops = [];
let dHeader = null;
await readCsv(join(outDir, 'drop-log.csv'), {
  onHeader: (h) => { dHeader = h; },
  onRow: (f) => { drops.push(Object.fromEntries(dHeader.map((k, i) => [k, f[i]]))); },
});
const dropFor = (needle) => drops.find((d) => d.org_name.includes(needle));

// ── Cohort and exclusions ───────────────────────────────────────────────────────────
console.log('Cohort and exclusions');
check('six practices survive the exclusions', rows.length === 6, `got ${rows.length}: ${rows.map((r) => r.org_name).join(' | ')}`);
check('hospital-named practice dropped on system_keyword', dropFor('Mercy Hospital')?.rule === 'system_keyword', JSON.stringify(dropFor('Mercy Hospital')));
check('community health center dropped on safety_net_keyword', dropFor('Northside')?.rule === 'safety_net_keyword', JSON.stringify(dropFor('Northside')));
check('Optum practice dropped on named_system', dropFor('Optum')?.rule === 'named_system' && dropFor('Optum')?.matched === 'OPTUM');
check('drop log names the token that matched', dropFor('Mercy Hospital')?.matched === 'HOSPITAL');
check('cardiologist is not counted as a primary care provider', byName('Riverbend')?.provider_count === '3', `provider_count=${byName('Riverbend')?.provider_count}`);
check('NPI with no source A row is excluded from the practice', byName('Lakeside')?.provider_count === '3', `provider_count=${byName('Lakeside')?.provider_count}`);
check('NPI under the 11-beneficiary floor is excluded', byName('Summit')?.provider_count === '2', `provider_count=${byName('Summit')?.provider_count}`);
check('organisation-entity row in source A is skipped', summary.stages.physician_org_rows_skipped === 1);
check('solo with a blank org survives as its own practice', !!byName('Foster'), rows.map((r) => r.org_name).join(' | '));
check('solo is flagged is_solo', byName('Foster')?.is_solo === 'TRUE');
check('moonlighting row at a 25-member group does not exclude the clinician',
  !!byName('Harbor') && byName('Harbor').provider_count === '2', 'Harbor Family Practice should survive via the ZIP affiliation rule');
check('affiliation resolved by ZIP for the multi-affiliation clinician', summary.stages.affiliation_rule_used.zip === 1, JSON.stringify(summary.stages.affiliation_rule_used));

// ── Practice metrics: hand-computed ─────────────────────────────────────────────────
console.log('\nRiverbend metrics (400 @ risk 2.10, 200 @ 1.50, 400 @ 1.00)');
const rb = byName('Riverbend');
// panel 400+200+400 = 1000
check('panel_total = 1,000', rb?.panel_total === '1000', `got ${rb?.panel_total}`);
// (400*2.10 + 200*1.50 + 400*1.00) / 1000 = 1540/1000
check('risk_score_wtd = 1.54', near(rb?.risk_score_wtd, 1.54), `got ${rb?.risk_score_wtd}`);
// (80+20+100)/1000
check('dual_rate = 0.2', near(rb?.dual_rate, 0.2), `got ${rb?.dual_rate}`);
// chf .22, ckd .28, copd .18, dm .34 -> mean 1.02/4
check('cc_density = 0.255', near(rb?.cc_density, 0.255), `got ${rb?.cc_density}`);
// (400*72 + 200*70 + 400*75)/1000 = 72800/1000
check('avg_age = 72.8', near(rb?.avg_age, 72.8), `got ${rb?.avg_age}`);
check('risk_coverage = 1 when every member has a risk score', near(rb?.risk_coverage, 1), `got ${rb?.risk_coverage}`);

console.log('\nLakeside metrics (one member has a suppressed risk score)');
const lk = byName('Lakeside');
check('panel_total counts the suppressed member: 500', lk?.panel_total === '500', `got ${lk?.panel_total}`);
// weighted over the 400 beneficiaries that have a score: (300*1.2 + 100*0.8)/400
check('risk_score_wtd excludes the suppressed member: 1.1', near(lk?.risk_score_wtd, 1.1), `got ${lk?.risk_score_wtd}`);
check('risk_coverage reports the gap: 0.8', near(lk?.risk_coverage, 0.8), `got ${lk?.risk_coverage}`);
// (30+10+5)/500 — dual counts are present for all three
check('dual_rate = 0.09', near(lk?.dual_rate, 0.09), `got ${lk?.dual_rate}`);
check('cc_density = 0.1', near(lk?.cc_density, 0.1), `got ${lk?.cc_density}`);
check('condition columns are read as proportions, not percentages', summary.cc_scale_detected.startsWith('proportion'), summary.cc_scale_detected);

// ── Percentiles and tiers ───────────────────────────────────────────────────────────
// Six scored practices: 0.60, 1.10, 1.54, 1.80, 2.20, 2.50
// Percentile rank with mid-ranked ties = (below + at-or-below) / 2 / n * 100
//   0.60 -> 8.3   1.10 -> 25   1.54 -> 41.7   1.80 -> 58.3   2.20 -> 75   2.50 -> 91.7
console.log('\nPercentiles and tiers');
check('percentile base is the six scored practices', summary.stages.percentile_base === 6, `got ${summary.stages.percentile_base}`);
check('Cedar Ridge sits at the 75th percentile', near(byName('Cedar Ridge')?.risk_pctile, 75, 0.05), `got ${byName('Cedar Ridge')?.risk_pctile}`);
check('Riverbend sits at the 41.7th percentile', near(rb?.risk_pctile, 41.7, 0.05), `got ${rb?.risk_pctile}`);
check('Tier 1: at or above the 75th percentile, panel >= 200, 2-10 providers', byName('Cedar Ridge')?.tier === '1', `got ${byName('Cedar Ridge')?.tier}`);
check('Tier 2: 58th percentile lands in tier 2', byName('Harbor')?.tier === '2', `got ${byName('Harbor')?.tier}`);
check('Tier 3: below the 50th percentile', rb?.tier === '3' && lk?.tier === '3', `Riverbend=${rb?.tier} Lakeside=${lk?.tier}`);
check('solo is Tier 3 despite the highest risk score on the list',
  byName('Foster')?.tier === '3' && near(byName('Foster')?.risk_pctile, 91.7, 0.05),
  `tier=${byName('Foster')?.tier} pctile=${byName('Foster')?.risk_pctile}`);
check('panel under 200 cannot reach tier 1 or 2', byName('Summit')?.tier === '3' && Number(byName('Summit').panel_total) < 200);
check('output is sorted by tier, then risk_pctile descending',
  rows.map((r) => `${r.tier}${(1000 - Number(r.risk_pctile || 0)).toFixed(1)}`).join('|') ===
  [...rows].sort((x, y) => Number(x.tier) - Number(y.tier) || Number(y.risk_pctile) - Number(x.risk_pctile))
    .map((r) => `${r.tier}${(1000 - Number(r.risk_pctile || 0)).toFixed(1)}`).join('|'));

// ── MSSP flags ──────────────────────────────────────────────────────────────────────
console.log('\nMSSP flags');
check('MSSP participant matched across punctuation differences', rb?.in_mssp === 'TRUE', `in_mssp=${rb?.in_mssp}`);
check('Aledade is flagged as an enablement ACO', rb?.enablement_aco === 'TRUE');
check('the ACO name is carried through', rb?.mssp_aco_name.includes('Aledade'), rb?.mssp_aco_name);
check('a non-enablement ACO is flagged in_mssp but not enablement', lk?.in_mssp === 'TRUE' && lk?.enablement_aco === 'FALSE',
  `in_mssp=${lk?.in_mssp} enablement=${lk?.enablement_aco}`);
check('a practice on no ACO is flagged FALSE', byName('Cedar Ridge')?.in_mssp === 'FALSE');

// ── Geography and the volume guard ──────────────────────────────────────────────────
console.log('\nGeography and the volume sanity check');
check('volume guard fires when Tier 1 is outside the expected national range',
  summary.warnings.some((w) => w.includes('Tier 1 is 1')), JSON.stringify(summary.warnings));
const ma = await build({ dataDir, outDir: join(dir, 'out-ma'), log: () => {}, states: ['MA'] });
check('a state filter restricts the output', ma.practices.every((p) => p.members[0].aff.state === 'MA') && ma.practices.length === 2,
  `got ${ma.practices.length}: ${ma.practices.map((p) => p.displayName).join(' | ')}`);
check('percentiles stay national when the state filter is applied',
  near(ma.practices.find((p) => p.displayName.includes('Cedar Ridge'))?.pctile, 75, 0.05),
  'Cedar Ridge should keep its national percentile, not be re-scored against MA alone');

// ── Column resolution ───────────────────────────────────────────────────────────────
console.log('\nColumn resolution');
check('new-style source B column names resolve', summary.columns.clinicians.org_name === 'facility_name' && summary.columns.clinicians.last_name === 'provider_last_name',
  JSON.stringify(summary.columns.clinicians));
check('TitleCase source A headers resolve', summary.columns.physician.risk_score === 'bene_avg_risk_scre');
check('chronic condition columns found by pattern, newest version',
  summary.columns.chronic_conditions.chf === 'bene_cc_ph_hf_nonihd_v2_pct' && summary.columns.chronic_conditions.diabetes === 'bene_cc_ph_diabetes_v2_pct',
  JSON.stringify(summary.columns.chronic_conditions));
check('a Pri_spec value that looks like primary care but is not on the list is reported',
  summary.specialties_all.some((s) => s.label === 'CARDIOLOGY'));

// ── Keyword matching ────────────────────────────────────────────────────────────────
// These are the false positives that would be invisible in a list of 40,000 practices:
// an independent practice dropped because its name contains a system's name as a substring.
console.log('\nKeyword matching');
check('a named system matches as a word prefix', nameHit('OPTUMCARE MEDICAL GROUP', SYSTEM_NAMES) === 'OPTUM');
check('a short system name does not match mid-word', nameHit('ARCHCARE FAMILY PRACTICE', SYSTEM_NAMES) === null,
  `ARCHCARE must not match HCA, got ${nameHit('ARCHCARE FAMILY PRACTICE', SYSTEM_NAMES)}`);
check('a short system name still matches as a whole word', nameHit('HCA HEALTHCARE', SYSTEM_NAMES) === 'HCA');
check('MAYORAL FAMILY MEDICINE is not the Mayo Clinic', nameHit('MAYORAL FAMILY MEDICINE', SYSTEM_NAMES) === null);
check('MAYO CLINIC is', nameHit('MAYO CLINIC', SYSTEM_NAMES) === 'MAYO');
check('a keyword phrase does not match a longer word', phraseHit('RIVERSIDE CLINICAL PARTNERS', SYSTEM_KEYWORDS) === null,
  'CLINIC FOUNDATION must not fire on CLINICAL');
check('a keyword phrase matches its plural', phraseHit('SPRINGFIELD MEDICAL CENTERS', SYSTEM_KEYWORDS) === 'MEDICAL CENTER');
check('a keyword phrase does not match a longer compound', phraseHit('MEDICAL CENTERPOINT ASSOCIATES', SYSTEM_KEYWORDS) === null);

rmSync(dir, { recursive: true, force: true });
console.log(fails === 0 ? '\nAll checks passed.\n' : `\n${fails} check(s) FAILED.\n`);
process.exit(fails === 0 ? 0 : 1);
