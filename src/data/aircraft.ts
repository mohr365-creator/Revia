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
    range: "~1,800 nm",
    image: "/aircraft/r-50.jpg",
    imageAlt: "Revia R-50 regional jet in flight.",
    specs: [
      { label: "Seats", value: "50 (single class)", verified: true },
      { label: "Range", value: "~1,800 nm", verified: false },
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
      { label: "Engine", value: "Derated PW1500G", verified: true },
      { label: "Runway (MTOW)", value: "~1,600 m", verified: true },
    ],
  },
  {
    name: "R-100",
    internalCode: "1C",
    tagline: "Regional capacity, mainline economics.",
    seats: "~100 seats",
    range: "~1,200 nm",
    image: "/aircraft/r-100.png",
    imageAlt: "Revia R-100 regional jet side profile.",
    specs: [
      { label: "Seats", value: "100 (single class)", verified: true },
      { label: "Range", value: "~1,200 nm", verified: true },
      { label: "MTOW", value: "~40,000 kg", verified: false },
      { label: "Engine", value: "Derated PW1500G", verified: true },
      { label: "Runway (MTOW)", value: "~1,800 m", verified: true },
    ],
  },
];

/**
 * Cargo variant — the freighter side of the commercial offering. Built on the
 * same shared architecture as the passenger family (R-100F off the R-100
 * baseline). Figures are derivative estimates, flagged for verification until
 * the freighter configuration is defined.
 */
export const cargoVariants: AircraftVariant[] = [
  {
    name: "R-100F",
    internalCode: "1C-F",
    tagline: "Cargo-first, by design.",
    seats: "Main-deck freighter",
    range: "~1,200 nm",
    image: "/aircraft/freighter.png",
    imageAlt: "Revia R-100F regional freighter in flight over countryside.",
    specs: [
      { label: "Payload", value: "~12,000 kg", verified: false },
      { label: "Range (max payload)", value: "~1,200 nm", verified: false },
      { label: "Main-deck door", value: "Forward port cargo door", verified: false },
      { label: "Containers", value: "Bulk + ULD-capable", verified: false },
      { label: "Engine", value: "PW1500G", verified: true },
    ],
  },
];

/**
 * Commercial special-missions variants. Built on the same shared architecture
 * as the passenger and cargo family, but configured for civil public-service
 * and industrial roles — distinct from the defense variants below. Figures are
 * derivative concepts, flagged for verification until configurations are
 * defined.
 */
export const specialMissions: AircraftVariant[] = [
  {
    name: "Air Ambulance",
    tagline: "ICU-grade aeromedical transport into short fields.",
    seats: "",
    range: "~1,500 nm",
    image: "/missions/air-ambulance.png",
    imageAlt: "Air ambulance variant of the Revia R-family.",
    specs: [
      { label: "Configuration", value: "Litters + critical-care team", verified: false },
      { label: "Cabin", value: "Reconfigurable medical deck", verified: false },
      { label: "Field", value: "Short / unimproved", verified: false },
      { label: "Engine", value: "PW1500G", verified: true },
    ],
  },
  {
    name: "Aerial Firefighting",
    tagline: "Retardant and water delivery with regional reach.",
    seats: "",
    range: "Ferry ~1,800 nm",
    image: "/missions/fire-tanker.png",
    imageAlt: "Aerial fire tanker variant of the Revia R-family.",
    specs: [
      { label: "Tank", value: "Roll-on/roll-off (concept)", verified: false },
      { label: "Drop", value: "Constant-flow system (concept)", verified: false },
      { label: "Reload", value: "Ground / scoop (TBD)", verified: false },
      { label: "Engine", value: "PW1500G", verified: true },
    ],
  },
  {
    name: "Oil Spill Response",
    tagline: "Dispersant spray and surveillance for marine response.",
    seats: "",
    range: "~1,500 nm",
    image: "/aircraft/oil-spill-response.png",
    imageAlt: "Oil Spill Response variant — blue and white livery with dispersant markings.",
    specs: [
      { label: "Spray", value: "Wing / belly boom (concept)", verified: false },
      { label: "Sensors", value: "Slick mapping suite", verified: false },
      { label: "Endurance", value: "~6 hrs", verified: false },
      { label: "Engine", value: "PW1500G", verified: true },
    ],
  },
  {
    name: "Survey & SAR",
    tagline: "Civil search-and-rescue, survey, and aerial mapping.",
    seats: "",
    range: "~1,500 nm",
    image: "/aircraft/sar.png",
    imageAlt: "Search and Rescue variant — orange and white livery with SAR markings.",
    specs: [
      { label: "Sensors", value: "EO/IR · radar (concept)", verified: false },
      { label: "Endurance", value: "~6 hrs", verified: false },
      { label: "Provisions", value: "Drop hatch / observer stations", verified: false },
      { label: "Engine", value: "PW1500G", verified: true },
    ],
  },
];

