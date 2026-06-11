# DOT Data Analysis — Revia Route-Opportunity Dataset
**Analyst:** Claude Code  
**Date:** 2026-06-11  
**Files reviewed:** `lost_routes_seed.csv`, `aircraft_reference.csv`, `airport_supplement.csv`, `overcapable_seed.csv`, `communities.geojson`, `METHODOLOGY.md`, `build_seeds.py`, `src/data/communities.ts`

---

## 1. Dataset Overview

| File | Rows | Purpose |
|---|---|---|
| `lost_routes_seed.csv` | 15 communities | Authoritative sourced seed: communities that lost or severely diminished service |
| `communities.ts` | 25 communities | Front-end dataset — superset of the CSV; includes 10 additional scaffolded entries |
| `communities.geojson` | 15 features | Map-ready GeoJSON, mirrors the CSV exactly (not the TS file) |
| `overcapable_seed.csv` | 25 routes | Short routes flown by grossly over-ranged aircraft |
| `aircraft_reference.csv` | 62 type codes | Aircraft → seats / range / category lookup |
| `airport_supplement.csv` | 6 airports | Small/EAS airports missing from OpenFlights (Kingman, Brookings, Wolf Point, Lewistown, Cumberland, Franklin) |

---

## 2. CSV vs. communities.ts Cross-Reference

### 2.1 Population and record counts

The CSV (15 rows) is a strict subset of communities.ts (25 rows). Every CSV city appears in communities.ts with matching coordinates, population, status, and source text. The 10 cities present **only** in communities.ts were added directly to the TS file without being pushed back into the CSV or GeoJSON — this is the principal structural gap (see section 5).

### 2.2 Field-by-field discrepancies

The following differences were found between CSV values and their communities.ts counterparts.

#### Athens, GA (AHN) — verification flag mismatch
| Field | CSV | communities.ts |
|---|---|---|
| `verification` | `needs-check` | `confirmed` |

The CSV marks Athens as `needs-check` because the EAS operator pre-2014 still needs to be confirmed. communities.ts sets `verified: true` (derived from `verification: "confirmed"`). This is incorrect — the UI will display a green "confirmed" badge for a record that is explicitly unverified in the authoritative source. **Fix: change Athens verification in communities.ts to `"needs-check"`.**

#### El Dorado, AR (ELD) — verification flag mismatch
| Field | CSV | communities.ts |
|---|---|---|
| `verification` | `needs-check` | `confirmed` |

The CSV marks El Dorado as `needs-check`. communities.ts sets `verification: "confirmed"`. Same UI-honesty problem as Athens. **Fix: change El Dorado verification in communities.ts to `"needs-check"`.**

#### Cumberland, MD (CBE) — formerHubs representation
| Field | CSV | communities.ts |
|---|---|---|
| `former_hubs` | `"(confirm)"` | `[]` (empty array) |

The CSV acknowledges the hub is unknown; communities.ts silently uses an empty array. Both are defensible, but the TS should carry a comment noting this is unconfirmed rather than simply absent. Minor.

#### Prescott, AZ (PRC) — formerHubs representation
| Field | CSV | communities.ts |
|---|---|---|
| `former_hubs` | `"PHX (lost), now DEN/LAX"` | `["PHX"]` |

The TS only lists PHX, dropping the current DEN/LAX service context. The detail field covers this narratively, but the `formerHubs` array being PHX-only could mislead route-matching logic if that field is ever used programmatically. Consider adding a separate `currentHubs` or `restoredHubs` field for Prescott's case.

#### Glasgow, MT (GGW) and other EAS-only communities — formerHubs formatting
| Field | CSV | communities.ts |
|---|---|---|
| `former_hubs` (Glasgow) | `"BIL/MSP (EAS)"` | `["BIL", "MSP"]` |
| `former_hubs` (Devils Lake) | `"MSP (EAS)"` | `["MSP"]` |
| `former_hubs` (Wolf Point) | `"BIL (EAS)"` | `["BIL"]` |

The TS correctly parses the hub codes into arrays but loses the "(EAS)" qualifier. This is a minor semantic loss — the array form is better for programmatic use, but the EAS context is lost. The `detail` field partially covers this.

### 2.3 Fields present in communities.ts but absent from the CSV

communities.ts carries `detail` (long narrative), `populationSource`, and `verification` (the string). The CSV uses `human_detail` and `population_source` as field names — these are equivalent but named differently. The pipeline script (`build_seeds.py`) does not output the TS format directly; the TS was hand-authored from the CSV. This is acceptable but means any future re-run of `build_seeds.py` would not auto-update the TS.

