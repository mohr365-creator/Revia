import type {
  LngLat,
  OverCapableMatch,
  OverCapableRoute,
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
 * Two pools fall out, and the methodology insists on keeping them separate:
 *   • Regional jets over-ranged for the mission → R-75 / R-100 (Phase-1 TAM).
 *   • Mainline narrowbodies on short hops → "phase-2" (above the regional
 *     family; the "third manufacturer" / right-sizing argument, NOT a swap).
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
  match: OverCapableMatch,
];

const rows: Row[] = [
  ["HNL", "Honolulu", "HI", [-157.9242, 21.3206], "OGG", "Kahului", "HI", [-156.43, 20.8986], 87.4, "Airbus A321neo", 200, 4000, 45.8, "phase-2"],
  ["SAN", "San Diego", "CA", [-117.19, 32.7336], "LAX", "Los Angeles", "CA", [-118.408, 33.9425], 94.9, "Airbus A320", 150, 3300, 34.8, "phase-2"],
  ["DEN", "Denver", "CO", [-104.673, 39.8617], "COS", "Colorado Springs", "CO", [-104.701, 38.8058], 63.4, "Embraer 175 (long wing)", 76, 2200, 34.7, "R-75"],
  ["LAX", "Los Angeles", "CA", [-118.408, 33.9425], "SBA", "Santa Barbara", "CA", [-119.84, 34.4262], 76.8, "Embraer 175 (long wing)", 76, 2200, 28.6, "R-75"],
  ["DTW", "Detroit", "MI", [-83.3534, 42.2124], "CLE", "Cleveland", "OH", [-81.8498, 41.4117], 82.7, "Embraer 175 (long wing)", 76, 2200, 26.6, "R-75"],
  ["SEA", "Seattle", "WA", [-122.309, 47.449], "PDX", "Portland", "OR", [-122.598, 45.5887], 112.3, "Boeing 737-800", 160, 2935, 26.1, "phase-2"],
  ["LGA", "New York", "NY", [-73.8726, 40.7772], "DCA", "Washington", "DC", [-77.0377, 38.8521], 186.2, "Airbus A319", 128, 3700, 19.9, "phase-2"],
  ["FLL", "Fort Lauderdale", "FL", [-80.1527, 26.0726], "MCO", "Orlando", "FL", [-81.309, 28.4294], 154.4, "Boeing 737-800", 160, 2935, 19.0, "phase-2"],
  ["ORD", "Chicago", "IL", [-87.9048, 41.9786], "GRR", "Grand Rapids", "MI", [-85.5228, 42.8808], 118.6, "Embraer 175 (long wing)", 76, 2200, 18.5, "R-75"],
  ["IAH", "Houston", "TX", [-95.3414, 29.9844], "AUS", "Austin", "TX", [-97.6699, 30.1945], 121.6, "Embraer 175 (long wing)", 76, 2200, 18.1, "R-75"],
  ["DAL", "Dallas", "TX", [-96.8518, 32.8471], "AUS", "Austin", "TX", [-97.6699, 30.1945], 164.7, "Boeing 737-800", 160, 2935, 17.8, "phase-2"],
  ["JFK", "New York", "NY", [-73.7789, 40.6398], "BOS", "Boston", "MA", [-71.0052, 42.3643], 162.1, "Embraer 190", 100, 2800, 17.3, "R-100"],
  ["ORD", "Chicago", "IL", [-87.9048, 41.9786], "DTW", "Detroit", "MI", [-83.3534, 42.2124], 203.2, "Airbus A320", 150, 3300, 16.2, "phase-2"],
  ["PHX", "Phoenix", "AZ", [-112.012, 33.4343], "TUS", "Tucson", "AZ", [-110.941, 32.1161], 95.8, "CRJ-900", 76, 1550, 16.2, "R-75"],
  ["LAX", "Los Angeles", "CA", [-118.408, 33.9425], "LAS", "Las Vegas", "NV", [-115.152, 36.0801], 205.2, "Airbus A320", 150, 3300, 16.1, "phase-2"],
  ["ATL", "Atlanta", "GA", [-84.4281, 33.6367], "CLT", "Charlotte", "NC", [-80.9431, 35.214], 196.9, "Boeing 737-900", 178, 2950, 15.0, "phase-2"],
  ["DFW", "Dallas", "TX", [-97.038, 32.8968], "IAH", "Houston", "TX", [-95.3414, 29.9844], 195.3, "Boeing 737-800", 160, 2935, 15.0, "phase-2"],
  ["PHX", "Phoenix", "AZ", [-112.012, 33.4343], "LAS", "Las Vegas", "NV", [-115.152, 36.0801], 221.8, "Airbus A320", 150, 3300, 14.9, "phase-2"],
  ["DAL", "Dallas", "TX", [-96.8518, 32.8471], "HOU", "Houston", "TX", [-95.2789, 29.6454], 208.5, "Boeing 737-800", 160, 2935, 14.1, "phase-2"],
  ["BOS", "Boston", "MA", [-71.0052, 42.3643], "LGA", "New York", "NY", [-73.8726, 40.7772], 160.2, "Embraer 175 (long wing)", 76, 2200, 13.7, "R-75"],
  ["LAX", "Los Angeles", "CA", [-118.408, 33.9425], "SFO", "San Francisco", "CA", [-122.375, 37.619], 293.3, "Airbus A321neo", 200, 4000, 13.6, "phase-2"],
  ["CLE", "Cleveland", "OH", [-81.8498, 41.4117], "ORD", "Chicago", "IL", [-87.9048, 41.9786], 273.5, "Airbus A319", 128, 3700, 13.5, "phase-2"],
  ["MDW", "Chicago", "IL", [-87.7524, 41.786], "STL", "St. Louis", "MO", [-90.37, 38.7487], 218.2, "Boeing 737-800", 160, 2935, 13.5, "phase-2"],
  ["MSP", "Minneapolis", "MN", [-93.2218, 44.882], "ORD", "Chicago", "IL", [-87.9048, 41.9786], 290.0, "Airbus A319", 128, 3700, 12.8, "phase-2"],
  ["DCA", "Washington", "DC", [-77.0377, 38.8521], "BOS", "Boston", "MA", [-71.0052, 42.3643], 346.4, "Airbus A320", 150, 3300, 9.5, "phase-2"],
];

const matchLabels: Record<OverCapableMatch, string> = {
  "R-50": "R-50",
  "R-75": "R-75",
  "R-100": "R-100",
  "phase-2": "Phase-2 narrowbody",
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

/** Phase-1: right-sizes onto a Revia regional variant. */
export const phase1Routes = overCapableRoutes.filter(
  (r) => r.match !== "phase-2",
);

/** Phase-2: above the regional family — the narrowbody / right-sizing story. */
export const phase2Routes = overCapableRoutes.filter(
  (r) => r.match === "phase-2",
);