/**
 * Defense variants. Same shared architecture, configured for military roles and
 * kept distinct from the commercial special-missions line above. We sequence
 * defense and cargo first, so these are core to the program. Figures are
 * derivative concepts, flagged for verification until defined.
 */
export const defenseVariants: AircraftVariant[] = [
  {
    name: "ISR",
    tagline: "Intelligence, surveillance, and reconnaissance with long loiter.",
    seats: "",
    range: "~1,800 nm",
    specs: [
      { label: "Roles", value: "ISR · signals (provisions)", verified: false },
      { label: "Endurance", value: "~6 hrs", verified: false },
      { label: "Sensors", value: "EO/IR · radar provisions", verified: false },
      { label: "Cabin", value: "Operator mission deck", verified: false },
      { label: "Engine", value: "PW1500G", verified: true },
    ],
  },
  {
    name: "Maritime Patrol",
    tagline: "Wide-area surface search and maritime patrol.",
    seats: "",
    range: "~1,800 nm",
    specs: [
      { label: "Roles", value: "Maritime patrol · ASW provisions", verified: false },
      { label: "Sensors", value: "Surface-search radar", verified: false },
      { label: "Endurance", value: "~6–7 hrs", verified: false },
      { label: "Engine", value: "PW1500G", verified: true },
    ],
  },
  {
    name: "Tactical Airlift",
    tagline: "Connector airlift between austere nodes.",
    seats: "",
    range: "~1,500 nm",
    image: "/missions/afsoc.png",
    imageAlt: "AFSOC tactical airlift variant of the Revia R-family.",
    specs: [
      { label: "Floor", value: "Flat cargo floor", verified: false },
      { label: "Field", value: "Short / unimproved", verified: false },
      { label: "Payload", value: "Palletized (concept)", verified: false },
      { label: "Engine", value: "PW1500G", verified: true },
    ],
  },
  {
    name: "Aeromedical Evacuation",
    tagline: "Military patient movement from forward areas.",
    seats: "",
    range: "~1,500 nm",
    specs: [
      { label: "Configuration", value: "Litters + care team", verified: false },
      { label: "Cabin", value: "Reconfigurable medical deck", verified: false },
      { label: "Field", value: "Short / unimproved", verified: false },
      { label: "Engine", value: "PW1500G", verified: true },
    ],
  },
];

export const remoteAutonomousVariant: AircraftVariant = {
  name: "Remote & Autonomous Operations",
  tagline: "Optionally piloted and remotely operated missions across contested and denied environments.",
  seats: "R-75 based",
  range: "~1,800 nm",
  image: "/missions/remote-autonomous.png",
  imageAlt: "Revia R-family in remote and autonomous operations configuration over desert terrain.",
  specs: [
    { label: "Operation", value: "Optionally piloted / RPA-capable", verified: false },
    { label: "Roles", value: "ISR · logistics · persistent surveillance", verified: false },
    { label: "Environment", value: "Contested / denied airspace", verified: false },
    { label: "Endurance", value: "Extended (TBD)", verified: false },
    { label: "Engine", value: "PW1500G", verified: true },
  ],
};

/**
 * Demand-side CEO quotes. ALL must be verified to source and dated before
 * publishing (brief §7). Marked `verified: false` until then.
 */
export const ceoQuotes: Quote[] = [
  {
    text: "We need more competition in the aerospace business.",
    attribution: "Scott Kirby, CEO, United Airlines",
    context: "Attributed: IATA Dubai 2024. VERIFY exact wording, venue, and date.",
    verified: false,
  },
  {
    text: "We'd consider a third manufacturer if they came in 10–20% below Airbus.",
    attribution: "Michael O'Leary, CEO, Ryanair",
    context: "Paraphrased: VERIFY exact wording, source, and date before publishing.",
    verified: false,
  },
];