### 2.4 All coordinates verified

All 15 shared communities have identical `[lng, lat]` pairs in the CSV and communities.ts. The GeoJSON geometry coordinates also match the CSV exactly. No coordinate errors found.

### 2.5 All population figures verified

All 15 shared communities have identical population figures (US Census 2020) across CSV and communities.ts.

---

## 3. Overcapable Routes Analysis

### 3.1 What the data shows

The 25 routes in `overcapable_seed.csv` represent short domestic segments (63–346 nm) operated by aircraft with maximum range far exceeding the mission. All 25 are flagged SEVERE (capability ratio ≥ 5.0). Key patterns:

**Extreme over-ranging (ratio > 30):**

| Route | Distance (nm) | Aircraft | Range (nm) | Ratio |
|---|---|---|---|---|
| HNL–OGG (inter-island Hawaii) | 87 | A321neo | 4,000 | 45.8 |
| SAN–LAX | 95 | A320 | 3,300 | 34.8 |
| DEN–COS | 63 | E175 (long wing) | 2,200 | 34.7 |
| LAX–SBA | 77 | E175 (long wing) | 2,200 | 28.6 |
| DTW–CLE | 83 | E175 (long wing) | 2,200 | 26.6 |

**Two distinct opportunity pools (as described in METHODOLOGY.md):**

**Pool 1 — Regional jets over-ranged for the mission (direct R-75/R-100 swap opportunities):**
9 routes use E175, CRJ-900, or E190 on hops of 63–203 nm. These are the cleanest Phase-1 commercial story — same seat count, a fraction of the trip fuel.

| Route | nm | Aircraft | Seats | Ratio | Revia variant |
|---|---|---|---|---|---|
| DEN–COS | 63 | E175 | 76 | 34.7 | R-75 |
| LAX–SBA | 77 | E175 | 76 | 28.6 | R-75 |
| DTW–CLE | 83 | E175 | 76 | 26.6 | R-75 |
| ORD–GRR | 119 | E175 | 76 | 18.5 | R-75 |
| IAH–AUS | 122 | E175 | 76 | 18.1 | R-75 |
| PHX–TUS | 96 | CRJ-900 | 76 | 16.2 | R-75 |
| BOS–LGA | 160 | E175 | 76 | 13.7 | R-75 |
| JFK–BOS | 162 | E190 | 100 | 17.3 | R-100 |

**Pool 2 — Mainline narrowbodies on short hops (Phase-2 / narrowbody story, above R-100):**
16 routes use A319/A320/A321/737-series on 87–346 nm hops. These score the highest absolute ratios but sit above the regional family. They reinforce the "third manufacturer" thesis and a frequency/right-sizing argument but should not be folded into the R-50/75/100 TAM.

### 3.2 SBA cross-reference — overcapable data confirms communities.ts entry

Santa Barbara (SBA) appears in both datasets:
- In `overcapable_seed.csv`: LAX–SBA is a 77 nm E175 hop (ratio 28.6, SEVERE, maps to R-75).
- In communities.ts: SBA is listed as `diminished`, `restorableBy: "R-100"`.

**Discrepancy:** The overcapable data suggests R-75 is the right fit for the LAX–SBA mission (76-seat E175 incumbent). communities.ts assigns R-100. These are not necessarily contradictory — R-100 could reflect a higher-frequency vision for SBA's multiple former hubs (LAX, SFO) — but the two sources should be reconciled. If the operative question is "what replaces the incumbent aircraft on the current mission," R-75 is the better mapping for the LAX–SBA segment specifically.

### 3.3 COS (Colorado Springs) — overcapable candidate not in communities.ts

Colorado Springs (COS) appears as a destination in the overcapable data (DEN–COS, 63 nm, E175, ratio 34.7). COS is not in communities.ts at all. This is appropriate — COS has not lost service; it is an over-capability play, not a lost-service story. The data pipelines correctly keep these as separate pools. No action needed, but worth noting in investor materials.

### 3.4 Capability ratio methodology note

The ratio formula (`aircraft_max_range_nm / stage_length_nm`) uses the nominal manufacturer maximum range. For routes like HNL–OGG (87 nm, A321neo ratio 45.8) and SAN–LAX (95 nm, A320 ratio 34.8), the numbers are correct but the missions are mainline/high-frequency shuttle routes where gauge and frequency economics differ from thin-market regional flying. Do not conflate these with EAS/thin-route opportunities.

---

## 4. Aircraft Reference and Revia Variant Mapping

### 4.1 Revia envelope per METHODOLOGY.md

