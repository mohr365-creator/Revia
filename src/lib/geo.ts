import { geoInterpolate } from "d3-geo";
import type { LngLat } from "./types";

/**
 * Samples a great-circle path between two points so it can be drawn as a
 * gently-curved arc through react-simple-maps' projection (rather than a flat
 * projected segment). Returns `steps + 1` [lng, lat] points.
 */
export function greatCircle(from: LngLat, to: LngLat, steps = 48): LngLat[] {
  const interpolate = geoInterpolate(from, to);
  const points: LngLat[] = [];
  for (let i = 0; i <= steps; i += 1) {
    points.push(interpolate(i / steps) as LngLat);
  }
  return points;
}
