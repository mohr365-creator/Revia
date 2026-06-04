import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
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
          <div className="mb-8 rounded-xl border border-ember/30 bg-ember/5 overflow-hidden">
            <div className="border-b border-ember/30 px-5 py-3">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-saffron">
                Concept · Specs Unverified
              </h2>
            </div>
            <div className="flex items-start gap-4 px-5 py-4">
              <span className="text-2xl leading-none text-saffron" aria-label="Caution">⚠</span>
              <p className="text-sm text-cream/70">
                The configurations below are derivative concepts. Roles, endurance,
                and mission systems are illustrative and must be confirmed against a
                defined program before publishing.
              </p>
            </div>
          </div>

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
