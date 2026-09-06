// 02-build.mjs — build the scored, practice-level target list.
//
//   node --max-old-space-size=4096 gtm/target-list/02-build.mjs
//
// Reads the raw CMS files from gtm/target-list/data/ and writes three things to
// gtm/target-list/out/:
//   practices.csv  — one row per practice, the deliverable
//   drop-log.csv   — every practice removed by step 4, with the rule and the token that
//                    matched, because keyword proxies over- and under-fire and this list
//                    is meant to be eyeballed and tuned
//   summary.json   — counts at every stage, the columns that were resolved, the specialty
//                    labels actually seen, and the volume sanity check
//
// The pipeline is a scored list with tiers, not a hard filter. Nothing that survives the
// exclusions is thrown away for scoring poorly; it lands in Tier 3.

import { mkdirSync, writeFileSync, createWriteStream, existsSync } from 'node:fs';
import { join } from 'node:path';
import { readCsv, csvLine } from './lib/csv.mjs';
import { resolve, findConditionColumns } from './lib/columns.mjs';
import { normOrg, orgTokens, jaccard, zip5, num } from './lib/normalize.mjs';
import { phraseHit, nameHit } from './lib/match.mjs';
import {
  SOURCES, DATA_DIR, OUT_DIR, PHYSICIAN_COLUMNS, CLINICIAN_COLUMNS, MSSP_COLUMNS,
  CONDITION_PATTERNS, CC_DENSITY_CONDITIONS,
} from './config/sources.mjs';
import {
  PRIMARY_CARE_SPECIALTIES, NEAR_MISS_SPECIALTIES, GROUP_SIZE_MIN, GROUP_SIZE_MAX,
  MIN_BENES_PER_NPI, TIER_PANEL_MIN, TIER1_PCTILE, TIER2_PCTILE, PERCENTILE_SCOPE,
  PERCENTILE_INCLUDE_SOLOS, SERVABLE_STATES, EXPECTED_TIER1_RANGE, AFFILIATION_RULE,
} from './config/cohort.mjs';
import {
  SAFETY_NET_KEYWORDS, SYSTEM_KEYWORDS, SYSTEM_NAMES, ENABLEMENT_ACOS, MSSP_MATCH_THRESHOLD,
} from './config/exclusions.mjs';

const PC_SET = new Set(PRIMARY_CARE_SPECIALTIES.map((s) => s.toUpperCase()));
const NEAR_MISS_SET = new Set(NEAR_MISS_SPECIALTIES.map((s) => s.toUpperCase()));

const OUTPUT_HEADER = [
  // Exactly the columns the spec asks for, in the order it asks for them...
  'org_pac_id', 'org_name', 'provider_count', 'address', 'city', 'state', 'zip', 'phone',
  'panel_total', 'risk_score_wtd', 'risk_pctile', 'dual_rate', 'cc_density',
  'tier', 'in_mssp', 'enablement_aco', 'npi_list', 'clinician_names', 'primary_specialties',
  // ...then appended extras, which is safe for anything reading by header name.
  'org_member_count', 'is_solo', 'risk_coverage', 'mssp_aco_name', 'avg_age',
];

