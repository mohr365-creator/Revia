import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { DataFlag } from "@/components/ui/DataFlag";

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

          <div className="mx-auto mt-16 max-w-prose rounded-2xl border border-cream/10 bg-cream/[0.03] p-8">
            <Eyebrow>Founder</Eyebrow>
            <div className="mt-4 flex items-center gap-3">
              <h2 className="font-serif text-2xl text-cream">Michael</h2>
              <DataFlag title="Founder is currently employed elsewhere — confirm what is public before publishing.">
                Confirm public bio
              </DataFlag>
            </div>
            <p className="mt-4 text-pretty leading-relaxed text-cream/75">
              Program management and systems engineering at Boeing (Mukilteo).
              M.S. Systems Engineering, Johns Hopkins; B.S. Aerospace
              Engineering, Iowa State; prior Textron Aviation.
            </p>
            <p className="mt-3 text-sm text-cream/50">
              Note: the founder is currently employed elsewhere. Confirm exactly
              what is public before this bio ships.
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
