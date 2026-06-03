import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { AircraftSilhouette } from "@/components/aircraft/AircraftSilhouette";

export const metadata: Metadata = {
  title: "Aircraft",
  description:
    "The Revia regional family: R-50, R-75, and R-100, built on shared architecture to restore the routes the market left behind.",
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
      "The third manufacturer airline CEOs have publicly asked for — developed concurrently, aimed at the single-aisle market.",
  },
];

export default function AircraftOverviewPage() {
  return (
    <>
      <PageHeader
        eyebrow="Aircraft"
        title="One architecture. Three variants. A platform built to grow."
        intro="Shared wing, cross-section, and engine family across the R-50, R-75, and R-100 keep development capital efficient and create a foundation designed to scale as market needs expand."
      />

      <section className="bg-navy py-16">
        <Container>
          <article className="flex flex-col rounded-2xl border border-cream/10 bg-cream/[0.03] p-8 md:flex-row md:items-center md:gap-12">
            <div className="md:w-1/2">
              <AircraftSilhouette
                src="/images/regional-family-photo.png"
                label="Revia regional family in flight"
              />
            </div>
            <div className="mt-8 md:mt-0 md:w-1/2">
              <h2 className="font-serif text-3xl text-cream">Regional family</h2>
              <p className="mt-1 text-sm uppercase tracking-eyebrow text-cream/50">
                R-50 · R-75 · R-100
              </p>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-cream/75">
                A 5-abreast trio sharing one wing, one fuselage cross-section, and
                one engine family. Sequenced defense and cargo first, where the
                certification path is cleaner and demand is immediate, then
                expanding into the commercial thin-route segment the incumbents
                abandoned.
              </p>
              <div className="mt-8">
                <ButtonLink href="/aircraft/regional" variant="secondary">
                  Explore the family →
                </ButtonLink>
              </div>
            </div>
          </article>

          <div className="mt-12 rounded-2xl border border-cream/10 bg-cream/[0.02] p-8">
            <Eyebrow>Architecture</Eyebrow>
            <p className="mt-4 max-w-3xl text-pretty text-lg text-cream/75">
              The R-50, R-75, and R-100 share a wing, a fuselage cross-section,
              and an engine family. One type rating, one supply chain, one
              development program amortized across three aircraft, with a
              platform deliberately architected for future growth as the market
              demands it.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
