import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { RouteMap } from "@/components/routes/RouteMap";
import { OverCapableSection } from "@/components/routes/OverCapableSection";
import { communities } from "@/data/communities";
import { lostRoutes } from "@/data/routes";
import type { ReviaVariant } from "@/lib/types";

export const metadata: Metadata = {
  title: "Revia Restoration",
  description:
    "The same severed network, seen the other way: which Revia variant brings each community back, and the over-capable routes the family right-sizes.",
};

const variants: { name: ReviaVariant; blurb: string }[] = [
  { name: "R-50", blurb: "the thin EAS-scale links no jet can close profitably" },
  { name: "R-75", blurb: "the mid-size markets the 50-seat retirement stranded" },
  { name: "R-100", blurb: "the larger communities squeezed off mainline gauges" },
];

export default function RestorationPage() {
  const byVariant = variants.map((v) => {
    const matched = communities.filter((c) => c.restorableBy === v.name);
    return {
      ...v,
      communities: matched.length,
      routes: lostRoutes.filter((r) => r.restorableBy === v.name).length,
      population: matched.reduce((sum, c) => sum + c.population, 0),
    };
  });

  return (
    <>
      <PageHeader
        eyebrow="Revia Restoration"
        title="The same map, lit back up."
        intro="The same severed network, told as a story of restoration and new opportunity. The whole map lights up in the routes Revia can profitably fly again — leave it on best fit to see everything, or choose R-50, R-75, or R-100 to light up the routes best suited to that aircraft."
      />

      <section className="bg-navy py-16">
        <Container>
          <div className="mb-12 grid gap-4 sm:grid-cols-3">
            {byVariant.map((v) => (
              <div
                key={v.name}
                className="rounded-2xl border border-cream/10 bg-navy/40 p-6"
              >
                <p className="text-sm font-medium text-amber">{v.name}</p>
                <p className="mt-2 font-serif text-3xl text-cream">
                  {v.communities}
                  <span className="ml-1.5 text-base text-cream/60">communities</span>
                </p>
                <p className="mt-1 text-sm text-cream/70">
                  {v.routes} severed links · {v.population.toLocaleString()} people
                </p>
                <p className="mt-3 text-sm text-cream/50">{v.blurb}</p>
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
