import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ConceptBanner } from "@/components/aircraft/ConceptBanner";
import { VariantCard } from "@/components/aircraft/VariantCard";
import { specialMissions } from "@/data/aircraft";

export const metadata: Metadata = {
  title: "Special Missions",
  description:
    "Commercial special-mission derivatives on the shared architecture: air ambulance, aerial firefighting, oil-spill response, and survey/SAR.",
};

export default function SpecialMissionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Aircraft · Special Missions"
        title="Civil missions, on a common airframe."
        intro="Commercial special-mission derivatives built on the same shared family: public-service and industrial roles, kept distinct from the defense variants. We say 'Special Missions' because, in theory, any airframe in the family can be adapted to the role."
      />

      <section className="bg-navy py-16">
        <Container>
          <ConceptBanner />

          <div className="grid gap-6 lg:grid-cols-2">
            {specialMissions.map((v) => (
              <VariantCard key={String(v.name)} variant={v} showDataFlags={false} />
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-cream/10 bg-cream/[0.03] p-8">
            <Eyebrow>Defense</Eyebrow>
            <p className="mt-4 max-w-3xl text-pretty text-lg text-cream/75">
              Looking for the military variants (ISR, maritime patrol, tactical
              airlift, and aeromedical evacuation)? Those are a separate line on
              the Defense section.
            </p>
            <div className="mt-6">
              <Link
                href="/defense"
                className="text-sm text-amber hover:text-saffron"
              >
                Explore Revia Defense →
              </Link>
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-cream/10 bg-cream/[0.02] p-8">
            <Eyebrow>Why it works</Eyebrow>
            <p className="mt-4 max-w-3xl text-pretty text-lg text-cream/75">
              Special-mission variants inherit the commonality of the family: the
              same wing, cross-section, and engine family. They share the
              commercial supply chain, type rating, and development base, keeping
              mission derivatives capital-efficient.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
