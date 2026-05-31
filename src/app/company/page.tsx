import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Company",
  description: "Revia's vision and the team to come.",
};

export default function CompanyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Company"
        title="Building the third major commercial aerospace OEM."
        intro="A clear mission, a sequenced plan, and a team built deliberately around it."
      />

      <section className="bg-navy py-16">
        <Container>
          <div className="mx-auto max-w-prose space-y-6 text-pretty text-lg leading-relaxed text-cream/75">
            <p>
              Revia&apos;s positioning is singular: the third major commercial
              aerospace OEM, entering through the segment the incumbents
              abandoned. We start where the need is sharpest and the
              certification path is cleanest, then expand.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-prose rounded-2xl border border-dashed border-cream/15 p-8 text-center">
            <Eyebrow>Under Construction</Eyebrow>
            <p className="mt-3 text-cream/60">
              This section is coming soon. Check back later.
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
