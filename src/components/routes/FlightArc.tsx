"use client";

import type { SVGProps } from "react";
import { useMapContext } from "react-simple-maps";
import type { LngLat } from "@/lib/types";

/**
 * A severed-route arc drawn the way flight maps draw them: a quadratic
 * Bézier in projected (screen) space, bowing toward the top of the map,
 * with curvature proportional to the route's length. Working in screen
 * space keeps every point inside the geoAlbersUsa projection — bowing the
 * geographic coordinates instead can push northern-border routes outside
 * the projection's clip extent, which fails to project at all.
 */
interface FlightArcProps extends Omit<SVGProps<SVGPathElement>, "from" | "to"> {
  from: LngLat;
  to: LngLat;
  /** Bow height as a fraction of the chord length. */
  curvature?: number;
}

export function FlightArc({ from, to, curvature = 0.22, ...pathProps }: FlightArcProps) {
  const { projection } = useMapContext();
  const a = projection(from);
  const b = projection(to);
  if (!a || !b) return null;

  const [x1, y1] = a;
  const [x2, y2] = b;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 1) return null;

  // Unit normal to the chord, flipped so the arc always bows upward
  // (negative y in SVG) — the convention that reads as a flight path.
  let nx = -dy / len;
  let ny = dx / len;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }

  const lift = len * curvature;
  const cx = (x1 + x2) / 2 + nx * lift;
  const cy = (y1 + y2) / 2 + ny * lift;

  return <path d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`} {...pathProps} />;
}
