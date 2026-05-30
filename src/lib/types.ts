export type LngLat = [number, number];

export type ServiceStatus = "lost-all-service" | "diminished";

export type ReviaVariant = "R-50" | "R-75" | "R-100";

/**
 * One community affected by the regional-service collapse.
 * Mirrors the per-route record schema in the brief (§7 Data Layer), collapsed
 * to the community grain that the map renders. Fields sourced from a real
 * dataset should set `verified: true`; everything else is sample/placeholder.
 */
export interface Community {
  id: string;
  city: string;
  state: string;
  coordinates: LngLat;
  population: number;
  status: ServiceStatus;
  /** Approximate year the last / a major service ended. */
  lastYearServed: number;
  lastCarrier: string;
  /** Number of nonstop city-pairs (routes) the community lost. */
  routesLost: number;
  /** One-line human detail, where available. */
  detail?: string;
  /** Which Revia variant could plausibly restore the gap. */
  restorableBy: ReviaVariant;
  /** False = sample/placeholder data, not yet traced to a source. */
  verified: boolean;
}

/** A severed city-pair, derived for the arc layer. */
export interface LostRoute {
  id: string;
  fromId: string;
  toId: string;
  from: LngLat;
  to: LngLat;
  lastYearServed: number;
  status: ServiceStatus;
  restorableBy: ReviaVariant;
}

export interface AircraftSpec {
  label: string;
  value: string;
  /** Mark specs the brief flagged as needing verification. */
  verified: boolean;
}

/** A photographic render to show in place of the stylized silhouette. */
export interface AircraftImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface AircraftVariant {
  name: ReviaVariant | string;
  internalCode?: string;
  tagline: string;
  /** Capacity descriptor — seat count for pax, payload/config for freighters. */
  seats: string;
  range: string;
  specs: AircraftSpec[];
  /** When set, the card/page renders this image instead of the placeholder silhouette. */
  image?: AircraftImage;
}

export interface Stat {
  value: string;
  label: string;
  source?: string;
  verified: boolean;
}

export interface Quote {
  text: string;
  attribution: string;
  context: string;
  verified: boolean;
}
