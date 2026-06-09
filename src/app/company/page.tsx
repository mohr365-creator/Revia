import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Company",
  description: "Revia's vision and mission.",
};

export default function CompanyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Company"
        title="Building the third major commercial aerospace OEM."
        intro="A clear mission and a sequenced plan."
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
        </Container>
      </section>
    </>
  );
}
