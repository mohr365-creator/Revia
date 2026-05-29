import type {
  LngLat,
  OverCapableRoute,
  ReviaVariant,
} from "@/lib/types";

/**
 * SOURCED — the 25 real short routes flown today by aircraft whose range far
 * exceeds the mission, from `data-sources/route-analysis/overcapable_seed.csv`.
 * Aircraft ranges are nominal manufacturer/industry figures; the route +
 * equipment pairings are real, illustrative anchors. Frequencies and passenger
 * counts (the full TAM) come from running the pipeline against BTS T-100 —
 * see METHODOLOGY.md. So: capability ratios are confirmed; traffic is pending.
 *
 * `capability_ratio = aircraft_max_range_nm / stage_length_nm`.
 *   ≥ 2.5 → flagged · ≥ 5.0 → "severe". Every seed row is severe.
 *
 * This file carries the regional pool only: regional jets over-ranged for the
 * mission → R-75 / R-100 (the regional TAM). The mainline-narrowbody pool (A320 /
 * 737 short hops — the Phase-2 "third manufacturer" / right-sizing argument) has
 * been stripped from the public site for now and lives on the
 * `feature/phase-ii-narrowbody` branch for later incorporation.
 */
type Row = [
  oIata: string,
  oCity: string,
  oState: string,
  oCoord: LngLat,
  dIata: string,
  dCity: string,
  dState: string,
  dCoord: LngLat,
  distanceNm: number,
  aircraft: string,
  seats: number,
  rangeNm: number,
  ratio: number,
  match: ReviaVariant,
];

const rows: Row[] = [
  ["DEN", "Denver", "CO", [-104.673, 39.8617], "COS", "Colorado Springs", "CO", [-104.701, 38.8058], 63.4, "Embraer 175 (long wing)", 76, 2200, 34.7, "R-75"],
  ["LAX", "Los Angeles", "CA", [-118.408, 33.9425], "SBA", "Santa Barbara", "CA", [-119.84, 34.4262], 76.8, "Embraer 175 (long wing)", 76, 2200, 28.6, "R-75"],
  ["DTW", "Detroit", "MI", [-83.3534, 42.2124], "CLE", "Cleveland", "OH", [-81.8498, 41.4117], 82.7, "Embraer 175 (long wing)", 76, 2200, 26.6, "R-75"],
  ["ORD", "Chicago", "IL", [-87.9048, 41.9786], "GRR", "Grand Rapids", "MI", [-85.5228, 42.8808], 118.6, "Embraer 175 (long wing)", 76, 2200, 18.5, "R-75"],
  ["IAH", "Houston", "TX", [-95.3414, 29.9844], "AUS", "Austin", "TX", [-97.6699, 30.1945], 121.6, "Embraer 175 (long wing)", 76, 2200, 18.1, "R-75"],
  ["JFK", "New York", "NY", [-73.7789, 40.6398], "BOS", "Boston", "MA", [-71.0052, 42.3643], 162.1, "Embraer 190", 100, 2800, 17.3, "R-100"],
  ["PHX", "Phoenix", "AZ", [-112.012, 33.4343], "TUS", "Tucson", "AZ", [-110.941, 32.1161], 95.8, "CRJ-900", 76, 1550, 16.2, "R-75"],
  ["BOS", "Boston", "MA", [-71.0052, 42.3643], "LGA", "New York", "NY", [-73.8726, 40.7772], 160.2, "Embraer 175 (long wing)", 76, 2200, 13.7, "R-75"],
];

const matchLabels: Record<ReviaVariant, string> = {
  "R-50": "R-50",
  "R-75": "R-75",
  "R-100": "R-100",
};

export const overCapableRoutes: OverCapableRoute[] = rows.map(
  ([
    oIata,
    oCity,
    oState,
    oCoord,
    dIata,
    dCity,
    dState,
    dCoord,
    distanceNm,
    aircraft,
    seats,
    rangeNm,
    ratio,
    match,
  ]) => ({
    id: `${oIata}-${dIata}`.toLowerCase(),
    origin: { iata: oIata, city: oCity, state: oState, coordinates: oCoord },
    dest: { iata: dIata, city: dCity, state: dState, coordinates: dCoord },
    distanceNm,
    aircraft,
    aircraftSeats: seats,
    aircraftRangeNm: rangeNm,
    capabilityRatio: ratio,
    severe: ratio >= 5.0,
    match,
    matchLabel: matchLabels[match],
  }),
);

/** Every over-capable route right-sizes onto a Revia regional variant. */
export const regionalRoutes = overCapableRoutes;
