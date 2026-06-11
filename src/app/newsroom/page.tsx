import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "Newsroom",
  description: "Press releases, media kit, and brand assets.",
};

const mediaKit = [
  "Wordmark + arc lockup (SVG)",
  "Arc-only mark (favicon / social avatar)",
  "Dawn color palette",
  "Aircraft side-profile renders",
  "One-page fact sheet",
];

export default function NewsroomPage() {
  return (
    <>
      <PageHeader
        eyebrow="Newsroom"
        title="The story, the assets, the contact."
        intro="Press materials and brand assets for journalists covering Revia."
      />

      <section className="bg-navy py-16">
        <Container>
          <div className="mb-10 rounded-xl border border-amber/30 bg-amber/5 p-4 text-sm text-cream/70">
            <p>This page is coming soon — press releases, media kit assets, and contact details will be available at launch.</p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <Eyebrow>Press releases</Eyebrow>
              <div className="mt-6 rounded-2xl border border-dashed border-cream/15 p-8 text-cream/60">
                <p>No releases published yet.</p>
              </div>
            </div>

            <div>
              <Eyebrow>Media kit</Eyebrow>
              <ul className="mt-6 space-y-3">
                {mediaKit.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-cream/10 bg-cream/[0.03] px-5 py-4 text-cream/80"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-cream/10 bg-cream/[0.02] p-8">
            <Eyebrow>Press contact</Eyebrow>
            <p className="mt-3 text-cream/70">press@revia.aero</p>
          </div>
        </Container>
      </section>
    </>
  );
}
