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
