import type { ReviaVariant, ServiceStatus } from "@/lib/types";

export type StatusFilter = "all" | ServiceStatus;
export type RegionFilter = "all" | "west" | "midwest" | "south" | "northeast";

export interface MapFilterState {
  status: StatusFilter;
  region: RegionFilter;
  /** Inclusive lower bound on lastYearServed. */
  sinceYear: number;
  restorableBy: "all" | ReviaVariant;
}

export const defaultFilters: MapFilterState = {
  status: "all",
  region: "all",
  sinceYear: 1978,
  restorableBy: "all",
};

/** Coarse region bucketing by longitude/latitude — good enough for the sample. */
export function regionOf(lng: number, lat: number): RegionFilter {
  if (lng < -104) return "west";
  if (lng < -90) return "midwest";
  if (lat < 37) return "south";
  return "northeast";
}
