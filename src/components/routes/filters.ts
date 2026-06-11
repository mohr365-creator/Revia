import type { Community, ReviaVariant, ServiceStatus } from "@/lib/types";

export type StatusFilter = "all" | ServiceStatus;
export type RegionFilter = "all" | "west" | "midwest" | "south" | "northeast";

/** Right edge of the timeline slider ("today"). Link years run to 2026. */
export const TIMELINE_MAX = 2026;
export const TIMELINE_MIN = 1978;

export interface MapFilterState {
  status: StatusFilter;
  region: RegionFilter;
  /** Inclusive upper bound on loss years — show all losses up to and including this year. */
  throughYear: number;
  restorableBy: "all" | ReviaVariant;
}

export const defaultFilters: MapFilterState = {
  status: "all",
  region: "all",
  throughYear: TIMELINE_MAX,
  restorableBy: "all",
};

/**
 * The year a community's FIRST documented link was severed — what the
 * cumulative timeline should date it by. `null` = nothing has ended
 * (a purely subsidy-dependent town); those only appear at "today" rather
 * than detonating at deregulation.
 */
export function firstLossYear(c: Community): number | null {
  const years: number[] = [];
  for (const y of Object.values(c.linkYears ?? {})) {
    if (y != null) years.push(y);
  }
  if (c.lastYearServed != null) years.push(c.lastYearServed);
  return years.length ? Math.min(...years) : null;
}

/** Coarse region bucketing by longitude/latitude — good enough for the sample. */
export function regionOf(lng: number, lat: number): RegionFilter {
  if (lng < -104) return "west";
  if (lng < -90) return "midwest";
  if (lat < 37) return "south";
  return "northeast";
}
