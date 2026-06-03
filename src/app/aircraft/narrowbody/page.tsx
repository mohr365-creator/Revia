import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
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
