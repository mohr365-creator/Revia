import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DataFlag } from "@/components/ui/DataFlag";
import { ButtonLink } from "@/components/ui/Button";
import { DefenseLogo } from "@/components/brand/DefenseLogo";
import { defenseVariants, remoteAutonomousVariant } from "@/data/aircraft";

export const metadata: Metadata = {
  title: "Defense",
  description:
    "Revia Defense: military variants on the shared architecture. ISR, maritime patrol, tactical airlift, and aeromedical evacuation. Defense and cargo first.",
};

const opportunities = [
  {
    heading: "Why defense first",
    bullets: [
      "Government demand tolerates lower initial production rate",
      "Values commonality across platforms and supply chains",
      "Underwrites the certification path the commercial family inherits",
    ],
  },
  {
    heading: "Built on commonality",
    bullets: [
      "Shared wing, cross-section, and engine family with the regional aircraft",
      "One supply chain across civil and government lines",
      "One type rating reduces training and logistics costs",
    ],
  },
  {
    heading: "Partner with us",
    bullets: [
      "Engaging primes, integrators, and government stakeholders now",
      "Mission profiles and payload definition in progress",
      "Program timelines aligned to Series A ahead",
    ],
  },
];

export default function DefensePage() {
  return (
    <>
      {/* Logo-forward hero. The REVIA DEFENSE shield leads the section. */}
      <header className="border-b border-cream/10 bg-navy pb-16 pt-36">
        <Container>
          <DefenseLogo tone="light" height={84} priority className="mb-10" />
          <Eyebrow>Defense</Eyebrow>
          <h1 className="mt-5 max-w-3xl text-balance font-serif text-4xl leading-tight text-cream sm:text-5xl">
            The same architecture, sequenced for the mission.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg text-cream/70">
            Revia Defense applies the regional family (shared wing,
            cross-section, and engine) to military roles. Defense and cargo
            lead; commercial follows. These variants are distinct from our
            civil special-mission line.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/contact" variant="primary">
              Partner with us
            </ButtonLink>
            <ButtonLink href="/aircraft/special-missions" variant="secondary">
              Commercial special missions →
            </ButtonLink>
          </div>
        </Container>
      </header>

      <section className="bg-navy py-16">
        <Container>
          <Eyebrow>Defense variants</Eyebrow>
          <h2 className="mt-4 max-w-3xl text-balance font-serif text-3xl text-cream">
            Where a common regional platform earns its keep.
          </h2>

          <div className="my-8 flex items-start gap-3 rounded-xl border border-ember/30 bg-ember/5 p-4 text-sm text-cream/70">
            <DataFlag>Concept · specs unverified</DataFlag>
            <p>
              The configurations below are derivative concepts. Roles, endurance,
              and mission systems are illustrative and must be confirmed against a
              defined program before publishing.
            </p>
          </div>

          <div className="rounded-2xl border border-cream/10 bg-cream/[0.03] overflow-hidden mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/missions/afsoc.png"
              alt="Revia R-family in AFSOC special missions configuration"
              className="aspect-[16/7] w-full object-cover"
            />
            <ul className="divide-y divide-cream/10">
              {defenseVariants.map((v) => (
                <li key={String(v.name)} className="flex flex-col gap-1 px-8 py-6 sm:flex-row sm:items-baseline sm:gap-6">
                  <div className="min-w-[11rem]">
                    <span className="font-serif text-xl text-cream">{v.name}</span>
                  </div>
                  <p className="text-sm text-cream/70">{v.tagline}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Remote & Autonomous Operations — separate card */}
          <div className="rounded-2xl border border-cream/10 bg-cream/[0.03] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={remoteAutonomousVariant.image}
              alt={remoteAutonomousVariant.imageAlt}
              className="aspect-[16/7] w-full object-cover"
            />
            <div className="px-8 py-6">
              <h3 className="font-serif text-2xl text-cream">{remoteAutonomousVariant.name}</h3>
              <p className="mt-2 text-cream/70">{remoteAutonomousVariant.tagline}</p>
              <ul className="mt-4 space-y-2">
                {remoteAutonomousVariant.specs.map((s) => (
                  <li key={s.label} className="flex items-baseline gap-2 text-sm">
                    <span className="shrink-0 text-cream/50">{s.label}:</span>
                    <span className="text-cream">{s.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-cream/10 bg-navy py-16">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {opportunities.map((o) => (
              <div
                key={o.heading}
                className="rounded-2xl border border-cream/10 bg-cream/[0.02] p-8"
              >
                <h3 className="font-serif text-lg text-cream">{o.heading}</h3>
                <ul className="mt-3 space-y-2">
                  {o.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-cream/70">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-cream/10 bg-cream/[0.03] p-8">
            <p className="font-serif text-xl text-cream">
              Exploring a mission profile or a program fit?
            </p>
            <p className="mt-3 max-w-2xl text-pretty text-cream/70">
              We work with primes, integrators, and government stakeholders on
              payload definition and timelines. For civil roles (air ambulance,
              firefighting, oil-spill response, and survey/SAR), see{" "}
              <Link href="/aircraft/special-missions" className="text-amber hover:text-saffron">
                Special Missions
              </Link>
              .
            </p>
            <div className="mt-6">
              <ButtonLink href="/contact" variant="primary">
                Get in touch
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
