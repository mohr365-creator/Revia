# Community Data Verification Report

Generated from parallel research across all 19 `needs-check` communities.
Cross-referenced against public DOT records, local news, and Wikipedia.

---

## Executive Summary

Of the 19 needs-check communities researched:
- **6 should be removed or reclassified** — either still have active service or have had no service for 10+ years
- **9 need data corrections** — year, carrier, route count, or hub fields are wrong
- **4 are broadly confirmed** (Wolf Point, Bradford, and two EAS cities)

Several entries contain route counts (4, 5, 3 routes lost) that are not supportable — the actual losses were 1–2 routes in most cases.

---

## 1. Remove or Reclassify

### Eugene, OR (EUG) — REMOVE
Airport is active and growing. COVID caused temporary 2020 dips but service recovered by 2021 and the airport expanded (American DFW, Southwest launched 2021; 50% seat capacity increase over pre-pandemic). The PDX nonstop lapsed 2020–2025 and was restored. EUG should not be in a lost-service dataset.

### Santa Barbara, CA (SBA) — REMOVE
5 carriers active as of 2026 (Alaska, American, Delta, Southwest, United), 13 nonstop destinations. Losses in 2020 were Contour Airlines (ceased operations entirely) and Delta (suspended SLC, returned 2024). LAX and SFO are active current hubs, not former. Should not be in a lost-service dataset.

### Lynchburg, VA (LYH) — REMOVE or RECLASSIFY
American Eagle still actively serves LYH–CLT as of 2026. Service was never discontinued in 2019. United Express (SkyWest) actually launched new ORD and IAD service in March 2026, expanding Lynchburg's connections. The "3 routes lost / last year 2019" data is unsupported. DCA as a formerHub is incorrect — the lost Washington connection was IAD (United), lost around 2002–2011.

### Wausau, WI (AUW) — REMOVE (wrong airport)
AUW (Wausau Downtown Airport) has had no commercial airline service since 1969. The correct Wausau-area airport is CWA (Central Wisconsin Airport, Mosinee), which currently has active Delta Connection (MSP) and American Eagle (ORD) service. Air Choice One never served either airport. The entire entry is misattributed and the data (2017, 5 routes, Air Choice One) is unverifiable.

### Brookings, SD (BKX) — REMOVE
EAS was terminated by DOT in September 2009 due to low ridership. The airport has operated as a GA/SDSU aviation training facility ever since (named 2024 Large GA Airport of the Year). Listed in data as active EAS — incorrect, no service for 15+ years.

### Lewistown, MT (LWT) — REMOVE
EAS subsidy terminated July 15, 2013 — per-passenger cost had reached ~$1,905 against a $1,000 congressional cap. Not included in the 2024–2027 Cape Air Montana contract. Listed in data as active EAS — incorrect, no service for 12+ years.

---

## 2. Keep with Corrections

### Paducah, KY (PAH)
| Field | Current | Corrected |
|---|---|---|
| lastYearServed | 2018 | 2022 |
| routesLost | 4 | 1 |
| formerHubs | ORD | ORD (confirmed) |
| lastCarrier | SkyWest/United Express | SkyWest/United Express (confirmed) |

Notes: SkyWest gave 90-day notice in March 2022 and exited. Contour Airlines replaced them Dec 2022. PAH had exactly one route — ORD. The "4 routes" figure is unsupported.

---

### Marquette, MI (MQT)
| Field | Current | Corrected |
|---|---|---|
| lastYearServed | 2020 | 2022 |
| routesLost | 3 | 1 |
| formerHubs | DTW | MSP |
| status | diminished | diminished |

Notes: Only the MSP route was cut (Jan 10, 2022). DTW service continued uninterrupted and continues today. MSP was restored January 2025. The airport still has active service — consider removing or marking as "route partially restored."

---

### Toledo, OH (TOL)
| Field | Current | Corrected |
|---|---|---|
| lastYearServed | 2020 | 2022 |
| formerHubs | DTW, ORD | ORD, CLT |
| lastCarrier | Multiple regionals | Envoy Air (American Eagle) |
| routesLost | 4 | 2–3 |

Notes: DTW was never a direct route — Toledo passengers drove to DTW. American/Envoy left in Sept 2022 (ORD) and Nov 2021 (CLT). Delta left DTW service in 2010–2011. Allegiant remains as sole carrier to leisure destinations.

---

### Athens, GA (AHN)
| Field | Current | Corrected |
|---|---|---|
| lastCarrier | (EAS, pre-2014; confirm operator) | SeaPort Airlines |
| formerHubs | ATL | BNA (Nashville) |
| verification | confirmed | needs-check |
| source | DOT Order 2014-6-6 | DOT Order 2014-9-21 |

Notes: SeaPort Airlines operated AHN–BNA (Nashville), not Atlanta. DOT terminated EAS Sept 30, 2014 because AHN averaged only 6 passengers/day vs the required 10. Order number 2014-6-6 appears incorrect; the relevant order was 2014-9-21.

---

### El Dorado, AR (ELD)
| Field | Current | Corrected |
|---|---|---|
| lastCarrier | Air Midwest (Beech 1900D) | SeaPort Airlines → Southern Airways Express → Contour Airlines |
| lastYearServed | 2008 | Still served — Contour Airlines launched March 2026 under Alternative EAS |
| verification | confirmed | needs-check |

