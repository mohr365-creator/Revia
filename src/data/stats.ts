import type { Stat } from "@/lib/types";
import { communities } from "./communities";
import { lostRoutes } from "./routes";
import { overCapableRoutes } from "./overcapable";

/**
 * Headline numbers, reconciled to the route-analysis methodology.
 *
 * The methodology is explicit that the old "840+ routes" figure was never
 * cleanly sourceable at the record level, and that the defensible anchor is
 * the RAA cumulative community count. A true national *route* count requires
 * running the pipeline against BTS T-100 (see data-sources/). So we lead with
 * the community figure (sourced) and report the documented dataset honestly,
 * rather than asserting a route total we can't yet back.
 */
export const communitiesLost: Stat = {
  value: "150+",
  label: "U.S. communities lost all commercial service since 1995",
  source: "Regional Airline Association (cumulative count)",
  verified: true,
};

/** Documented at the record level on this site (the sourced seed dataset). */
export const communitiesDocumented = communities.length;

/** How many of those are traced to a DOT order / GAO / news (confirmed). */
export const communitiesConfirmed = communities.filter((c) => c.verified).length;

/** Severed / subsidy-dependent hub links drawn on the map. */
export const severedLinks = lostRoutes.length;

/** Real short routes flown by over-capable equipment (the "wrong aircraft" pool). */
export const overCapableCount = overCapableRoutes.length;

/**
 * The honest replacement for the asserted route total: still pending the
 * T-100 enumeration. Flagged so it never ships disguised as a sourced figure.
 */
export const nationalRouteCount: Stat = {
  value: "Pending T-100",
  label: "every flagged city-pair nationwide (frequencies + passengers)",
  source:
    "Computed by the data-sources/route-analysis pipeline against BTS T-100",
  verified: false,
};

export const supportingStats: Stat[] = [
  {
    value: "14",
    label: "airports lost all commercial service since 2019",
    source: "Regional Airline Association",
    verified: false,
  },
  {
    value: "161",
    label: "airports lost >25% of flights, 2019–2022",
    source: "Regional Airline Association",
    verified: false,
  },
  {
    value: "68",
    label: "cities the big three pulled out of since April 2020",
    source: "Ailevon Pacific",
    verified: false,
  },
  {
    value: "8,000–10,000",
    label: "aircraft total addressable market in the 50–100 seat gap",
    source: "Internal estimate — PROJECT_BRIEF",
    verified: false,
  },
];
