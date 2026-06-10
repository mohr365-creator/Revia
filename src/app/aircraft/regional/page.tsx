import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { VariantCard } from "@/components/aircraft/VariantCard";
import { ConceptBanner } from "@/components/aircraft/ConceptBanner";
import { regionalFamily, cargoVariants } from "@/data/aircraft";

export const metadata: Metadata = {
  title: "Commercial",
  description:
    "The commercial family: passenger (R-50, R-75, R-100) and cargo (R-100F) on one shared 5-abreast architecture.",
};

export default function CommercialPage() {
  return (
    <>
      <PageHeader
        eyebrow="Commercial"
        title="R-50 · R-75 · R-100 · R-100F"
        intro="A 5-abreast commercial family built on shared architecture, with passenger and cargo on one wing, one cross-section, and one engine family, designed to make thin routes economic again."
      />

      <section className="bg-navy py-16">
        <Container>
          <ConceptBanner message="Conceptual Development & Initial Vehicle Configuration In-work" />
          <div id="passenger" className="scroll-mt-24">
            <Eyebrow>Passenger</Eyebrow>
            <h2 className="mt-4 font-serif text-2xl text-cream">
              The regional family
            </h2>
            <p className="mt-3 max-w-3xl text-pretty text-cream/70">
              Three passenger aircraft, one architecture, sized to restore the
              thin routes the majors abandoned.
            </p>
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {regionalFamily.map((v) => (
                <VariantCard key={String(v.name)} variant={v} showDataFlags={false} />
              ))}
            </div>
          </div>

          <div id="cargo" className="mt-16 scroll-mt-24">
            <Eyebrow>Cargo</Eyebrow>
            <h2 className="mt-4 font-serif text-2xl text-cream">
              Beyond passenger: the freighter
            </h2>
            <p className="mt-3 max-w-3xl text-pretty text-cream/70">
              The same wing, cross-section, and engine family carry into cargo.
              We sequence defense and cargo first, so the freighter is core to
              the program, not an afterthought.
            </p>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {cargoVariants.map((v) => (
                <VariantCard key={String(v.name)} variant={v} showDataFlags={false} />
              ))}
            </div>
          </div>

          <div className="mt-16 rounded-2xl border border-cream/10 bg-cream/[0.03] p-8">
            <Eyebrow>Special Missions</Eyebrow>
            <p className="mt-4 max-w-3xl text-pretty text-lg text-cream/75">
              The same architecture also underpins our defense work. Special
              Missions derivatives (ISR, maritime patrol, medevac) live on
              their own page.
            </p>
            <div className="mt-6">
              <Link
                href="/aircraft/special-missions"
                className="text-sm text-amber hover:text-saffron"
              >
                Explore Special Missions →
              </Link>
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-cream/10 bg-cream/[0.02] p-8">
            <Eyebrow>Commonality</Eyebrow>
            <p className="mt-4 max-w-3xl text-pretty text-lg text-cream/75">
              Shared wing · shared fuselage cross-section · shared engine family
              (derated PW1500G). One development program across the family.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