Notes: Air Midwest/DFW origin story is not substantiated. Documented history: SeaPort Airlines (EAS, to DAL/HOU/MEM) until Sept 2016; Southern Airways Express from 2017 until Feb 2025; Contour Airlines launched DFW service March 2026. ELD is currently served. Should be reclassified or removed from "lost service" dataset.

---

### Cumberland, MD (CBE)
| Field | Current | Corrected |
|---|---|---|
| lastCarrier | (confirm — likely US Airways Express/Colgan era) | Air Midwest / US Airways Express |
| lastYearServed | null | 2003 (July) |
| formerHubs | (empty) | PIT |

Notes: Air Midwest operated CBE–PIT under US Airways Express until September 8, 2001. Boston-Maine Airways (Pan Am Clipper Connection) then ran BWI service until July 2003 when the Maryland state subsidy lapsed. No scheduled service since July 2003. Colgan attribution is incorrect.

---

### Prescott, AZ (PRC)
| Field | Current | Corrected |
|---|---|---|
| status | diminished | restored/expanding |
| lastCarrier | Air Midwest (2008); SkyWest/United Express restored | Great Lakes Airlines (until 2018); SkyWest/United Express |
| lastYearServed | 2008 | 2018 (Great Lakes); SkyWest started Aug 2018 |

Notes: Great Lakes Airlines served PRC until March 26, 2018 (not 2008). SkyWest/United Express began August 2018. As of Oct 2025, service has expanded to 2x daily DEN + 1x daily LAX. This is a success story — Revia should consider highlighting it as a "restored route" case rather than a lost one.

---

### Farmington, NM (FMN)
| Field | Current | Corrected |
|---|---|---|
| lastCarrier | Air Midwest (2008); subsidized service later restored | Great Lakes Airlines (until Nov 2017); SkyWest/United Express (from May 2025) |
| lastYearServed | 2008 | 2017 |
| detail | "lost Air Midwest in 2008, later reconnected to Denver under EAS" | Great Lakes served DEN until 2017 (pilot shortage); SkyWest launched May 2025 under city-funded risk-sharing, not EAS |

Notes: The restored service is a **commercial risk-sharing arrangement** ($6.9M over 2 years), not EAS. This distinction matters for the Revia narrative.

---

### Rochester, MN (RST)
| Field | Current | Corrected |
|---|---|---|
| lastCarrier | SkyWest/Delta Connection | SkyWest/United Express AND Delta Connection |
| formerHubs | MSP | ATL, ORD, DEN (MSP is active — should not be listed as former) |
| routesLost | 4 | 3 confirmed (ORD, DEN, ATL) |

Notes: Delta Connection (MSP) continues operating — MSP is not a former hub. The routes lost were: ORD (United/SkyWest, Sept 2021), DEN (United/SkyWest, Oct 2021), ATL (Delta, late 2021). Mayo Clinic's home airport; strong case for R-75.

---

## 3. Confirmed

### Glasgow, MT (GGW)
- Cape Air, Billings (BIL) only — **not BIL/MSP** (MSP is incorrect; correct to BIL only)
- Contract: Jan 2024 – Dec 2027. Active and confirmed.

### Devils Lake, ND (DVL)
- SkyWest/United Express, Denver (DEN) — **not MSP** (previous carrier Great Lakes used MSP; current is DEN)
- Contract: July 2024 – June 2027. Active and confirmed.

### Wolf Point, MT (OLF)
- Cape Air, Billings (BIL). Active. Confirmed.

### Bradford, PA (BFD)
- Southern Airways Express, Pittsburgh (PIT) + Dulles (IAD).
- Waiver history substantiated. Active through Sept 2028.
- Risk flag: FY2027 White House budget proposes eliminating $372M in EAS funding program-wide.

---

## 4. Already Confirmed (no changes needed)

These were already marked `verification: "confirmed"` and remain accurate:
- Jamestown, NY (JHW) ✓
- Franklin/Oil City, PA (FKL) ✓
- Hagerstown, MD (HGR) ✓
- Kingman, AZ (IGM) ✓

---

## 5. Verification Flag Fixes (DOT analysis findings)

Per the DOT Data Analysis report, these two were marked `verified: true` in `communities.ts` but `needs-check` in the CSV:
- Athens, GA (AHN) → change to `needs-check`
- El Dorado, AR (ELD) → change to `needs-check`

---

## Recommended Actions

1. **Remove** EUG, SBA, LYH, AUW, BKX, LWT from `communities.ts` (6 entries)
2. **Correct** PAH, MQT, TOL, AHN, ELD, CBE, PRC, FMN, RST (9 entries)
3. **Correct hub codes** for GGW (remove MSP) and DVL (MSP→DEN)
4. **Add Wausau-area** back as CWA if still relevant, with accurate data
5. **Fix `build_seeds.py`** line 107 R-50 hardcode bug (see DOT_DATA_ANALYSIS.md)
6. **Add the 10 deck-only cities** to lost_routes_seed.csv and communities.geojson so they survive pipeline re-runs

---

*Research conducted via web search against DOT orders, local news archives, Wikipedia, and airport authority sources. All sources cited in individual batch findings.*
