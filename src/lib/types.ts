export type LngLat = [number, number];

export type ServiceStatus = "lost-all-service" | "diminished";

export type ReviaVariant = "R-50" | "R-75" | "R-100";

/**
 * Provenance of a record's service-loss facts.
 * - `confirmed` — traced to a DOT order / GAO report / contemporaneous news.
 * - `needs-check` — scaffolded from the Revia deck / EAS lists; the `source`
 *   cell says what still needs confirming.
 */
export type Verification = "confirmed" | "needs-check";

/**
 * One community affected by the regional-service collapse.
 * Sourced from `data-sources/route-analysis/lost_routes_seed.csv` (the 15
 * documented lost / EAS-dependent communities). `verified` is derived from
 * `verification === "confirmed"` so existing UI keeps working.
 */
export interface Community {
  id: string;
  city: string;
  state: string;
  /** Airport IATA code (also the basis for `id`). */
  iata: string;
  coordinates: LngLat;
  population: number;
  populationSource: string;
  status: ServiceStatus;
  /**
   * Year the last / a major scheduled service ended. `null` means the
   * community is still on the map only through an EAS subsidy (no clean
   * "ended" date — the diminished-but-ongoing case).
   */
  lastYearServed: number | null;
  lastCarrier: string;
  /** Number of nonstop hub links the community lost. EAS-only towns: 0. */
  routesLost: number;
  /** IATA codes of the former hub link(s) this community fed / feeds. */
  formerHubs: string[];
  /**
   * Year each `formerHubs` link ended, keyed by hub IATA. `null` = the link
   * is still flown (typically under an EAS subsidy). Lets the timeline date
   * each severed link individually instead of by one community-level year.
   */
  linkYears?: Record<string, number | null>;
  /** One-line human detail, where available. */
  detail?: string;
  /** Which Revia variant could plausibly restore / right-size the gap. */
  restorableBy: ReviaVariant;
  /** What the service-loss facts are traced to. */
  source: string;
  verification: Verification;
  /** Derived: `verification === "confirmed"`. */
  verified: boolean;
}

/** A severed (or subsidy-dependent) city-pair, derived for the arc layer. */
export interface LostRoute {
  id: string;
  fromId: string;
  /** Hub IATA code. */
  toId: string;
  from: LngLat;
  to: LngLat;
  lastYearServed: number | null;
  status: ServiceStatus;
  restorableBy: ReviaVariant;
}

/**
 * A short route (<1,000 nm) flown today by an aircraft whose range far
 * exceeds the mission. Sourced from
 * `data-sources/route-analysis/overcapable_seed.csv`.
 */
export interface OverCapableRoute {
  id: string;
  origin: { iata: string; city: string; state: string; coordinates: LngLat };
  dest: { iata: string; city: string; state: string; coordinates: LngLat };
  /** Great-circle stage length, nautical miles. */
  distanceNm: number;
  aircraft: string;
  aircraftSeats: number;
  aircraftRangeNm: number;
  /** aircraftRangeNm / distanceNm. ≥2.5 flags; ≥5.0 is "severe". */
  capabilityRatio: number;
  severe: boolean;
  /** Right-sized Revia regional variant. */
  match: ReviaVariant;
  /** Human label for `match` (e.g. "R-75"). */
  matchLabel: string;
}

export interface AircraftSpec {
  label: string;
  value: string;
  /** Mark specs the brief flagged as needing verification. */
  verified: boolean;
}

export interface AircraftVariant {
  name: ReviaVariant | string;
  internalCode?: string;
  tagline: string;
  seats: string;
  range: string;
  specs: AircraftSpec[];
  /** Public-facing photo. When set, replaces the placeholder silhouette. */
  image?: string;
  /** Alt text for `image`. */
  imageAlt?: string;
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
