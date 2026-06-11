import type { LngLat } from "@/lib/types";

/**
 * The hubs the documented communities fed (or are subsidized to reach today).
 * IATA codes come from `former_hubs` in the route-analysis seed; coordinates
 * are real airport positions, reused where the over-capable seed already
 * carries them so the two layers line up exactly.
 */
export interface Hub {
  iata: string;
  name: string;
  coordinates: LngLat;
}

export const hubs: Record<string, Hub> = {
  ABQ: { iata: "ABQ", name: "Albuquerque", coordinates: [-106.609, 35.0402] },
  ATL: { iata: "ATL", name: "Atlanta", coordinates: [-84.4281, 33.6367] },
  BIL: { iata: "BIL", name: "Billings", coordinates: [-108.543, 45.8077] },
  BNA: { iata: "BNA", name: "Nashville", coordinates: [-86.6782, 36.1245] },
  BOS: { iata: "BOS", name: "Boston", coordinates: [-71.0052, 42.3643] },
  BWI: { iata: "BWI", name: "Baltimore/Washington", coordinates: [-76.6683, 39.1754] },
  CLT: { iata: "CLT", name: "Charlotte", coordinates: [-80.9431, 35.214] },
  DEN: { iata: "DEN", name: "Denver", coordinates: [-104.673, 39.8617] },
  DFW: { iata: "DFW", name: "Dallas–Fort Worth", coordinates: [-97.038, 32.8968] },
  IAD: { iata: "IAD", name: "Washington Dulles", coordinates: [-77.4558, 38.9445] },
  LAX: { iata: "LAX", name: "Los Angeles", coordinates: [-118.408, 33.9425] },
  LAS: { iata: "LAS", name: "Las Vegas", coordinates: [-115.152, 36.0801] },
  MCI: { iata: "MCI", name: "Kansas City", coordinates: [-94.7139, 39.2976] },
  MEM: { iata: "MEM", name: "Memphis", coordinates: [-89.9767, 35.0424] },
  MSP: { iata: "MSP", name: "Minneapolis–St. Paul", coordinates: [-93.2218, 44.882] },
  ORD: { iata: "ORD", name: "Chicago O'Hare", coordinates: [-87.9048, 41.9786] },
  PDX: { iata: "PDX", name: "Portland", coordinates: [-122.598, 45.5887] },
  PHL: { iata: "PHL", name: "Philadelphia", coordinates: [-75.2411, 39.8719] },
  PHX: { iata: "PHX", name: "Phoenix", coordinates: [-112.012, 33.4343] },
  PIT: { iata: "PIT", name: "Pittsburgh", coordinates: [-80.2329, 40.4958] },
  STL: { iata: "STL", name: "St. Louis", coordinates: [-90.37, 38.7487] },
};
