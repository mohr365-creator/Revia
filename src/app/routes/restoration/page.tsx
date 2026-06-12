import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { RouteMap } from "@/components/routes/RouteMap";
import { OverCapableSection } from "@/components/routes/OverCapableSection";
import { AircraftSilhouette } from "@/components/aircraft/AircraftSilhouette";
import { communities } from "@/data/communities";
import { lostRoutes } from "@/data/routes";
import type { ReviaVariant } from "@/lib/types";

export const metadata: Metadata = {
  title: "Revia Restoration",
  description:
    "The same severed network, seen the other way: which Revia variant brings each community back, and the over-capable routes the family right-sizes.",
};

const variants: { name: ReviaVariant; mission: string; blurb: string }[] = [
  {
    name: "R-50",
    mission: "Restore the thinnest lifelines",
    blurb: "the EAS-scale essential links no jet can close profitably",
  },
  {
    name: "R-75",
    mission: "Reconnect the stranded middle",
    blurb: "the mid-size markets the 50-seat jet retirement left behind",
  },
  {
    name: "R-100",
    mission: "Right-size the mainline",
    blurb: "the larger communities squeezed off mainline gauges",
  },
];

export default function RestorationPage() {
  const byVariant = variants.map((v) => {
    const matched = communities.filter((c) => c.restorableBy === v.name);
    return {
      ...v,
      population: matched.reduce((sum, c) => sum + c.population, 0),
    };
  });

  return (
    <>
      <PageHeader
        eyebrow="Revia Restoration"
        title="The same map, lit back up."
        intro="The same severed network, told as a story of restoration and new opportunity. The whole map lights up in the routes Revia can profitably fly again."
      />

      <section className="bg-navy py-16">
        <Container>
          <div className="mb-12 overflow-hidden rounded-2xl border border-cream/10 bg-cream/[0.03]">
            <AircraftSilhouette
              src="/images/restoration-family.png"
              label="The Revia family — R-50, R-75, and R-100 — in formation"
              className="rounded-none"
            />
          </div>

          <div className="mb-12 grid gap-4 sm:grid-cols-3">
            {byVariant.map((v) => (
              <div
                key={v.name}
                className="rounded-2xl border border-cream/10 bg-navy/40 p-6"
              >
                <h3 className="font-serif text-2xl text-cream">
                  <span className="text-amber">{v.name}:</span> {v.mission}
                </h3>
                <p className="mt-3 text-sm text-cream/60">{v.blurb}</p>
                <p className="mt-4 text-xs uppercase tracking-eyebrow text-cream/40">
                  {v.population.toLocaleString()} people to reconnect
                </p>
              </div>
            ))}
          </div>

          <RouteMap
            communities={communities}
            routes={lostRoutes}
            view="restoration"
          />
        </Container>
      </section>

      <OverCapableSection />
    </>
  );
}
