import type { AircraftVariant, Quote } from "@/lib/types";

/**
 * Regional family. Marketing names are public-facing; internal variant
 * codes (1A/1B/1C) are kept here for reference only and must NOT appear in public
 * copy. Several figures are flagged by the brief as needing verification
 * (R-100 MTOW, R-50 runway, R-50 range) and are marked `verified: false`.
 *
 * NOTE: the Phase-2 narrowbody family (the 6-abreast A320neo/737 MAX competitor)
 * has been stripped from the public site for now and lives on the
 * `feature/phase-ii-narrowbody` branch for later incorporation.
 */
export const regionalFamily: AircraftVariant[] = [
  {
    name: "R-50",
    internalCode: "1A",
    tagline: "The thin-route restorer.",
    seats: "~50 seats",
    range: "~1,200 nm",
    image: "/aircraft/r-50.jpg",
    imageAlt: "Revia R-50 regional jet in flight.",
    specs: [
      { label: "Seats", value: "50 (single class)", verified: true },
      { label: "Range", value: "~1,200 nm", verified: false },
      { label: "MTOW", value: "~24,000 kg", verified: true },
      { label: "Engine", value: "Derated PW1500G", verified: true },
      { label: "Runway (MTOW)", value: "~1,400 m", verified: false },
    ],
  },
  {
    name: "R-75",
    internalCode: "1B",
    tagline: "The workhorse of the family.",
    seats: "~75 seats",
    range: "~1,500 nm",
    image: "/aircraft/r-75.png",
    imageAlt: "Revia R-75 regional jet on the apron.",
    specs: [
      { label: "Seats", value: "75 (single class)", verified: true },
      { label: "Range", value: "~1,500 nm", verified: true },
      { label: "MTOW", value: "~31,000 kg", verified: true },
      { label: "Engine", value: "PW1500G", verified: true },
      { label: "Runway (MTOW)", value: "~1,600 m", verified: true },
    ],
  },
  {
    name: "R-100",
    internalCode: "1C",
    tagline: "Regional capacity, mainline economics.",
    seats: "~100 seats",
    range: "~1,800 nm",
    image: "/aircraft/r-100.png",
    imageAlt: "Revia R-100 regional jet side profile.",
    specs: [
      { label: "Seats", value: "100 (single class)", verified: true },
      { label: "Range", value: "~1,800 nm", verified: true },
      { label: "MTOW", value: "~40,000 kg", verified: false },
      { label: "Engine", value: "PW1500G", verified: true },
      { label: "Runway (MTOW)", value: "~1,800 m", verified: true },
    ],
  },
];

/**
 * Mission variants built on the same shared architecture as the passenger
 * family. The strategy sequences defense and cargo first, so these derivatives
 * are core to the program rather than afterthoughts. All figures here are
 * derivative estimates off the R-75 baseline and are flagged for verification
 * until the freighter and special-missions configurations are defined.
 */
export const missionVariants: AircraftVariant[] = [
  {
    name: "R-75F",
    internalCode: "1B-F",
    tagline: "Cargo-first, by design.",
    seats: "Main-deck freighter",
    range: "~1,400 nm",
    specs: [
      { label: "Payload", value: "~9,000 kg", verified: false },
      { label: "Range (max payload)", value: "~1,400 nm", verified: false },
      { label: "Main-deck door", value: "Forward port cargo door", verified: false },
      { label: "Containers", value: "Bulk + ULD-capable", verified: false },
      { label: "Engine", value: "PW1500G", verified: true },
    ],
  },
  {
    name: "R-75 SM",
    internalCode: "1B-SM",
    tagline: "ISR, maritime patrol, medevac, and connector.",
    seats: "Mission-configurable",
    range: "~1,800 nm",
    specs: [
      { label: "Roles", value: "ISR · maritime patrol · medevac", verified: false },
      { label: "Endurance", value: "~6 hrs", verified: false },
      { label: "Cabin", value: "Reconfigurable mission deck", verified: false },
      { label: "Provisions", value: "Sensor / palletized systems", verified: false },
      { label: "Engine", value: "PW1500G", verified: true },
    ],
  },
];

/**
 * Demand-side CEO quotes. ALL must be verified to source and dated before
 * publishing (brief §7). Marked `verified: false` until then.
 */
export const ceoQuotes: Quote[] = [
  {
    text: "We need more competition in the aerospace business.",
    attribution: "Scott Kirby, CEO, United Airlines",
    context: "Attributed — IATA Dubai 2024. VERIFY exact wording, venue, and date.",
    verified: false,
  },
  {
    text: "We'd consider a third manufacturer if they came in 10–20% below Airbus.",
    attribution: "Michael O'Leary, CEO, Ryanair",
    context: "Paraphrased — VERIFY exact wording, source, and date before publishing.",
    verified: false,
  },
];
