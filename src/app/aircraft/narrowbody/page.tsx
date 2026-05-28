import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { DataFlag } from "@/components/ui/DataFlag";
import { VariantCard } from "@/components/aircraft/VariantCard";
import { narrowbodyFamily } from "@/data/aircraft";

export const metadata: Metadata = {
  title: "Narrowbody family",
  description:
    "A 6-abreast narrowbody family — the third manufacturer the market has asked for.",
};

export default function NarrowbodyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Phase 2 · Narrowbody family"
        title="The third manufacturer, by design."
        intro="A 6-abreast single-aisle family developed concurrently with the regional program, positioned against the single-aisle duopoly."
      />

      <section className="bg-navy py-16">
        <Container>
          <div className="mb-8 flex items-start gap-3 rounded-xl border border-ember/30 bg-ember/5 p-4 text-sm text-cream/70">
            <DataFlag>Naming + specs TBD</DataFlag>
            <p>
              Phase 2 variant names are unresolved (2A/2B/2C vs −700/−800) and
              every figure here is a placeholder. Treat this page as a structural
              stub until product definition is locked.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {narrowbodyFamily.map((v) => (
              <VariantCard key={String(v.name)} variant={v} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
