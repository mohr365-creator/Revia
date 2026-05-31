export const site = {
  name: "Revia",
  tagline: "The way, revived.",
  thesis:
    "America and the world lost the small-aircraft routes that connected ordinary places. Revia is building the aircraft to bring them back.",
  // Domain unresolved — revia.com is taken. Placeholder until confirmed.
  domain: "revia.aero",
  disclaimer: "Confidential — pre–Series A.",
} as const;

export const primaryNav = [
  { href: "/mission", label: "Mission" },
  { href: "/routes", label: "Routes" },
  {
    href: "/aircraft",
    label: "Aircraft",
    children: [
      { href: "/aircraft/regional", label: "Commercial" },
      { href: "/aircraft/special-missions", label: "Defense" },
    ],
  },
  { href: "/technology", label: "Technology" },
  { href: "/company", label: "Company" },
] as const;

export const footerNav = [
  {
    heading: "Explore",
    links: [
      { href: "/mission", label: "Mission" },
      { href: "/routes", label: "Lost routes" },
      { href: "/aircraft", label: "Aircraft" },
      { href: "/aircraft/special-missions", label: "Special Missions" },
      { href: "/technology", label: "Technology" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/company", label: "About" },
      { href: "/newsroom", label: "Newsroom" },
      { href: "/contact", label: "Contact" },
    ],
  },
] as const;

export const inquiryTypes = [
  {
    id: "investor",
    label: "Investor",
    blurb: "Series A. Credibility, scale of opportunity, and team.",
  },
  {
    id: "partner",
    label: "Partner (airline / defense)",
    blurb: "Aircraft specs, route economics, and program timeline.",
  },
  { id: "press", label: "Press", blurb: "Story, named communities, and assets." },
  { id: "careers", label: "Careers", blurb: "Mission, ambition, and culture." },
  { id: "general", label: "General", blurb: "Anything else." },
] as const;
