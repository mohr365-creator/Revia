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
  PIT: { iata: "PIT", name: "Pittsburgh", coordinates: [-80.2329, 40.4958] },
  ATL: { iata: "ATL", name: "Atlanta", coordinates: [-84.4281, 33.6367] },
  MSP: { iata: "MSP", name: "Minneapolis–St. Paul", coordinates: [-93.2218, 44.882] },
  DEN: { iata: "DEN", name: "Denver", coordinates: [-104.673, 39.8617] },
  LAS: { iata: "LAS", name: "Las Vegas", coordinates: [-115.152, 36.0801] },
  DFW: { iata: "DFW", name: "Dallas–Fort Worth", coordinates: [-97.038, 32.8968] },
  BWI: { iata: "BWI", name: "Baltimore/Washington", coordinates: [-76.6683, 39.1754] },
  BIL: { iata: "BIL", name: "Billings", coordinates: [-108.543, 45.8077] },
  PHX: { iata: "PHX", name: "Phoenix", coordinates: [-112.012, 33.4343] },
};
