// cohort.mjs — who is in the cohort, and how it is scored and tiered.

// Step 1. CMS's own Pri_spec labels, which are not always the obvious ones — "Family
// Practice", not "Family Medicine". Matched case-insensitively; the build prints every
// Pri_spec value it saw alongside its row count so these can be checked against the file
// rather than trusted, as the spec asks.
export const PRIMARY_CARE_SPECIALTIES = [
  'Internal Medicine',
  'Family Practice',
  'General Practice',
  'Geriatric Medicine',
  'Nurse Practitioner',
  'Physician Assistant',
];

// Values close enough to the list above that seeing one probably means CMS relabelled a
// specialty and the list needs updating. Reported, never silently included.
export const NEAR_MISS_SPECIALTIES = [
  'Family Medicine', 'General Internal Medicine', 'Geriatric Practice',
  'Adult Health Nurse Practitioner', 'Primary Care', 'Preventive Medicine',
];

// Step 2. Group size, from num_org_mem. Solos (blank org, or a group of one) are kept and
// tiered separately so they can be measured rather than argued about.
export const GROUP_SIZE_MIN = 2;
export const GROUP_SIZE_MAX = 10;

// Source A is unreliable below about 11 beneficiaries, and CMS suppresses the risk score
// there outright.
export const MIN_BENES_PER_NPI = 11;

// Step 6 tier boundaries.
export const TIER_PANEL_MIN = 200;
export const TIER1_PCTILE = 75;
export const TIER2_PCTILE = 50;

// Percentiles are computed against the national cohort, not against the servable states.
// Two reasons: the state list is a commercial decision that will change, and a national
// base means adding a state later does not re-tier every practice already in Bullpen.
// Set to 'servable' to score within the geography instead.
export const PERCENTILE_SCOPE = 'national';

// Whether solo practices sit in the percentile base. They are Tier 3 either way, but they
// are numerous and lower-panel, so including them shifts the 75th percentile.
export const PERCENTILE_INCLUDE_SOLOS = true;

// Geography. Empty means national — Jake to supply the servable states.
// e.g. ['MA','NH','RI','CT','ME','VT']
export const SERVABLE_STATES = [];

// Volume sanity check from the spec: Tier 1 should land in the low thousands nationally.
// Outside this range something in the dedupe or the exclusions is wrong, and the build
// says so rather than handing over a plausible-looking file.
export const EXPECTED_TIER1_RANGE = [1000, 6000];

// How a clinician's many rows in the Doctors and Clinicians file collapse to one practice.
// The spec offers two rules — largest num_org_mem, or the row whose address matches source
// A's ZIP — and they disagree in exactly the case that matters (a clinician whose main
// 4-person practice is not where they moonlight). ZIP first, then state, then the spec's
// conservative default. The build reports how many NPIs each rule resolved.
export const AFFILIATION_RULE = ['zip', 'state', 'largest'];
