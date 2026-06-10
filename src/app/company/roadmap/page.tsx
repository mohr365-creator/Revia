import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { DevelopmentTimeline } from "@/components/company/DevelopmentTimeline";

export const metadata: Metadata = {
  title: "Program Roadmap",
  description:
    "Revia's sequenced development path: from concept and Series A through defense and cargo to commercial regional certification and future growth.",
};

export default function RoadmapPage() {
  return (
    <>
      <PageHeader
        eyebrow="Company · Program Roadmap"
        title="A sequenced path to market."
        intro="Defense and cargo first. Then commercial regional. Each phase builds the certification basis and demand signal the next one requires, on an architecture designed for future growth."
      />

      <section className="bg-navy py-16">
        <Container>
          <DevelopmentTimeline />

          <div className="mt-16 rounded-2xl border border-cream/10 bg-cream/[0.02] p-8 sm:flex sm:items-center sm:justify-between sm:gap-12">
            <div className="max-w-xl">
              <p className="font-serif text-xl text-cream">
                Interested in the program timeline?
              </p>
              <p className="mt-3 text-pretty text-cream/60">
                We work with airlines, investors, defense primes, and
                government stakeholders on program fit and timing. Get in
                touch to discuss where you fit in the roadmap.
              </p>
            </div>
            <div className="mt-6 flex shrink-0 flex-wrap gap-3 sm:mt-0">
              <ButtonLink href="/contact?type=investor" variant="primary">
                Investor inquiries
              </ButtonLink>
              <ButtonLink href="/contact?type=partner" variant="secondary">
                Partner with us →
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
