# High-complexity independent primary care — target list build

Builds a scored, practice-level target list for Bullpen outbound from public, provider-level
CMS files. No PHI at any step; every input is a public download.

Implements the build spec of 2026-09-06 (v1). Where this code departs from the spec it says
so below, under **Where this differs from the spec, and why**.

## Run it

```bash
node gtm/target-list/01-fetch.mjs                              # resolve + download the CMS files
node --max-old-space-size=4096 gtm/target-list/02-build.mjs     # build the list
node gtm/target-list/03-acceptance-test.mjs                     # seed check — do not skip
node gtm/target-list/verify-pipeline.mjs                        # assert the arithmetic (no network)
```

`02-build.mjs` takes `--data-dir`, `--out-dir` and `--states MA,NH,RI` if you want to override
the config without editing it.

Outputs land in `gtm/target-list/out/`:

| file | what it is |
|---|---|
| `practices.csv` | the deliverable — one row per practice, sorted by tier then `risk_pctile` desc |
| `drop-log.csv` | every practice removed at step 4, with the rule and the exact token that matched |
| `summary.json` | counts at every stage, the columns that resolved, the `Pri_spec` values actually seen, and the volume sanity check |

`data/`, `out/` and `seeds/*.csv` are gitignored. The source files are hundreds of megabytes,
the output is regenerable, and the seed file is a customer list.

## Read the drop log

The exclusions are a keyword proxy over a legal business name, because public data does not
state ownership. They over-fire (`Hospital Road Family Practice` is not hospital-owned) and
under-fire (a system-owned practice trading under a local name is invisible). `drop-log.csv`
exists so that is a tuning problem rather than an invisible one. Eyeball it before the first
send, and again after any change to `config/exclusions.mjs`.

## Configuration

Everything tunable is in `config/`, nothing is hardcoded in the pipeline:

- `cohort.mjs` — specialties, group size, panel floor, tier boundaries, **`SERVABLE_STATES`**
- `exclusions.mjs` — the safety-net, health-system and enablement-ACO keyword lists
- `sources.mjs` — dataset ids, column aliases, chronic-condition patterns

## Things in here that are not decoration

**The drop log.** See above.

**`risk_coverage`.** The share of a practice's panel that actually had a risk score. CMS
suppresses the score on small counts, and a practice whose score rests on 30% of its panel is
a weaker signal than one at 100%. Weighted means skip suppressed values in both numerator and
denominator — carrying them as zero would quietly drag every average down — so this column is
the only way to see that happening.

**The volume sanity check.** The spec's own expectation is Tier 1 in the low thousands
nationally. `02-build.mjs` warns when it lands outside `EXPECTED_TIER1_RANGE`, because the
failure mode of a broken dedupe is not a crash — it is a plausible-looking file.

**The acceptance test.** The spec calls it the whole point of building the list this way, and
it is the only evidence the scoring means anything. Risk score is a proxy for panel
complexity; nothing guarantees it is the proxy that predicts who buys. It reports three ways —
by tier, by segment, and by raw risk percentile — because on our current customer base the
tier reading alone is misleading: Tier 1 requires 2–10 providers and much of that base is
solo, so it can fail the tier bar while the *score* is working perfectly.

## Known blind spots, carried deliberately

**Medicare Advantage is invisible.** Source A is fee-for-service only. A practice with a heavy
MA panel looks smaller and less complex than it is. The spec accepts this for v1 and so does
this code — but note it interacts with geography: in high-MA-penetration states a real target
can fall under the 200-beneficiary floor purely because CMS cannot see most of their panel.
Worth knowing when the servable-state list is chosen.

**Risk score is partly a coding artefact.** `bene_avg_risk_scre` reflects the diagnoses the
practice actually documented, not the illness burden it carries. A practice that codes well
scores high; a complex practice that codes poorly scores lower — and the second one is the
better prospect for us. So the list has a mild bias towards practices that need us least.
`cc_density` and `dual_rate` are the counterweights: both are in the output and both are
sortable. This is the first thing to look at if the acceptance test comes back NOT VALIDATED.

**Names, not identifiers, do most of the non-NPI joining.** Every match to an MSSP participant
or an exclusion keyword runs through a name a human typed into an enrolment form.

## What NPPES is and is not good for here

The spec has NPPES supplying FQHC/RHC taxonomy codes for the exclusion step. **That does not
work as written, and it is the one correction worth making before anyone spends a day on it.**
Taxonomies `261QF0400X` (FQHC) and `261QR1300X` (RHC) sit on the *organisation's* Type 2 NPI.
Source B gives clinician NPIs, and a family physician working at an FQHC carries an individual
taxonomy such as `207Q00000X`, not the facility code. Joining clinician NPIs to those two codes
matches close to nothing.

