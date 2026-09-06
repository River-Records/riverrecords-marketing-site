# Acceptance-test seeds

`03-acceptance-test.mjs` reads `customers.csv` from this directory. It is gitignored: it is a
customer list, and it does not belong in the repo.

Four required columns plus two optional ones. Header names must match; any of the identifying
columns may be blank as long as one of them identifies the practice:

```csv
org_name,state,zip,npi,segment,source
"Riverbend Family Medicine, P.C.",MA,02138,,addressable,HubSpot company 123
"Harbor Family Practice",ME,04101,1234567890,addressable,HubSpot company 456
```

- `org_name` — the practice's legal business name as CMS would have it, not the trading name
  where they differ. A CRM account name usually works; the matcher normalises punctuation and
  corporate suffixes and falls back to fuzzy token matching within the state.
- `state` — required for the name match; it is the blocking key.
- `zip` — optional, not currently used for matching. Useful for eyeballing near-misses.
- `npi` — optional, and the most reliable. Any single clinician NPI at the practice is enough;
  the matcher looks it up in each practice's `npi_list`.
- `segment` — optional label, reported as a breakdown. Worth setting: a CRM-derived seed list
  is not homogeneous, and a pediatric or non-US account cannot appear in a Medicare list at
  all. Averaging those in with the addressable accounts hides which group is actually failing.
- `source` — optional, ignored by the matcher. Where the row came from, so a surprising result
  can be traced back to a record rather than re-litigated.

`customers.csv` is generated from the CRM — every customer-stage company and contact in
portal 46752060, deduplicated to practices, with a `segment` label and the record it came
from. Regenerate it when the customer base moves.

Seed it with two groups, per the spec: our existing customer base, and the Coffman-adjacent
network. Mixing them in one file is fine — but if you want to know whether they behave
differently, run the test twice with two files:

```bash
node gtm/target-list/03-acceptance-test.mjs gtm/target-list/seeds/customers.csv
node gtm/target-list/03-acceptance-test.mjs gtm/target-list/seeds/coffman.csv
```

## Reading the result

The verdict is the headline, but the two lists under it are the useful part:

- **Seeds our own step 4 exclusions removed** are false positives in the keyword lists. Fix
  `config/exclusions.mjs` before touching the scoring — a customer we already have is proof
  the rule is too aggressive.
- **Seeds not in the list at all** are usually a Medicare Advantage panel that source A cannot
  see, a group larger than 10, or a CRM name that does not match the CMS legal business name.

Only once those are clean does a NOT VALIDATED verdict mean the *scoring* is wrong.

**Tier is not the only reading, and on this customer base it is the misleading one.** Tier 1
requires 2–10 providers, so a solo practice cannot reach it however complex its panel — and
much of our customer base is solo. So the test also reports the risk percentile of the matched
seeds, which asks the question the tier boundary is a proxy for. A `SCORING VALIDATED, TIERING
DOES NOT FIT` verdict means the score works and the size constraint is what is failing: the
decision then is whether solos need a tier of their own, not whether to change the score.