export async function build({
  dataDir = DATA_DIR, outDir = OUT_DIR, log = console.log, limit = 0,
  states = SERVABLE_STATES,
} = {}) {
  mkdirSync(outDir, { recursive: true });
  const summary = { generated_at: new Date().toISOString(), stages: {}, columns: {}, warnings: [] };

  // ── Step 1 & 2. Source B: primary care, at any group size. ──────────────────────────
  // Size is filtered after the affiliation dedupe, not here: a clinician whose 4-person
  // practice is their real one must not be judged on the 40-person group they moonlight in,
  // and that comparison is only possible if both rows survive to the dedupe.
  const clinicianPath = join(dataDir, SOURCES.clinicians.file);
  if (!existsSync(clinicianPath)) throw new Error(`Missing ${clinicianPath}. Run 01-fetch.mjs, or see README for the manual download.`);

  const affiliations = new Map();   // npi -> Affiliation[]
  const specCounts = new Map();
  let bRows = 0, bKept = 0;
  let C;

  await readCsv(clinicianPath, {
    onHeader: (h) => {
      C = resolve(h, CLINICIAN_COLUMNS, {
        file: SOURCES.clinicians.file,
        required: ['npi', 'ind_pac_id', 'pri_spec', 'num_org_mem', 'state'],
      });
      summary.columns.clinicians = Object.fromEntries(
        Object.keys(CLINICIAN_COLUMNS).map((k) => [k, C[`${k}__col`]]));
    },
    onRow: (f) => {
      bRows++;
      const spec = (f[C.pri_spec] || '').trim();
      const key = spec.toUpperCase();
      specCounts.set(key, (specCounts.get(key) || 0) + 1);
      if (!PC_SET.has(key)) return;

      const npi = (f[C.npi] || '').trim();
      if (!npi) return;
      const orgPac = (f[C.org_pac_id] || '').trim();
      const indPac = (f[C.ind_pac_id] || '').trim();
      const size = num(f[C.num_org_mem]);
      // Blank org means solo, not missing data. Solos are keyed on their own PAC ID.
      const solo = orgPac === '' || size === 1;
      const aff = {
        npi,
        practiceKey: solo ? `IND:${indPac || npi}` : `ORG:${orgPac}`,
        orgPacId: solo ? '' : orgPac,
        orgName: (f[C.org_name] || '').trim(),
        size: solo ? 1 : size,
        solo,
        last: (f[C.last_name] || '').trim(),
        first: (f[C.first_name] || '').trim(),
        cred: (f[C.credentials] || '').trim(),
        spec,
        addr: [(f[C.adr_ln_1] || '').trim(), (f[C.adr_ln_2] || '').trim()].filter(Boolean).join(' '),
        city: (f[C.city] || '').trim(),
        state: (f[C.state] || '').trim().toUpperCase(),
        zip: zip5(f[C.zip]),
        phone: (f[C.phone] || '').trim(),
      };
      let list = affiliations.get(npi);
      if (!list) { list = []; affiliations.set(npi, list); }
      // The file is unique at clinician/enrolment/group/address level, so one NPI arrives
      // many times. Collapse identical practice+location rows on the way in.
      if (!list.some((a) => a.practiceKey === aff.practiceKey && a.zip === aff.zip)) list.push(aff);
      bKept++;
      if (limit && affiliations.size >= limit) return false;
    },
  });

  summary.stages.clinicians_rows_read = bRows;
  summary.stages.clinicians_pc_rows = bKept;
  summary.stages.clinicians_pc_npis = affiliations.size;
  // The spec asks for the specialty strings to be verified against the file rather than
  // guessed, so report what was actually there.
  summary.specialties_matched = PRIMARY_CARE_SPECIALTIES.map((s) => ({ label: s, rows: specCounts.get(s.toUpperCase()) || 0 }));
  summary.specialties_near_miss = [...specCounts.entries()]
    .filter(([k]) => NEAR_MISS_SET.has(k) && !PC_SET.has(k))
    .map(([label, rows]) => ({ label, rows }));
  for (const s of summary.specialties_matched) {
    if (s.rows === 0) summary.warnings.push(`Pri_spec "${s.label}" matched zero rows — CMS may have relabelled it. Check summary.specialties_all.`);
  }
  for (const s of summary.specialties_near_miss) {
    summary.warnings.push(`Pri_spec "${s.label}" (${s.rows} rows) looks like primary care but is not in PRIMARY_CARE_SPECIALTIES.`);
  }
  summary.specialties_all = [...specCounts.entries()].sort((a, b) => b[1] - a[1]).map(([label, rows]) => ({ label, rows }));
  log(`  source B: ${bRows.toLocaleString()} rows -> ${affiliations.size.toLocaleString()} primary care NPIs`);

  // ── Step 3. Source A, joined on NPI. ────────────────────────────────────────────────
  const physPath = join(dataDir, SOURCES.physician.file);
  if (!existsSync(physPath)) throw new Error(`Missing ${physPath}. Run 01-fetch.mjs, or see README for the manual download.`);

  const metrics = new Map(); // npi -> { benes, dual, risk, age, cc{}, zip, state }
  let aRows = 0, aOrgRows = 0, aSuppressed = 0;
  let P, CC;
  let ccMax = 0;

  await readCsv(physPath, {
    onHeader: (h) => {
      P = resolve(h, PHYSICIAN_COLUMNS, {
        file: SOURCES.physician.file,
        required: ['npi', 'entity_code', 'tot_benes', 'risk_score', 'zip5', 'state'],
      });
      CC = findConditionColumns(h, CONDITION_PATTERNS);
      summary.columns.physician = Object.fromEntries(
        Object.keys(PHYSICIAN_COLUMNS).map((k) => [k, P[`${k}__col`]]));
      summary.columns.chronic_conditions = CC;
      const missingCc = CC_DENSITY_CONDITIONS.filter((c) => !CC[c]);
      if (missingCc.length) {
        summary.warnings.push(`No column found for chronic condition(s): ${missingCc.join(', ')}. cc_density will be computed from the rest. Check the data dictionary for this release and update CONDITION_PATTERNS.`);
      }
      CC.__idx = Object.fromEntries(Object.entries(CC).filter(([, v]) => v).map(([k, v]) => [k, h.indexOf(v)]));
    },
    onRow: (f) => {
      aRows++;
      // Keep individuals only; the organisation rows are the same money counted twice.
      if ((f[P.entity_code] || '').trim().toUpperCase() !== 'I') { aOrgRows++; return; }
      const npi = (f[P.npi] || '').trim();
      if (!affiliations.has(npi)) return;
      const benes = num(f[P.tot_benes]);
      if (benes === null || benes < MIN_BENES_PER_NPI) { aSuppressed++; return; }
      const cc = {};
      for (const [cond, i] of Object.entries(CC.__idx)) {
        const v = num(f[i]);
        if (v !== null) { cc[cond] = v; if (v > ccMax) ccMax = v; }
      }
      metrics.set(npi, {
        benes,
        dual: num(f[P.dual_cnt]),
        risk: num(f[P.risk_score]),
        age: num(f[P.avg_age]),
        cc,
        zip: zip5(f[P.zip5]),
        state: (f[P.state] || '').trim().toUpperCase(),
      });
    },
  });

  // The condition columns are a proportion in some releases and a percentage in others.
  // Detect which rather than assume, or cc_density is off by 100x and looks plausible.
  const ccScale = ccMax > 1.5 ? 100 : 1;
  summary.stages.physician_rows_read = aRows;
  summary.stages.physician_org_rows_skipped = aOrgRows;
  summary.stages.physician_below_bene_floor = aSuppressed;
  summary.stages.npis_joined = metrics.size;
  summary.stages.npis_dropped_no_physician_match = affiliations.size - metrics.size;
  summary.cc_scale_detected = ccScale === 100 ? 'percentage (0-100), divided by 100' : 'proportion (0-1)';
  log(`  source A: ${aRows.toLocaleString()} rows -> ${metrics.size.toLocaleString()} NPIs joined ` +
      `(${(affiliations.size - metrics.size).toLocaleString()} dropped: no Medicare FFS volume)`);

  // ── Affiliation dedupe. One clinician, one practice. ────────────────────────────────
  const ruleCounts = { zip: 0, state: 0, largest: 0, only: 0 };
  const primary = new Map(); // npi -> Affiliation
  for (const [npi, list] of affiliations) {
    const m = metrics.get(npi);
    if (!m) continue;
    if (list.length === 1) { primary.set(npi, list[0]); ruleCounts.only++; continue; }
    let chosen = null, rule = null;
    for (const r of AFFILIATION_RULE) {
      const pool = r === 'zip' ? list.filter((a) => a.zip && a.zip === m.zip)
                 : r === 'state' ? list.filter((a) => a.state && a.state === m.state)
                 : list;
      if (!pool.length) continue;
      // Within the winning rule, the spec's conservative default: the largest group, which
      // errs towards excluding a practice rather than towards a bad call for Bullpen.
      chosen = pool.reduce((best, a) => ((a.size || 0) > (best.size || 0) ? a : best), pool[0]);
      rule = r;
      break;
    }
    if (!chosen) { chosen = list[0]; rule = 'largest'; }
    ruleCounts[rule]++;
    primary.set(npi, chosen);
  }
  summary.stages.affiliation_rule_used = ruleCounts;

  // ── Step 5. Roll up to practices. ───────────────────────────────────────────────────
  const practices = new Map();
  for (const [npi, aff] of primary) {
    let p = practices.get(aff.practiceKey);
    if (!p) {
      p = { key: aff.practiceKey, orgPacId: aff.orgPacId, orgName: aff.orgName, solo: aff.solo, size: aff.size, members: [] };
      practices.set(aff.practiceKey, p);
    }
    // num_org_mem can disagree across a group's rows; the largest is the group's real size.
    if ((aff.size || 0) > (p.size || 0)) p.size = aff.size;
    if (!p.orgName && aff.orgName) p.orgName = aff.orgName;
    p.members.push({ npi, aff, m: metrics.get(npi) });
  }
  summary.stages.practices_before_exclusions = practices.size;

  // ── Step 4. Exclusions, applied at practice level and logged. ───────────────────────
  const dropStream = createWriteStream(join(outDir, 'drop-log.csv'));
  dropStream.write(csvLine(['practice_key', 'org_name', 'state', 'provider_count', 'org_member_count', 'panel_total', 'rule', 'matched']));
  const dropCounts = {};
  const kept = [];

  for (const p of practices.values()) {
    const first = p.members[0].aff;
    const displayName = p.orgName || `${first.last}, ${first.first} (solo)`;
    const norm = normOrg(displayName);
    const panel = p.members.reduce((s, x) => s + x.m.benes, 0);
    let rule = null, matched = null;

    let hit;
    if ((hit = phraseHit(norm, SAFETY_NET_KEYWORDS))) { rule = 'safety_net_keyword'; matched = hit; }
    else if ((hit = phraseHit(norm, SYSTEM_KEYWORDS))) { rule = 'system_keyword'; matched = hit; }
    else if ((hit = nameHit(norm, SYSTEM_NAMES))) { rule = 'named_system'; matched = hit; }
    else if (p.size !== null && p.size > GROUP_SIZE_MAX) { rule = 'group_size_over_max'; matched = String(p.size); }
    else if (!p.solo && (p.size === null || p.size < GROUP_SIZE_MIN)) { rule = 'group_size_under_min'; matched = String(p.size); }

    if (rule) {
      dropCounts[rule] = (dropCounts[rule] || 0) + 1;
      dropStream.write(csvLine([p.key, displayName, first.state, p.members.length, p.size, panel, rule, matched]));
      continue;
    }
    p.displayName = displayName;
    p.norm = norm;
    kept.push(p);
  }
  await new Promise((r) => dropStream.end(r));
  summary.stages.practices_dropped = dropCounts;
  summary.stages.practices_after_exclusions = kept.length;
  log(`  exclusions: ${practices.size.toLocaleString()} practices -> ${kept.length.toLocaleString()} kept ` +
      `(${Object.entries(dropCounts).map(([k, v]) => `${k} ${v}`).join(', ') || 'none dropped'})`);

  // ── Step 5 metrics. ─────────────────────────────────────────────────────────────────
  // Weighted means skip NPIs whose value CMS suppressed, in both numerator and
  // denominator — carrying them as zero would quietly drag every average down.
  const wmean = (members, pick) => {
    let wsum = 0, vsum = 0;
    for (const x of members) {
      const v = pick(x);
      if (v === null || v === undefined) continue;
      wsum += x.m.benes;
      vsum += v * x.m.benes;
    }
    return wsum > 0 ? { value: vsum / wsum, coverage: wsum } : { value: null, coverage: 0 };
  };

  for (const p of kept) {
    p.panel = p.members.reduce((s, x) => s + x.m.benes, 0);
    const risk = wmean(p.members, (x) => x.m.risk);
    p.risk = risk.value;
    p.riskCoverage = p.panel > 0 ? risk.coverage / p.panel : 0;
    p.age = wmean(p.members, (x) => x.m.age).value;

    let dualNum = 0, dualDen = 0;
    for (const x of p.members) if (x.m.dual !== null) { dualNum += x.m.dual; dualDen += x.m.benes; }
    p.dualRate = dualDen > 0 ? dualNum / dualDen : null;

    const conds = CC_DENSITY_CONDITIONS.filter((c) => CC[c]);
    const parts = conds.map((c) => wmean(p.members, (x) => x.m.cc[c]).value).filter((v) => v !== null);
    p.ccDensity = parts.length ? (parts.reduce((a, b) => a + b, 0) / parts.length) / ccScale : null;
  }

  // ── Step C. MSSP flags. ─────────────────────────────────────────────────────────────
  await flagMssp(kept, dataDir, summary, log);

  // ── Step 6. Percentiles and tiers. ──────────────────────────────────────────────────
  const inScope = (p) => !states.length || states.includes(p.members[0].aff.state);
  const base = kept.filter((p) => p.risk !== null
    && (PERCENTILE_INCLUDE_SOLOS || !p.solo)
    && (PERCENTILE_SCOPE === 'national' || inScope(p)));
  const sorted = base.map((p) => p.risk).sort((a, b) => a - b);
  const n = sorted.length;
  const lower = (v) => { let lo = 0, hi = n; while (lo < hi) { const mid = (lo + hi) >> 1; if (sorted[mid] < v) lo = mid + 1; else hi = mid; } return lo; };
  const upper = (v) => { let lo = 0, hi = n; while (lo < hi) { const mid = (lo + hi) >> 1; if (sorted[mid] <= v) lo = mid + 1; else hi = mid; } return lo; };

  for (const p of kept) {
    // Percentile rank, mid-ranking ties. The tier boundary is defined by this column, so
    // "at or above the 75th percentile" and "risk_pctile >= 75" cannot drift apart.
    p.pctile = p.risk === null || n === 0 ? null
      : ((lower(p.risk) + upper(p.risk)) / 2 / n) * 100;
    const sizeOk = p.members.length >= GROUP_SIZE_MIN && p.members.length <= GROUP_SIZE_MAX;
    const panelOk = p.panel >= TIER_PANEL_MIN;
    p.tier = p.pctile !== null && sizeOk && panelOk && p.pctile >= TIER1_PCTILE ? 1
           : p.pctile !== null && sizeOk && panelOk && p.pctile >= TIER2_PCTILE ? 2
           : 3;
  }

  // ── Output. ─────────────────────────────────────────────────────────────────────────
  const rows = kept.filter(inScope).sort((a, b) => a.tier - b.tier || (b.pctile ?? -1) - (a.pctile ?? -1));
  const out = createWriteStream(join(outDir, 'practices.csv'));
  out.write(csvLine(OUTPUT_HEADER));
  const r3 = (v) => (v === null || v === undefined ? '' : Math.round(v * 1000) / 1000);
  for (const p of rows) {
    const a = p.members[0].aff;
    out.write(csvLine([
      p.orgPacId, p.displayName, p.members.length, a.addr, a.city, a.state, a.zip, a.phone,
      p.panel, r3(p.risk), p.pctile === null ? '' : Math.round(p.pctile * 10) / 10,
      r3(p.dualRate), r3(p.ccDensity),
      p.tier, p.inMssp ? 'TRUE' : 'FALSE', p.enablementAco ? 'TRUE' : 'FALSE',
      p.members.map((x) => x.npi).join('; '),
      p.members.map((x) => [x.aff.last, x.aff.first].filter(Boolean).join(', ') + (x.aff.cred ? ` ${x.aff.cred}` : '')).join('; '),
      [...new Set(p.members.map((x) => x.aff.spec))].join('; '),
      p.size ?? '', p.solo ? 'TRUE' : 'FALSE', r3(p.riskCoverage), p.msspAcoName || '', r3(p.age),
    ]));
  }
  await new Promise((r) => out.end(r));

  const tierCount = (t) => rows.filter((p) => p.tier === t).length;
  summary.stages.percentile_base = n;
  summary.stages.output_rows = rows.length;
  summary.tiers = { tier1: tierCount(1), tier2: tierCount(2), tier3: tierCount(3) };
  summary.geography = states.length ? states : 'national (SERVABLE_STATES is empty)';

  // The spec's own sanity check. A national Tier 1 outside this range means the dedupe or
  // the exclusions are wrong, and that is worth saying loudly rather than shipping.
  if (!states.length) {
    const t1 = summary.tiers.tier1;
    if (t1 < EXPECTED_TIER1_RANGE[0] || t1 > EXPECTED_TIER1_RANGE[1]) {
      summary.warnings.push(`Tier 1 is ${t1.toLocaleString()} nationally, outside the expected ${EXPECTED_TIER1_RANGE[0].toLocaleString()}–${EXPECTED_TIER1_RANGE[1].toLocaleString()}. Check the affiliation dedupe and the exclusion keyword lists before this list is used.`);
    }
  }

  writeFileSync(join(outDir, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
  log(`  tiers: 1=${summary.tiers.tier1.toLocaleString()}  2=${summary.tiers.tier2.toLocaleString()}  3=${summary.tiers.tier3.toLocaleString()}`);
  for (const w of summary.warnings) log(`  WARNING: ${w}`);
  return { summary, practices: rows, outDir };
}

async function flagMssp(kept, dataDir, summary, log) {
  for (const p of kept) { p.inMssp = false; p.enablementAco = false; p.msspAcoName = ''; }
  const path = join(dataDir, SOURCES.mssp.file);
  if (!existsSync(path)) {
    summary.warnings.push(`No ${SOURCES.mssp.file} in ${dataDir} — in_mssp and enablement_aco are FALSE for every row, which is "unknown", not "no".`);
    return;
  }
  // The join is on normalised legal-business-name within state. The public participant file
  // does not carry TIN, so name is all there is — see README.
  const parts = [];
  let M;
  await readCsv(path, {
    onHeader: (h) => {
      M = resolve(h, MSSP_COLUMNS, { file: SOURCES.mssp.file, required: ['participant_name'] });
      summary.columns.mssp = Object.fromEntries(Object.keys(MSSP_COLUMNS).map((k) => [k, M[`${k}__col`]]));
    },
    onRow: (f) => {
      const name = (f[M.participant_name] || '').trim();
      if (!name) return;
      const acoName = M.aco_name === -1 ? '' : (f[M.aco_name] || '').trim();
      parts.push({
        tokens: orgTokens(name),
        state: M.state === -1 ? '' : (f[M.state] || '').trim().toUpperCase(),
        acoName,
        enablement: !!ENABLEMENT_ACOS.find((e) => normOrg(acoName).includes(e)),
      });
    },
  });

  // Inverted index on (state, token) so this is not 50k x 30k string comparisons.
  const index = new Map();
  parts.forEach((p, i) => {
    for (const t of p.tokens) {
      for (const st of p.state ? [p.state, ''] : ['']) {
        const k = `${st}|${t}`;
        let arr = index.get(k);
        if (!arr) { arr = []; index.set(k, arr); }
        arr.push(i);
      }
    }
  });

  let matched = 0, enablement = 0;
  for (const p of kept) {
    const tokens = orgTokens(p.displayName);
    const state = p.members[0].aff.state;
    const seen = new Set();
    let best = null, bestScore = 0;
    for (const t of tokens) {
      for (const k of [`${state}|${t}`, `|${t}`]) {
        for (const i of index.get(k) || []) {
          if (seen.has(i)) continue;
          seen.add(i);
          const s = jaccard(tokens, parts[i].tokens);
          if (s > bestScore) { bestScore = s; best = parts[i]; }
        }
      }
    }
    if (best && bestScore >= MSSP_MATCH_THRESHOLD) {
      p.inMssp = true;
      p.msspAcoName = best.acoName;
      p.enablementAco = best.enablement;
      matched++;
      if (best.enablement) enablement++;
    }
  }
  summary.stages.mssp = { participants: parts.length, practices_flagged: matched, enablement_flagged: enablement };
  log(`  mssp: ${matched.toLocaleString()} practices flagged (${enablement.toLocaleString()} on an enablement ACO)`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const arg = (name) => { const i = process.argv.indexOf(name); return i === -1 ? null : process.argv[i + 1]; };
  console.log('\nBuilding the primary care target list...\n');
  const statesArg = arg('--states');
  const { summary, outDir } = await build({
    dataDir: arg('--data-dir') || DATA_DIR,
    outDir: arg('--out-dir') || OUT_DIR,
    ...(statesArg ? { states: statesArg.split(',').map((s) => s.trim().toUpperCase()) } : {}),
  });
  console.log(`\nWrote ${join(outDir, 'practices.csv')}, drop-log.csv and summary.json`);
  console.log(`${summary.stages.output_rows.toLocaleString()} practices, geography: ${JSON.stringify(summary.geography)}\n`);
}