Three ways to actually get it, in order of effort:

1. **Keyword only** (what this code does by default). The safety-net names are distinctive —
   "Community Health", "Neighborhood Health", "Health Center" — so the recall is decent.
2. **HRSA Health Center Program data.** A direct list of funded health-center sites with names
   and addresses. Far smaller than NPPES and purpose-built for this question.
3. **NPPES organisation records.** Filter the dissemination file to entity type 2 with those
   taxonomies, then match to `Org_nm` + ZIP. A ~1 GB download for one flag.

The other reason NPPES was in the spec was practice phone — and that is already unnecessary.
The Doctors and Clinicians file carries `Telephone Number`, and the pipeline reads it. **v1
needs no NPPES download at all.**

## Where this differs from the spec, and why

**The affiliation dedupe.** The spec offers two rules — "the row with the largest
`num_org_mem`, or the address matching source A's ZIP" — and they disagree in exactly the case
the spec is worried about. A clinician whose real practice has 4 providers and who also has a
row at a 40-provider group: "largest" reads them as a 40-provider group and the size filter
deletes them; ZIP-matching keeps the practice we want. Since the stated goal is "don't let a
clinician's second location inflate the practice count", the rules run in the order
`zip → state → largest`, with the spec's conservative default last. `summary.json` reports how
many NPIs each rule resolved. `AFFILIATION_RULE` in `config/cohort.mjs` changes the order.

**MSSP joins on name, not TIN.** The spec says "by organization name and TIN". The public
participant file does not publish TINs. Name within state is all there is, thresholded at 0.85
token overlap — deliberately strict, because a false positive mislabels a good target as
already-enabled and Bullpen never calls it. Absent an MSSP file, `in_mssp` is FALSE for every
row, which means *unknown*, not *no*; the build warns when that happens.

**Percentiles are computed nationally, then geography is applied at output.** The spec says
percentiles are computed "within this filtered primary care cohort", which is what happens —
but the cohort is the national one, so adding a state to `SERVABLE_STATES` later does not
re-tier every practice already sitting in Bullpen. Set `PERCENTILE_SCOPE = 'servable'` to score
within the geography instead.

**Solos are kept, scored, and tiered separately.** Per the spec, a blank `Org_nm` means solo,
not missing; a group of one is treated the same way. They carry a real `risk_pctile` and sit in
the percentile base by default (`PERCENTILE_INCLUDE_SOLOS`), so they can be measured rather
than argued about, but they cannot reach Tier 1 or 2 — those require 2–10 providers.

**Five columns are appended to the spec's output header**, after all of its columns and in its
order, so anything reading by header name is unaffected: `org_member_count` (the group size
CMS reports, which is not the same as our count of primary care NPIs), `is_solo`,
`risk_coverage`, `mssp_aco_name` and `avg_age`.

**`dual_rate` is an output column and a sort key, never a tier boundary** — as specified. It is
correlated with complexity rather than causal, and filtering on it pulls back in exactly the
safety-net organisations step 4 removes.

## Column drift

CMS renames columns between releases, and the pipeline is built to survive it rather than
silently produce empty columns:

- Every column is looked up through an alias list in `config/sources.mjs`. Both spellings of
  the Doctors and Clinicians file are handled (`lst_nm` / `Provider Last Name`, `Org_nm` /
  `Facility Name`), as are the lowercase JSON-API and TitleCase CSV headers of source A.
- The chronic-condition columns are found by *pattern*, newest `_vN` winning, because their
  names have shifted repeatedly. `summary.json` reports exactly which columns matched — check
  it against the data dictionary for the release you downloaded, as the spec asks.
- Their scale is detected, not assumed: some releases express them 0–1 and some 0–100. Getting
  this wrong makes `cc_density` off by 100× and still plausible-looking.
- A missing *required* column is a loud failure with the real header printed, not a silent null.
- The `Pri_spec` labels are CMS's own and are not always the obvious ones — "Family Practice",
  not "Family Medicine". `summary.json` lists every value seen with its row count, and the build
  warns when a configured specialty matched zero rows or when a near-miss label appears.

## Verifying

`verify-pipeline.mjs` runs the whole pipeline against a synthetic fixture whose expected values
are worked out by hand, and asserts 54 of them: every rollup and weighted average, the
suppressed-value handling, each exclusion rule, the multi-affiliation dedupe, the percentile
boundaries, both MSSP flags, the geography filter, the column-alias resolution, and the
keyword-matching edge cases that would otherwise drop independent practices silently.

It needs no network and no CMS download, which is the point — the real files are large,
republished annually, and unreachable from some environments.