| Variant | Seats | Range (nm) |
|---|---|---|
| R-50 | ~50 | ~1,400 |
| R-75 | ~76 | ~900 |
| R-100 | ~100 | ~550 |

Variant assignment logic (from `revia_route_analysis.py` via `build_seeds.py`):
- ≤55 seats → R-50
- 56–85 seats → R-75
- 86–110 seats → R-100
- >110 seats → above regional family (Phase-2 / narrowbody)

### 4.2 Lost-routes communities — all mapped R-50

Every community in `lost_routes_seed.csv` is assigned `R-50`. This is correct for their incumbent aircraft context (Beech 1900D 19-seat, Cessna Caravan 9-seat, Saab 340 34-seat, CRJ-200 50-seat). The R-50's ~1,400 nm range is far beyond these markets' typical 200–600 nm missions, so range is not a constraint — the seat/economics match is the driver.

### 4.3 communities.ts — mixed variant assignments not matching the R-50 default

Ten communities in communities.ts that are NOT in the CSV carry non-R-50 assignments:

| City | IATA | `restorableBy` | Seats at incumbent aircraft | Assessment |
|---|---|---|---|---|
| Paducah, KY | PAH | R-50 | CRJ-200 (50-seat) | Correct |
| Lynchburg, VA | LYH | R-50 | CRJ-200 (50-seat) "50-seat jets aged out" | Correct |
| Wausau, WI | AUW | R-50 | Small regionals (Air Choice One uses Cessna/Saab) | Correct |
| Marquette, MI | MQT | **R-75** | SkyWest/Delta Connection — likely CRJ-200/CRJ-700 | Needs verification |
| Eugene, OR | EUG | **R-100** | Multiple regionals, 6 routes lost | Plausible; verify incumbent fleet mix |
| Rochester, MN | RST | **R-75** | SkyWest/Delta Connection | Needs verification |
| Santa Barbara, CA | SBA | **R-100** | Multiple regionals | Conflicts with overcapable data (R-75 on LAX–SBA) |
| Cheyenne, WY | CYS | R-50 | American Eagle (CRJ-200 era) | Correct |
| Dubuque, IA | DBQ | R-50 | American Eagle (CRJ-200) | Correct |
| Toledo, OH | TOL | **R-75** | Multiple regionals | Needs verification |

**Key finding:** Marquette (MQT), Rochester (RST), and Toledo (TOL) are assigned R-75 in communities.ts. This implies the intended incumbent replacement is a 76-seat class aircraft. SkyWest/Delta Connection primarily operated CRJ-200 (50-seat) and CRJ-700/CRJ-900/E175 (70-76-seat) on these markets. If the last aircraft type on these routes was 50-seat class, R-50 would be the correct mapping; if 70-76-seat class, R-75 is right. These assignments are `needs-check` in the source and should be verified against T-100 data for the specific last year of service.

**Santa Barbara (SBA) conflict:** As noted in section 3.2, communities.ts says R-100 but the overcapable data (LAX–SBA E175, 76 seats) points to R-75. If the strategic goal is to replace the current incumbent on the current routes, R-75 is correct. R-100 only makes sense if Revia envisions restoring higher-capacity routes to SFO or other former hubs.

### 4.4 Aircraft types retired that Revia replaces — aging fleet alignment

The following incumbent/retired aircraft types map cleanly to Revia variants and confirm the replacement thesis:

| Retired/aging type | Typical seats | Category | Revia replacement |
|---|---|---|---|
| Beechcraft 1900D | 19 | turboprop_19 — below Revia floor | R-50 (upgrade) |
| Cessna 208 Caravan | 9 | sub-19 — below Revia floor | R-50 (upgrade) |
| Saab 340 | 34 | turboprop_30s | R-50 |
| ATR 42 | 48 | turboprop_50 | R-50 |
| CRJ-100/200 | 50 | regional_jet_50 — aging | R-50 |
| ERJ-145 | 50 | regional_jet_50 — aging | R-50 |
| CRJ-700 | 70 | regional_jet_70 | R-75 |
| ATR 72 | 70 | turboprop_70 | R-75 |
| Dash 8-400 (Q400) | 78 | turboprop_70 | R-75 |
| CRJ-900 | 76 | regional_jet_76 | R-75 |
| E175 | 76 | regional_jet_76 — dominant 76-seater | R-75 |
| Embraer 190 | 100 | regional_jet_100 | R-100 |
| CRJ-1000 | 100 | regional_jet_100 | R-100 |

