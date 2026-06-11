# Community research sweep (June 2026)

State-by-state research pass that expanded the documented dataset from 137
communities (~180 map arcs) to 329 communities and ~1,030 severed or
subsidy-dependent nonstop links.

## How it was built

- 24 research groups covered all 50 states (plus one pass for national
  headline statistics). Each group researched against DOT/EAS orders, GAO
  reports, Wikipedia airport service histories, and local news archives,
  per `INSTRUCTIONS.md`.
- Raw per-group findings live in `findings/*.jsonl` — one JSON record per
  line: `update` records add severed destinations to communities already in
  the dataset; `new` records add communities.
- `merge.py` folds the findings into the prior seed dataset with validation:
  - drops records/destinations without plausible airport coordinates,
  - drops pre-deregulation losses (last service before 1979),
  - excludes major-airport dehubbing stories (CVG, MEM, STL, PIT, CLE,
    MCI, DAY) as out of scope,
  - dedupes communities reported by more than one group.
- `validate.mjs` removes any point the map's geoAlbersUsa projection cannot
  draw (e.g. Saskatoon YXE, reported as a lost cross-border link).
- `gen.py` regenerates `src/data/communities.ts` and `src/data/hubs.ts`.
- `report.txt` is the full merge audit: every update, addition, skip, and
  the per-record correction notes that still deserve a human pass.

## Verification semantics

`confirmed` = the agent traced the service-loss facts to a DOT order, GAO
report, or contemporaneous news story (citation in the record's `source`).
`needs-check` = scaffolded from weaker sourcing; the `source` cell says what
to confirm. 263 of 329 records are `confirmed`.
