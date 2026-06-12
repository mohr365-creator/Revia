/**
 * Competitive landscape — distilled from the internal "The Field" census
 * (competitive analysis, public sources as of June 2026; estimates marked).
 * Used by the /aircraft/why-revia page and its infographics. Framing is
 * deliberately neutral: the point is the empty segment, not the scoreboard.
 */

export type ProgramStatus = "revia" | "dev" | "paused" | "cancelled" | "legacy";

/** Seats (baseline) vs design range (nm) — the white-space map. */
export type SeatRangePoint = {
  name: string;
  seats: number;
  range: number;
  status: ProgramStatus;
  /** Electric, hybrid-electric, or other novel-propulsion program. */
  newProp?: boolean;
};

export const seatsRange: SeatRangePoint[] = [
  // Revia family — shared wing & fuel, a payload/range trade
  { name: "R-50", seats: 50, range: 1150, status: "revia" },
  { name: "R-75", seats: 76, range: 900, status: "revia" },
  { name: "R-100", seats: 100, range: 700, status: "revia" },
  // In development
  { name: "D328eco", seats: 40, range: 655, status: "dev" },
  { name: "Aura ERA", seats: 19, range: 900, status: "dev", newProp: true },
  { name: "Electra EL9", seats: 9, range: 1100, status: "dev", newProp: true },
  { name: "Heart ES-30", seats: 30, range: 215, status: "dev", newProp: true },
  { name: "TAC SY30J", seats: 30, range: 430, status: "dev" },
  { name: "TAC SY50J", seats: 50, range: 430, status: "dev" },
  { name: "Elysian E9X", seats: 92, range: 470, status: "dev", newProp: true },
  // On hold
  { name: "Eviation Alice", seats: 9, range: 250, status: "paused", newProp: true },
  // No longer active
  { name: "Maeve MJ500", seats: 88, range: 800, status: "cancelled", newProp: true },
  { name: "SpaceJet M90", seats: 88, range: 2040, status: "cancelled" },
  { name: "728JET", seats: 75, range: 1800, status: "cancelled" },
  // Legacy (in service, no clean-sheet successor)
  { name: "ATR 72", seats: 72, range: 740, status: "legacy" },
  { name: "ATR 42", seats: 48, range: 720, status: "legacy" },
  { name: "CRJ900", seats: 76, range: 1550, status: "legacy" },
  { name: "E175", seats: 76, range: 2060, status: "legacy" },
];

/** Where capital arrived and what it produced. */
export type Fate = "active" | "wounded" | "dead";

export type CapitalEntry = {
  name: string;
  /** Capital raised / committed, in $M (log scale on the chart). */
  capitalM: number;
  label: string;
  note: string;
  fate: Fate;
};

export const capital: CapitalEntry[] = [
  { name: "Mitsubishi SpaceJet", capitalM: 10000, label: "~$10B", fate: "dead", note: "Six flying prototypes; program ended in 2023 without reaching certification" },
  { name: "JetZero", capitalM: 1000, label: ">$1B", fate: "active", note: "Demonstrator in build, first flight targeted 2027 (incl. $235M USAF + commitments)" },
  { name: "Aura Aero (ERA)", capitalM: 393, label: "€340M", fate: "active", note: "First flight now targeted for late 2027 (incl. ≈€290M subsidies / state)" },
  { name: "Electra (EL9)", capitalM: 235, label: "~$235M", fate: "active", note: "Part 23 application filed; 2,200 pre-orders — an adjacent market" },
  { name: "Eviation (Alice)", capitalM: 200, label: "~$200M", fate: "dead", note: "One flight in 2022; development on hold since early 2025" },
  { name: "Heart (ES-30)", capitalM: 145, label: "~$145M", fate: "wounded", note: "Ground-demonstrator stage; restructured and relocated" },
  { name: "Universal Hydrogen", capitalM: 100, label: "~$100M", fate: "dead", note: "Testbed flew in 2023; operations wound down in 2024" },
  { name: "Maeve (MJ500)", capitalM: 30, label: "~€30M", fate: "dead", note: "Concept through several redesigns; wound down in 2026 (est.)" },
  { name: "The AirCraft Co.", capitalM: 8, label: "~$8M", fate: "wounded", note: "Simulator + sub-scale prep (self / angel funded, est.)" },
];

/** Two eras of attrition. */
export type AttritionEvent = { year: string; name: string; why: string };

export const conventionalEra: AttritionEvent[] = [
  { year: "1996", name: "Fokker", why: "Ended during production" },
  { year: "2001", name: "BAe Avro RJX", why: "Wound down shortly after first flight" },
  { year: "2002", name: "Fairchild Dornier 728", why: "Ended mid-program" },
  { year: "2023", name: "Mitsubishi SpaceJet", why: "≈$10B invested; ended before certification" },
];