The Saab 340 (34 seats) and ATR 42 (48 seats) are the current EAS workhorses for many of the seed communities. These fall in or just below the R-50 class, making R-50 the correct and consistent assignment for all 15 CSV communities. The aircraft_reference.csv supports this mapping without exception.

Note: the Cessna Caravan (9 seats) and Beechcraft 1900D (19 seats) are flagged in aircraft_reference.csv as "below Revia floor" — R-50 is an upgrade play on these missions, not a like-for-like swap.

---

## 5. Cities in communities.ts Not in lost_routes_seed.csv

Ten cities were added directly to communities.ts without being added to the CSV or GeoJSON. These are the "scaffolded deck entries" referenced in the file's header comment.

| City | IATA | Status | Verification | Data gap |
|---|---|---|---|---|
| Paducah, KY | PAH | diminished | needs-check | Not in CSV, GeoJSON, or airport_supplement |
| Lynchburg, VA | LYH | diminished | needs-check | Not in CSV, GeoJSON, or airport_supplement |
| Wausau, WI | AUW | lost-all-service | needs-check | Not in CSV, GeoJSON, or airport_supplement |
| Marquette, MI | MQT | diminished | needs-check | Not in CSV, GeoJSON, or airport_supplement |
| Eugene, OR | EUG | diminished | needs-check | Not in CSV, GeoJSON, or airport_supplement |
| Rochester, MN | RST | diminished | needs-check | Not in CSV, GeoJSON, or airport_supplement |
| Santa Barbara, CA | SBA | diminished | needs-check | Not in CSV, GeoJSON, or airport_supplement |
| Cheyenne, WY | CYS | lost-all-service | needs-check | Not in CSV, GeoJSON, or airport_supplement |
| Dubuque, IA | DBQ | lost-all-service | needs-check | Not in CSV, GeoJSON, or airport_supplement |
| Toledo, OH | TOL | diminished | needs-check | Not in CSV, GeoJSON, or airport_supplement |

All 10 are `needs-check`. None have been sourced to DOT orders or GAO reports. Their coordinates are valid airport positions; population figures are plausible for the cities named. However, because they exist only in the TS file:

1. They do not appear on the map (communities.geojson is not aware of them).
2. They would be silently dropped if `build_seeds.py` is re-run and the TS is regenerated.
3. Their `routesLost` and `lastCarrier` values are not traceable to a DOT data source.

**Recommended action:** For each of these 10 cities, either (a) verify against T-100 and add to `lost_routes_seed.csv` + `communities.geojson` via the pipeline, or (b) retain them as TS-only scaffolding but add a distinct `origin: "deck-only"` or `tier: "unverified"` flag so the pipeline and UI treat them separately from CSV-sourced entries.

---

## 6. Data Quality Issues

### Issue 1 — CRITICAL: Two communities marked `confirmed` in TS but `needs-check` in CSV

- **Athens, GA (AHN):** `verification: "confirmed"` in communities.ts, `needs-check` in CSV. The EAS operator pre-2014 is still unconfirmed.
- **El Dorado, AR (ELD):** `verification: "confirmed"` in communities.ts, `needs-check` in CSV. The Air Midwest shutdown linkage to EAS status is unconfirmed.

Both of these will render as `verified: true` in the UI (the `verified` boolean is `verification === "confirmed"`), which is misleading. These should be corrected to `needs-check` in communities.ts.

### Issue 2 — MODERATE: 10 TS-only communities have no GeoJSON representation

The map and GeoJSON-based tooling is unaware of Paducah, Lynchburg, Wausau, Marquette, Eugene, Rochester, Santa Barbara, Cheyenne, Dubuque, and Toledo. If the communities map is shown to investors using the GeoJSON, these cities will be invisible.

### Issue 3 — MODERATE: Santa Barbara restorableBy conflict

communities.ts: `restorableBy: "R-100"`. overcapable_seed.csv: LAX–SBA E175 (76 seats) → R-75. Resolve by deciding whether the assignment reflects (a) the incumbent aircraft on the specific current route, or (b) the ideal Revia service for the market's total demand.

### Issue 4 — MINOR: Cumberland, MD (CBE) has `lastYearServed: null` and empty `formerHubs`

Both fields are genuinely unknown. The CSV acknowledges this with "(confirm)" placeholders. The TS silently uses `null` and `[]`. Adding a brief comment in the TS noting these are unconfirmed would maintain the file's stated honesty standard.

### Issue 5 — MINOR: build_seeds.py hardcodes `"R-50"` for all lost-routes communities

