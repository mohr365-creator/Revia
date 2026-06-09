import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Company",
  description: "A digitally native aerospace startup — building airplanes the way great software companies build products.",
};

export default function CompanyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Company"
        title="A software company that builds airplanes."
        intro="Digitally native, deliberately lean, and built to move faster than incumbents structured around hardware-era processes."
      />

      <section className="bg-navy py-16">
        <Container>
          <div className="mx-auto max-w-prose space-y-6 text-pretty text-lg leading-relaxed text-cream/75">
            <p>
              Revia is the scrappy startup changing how large, complex aerospace
              systems are designed, tested, developed, and certified. Where
              legacy OEMs carry decades of process debt, we move with the speed
              and discipline of a modern software organization — treating the
              aircraft as a software-defined platform from day one.
            </p>
            <p>
              We enter through the segment the incumbents abandoned: the 50–100
              seat gap where demand is sharpest and the certification path is
              cleanest. The advantage isn&apos;t just the aircraft — it&apos;s
              the method. Agile development cycles, model-based systems
              engineering, and a digital thread from design to certification
              let a small, focused team outmaneuver organizations built for a
              different era.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-prose rounded-2xl border border-dashed border-cream/15 p-8 text-center">
            <Eyebrow>Coming soon</Eyebrow>
            <p className="mt-3 text-cream/60">
              Team grid, advisors, and careers grow here.
            </p>
            <div className="mt-6">
              <ButtonLink href="/contact?type=careers" variant="secondary">
                Careers →
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
