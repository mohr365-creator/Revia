import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DataFlag } from "@/components/ui/DataFlag";
import { VariantCard } from "@/components/aircraft/VariantCard";
import { freighterFamily } from "@/data/aircraft";

export const metadata: Metadata = {
  title: "Freighter",
  description:
    "The regional freighter — cargo first, on the shared Phase 1 airframe.",
};

const hero = freighterFamily[0].image!;

export default function FreighterPage() {
  return (
    <>
      <PageHeader
        eyebrow="Cargo-first · R-100F"
        title="Cargo first, by design."
        intro="The R-100F shares the Phase 1 R-100 airframe — the first aircraft out the door, built to prove the architecture in defense and cargo service before commercial."
      />

      <section className="bg-navy py-16">
        <Container>
          <Image
            src={hero.src}
            alt={hero.alt}
            width={hero.width}
            height={hero.height}
            priority
            className="h-auto w-full rounded-2xl border border-cream/10"
          />
          <p className="mt-3 text-xs uppercase tracking-eyebrow text-cream/40">
            Concept render — not to scale, not an engineering drawing.
          </p>

          <div className="mb-8 mt-12 flex items-start gap-3 rounded-xl border border-ember/30 bg-ember/5 p-4 text-sm text-cream/70">
            <DataFlag>Specs TBD</DataFlag>
            <p>
              Every payload and performance figure below is a placeholder,
              flagged for verification. Treat this page as a structural stub
              until product definition is locked.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {freighterFamily.map((v) => (
              <VariantCard key={String(v.name)} variant={v} />
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-cream/10 bg-cream/[0.02] p-8">
            <Eyebrow>Commonality</Eyebrow>
            <p className="mt-4 max-w-3xl text-pretty text-lg text-cream/75">
              Shared wing · shared fuselage cross-section · shared engine family
              with the regional program. Cargo and defense first amortize the
              development program before the commercial passenger variants enter
              service.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
