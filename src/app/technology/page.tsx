import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DataFlag } from "@/components/ui/DataFlag";

export const metadata: Metadata = {
  title: "Technology",
  description:
    "Engine strategy, autonomy and reduced-crew architecture, and a software-first organization.",
};

const pillars = [
  {
    eyebrow: "Propulsion",
    title: "A proven engine, derated for the mission.",
    body: "The regional family is built around a derated PW1500G across all three variants, trading a sliver of thrust for commonality, reliability, and a credible certification basis. One engine family, one supply chain, one maintenance program.",
    flag: null,
  },
  {
    eyebrow: "Autonomy",
    title: "Reduced-crew, defense and cargo first: framed honestly.",
    body: "Single-pilot and reduced-crew operations are real, but the regulatory state is sober: EASA paused single-pilot research, and passenger single-pilot is off the table near-term. The credible path runs through defense and cargo first, where the certification case is tractable. We build toward it without overstating it.",
    flag: "Regulatory state as of 2026: keep this copy current.",
  },
  {
    eyebrow: "Software",
    title: "A software-first aerospace company.",
    body: "Treating the aircraft as a software-defined platform (from design and certification tooling to in-service data) is the organizational thesis that lets a new entrant move faster than incumbents structured around hardware-era processes.",
    flag: null,
  },
];

export default function TechnologyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Technology"
        title="Boring where it should be. New where it counts."
        intro="A clean-sheet aircraft does not mean clean-sheet risk everywhere. We concentrate novelty where it creates advantage and lean on proven components everywhere else."
      />

      <section className="bg-navy py-16">
        <Container>
          <div className="space-y-px">
            {pillars.map((p) => (
              <div
                key={p.eyebrow}
                className="grid gap-6 border-t border-cream/10 py-12 md:grid-cols-[1fr_2fr]"
              >
                <Eyebrow>{p.eyebrow}</Eyebrow>
                <div>
                  <h2 className="font-serif text-2xl text-cream sm:text-3xl">
                    {p.title}
                  </h2>
                  <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-cream/75">
                    {p.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
