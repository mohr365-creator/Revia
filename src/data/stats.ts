import type { Stat } from "@/lib/types";
import { communities } from "./communities";

/**
 * Headline numbers. Per the brief's data flag, the verified figure
 * ("~150 communities, 1995–2020") is the credible anchor; "840+ routes" is a
 * flagged slot to be earned from the dataset before launch. We surface BOTH.
 *
 * `routesLostSample` is COMPUTED from the sample dataset so the routes counter
 * is always honest about what it is actually showing.
 */
export const communitiesLost: Stat = {
  value: "~150",
  label: "U.S. communities lost their last commercial flight",
  source: "GAO / DOT, 1995–2020",
  verified: true,
};

export const routesLostHeadline: Stat = {
  value: "840+",
  label: "routes went dark",
  source: "PLACEHOLDER: not yet sourced; must be computed from the dataset",
  verified: false,
};

/** Total severed city-pairs represented by the current (sample) dataset. */
export const routesLostSample = communities.reduce(
  (sum, c) => sum + c.routesLost,
  0,
);

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
    source: "Internal estimate: PROJECT_BRIEF",
    verified: false,
  },
];
