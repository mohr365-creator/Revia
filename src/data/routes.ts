import type { LostRoute } from "@/lib/types";
import { communities } from "./communities";
import { hubs } from "./hubs";

/**
 * The severed (or subsidy-dependent) city-pairs, built from each community's
 * real `formerHubs` rather than synthesized nearest-hub guesses. One arc per
 * community→hub link; endpoints are real airport coordinates. Communities with
 * no known former hub (e.g. Cumberland, pending confirmation) contribute no arc
 * but still appear as map markers.
 */
export const lostRoutes: LostRoute[] = communities.flatMap((c) =>
  c.formerHubs.flatMap((hubCode) => {
    const hub = hubs[hubCode];
    if (!hub) return [];
    return [
      {
        id: `${c.id}-${hub.iata.toLowerCase()}`,
        fromId: c.id,
        toId: hub.iata,
        from: c.coordinates,
        to: hub.coordinates,
        lastYearServed: c.lastYearServed,
        status: c.status,
        restorableBy: c.restorableBy,
      },
    ];
  }),
);