export const propulsionEra: AttritionEvent[] = [
  { year: "2019", name: "Zunum Aero", why: "Boeing-backed hybrid; wound down" },
  { year: "2023", name: "Tecnam P-Volt", why: "Suspended — battery economics" },
  { year: "2024", name: "Universal Hydrogen", why: "≈$100M; operations wound down" },
  { year: "2025", name: "Eviation Alice", why: "≈$200M; on hold after first flight" },
  { year: "2026", name: "Maeve", why: "Wound down in 2026" },
];

/** What getting to entry-into-service has actually cost. */
export const capitalBenchmarks: { program: string; detail: string }[] = [
  { program: "Bombardier CSeries — clean-sheet, certified", detail: "≈ $6B to EIS — a company-defining investment" },
  { program: "Embraer E2 — derivative, certified", detail: "≈ $1.7B — the derivative discount is real" },
  { program: "Mitsubishi SpaceJet — clean-sheet", detail: "≈ $10B — and did not reach certification" },
  { program: "JetZero — clean-sheet, in progress", detail: ">$1B raised + committed — buys a demonstrator, not an EIS" },
];

/** The incumbents that once served this class — and where they've gone. */
export type LegacyPlayer = {
  name: string;
  product: string;
  seats: string;
  /** Short status tag. */
  status: string;
  /** How they've moved away from a conventional clean-sheet at 50–100 seats. */
  moved: string;
};

export const legacyPlayers: LegacyPlayer[] = [
  {
    name: "ATR",
    product: "ATR 42 / 72",
    seats: "48–72",
    status: "In service, no successor",
    moved: "The airframe dates to the 1980s and tops out at 72 seats. The clean-sheet “EVO” launch decision keeps slipping, and there is no 90–100 seat product on the roadmap.",
  },
  {
    name: "Embraer",
    product: "E175 / E175-E2",
    seats: "76–88",
    status: "Upmarket + scope-constrained",
    moved: "The re-engined E175-E2 came in too heavy for the US scope clause and has drawn no US orders. Embraer shelved its next-gen turboprop and focuses on the larger 150-seat E2 jets.",
  },
  {
    name: "Bombardier",
    product: "CRJ family",
    seats: "50–100",
    status: "Exited commercial",
    moved: "Sold the CRJ program to Mitsubishi (2020) and the CSeries to Airbus, where it became the larger 100–150 seat A220. Bombardier left regional aviation for business jets.",
  },
  {
    name: "De Havilland Canada",
    product: "Dash 8-400",
    seats: "78–90",
    status: "Production paused",
    moved: "Paused Dash 8 production and shifted focus; no active 50–100 seat line, with any restart years out.",
  },
];

/** Who is still actively developing in or near the class — context for the timeline. */
export type ActivePlayer = {
  name: string;
  program: string;
  seats: string;
  category: "Airframe bet" | "Derivative" | "Clean-sheet, early-stage" | "New propulsion";
  note: string;
};

export const activePlayers: ActivePlayer[] = [
  { name: "JetZero", program: "Z4 blended-wing-body", seats: "~200+", category: "Airframe bet", note: "Demonstrator in build with USAF backing — a large, different-market airframe, not a 50–100 regional." },
  { name: "Deutsche Aircraft", program: "D328eco", seats: "40", category: "Derivative", note: "A re-engined Do 328 successor: conventional power, but below the 50-seat floor." },
  { name: "The AirCraft Co.", program: "SY30J / SY50J", seats: "30 / 50", category: "Clean-sheet, early-stage", note: "Conventional regional jets in early, lightly funded development." },
  { name: "Aura Aero", program: "ERA", seats: "19", category: "New propulsion", note: "Hybrid-electric 19-seater; first flight now targeted for late 2027." },
  { name: "Electra", program: "EL9", seats: "9", category: "New propulsion", note: "Hybrid-electric STOL aimed at an adjacent short-field market." },
  { name: "Heart Aerospace", program: "ES-30", seats: "30", category: "New propulsion", note: "Hybrid-electric 30-seater at the ground-demonstrator stage." },
  { name: "Elysian", program: "E9X", seats: "90", category: "New propulsion", note: "Battery-electric concept from a research-led team; pre-prototype." },
];

/** Three facts the census points to. */
export const takeaways: { n: string; head: string; body: string }[] = [
  {
    n: "01",
    head: "The 50–100 seat box has been open since 2002.",
    body: "No conventional clean-sheet has occupied that band since Fairchild Dornier wound down — and the most recent exit in 2026 left the band open again above us.",
  },
  {
    n: "02",
    head: "Capital follows propulsion stories in. Physics tends to carry it back out.",
    body: "Several propulsion-focused programs have exited in the past three years. The programs still moving are derivatives, sub-19-seaters, or airframe bets with conventional engines — which points back toward a conventional-power thesis.",
  },
  {
    n: "03",
    head: "The demand signal is proven — and currently unmet.",
    body: "SkyWest took equity and launch rights in this segment. Delta partnered on it. United funds adjacent clean-sheets. That demand is still looking for an aircraft that closes the business case.",
  },
];
