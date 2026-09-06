// exclusions.mjs — step 4. Who comes off the list, and on what evidence.
//
// Public data does not state ownership, so most of this is a keyword proxy over the
// practice's legal name. Keyword proxies over-fire ("Hospital Road Family Practice" is
// not hospital-owned) and under-fire (a system-owned practice trading under a local name
// is invisible). That is why every drop is written to drop-log.csv with the rule and the
// exact token that matched: the list is meant to be eyeballed and tuned, not trusted.
//
// Keywords are matched against the normalised org name (upper case, punctuation removed)
// as whole-word phrases, so "CLINIC" does not match "CLINICAL".

// Safety-net organisations. These are excluded on mission, not on quality: they are
// grant-funded, sliding-scale, and buy differently.
export const SAFETY_NET_KEYWORDS = [
  'COMMUNITY HEALTH', 'NEIGHBORHOOD HEALTH', 'HEALTH CENTER', 'HEALTH CENTRE',
  'FEDERALLY QUALIFIED', 'FQHC', 'RURAL HEALTH CLINIC', 'MIGRANT', 'TRIBAL',
  'INDIAN HEALTH', 'FREE CLINIC', 'HEALTH DEPARTMENT', 'PUBLIC HEALTH',
];

// NPPES taxonomy codes for FQHC / RHC. Note these sit on the *organisation's* Type 2 NPI,
// not on the clinician NPIs this pipeline joins on — see README, "What NPPES is and is
// not good for here". Used only when an NPPES organisation extract is supplied.
export const SAFETY_NET_TAXONOMIES = ['261QF0400X', '261QR1300X'];

// Health-system and hospital ownership, by name proxy.
export const SYSTEM_KEYWORDS = [
  'HEALTH SYSTEM', 'HOSPITAL', 'MEDICAL CENTER', 'MEDICAL CENTRE', 'UNIVERSITY',
  'CLINIC FOUNDATION', 'HEALTHCARE SYSTEM', 'REGIONAL HEALTH', 'MEMORIAL HEALTH',
  'SCHOOL OF MEDICINE', 'COLLEGE OF MEDICINE', 'FACULTY PRACTICE',
];

// Named systems, national roll-ups and payer-owned groups. Matched as substrings of the
// normalised name, so 'OPTUM' catches 'OPTUM MEDICAL GROUP' and 'OPTUMCARE'.
export const SYSTEM_NAMES = [
  'OPTUM', 'KAISER', 'ASCENSION', 'TRINITY HEALTH', 'HCA', 'PROVIDENCE', 'COMMONSPIRIT',
  'CHRISTUS', 'ADVOCATE', 'ATRIUM', 'BAYLOR SCOTT', 'BANNER', 'BON SECOURS', 'CLEVELAND CLINIC',
  'GEISINGER', 'INTERMOUNTAIN', 'MAYO', 'MERCY HEALTH', 'NORTHWELL', 'NOVANT', 'OCHSNER',
  'SANFORD HEALTH', 'SENTARA', 'SSM HEALTH', 'SUTTER', 'TENET', 'UNITYPOINT', 'UPMC',
  'CAREMAX', 'CANO HEALTH', 'ONEMEDICAL', 'ONE MEDICAL', 'VILLAGEMD', 'VILLAGE MEDICAL',
  'CITYBLOCK', 'CHENMED', 'DEDICATED SENIOR', 'JENCARE', 'IORA', 'OAK STREET',
];

// C. ACO enablement companies. A flag, never a filter — these practices already have a
// risk-capture tool and a chart-review workflow, which makes them a harder sell or a
// channel conversation. Knowing before the call is the whole point.
export const ENABLEMENT_ACOS = [
  'ALEDADE', 'PRIVIA', 'AGILON', 'VYTALIZE', 'PEARL HEALTH', 'WELLVANA', 'EVERGREEN',
  'CAREMAX', 'MILLENNIUM PHYSICIAN', 'PHYSICIANS OF SOUTHWEST', 'CHESS HEALTH',
  'CAREALLIES', 'ARCADIA', 'HABITAT HEALTH', 'ETHOS HEALTH', 'ELATION', 'STELLAR HEALTH',
];

// Minimum token overlap for a practice name to count as the same organisation as an MSSP
// participant. 0.85 is deliberately strict: a false positive here mislabels a good target
// as already-enabled and Bullpen never calls it.
export const MSSP_MATCH_THRESHOLD = 0.85;
