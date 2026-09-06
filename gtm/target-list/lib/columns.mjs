// columns.mjs — resolve the columns we need from the header actually present in the file.
//
// The spec is explicit that the chronic-condition column names have shifted across
// release years, and the same is true of the Doctors and Clinicians file: "lst_nm" and
// "Org_nm" became "Provider Last Name" and "Facility Name" in the 2023 refresh. Hardcoding
// either spelling means the pipeline silently produces empty columns the first time CMS
// republishes. So every column is looked up through an alias list, a missing required
// column is a loud failure, and what matched is printed.

export function resolve(header, aliasMap, { file, required = [] }) {
  const idx = {};
  const seen = new Set(header);
  for (const [key, aliases] of Object.entries(aliasMap)) {
    const hit = aliases.find((a) => seen.has(a));
    idx[key] = hit === undefined ? -1 : header.indexOf(hit);
    idx[`${key}__col`] = hit || null;
  }
  const missing = required.filter((k) => idx[k] === -1);
  if (missing.length) {
    throw new Error(
      `${file}: could not find required column(s) ${missing.join(', ')}.\n` +
      `Header was:\n  ${header.join(', ')}\n` +
      `Add the real spelling to the alias list in config/sources.mjs.`
    );
  }
  return idx;
}

/**
 * Find the chronic-condition percentage columns by pattern rather than by name.
 * Recent releases look like `bene_cc_ph_diabetes_v2_pct`; older ones like
 * `bene_cc_diabetes_pct`. Where several versions of the same condition are present the
 * highest _vN wins, because that is the current CMS definition.
 */
export function findConditionColumns(header, conditionPatterns) {
  const out = {};
  for (const [cond, tokens] of Object.entries(conditionPatterns)) {
    let best = null;
    let bestVer = -1;
    for (const h of header) {
      if (!h.startsWith('bene_cc_') || !h.endsWith('_pct')) continue;
      if (!tokens.some((t) => h.includes(t))) continue;
      const m = h.match(/_v(\d+)_/);
      const ver = m ? Number(m[1]) : 0;
      if (ver > bestVer) { best = h; bestVer = ver; }
    }
    out[cond] = best;
  }
  return out;
}
