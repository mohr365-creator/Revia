import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { AircraftSilhouette } from "@/components/aircraft/AircraftSilhouette";

export const metadata: Metadata = {
  title: "Aircraft",
  description:
    "Two aircraft families built on shared architecture: defense and cargo first, then commercial.",
};

const families = [
  {
    href: "/aircraft/regional",
    phase: "Phase 1",
    name: "Regional family",
    variants: "R-50 · R-75 · R-100",
    blurb:
      "A 5-abreast family sharing one wing, one cross-section, and one engine family within the phase. Built to restore the thin routes first.",
  },
  {
    href: "/aircraft/narrowbody",
    phase: "Phase 2",
    name: "Narrowbody family",
    variants: "6-abreast · variants TBD",
    blurb:
      "The third manufacturer airline CEOs have asked for, built concurrently and aimed at the single-aisle market.",
  },
];

export default function AircraftOverviewPage() {
  return (
    <>
      <PageHeader
        eyebrow="Aircraft"
        title="One architecture. Two families. A deliberate sequence."
        intro="Commonality is the strategy: shared wing, cross-section, and engine family keep development capital efficient. We sequence defense and cargo first, then commercial."
      />

      <section className="bg-navy py-16">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {families.map((f) => (
              <article
                key={f.href}
                className="flex flex-col rounded-2xl border border-cream/10 bg-cream/[0.03] p-8"
              >
                <span className="text-xs uppercase tracking-eyebrow text-amber">
                  {f.phase}
                </span>
                <AircraftSilhouette className="my-8 text-saffron" label={f.name} />
                <h2 className="font-serif text-2xl text-cream">{f.name}</h2>
                <p className="mt-1 text-sm uppercase tracking-eyebrow text-cream/50">
                  {f.variants}
                </p>
                <p className="mt-4 text-pretty text-cream/70">{f.blurb}</p>
                <div className="mt-8">
                  <ButtonLink href={f.href} variant="secondary">
                    Explore the family →
                  </ButtonLink>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-cream/10 bg-cream/[0.02] p-8">
            <Eyebrow>Commonality</Eyebrow>
            <p className="mt-4 max-w-3xl text-pretty text-lg text-cream/75">
              Within Phase 1, the R-50, R-75, and R-100 share a wing, a fuselage
              cross-section, and an engine family. One type rating, one supply
              chain, one development program amortized across three aircraft.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
