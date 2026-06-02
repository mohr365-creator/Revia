import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DataFlag } from "@/components/ui/DataFlag";
import { VariantCard } from "@/components/aircraft/VariantCard";
import { specialMissionsFamily } from "@/data/aircraft";

export const metadata: Metadata = {
  title: "Special Missions",
  description:
    "Defense, firefighting, and aeromedical variants built on the Revia R-family airframe.",
};

export default function SpecialMissionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Special Missions"
        title="One airframe. Many missions."
        intro="The R-family's short-field performance and efficient economics make it a natural fit for government, emergency services, and public-safety operators."
      />

      <section className="bg-navy py-16">
        <Container>
          <div className="mb-8 flex items-start gap-3 rounded-xl border border-ember/30 bg-ember/5 p-4 text-sm text-cream/70">
            <DataFlag>Specs unverified</DataFlag>
            <p>
              Configuration details and performance figures below are
              illustrative placeholders pending customer-specific program data.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {specialMissionsFamily.map((v) => (
              <VariantCard key={String(v.name)} variant={v} />
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-cream/10 bg-cream/[0.02] p-8">
            <Eyebrow>Common platform advantage</Eyebrow>
            <p className="mt-4 max-w-3xl text-pretty text-lg text-cream/75">
              Special missions variants share the same wing, fuselage cross-section,
              and engine family as the commercial R-family. Operators benefit from
              an established supply chain, simplified maintenance, and a common
              type rating across the fleet.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