Line 107 of `build_seeds.py`: `"revia_variant": "R-50"` is hardcoded unconditionally, ignoring the `revia_variant_for()` function used in the overcapable analysis. This means if the pipeline is re-run, Marquette (R-75), Eugene (R-100), Rochester (R-75), Santa Barbara (R-100), and Toledo (R-75) would have their variant overwritten to R-50. The script should call `revia_variant_for(seats, dist)` using the community's population-implied seat demand or the last-known aircraft seat count.

### Issue 6 — MINOR: airport_supplement.csv is missing the 10 TS-only communities

The supplement exists to provide coordinates for small airports absent from OpenFlights. AUW (Wausau), PAH (Paducah), LYH (Lynchburg), MQT (Marquette), EUG (Eugene), RST (Rochester), SBA (Santa Barbara), CYS (Cheyenne), DBQ (Dubuque), and TOL (Toledo) are not in the supplement. For the major airports (EUG, SBA, TOL, RST) this is fine — they are in OpenFlights. For any small/regional airports that may be added in future, the supplement will need updating.

### Issue 7 — MINOR: Jamestown NY `detail` field differs slightly between CSV and TS

- CSV (`human_detail`): "Per-passenger subsidy hit $460 — more than double the $200 federal cap — and DOT pulled it."
- TS (`detail`): "Per-passenger subsidy hit $460, more than double the $200 federal cap, and DOT pulled it."

The em dash `—` was replaced with commas. Factually identical; cosmetic only.

---

## 7. Recommended Additions and Corrections to communities.ts

### 7.1 Immediate corrections (data integrity)

1. **Athens, GA (AHN):** Change `verification: "confirmed"` → `verification: "needs-check"`. This corrects a false `verified: true` display.

2. **El Dorado, AR (ELD):** Change `verification: "confirmed"` → `verification: "needs-check"`. Same reason.

3. **Santa Barbara, CA (SBA):** Review `restorableBy: "R-100"`. If the LAX–SBA segment (E175, 76 seats) is the operative market, change to `restorableBy: "R-75"`. If SBA's multi-hub potential (LAX + SFO) justifies higher capacity, document the rationale in a comment.

### 7.2 Pipeline sync (structural)

4. **Add all 10 TS-only cities to `lost_routes_seed.csv` and `communities.geojson`** once verified against T-100. In the interim, add a comment block above each TS-only entry: `// DECK-ONLY: not yet in CSV/GeoJSON — verify via T-100 before publishing.`

5. **Fix `build_seeds.py` hardcoded R-50:** Replace the hardcoded `"revia_variant": "R-50"` with a proper `revia_variant_for()` call using each community's last-known aircraft seat count.

### 7.3 Verification priorities

The following communities have the weakest sourcing and should be confirmed first if the dataset will be shown to investors or included in DOT filings:

| Priority | City | IATA | What to confirm |
|---|---|---|---|
| 1 | Athens, GA | AHN | EAS operator name pre-2014; DOT Order 2014-6-6 text |
| 2 | El Dorado, AR | ELD | EAS status at time of Air Midwest shutdown; confirm no subsequent restoration |
| 3 | Cumberland, MD | CBE | Last year of service; last carrier; former hub (likely PIT via US Airways Express) |
| 4 | Cheyenne, WY | CYS | Confirm final DOT order and exact service end date |
| 5 | Prescott, AZ | PRC | Confirm current SkyWest schedule; update status to `active-restored` if still flying |
| 6 | Farmington, NM | FMN | Confirm current EAS carrier and hub |
| 7 | Marquette, MI | MQT | Confirm last aircraft type (CRJ-200 vs. larger) to validate R-75 assignment |
| 8 | Toledo, OH | TOL | Confirm last aircraft type to validate R-75 assignment |

---

## 8. Summary Scorecard

| Check | Result |
|---|---|
| CSV ↔ TS coordinate match | PASS — all 15 shared communities identical |
| CSV ↔ TS population match | PASS — all 15 identical |
| CSV ↔ TS verification flag match | FAIL — 2 communities (AHN, ELD) differ |
| GeoJSON ↔ CSV match | PASS — 15 features, identical to CSV |
| TS-only communities in GeoJSON | FAIL — 10 TS cities not mapped |
| Revia variant assignments | MOSTLY CORRECT — 1 conflict (SBA R-100 vs. R-75) |
| Aircraft reference coverage | PASS — all incumbent types present and categorized |
| build_seeds.py variant logic | BUG — hardcoded R-50 for all lost-routes, ignores non-R-50 TS assignments |
| Overcapable data integrity | PASS — all 25 ratios are SEVERE; two-pool separation is correct |
