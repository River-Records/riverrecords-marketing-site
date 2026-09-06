// sources.mjs — where each file comes from and what its columns are called.
//
// Dataset identity is stable; column spelling and download URLs are not. Everything
// version-sensitive lives here so a CMS refresh is a config edit, not a code change.

export const DATA_DIR = 'gtm/target-list/data';
export const OUT_DIR = 'gtm/target-list/out';

export const SOURCES = {
  // A. Medicare Physician & Other Practitioners — by Provider.
  // One row per NPI per calendar year. Fee-for-service only; see README on the MA blind spot.
  physician: {
    file: 'physician-by-provider.csv',
    catalog: 'data-api',
    titleMatch: /Medicare Physician & Other Practitioners.*by Provider/i,
    landing: 'https://data.cms.gov/provider-summary-by-type-of-service/medicare-physician-other-practitioners/medicare-physician-other-practitioners-by-provider',
  },
  // B. Doctors and Clinicians National Downloadable File. Practice identity and size.
  clinicians: {
    file: 'doctors-and-clinicians.csv',
    catalog: 'provider-data',
    datasetId: 'mj5m-pzi6',
    landing: 'https://data.cms.gov/provider-data/dataset/mj5m-pzi6',
  },
  // C. MSSP ACO participants. Flag only, never a filter.
  mssp: {
    file: 'mssp-aco-participants.csv',
    catalog: 'data-api',
    titleMatch: /Shared Savings Program.*Participant/i,
    landing: 'https://data.cms.gov/medicare-shared-savings-program/shared-savings-program-accountable-care-organizations',
    optional: true,
  },
  // D. NPPES. Optional in v1 — see README, "What NPPES is and is not good for here".
  nppes: {
    file: 'nppes.csv',
    landing: 'https://download.cms.gov/nppes/NPI_Files.html',
    optional: true,
  },
};

// Column aliases, newest spelling first. `resolve()` takes the first one present.
export const PHYSICIAN_COLUMNS = {
  npi: ['rndrng_npi'],
  last_org_name: ['rndrng_prvdr_last_org_name'],
  first_name: ['rndrng_prvdr_first_name'],
  credentials: ['rndrng_prvdr_crdntls'],
  provider_type: ['rndrng_prvdr_type'],
  entity_code: ['rndrng_prvdr_ent_cd'],
  city: ['rndrng_prvdr_city'],
  state: ['rndrng_prvdr_state_abrvtn'],
  zip5: ['rndrng_prvdr_zip5'],
  tot_benes: ['tot_benes'],
  dual_cnt: ['bene_dual_cnt'],
  risk_score: ['bene_avg_risk_scre'],
  avg_age: ['bene_avg_age'],
};

export const CLINICIAN_COLUMNS = {
  npi: ['npi'],
  ind_pac_id: ['ind_pac_id'],
  last_name: ['provider_last_name', 'lst_nm'],
  first_name: ['provider_first_name', 'frst_nm'],
  credentials: ['cred'],
  pri_spec: ['pri_spec'],
  sec_spec_all: ['sec_spec_all'],
  org_name: ['facility_name', 'org_nm'],
  org_pac_id: ['org_pac_id'],
  num_org_mem: ['num_org_mem'],
  adr_ln_1: ['adr_ln_1'],
  adr_ln_2: ['adr_ln_2'],
  city: ['city_town', 'cty', 'city'],
  state: ['state', 'st'],
  zip: ['zip_code', 'zip'],
  phone: ['telephone_number', 'phn_numbr'],
};

export const MSSP_COLUMNS = {
  aco_id: ['aco_id', 'aco_num'],
  aco_name: ['aco_name', 'aco_nm'],
  participant_name: ['participant_name', 'pcpt_lgl_bus_nm', 'aco_participant_name', 'acopcpt_lgl_bus_nm', 'lbn'],
  participant_dba: ['participant_dba', 'pcpt_dba_nm', 'dba'],
  state: ['state', 'aco_state', 'pcpt_st', 'st'],
};

// Chronic-condition columns are matched by pattern, not by name — see columns.mjs.
export const CONDITION_PATTERNS = {
  chf: ['hf_nonihd', '_chf', 'heart_failure'],
  ckd: ['ckd', 'kidney'],
  copd: ['copd'],
  diabetes: ['diabetes', 'diab'],
  // Pulled for completeness; not part of cc_density. Add to CC_DENSITY_CONDITIONS to use.
  depression: ['depress'],
  ihd: ['_ihd'],
  stroke: ['stroke'],
};

// Step 5 of the spec: cc_density is the mean of these four, weighted by tot_benes.
export const CC_DENSITY_CONDITIONS = ['chf', 'ckd', 'copd', 'diabetes'];
