export type PhaseStatus = "active" | "upcoming" | "future";

export interface Phase {
  id: string;
  horizon: string;
  status: PhaseStatus;
  title: string;
  description: string;
  milestones: string[];
}

export const developmentPhases: Phase[] = [
  {
    id: "pre-series-a",
    horizon: "Now",
    status: "active",
    title: "Concept development & stakeholder engagement",
    description:
      "Revia is in active concept development — building the business case, engaging airlines, government stakeholders, and potential investors, and refining the program architecture ahead of Series A.",
    milestones: [
      "Aircraft family concept definition (R-50, R-75, R-100, R-100F)",
      "Defense and special-missions variant scoping",
      "Route market analysis and community documentation",
      "Investor and partner outreach underway",
    ],
  },
  {
    id: "series-a",
    horizon: "Series A",
    status: "upcoming",
    title: "Series A · Program launch",
    description:
      "Series A closes and funds the transition from concept to program. Preliminary design begins, key engineering hires are made, and formal defense and cargo partnerships are initiated.",
    milestones: [
      "Series A close",
      "Core engineering team formation",
      "Defense partner and prime contractor engagement",
      "Preliminary design review (PDR) initiated",
      "Certification strategy filed with FAA / EASA",
    ],
  },
  {
    id: "defense-cargo",
    horizon: "Years 1–4",
    status: "future",
    title: "Defense & cargo first",
    description:
      "The program sequences defense and cargo variants ahead of commercial certification. Government demand underwrites early production rates; the certification basis earned here transfers directly to the commercial family.",
    milestones: [
      "Special-missions and defense variant critical design review (CDR)",
      "R-100F freighter development alongside commercial program",
      "DoD and allied-nation program-of-record pursuit",
      "Type-certificate basis established with regulatory authorities",
    ],
  },
  {
    id: "commercial-phase-1",
    horizon: "Years 4–8",
    status: "future",
    title: "Commercial Phase 1 · Regional family",
    description:
      "The R-50, R-75, and R-100 enter FAA and EASA type certification on the shared architecture. Entry-into-service targets thin domestic routes and international thin-haul markets where no current product competes effectively.",
    milestones: [
      "R-75 lead variant first flight",
      "FAA / EASA type certification (R-50, R-75, R-100)",
      "Launch airline customer agreements",
      "Entry into service — domestic thin routes",
      "R-100F cargo variant entry into service",
    ],
  },
];
