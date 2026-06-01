import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { AircraftSilhouette } from "@/components/aircraft/AircraftSilhouette";

export const metadata: Metadata = {
  title: "Aircraft",
  description:
    "One architecture — a commercial family (passenger + cargo) and civil special-mission derivatives, built on shared structure. Defense variants live in the Defense section.",
};

type FamilyCard = {
  id: string;
  href: string;
  eyebrow: string;
  name: string;
  variants: string;
  blurb: string;
  image?: string;
  imageAlt?: string;
  cta: string;
};

const families: FamilyCard[] = [
  {
    id: "commercial",
    href: "/aircraft/regional",
    eyebrow: "Commercial",
    name: "Commercial family",
    variants: "Passenger: R-50 · R-75 · R-100 · Cargo: R-100F",
    blurb:
      "A 5-abreast family sharing one wing, one cross-section, and one engine family — passenger and cargo variants. Built to restore the thin routes first.",
    image: "/aircraft/regional-family.png",
    imageAlt: "The Revia regional family in formation flight.",
    cta: "Explore the commercial family →",
  },
  {
    id: "special-missions",
    href: "/aircraft/special-missions",
    eyebrow: "Special Missions",
    name: "Special Missions",
    variants: "Air ambulance · firefighting · oil-spill · SAR",
    blurb:
      "Commercial special-mission derivatives on the same shared architecture — civil public-service and industrial roles. We say Special Missions because any airframe in the family can be adapted to the mission.",
    cta: "Explore Special Missions →",
  },
];

export default function AircraftOverviewPage() {
  return (
    <>
      <PageHeader
        eyebrow="Aircraft"
        title="One architecture. Two markets. Built for the gap."
        intro="Commonality is the strategy: shared wing, cross-section, and engine family keep development capital efficient. We sequence defense and cargo first, then commercial."
      />

      <section className="bg-navy py-16">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {families.map((f) => (
              <article
                key={f.href}
                id={f.id}
                className="flex scroll-mt-24 flex-col rounded-2xl border border-cream/10 bg-cream/[0.03] p-8"
              >
                <span className="text-xs uppercase tracking-eyebrow text-amber">
                  {f.eyebrow}
                </span>
                {f.image ? (
                  <div className="my-8 overflow-hidden rounded-xl border border-cream/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={f.image}
                      alt={f.imageAlt ?? f.name}
                      className="aspect-[16/9] w-full object-cover"
                    />
                  </div>
                ) : (
                  <AircraftSilhouette className="my-8 text-saffron" label={f.name} />
                )}
                <h2 className="font-serif text-2xl text-cream">{f.name}</h2>
                <p className="mt-1 text-sm uppercase tracking-eyebrow text-cream/50">
                  {f.variants}
                </p>
                <p className="mt-4 text-pretty text-cream/70">{f.blurb}</p>
                <div className="mt-8">
                  <ButtonLink href={f.href} variant="secondary">
                    {f.cta}
                  </ButtonLink>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-6 rounded-2xl border border-cream/10 bg-cream/[0.03] p-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-eyebrow text-amber">
                Defense
              </span>
              <h2 className="mt-2 font-serif text-2xl text-cream">
                Military variants are a separate line.
              </h2>
              <p className="mt-3 text-pretty text-cream/70">
                ISR, maritime patrol, tactical airlift, and aeromedical
                evacuation — built on the same architecture, kept distinct from
                the civil special-mission roles above.
              </p>
            </div>
            <ButtonLink href="/defense" variant="secondary" className="shrink-0">
              Revia Defense →
            </ButtonLink>
          </div>

          <div className="mt-12 rounded-2xl border border-cream/10 bg-cream/[0.02] p-8">
            <Eyebrow>Commonality</Eyebrow>
            <p className="mt-4 max-w-3xl text-pretty text-lg text-cream/75">
              The R-50, R-75, and R-100 share a wing, a fuselage cross-section,
              and an engine family — and the cargo and special-missions
              derivatives inherit it. One type rating, one supply chain, one
              development program amortized across the family.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
