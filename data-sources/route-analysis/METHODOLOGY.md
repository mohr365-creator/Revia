# Revia Route-Opportunity Analysis — Methodology

Two questions, one data backbone:

1. **Where did service disappear?** — communities and city-pairs that lost their nonstop link.
2. **Where is the wrong aircraft flying the route today?** — short routes (<1,000 nm) operated by aircraft with range far beyond the mission. These are the markets where a right-sized Revia airframe wins on trip cost, and where over-frequency/over-range is the visible symptom of the missing segment.

Everything is scored against Revia's regional envelope: **R-50 (50 seats / ~1,400 nm) · R-75 (76 seats / ~900 nm) · R-100 (100 seats / ~550 nm).**

---

## What's in the package

| File | What it is |
|---|---|
| `revia_route_analysis.py` | The pipeline. Ingests a BTS T-100 segment file, computes great-circle distances, produces both analyses. |
| `aircraft_reference.csv` | Type code → seats, max range, category. The over-capability scoring backbone. Ranges are nominal practical full-payload figures from manufacturer/industry sources. |
| `airports_raw.dat` | OpenFlights airport coordinates (distance backbone). |
| `airport_supplement.csv` | Small/EAS airports missing from OpenFlights (extend as needed). |
| `build_seeds.py` | Builds the seed datasets below from documented real cases. |
| `lost_routes_seed.csv` | 15 documented lost / EAS-dependent communities, with real computed distances. |
| `overcapable_seed.csv` | 25 real short routes flown by over-capable equipment, with real computed capability ratios. |

The seed CSVs are **real routes with real computed distances and ratios** — illustrative anchors that demonstrate the logic. The full enumerated dataset (every flagged city-pair nationwide, with frequencies and passengers) is produced by running the pipeline against the T-100 file you download.

---

## The over-capability logic

For every current segment under the distance threshold:

```
capability_ratio = aircraft_max_range_nm / stage_length_nm
```

- **ratio ≥ 2.5** → FLAG (carrying meaningful unused range — extra structural weight, bigger wing/fuel fraction, worse trip economics for the mission)
- **ratio ≥ 5.0** → SEVERE (egregiously over-ranged; the airframe is sized for a mission 5×+ longer than the one it's flying)

Then each flagged segment is mapped to the right-sized Revia variant by the *incumbent's seat count* (≤55 → R-50; 56–85 → R-75; 86–110 → R-100; >110 → above the regional family).

**Two distinct opportunity pools fall out of this — worth keeping separate in the deck:**

1. **Regional jets over-ranged for the mission** (E175 at 2,200 nm flying an 80–120 nm hop, CRJ-900 on a 95 nm hop). These map cleanly to **R-75 / R-100** and are the core Phase-1 commercial story: same seats, a fraction of the trip fuel.
2. **Mainline narrowbodies on short hops** (A320/737/A321 on 90–350 nm sectors like SAN-LAX, SEA-PDX, LAX-LAS). These score the highest ratios but sit *above* the regional family — they're the **Phase-2 narrowbody** argument and a frequency/right-sizing story, not an R-50/75/100 swap.

This distinction is a feature, not a bug: pool 1 sizes the regional TAM; pool 2 reinforces the "third manufacturer" thesis.

---

## Getting the raw data (you do this part — the sandbox can't reach bts.gov)

1. Go to the BTS TranStats T-100 Domestic Segment table:
   `https://www.transtats.bts.gov/DL_SelectFields.aspx?gnoyr_VQ=FMG&QO_fu146_anzr=Nv4%20Pn44vr45`
   (or search "BTS T-100 Domestic Segment (All Carriers)").
2. Select a year (e.g. **2024** for "recent", **2005** for "baseline"), select **all months**, and check these fields at minimum:
   `YEAR, ORIGIN, DEST, AIRCRAFT_TYPE, PASSENGERS, SEATS, DEPARTURES_PERFORMED, UNIQUE_CARRIER`.
3. Download the ZIP, unzip the CSV into this folder.
4. T-100 reports aircraft as a numeric `AIRCRAFT_TYPE` code. Either (a) also download the `L_AIRCRAFT_TYPE` lookup and join to IATA codes, or (b) use a public export that already carries readable type codes. The pipeline's `COLMAP` accepts `AIRCRAFT_CODE`, `AC_TYPE`, or `AIRCRAFT_TYPE` — adjust if your export differs.

Then run:

```bash
# over-capable analysis (recent year)
python3 revia_route_analysis.py --t100 T100_2024.csv

# add lost-routes (baseline vs recent)
python3 revia_route_analysis.py --t100 T100_2024.csv --baseline-t100 T100_2005.csv
```

Outputs: `overcapable_routes.csv` and `lost_routes.csv`.

---

## Honesty notes / caveats

- **Capability ratio is a screening heuristic, not a business case.** A high ratio means the airframe is over-built for the mission; whether a Revia swap *pencils* depends on frequency, fleet commonality, gauge discipline, and crew scope — none of which the ratio captures. Treat flagged routes as the shortlist to model, not the conclusion.
- **Ranges are nominal.** Full-payload practical range varies by source, config, and reserves. They're good enough to rank over-capability; they are not certification figures.
- **The "150+ communities since 1995" figure is RAA's cumulative count** of communities that lost all service — a different unit from a route count. The earlier deck's "842 routes" was never cleanly sourceable at the record level; this pipeline lets the defensible number compute itself from T-100 rather than being asserted.
- **Mainline-on-short-hop routes are real and high-ratio but mostly above the regional family.** Don't fold them into the R-50/75/100 TAM; they belong to the Phase-2 narrowbody narrative.

---

## Dataset schema (added)

**`lost_routes_seed.csv`** — one row per community:

`city, state, iata, lng, lat, coordinates [lng,lat], population, population_source, status, last_year_served, last_carrier, routes_lost, former_hubs, revia_variant, human_detail, source, verification`

- **status** is `lost-all-service` (no scheduled commercial service today) or `diminished` (downgraded to EAS-subsidized-only, or retains leisure-only / restored service).
- **verification** is `confirmed` (service-loss facts sourced to a DOT order / GAO / news) or `needs-check` (scaffolded — see the `source` cell for what to confirm). Population is from US Census 2020 across the board; spot-verify before publishing.
- **`communities.geojson`** is the same data as map-ready GeoJSON (Point features, `[lng, lat]`), drop-in for Mapbox/Leaflet.

**`overcapable_seed.csv`** — one row per route, with both endpoints geocoded:

`origin_iata, origin_city, origin_state, dest_iata, dest_city, dest_state, origin_coordinates, dest_coordinates, distance_nm, aircraft, ac_seats, ac_range_nm, capability_ratio, flag, revia_variant, source, verification`

(Population / last-carrier / status fields don't apply to over-capable routes — those are community-level concepts.)

### Status reclassifications worth noting
Research surfaced that several communities lost service, regained it, and lost it again — and two now retain service, so they are **diminished**, not lost:
- **Prescott, AZ** — lost Air Midwest (2008) but SkyWest now flies United Express to Denver/LA (a rare *restoration*).
- **Hagerstown, MD** — lost its EAS hub link (2019) but keeps a 2x-weekly Allegiant leisure flight to Orlando.
- **Kingman, AZ / Athens, GA** — last losses were 2015 and 2014, *not* the 2008 Air Midwest shutdown; they had service in between.

This matters for the headline count: "lost all service" is a smaller, harder number than "lost their original mainline/EAS connection." Both are defensible if labeled precisely.
