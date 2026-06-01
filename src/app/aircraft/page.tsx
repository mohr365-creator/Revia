import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { AircraftSilhouette } from "@/components/aircraft/AircraftSilhouette";

export const metadata: Metadata = {
  title: "Aircraft",
  description:
    "One architecture, two markets — a commercial family (passenger + cargo) and special-missions derivatives, built on shared structure. Defense and cargo first, then commercial.",
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
    id: "defense",
    href: "/aircraft/special-missions",
    eyebrow: "Defense",
    name: "Special Missions",
    variants: "R-75 SM · mission-configurable",
    blurb:
      "Defense derivatives on the same shared architecture — ISR, maritime patrol, medevac, and connector roles. We say Special Missions because any airframe in the family can be adapted to the mission.",
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
