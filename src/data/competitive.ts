/**
 * Competitive landscape — distilled from the internal "The Field" census
 * (competitive analysis, public sources as of June 2026; estimates marked).
 * Used by the /aircraft/why-revia page and its infographics.
 */

export type ProgramStatus = "revia" | "dev" | "paused" | "cancelled" | "legacy";

/** Seats (baseline) vs design range (nm) — the white-space map. */
export type SeatRangePoint = {
  name: string;
  seats: number;
  range: number;
  status: ProgramStatus;
};

export const seatsRange: SeatRangePoint[] = [
  // Revia family — shared wing & fuel, a payload/range trade
  { name: "R-50", seats: 50, range: 1150, status: "revia" },
  { name: "R-75", seats: 76, range: 900, status: "revia" },
  { name: "R-100", seats: 100, range: 700, status: "revia" },
  // In development
  { name: "D328eco", seats: 40, range: 655, status: "dev" },
  { name: "Aura ERA", seats: 19, range: 900, status: "dev" },
  { name: "Electra EL9", seats: 9, range: 1100, status: "dev" },
  { name: "Heart ES-30", seats: 30, range: 215, status: "dev" },
  { name: "TAC SY30J", seats: 30, range: 430, status: "dev" },
  { name: "TAC SY50J", seats: 50, range: 430, status: "dev" },
  { name: "Elysian E9X", seats: 92, range: 470, status: "dev" },
  // Paused
  { name: "Eviation Alice", seats: 9, range: 250, status: "paused" },
  // Cancelled
  { name: "Maeve MJ500", seats: 88, range: 800, status: "cancelled" },
  { name: "SpaceJet M90", seats: 88, range: 2040, status: "cancelled" },
  { name: "728JET", seats: 75, range: 1800, status: "cancelled" },
  // Legacy (in service, no clean-sheet successor)
  { name: "ATR 72", seats: 72, range: 740, status: "legacy" },
  { name: "ATR 42", seats: 48, range: 720, status: "legacy" },
  { name: "CRJ900", seats: 76, range: 1550, status: "legacy" },
  { name: "E175", seats: 76, range: 2060, status: "legacy" },
];

/** Where money arrived and what it bought. */
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
  { name: "Mitsubishi SpaceJet", capitalM: 10000, label: "~$10B", fate: "dead", note: "Six flying prototypes — cancelled 2023, never certified" },
  { name: "JetZero", capitalM: 1000, label: ">$1B", fate: "active", note: "Demonstrator in build, first flight 2027 (incl. $235M USAF + commitments)" },
  { name: "Aura Aero (ERA)", capitalM: 393, label: "€340M", fate: "active", note: "First flight slipped to late 2027 (incl. ≈€290M subsidies / state)" },
  { name: "Electra (EL9)", capitalM: 235, label: "~$235M", fate: "active", note: "Part 23 application filed; 2,200 pre-orders — adjacent market" },
  { name: "Eviation (Alice)", capitalM: 200, label: "~$200M", fate: "dead", note: "One 8-minute flight (2022) — paused, staff laid off Feb 2025" },
  { name: "Heart (ES-30)", capitalM: 145, label: "~$145M", fate: "wounded", note: "Ground demonstrator only — relocated, two layoff rounds" },
  { name: "Universal Hydrogen", capitalM: 100, label: "~$100M", fate: "dead", note: "Testbed flew 2023 — shut down June 2024" },
  { name: "Maeve (MJ500)", capitalM: 30, label: "~€30M", fate: "dead", note: "Concept + four redesigns — bankrupt May 2026 (est.)" },
  { name: "The AirCraft Co.", capitalM: 8, label: "~$8M", fate: "wounded", note: "Simulator + sub-scale prep (self / angel funded, est.)" },
];

/** Two eras of failure. */
export type AttritionEvent = { year: string; name: string; why: string };

export const conventionalEra: AttritionEvent[] = [
  { year: "1996", name: "Fokker", why: "Bankrupt in production" },
  { year: "2001", name: "BAe Avro RJX", why: "Cancelled weeks after first flight" },
  { year: "2002", name: "Fairchild Dornier 728", why: "Bankrupt mid-program" },
  { year: "2023", name: "Mitsubishi SpaceJet", why: "~$10B, cancelled pre-certification" },
];

export const propulsionEra: AttritionEvent[] = [
  { year: "2019", name: "Zunum Aero", why: "Boeing-backed hybrid, collapsed" },
  { year: "2023", name: "Tecnam P-Volt", why: "OEM suspends — battery economics" },
  { year: "2024", name: "Universal Hydrogen", why: "~$100M, shut down" },
  { year: "2025", name: "Eviation Alice", why: "~$200M, paused after one flight" },
  { year: "2026", name: "Maeve", why: "Bankrupt 28 May — our segment" },
];

/** What getting to entry-into-service has actually cost. */
export const capitalBenchmarks: { program: string; detail: string }[] = [
  { program: "Bombardier CSeries — clean-sheet, certified", detail: "≈ $6B to EIS — nearly broke the company" },
  { program: "Embraer E2 — derivative, certified", detail: "≈ $1.7B — the derivative discount is real" },
  { program: "Mitsubishi SpaceJet — clean-sheet, failed", detail: "≈ $10B — and never certified" },
  { program: "JetZero — clean-sheet, in progress", detail: ">$1B raised + committed — buys a demonstrator, not an EIS" },
];

/** Three facts the census hands us. */
export const takeaways: { n: string; head: string; body: string }[] = [
  {
    n: "01",
    head: "The box has been empty since 2002.",
    body: "No conventional clean-sheet has occupied the 50–100 seat band since Fairchild Dornier's bankruptcy — and Maeve's collapse in May 2026 emptied the band again above us.",
  },
  {
    n: "02",
    head: "Capital follows propulsion stories in. Physics carries it out.",
    body: "Four propulsion-bet exits in 36 months. The survivors are derivatives, sub-19-seaters, or airframe bets with conventional engines — quietly conceding the propulsion thesis.",
  },
  {
    n: "03",
    head: "The demand signal is proven — and now orphaned.",
    body: "SkyWest took equity and launch rights in this segment. Delta partnered on it. United funds adjacent clean-sheets. That money is still looking for an aircraft that closes.",
  },
];
