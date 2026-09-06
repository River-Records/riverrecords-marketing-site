# Acceptance-test seeds

`03-acceptance-test.mjs` reads `customers.csv` from this directory. It is gitignored: it is a
customer list, and it does not belong in the repo.

Four columns. Header names must match; any of the identifying columns may be blank as long as
one of them identifies the practice:

```csv
org_name,state,zip,npi
"Riverbend Family Medicine, P.C.",MA,02138,
"Harbor Family Practice",ME,04101,1234567890
```

- `org_name` — the practice's legal business name as CMS would have it, not the trading name
  where they differ. A CRM account name usually works; the matcher normalises punctuation and
  corporate suffixes and falls back to fuzzy token matching within the state.
- `state` — required for the name match; it is the blocking key.
- `zip` — optional, not currently used for matching. Useful for eyeballing near-misses.
- `npi` — optional, and the most reliable. Any single clinician NPI at the practice is enough;
  the matcher looks it up in each practice's `npi_list`.

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
