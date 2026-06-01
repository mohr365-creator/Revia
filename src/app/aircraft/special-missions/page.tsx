import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DataFlag } from "@/components/ui/DataFlag";
import { VariantCard } from "@/components/aircraft/VariantCard";
import { specialMissions } from "@/data/aircraft";

export const metadata: Metadata = {
  title: "Special Missions",
  description:
    "Defense and special-missions derivatives on the same shared architecture — ISR, maritime patrol, medevac, and connector roles.",
};

export default function SpecialMissionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Defense · Special Missions"
        title="One architecture, adapted to the mission."
        intro="Special-missions derivatives built on the same shared family. We sequence defense and cargo first — so these are core to the program, not afterthoughts. We say 'Special Missions' because, in theory, any airframe in the family can be adapted to the role."
      />

      <section className="bg-navy py-16">
        <Container>
          <div className="mb-8 flex items-start gap-3 rounded-xl border border-ember/30 bg-ember/5 p-4 text-sm text-cream/70">
            <DataFlag>Concept · specs unverified</DataFlag>
            <p>
              The special-missions configurations below are derivative concepts.
              Roles, endurance, and mission systems are illustrative and must be
              confirmed against a defined program before publishing.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {specialMissions.map((v) => (
              <VariantCard key={String(v.name)} variant={v} />
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-cream/10 bg-cream/[0.03] p-8">
            <Eyebrow>Commercial</Eyebrow>
            <p className="mt-4 max-w-3xl text-pretty text-lg text-cream/75">
              Looking for the passenger and cargo aircraft? The commercial family
              — R-50, R-75, R-100, and the R-100F freighter — lives on its own
              page.
            </p>
            <div className="mt-6">
              <Link
                href="/aircraft/regional"
                className="text-sm text-amber hover:text-saffron"
              >
                Explore the commercial family →
              </Link>
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-cream/10 bg-cream/[0.02] p-8">
            <Eyebrow>Why it works</Eyebrow>
            <p className="mt-4 max-w-3xl text-pretty text-lg text-cream/75">
              Special-missions variants inherit the commonality of the family —
              the same wing, cross-section, and engine family. Defense programs
              share the commercial supply chain, type rating, and development
              base, keeping mission derivatives capital-efficient.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
