import type { Community, LngLat, LostRoute } from "@/lib/types";
import { communities } from "./communities";

/**
 * SAMPLE — severed city-pairs are synthesized by connecting each community to
 * the nearest large hub(s) it plausibly fed. This produces the "extinguished
 * network" arc layer for the map. Replace with real T-100 segment pairs when
 * the dataset lands (§7). Endpoints are real airport coordinates.
 */
const hubs: { id: string; coordinates: LngLat }[] = [
  { id: "ord", coordinates: [-87.9048, 41.9786] }, // Chicago O'Hare
  { id: "den", coordinates: [-104.6737, 39.8561] }, // Denver
  { id: "dfw", coordinates: [-97.038, 32.8998] }, // Dallas–Fort Worth
  { id: "atl", coordinates: [-84.4277, 33.6407] }, // Atlanta
  { id: "msp", coordinates: [-93.2218, 44.8848] }, // Minneapolis–St. Paul
  { id: "sfo", coordinates: [-122.379, 37.6213] }, // San Francisco
  { id: "clt", coordinates: [-80.9431, 35.2144] }, // Charlotte
];

function haversine(a: LngLat, b: LngLat): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const [lon1, lat1] = a;
  const [lon2, lat2] = b;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * Math.asin(Math.sqrt(s));
}

function nearestHubs(c: Community, count: number) {
  return [...hubs]
    .sort(
      (a, b) =>
        haversine(c.coordinates, a.coordinates) -
        haversine(c.coordinates, b.coordinates),
    )
    .slice(0, count);
}

export const lostRoutes: LostRoute[] = communities.flatMap((c) => {
  // Connect to a number of hubs proportional to the routes the community lost.
  const count = Math.max(1, Math.min(3, Math.round(c.routesLost / 2)));
  return nearestHubs(c, count).map((hub, i) => ({
    id: `${c.id}-${hub.id}`,
    fromId: c.id,
    toId: hub.id,
    from: c.coordinates,
    to: hub.coordinates,
    lastYearServed: c.lastYearServed + i,
    status: c.status,
    restorableBy: c.restorableBy,
  }));
});
