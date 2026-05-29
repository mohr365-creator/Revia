import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DataFlag } from "@/components/ui/DataFlag";
import { VariantCard } from "@/components/aircraft/VariantCard";
import { regionalFamily } from "@/data/aircraft";

export const metadata: Metadata = {
  title: "Regional family",
  description: "The R-50, R-75, and R-100 — a 5-abreast regional family.",
};

export default function RegionalPage() {
  return (
    <>
      <PageHeader
        eyebrow="Regional family"
        title="R-50 · R-75 · R-100"
        intro="A 5-abreast regional family built on shared architecture, designed to make thin routes economic again."
      />

      <section className="bg-navy py-16">
        <Container>
          <div className="mb-8 flex items-start gap-3 rounded-xl border border-ember/30 bg-ember/5 p-4 text-sm text-cream/70">
            <DataFlag>Specs unverified</DataFlag>
            <p>
              Several figures below — notably R-100 MTOW, R-50 runway, and R-50
              range — are flagged for verification and must not ship as fact
              until confirmed.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {regionalFamily.map((v) => (
              <VariantCard key={String(v.name)} variant={v} />
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-cream/10 bg-cream/[0.02] p-8">
            <Eyebrow>Commonality footer</Eyebrow>
            <p className="mt-4 max-w-3xl text-pretty text-lg text-cream/75">
              Shared wing · shared fuselage cross-section · shared engine family
              (derated PW1500G). One development program across three aircraft.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
