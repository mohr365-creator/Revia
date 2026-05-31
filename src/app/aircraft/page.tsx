import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { AircraftSilhouette } from "@/components/aircraft/AircraftSilhouette";

export const metadata: Metadata = {
  title: "Aircraft",
  description:
    "A regional aircraft family built on shared architecture — defense and cargo first, then commercial.",
};

const families = [
  {
    href: "/aircraft/regional",
    name: "Regional family",
    variants: "R-50 · R-75 · R-100 · R-100F · R-75 SM",
    blurb:
      "A 5-abreast family sharing one wing, one cross-section, and one engine family — passenger, freighter, and special-missions variants. Built to restore the thin routes first.",
    image: "/aircraft/regional-family.png",
    imageAlt: "The Revia regional family in formation flight.",
  },
];

export default function AircraftOverviewPage() {
  return (
    <>
      <PageHeader
        eyebrow="Aircraft"
        title="One architecture. One regional family. Built for the gap."
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
                {f.image ? (
                  <div className="mb-8 overflow-hidden rounded-xl border border-cream/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={f.image}
                      alt={f.imageAlt ?? f.name}
                      className="aspect-[16/9] w-full object-cover"
                    />
                  </div>
                ) : (
                  <AircraftSilhouette className="mb-8 text-saffron" label={f.name} />
                )}
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
              The R-50, R-75, and R-100 share a wing, a fuselage cross-section,
              and an engine family. One type rating, one supply chain, one
              development program amortized across three aircraft.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
