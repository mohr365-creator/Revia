import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DataFlag } from "@/components/ui/DataFlag";
import { ButtonLink } from "@/components/ui/Button";
import { AircraftSilhouette } from "@/components/aircraft/AircraftSilhouette";

export const metadata: Metadata = {
  title: "Special missions",
  description:
    "Special-mission and defense variants of the Revia regional family — ISR, airlift, medevac, and personnel transport on shared architecture.",
};

const roles = [
  {
    role: "ISR / sensor platform",
    base: "R-75 · R-100",
    note: "Long loiter, cabin volume for mission systems and operators, and electrical headroom for sensors.",
  },
  {
    role: "Tactical / connector airlift",
    base: "R-50 · R-75",
    note: "Short-field performance into austere strips with a flat cabin floor for palletized loads.",
  },
  {
    role: "Medevac / humanitarian",
    base: "R-75",
    note: "Reconfigurable cabin for litters and care teams; reach into fields without long runways.",
  },
  {
    role: "Personnel / VIP transport",
    base: "R-100",
    note: "Quiet, modern, economic-to-operate alternative to aging in-service types.",
  },
];

export default function SpecialMissionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Aircraft · Special missions"
        title="Mission variants on a common airframe."
        intro="Defense and special-mission roles built on the Phase 1 regional family — the same wing, cross-section, and engine, reconfigured for the mission."
      />

      <section className="bg-navy py-16">
        <Container>
          <div className="mb-8 flex items-start gap-3 rounded-xl border border-ember/30 bg-ember/5 p-4 text-sm text-cream/70">
            <DataFlag>Concept · not yet specced</DataFlag>
            <p>
              Mission roles below are illustrative of the platform&apos;s
              potential. Payloads, performance, and variant definitions are
              pre-program and must not be treated as committed specifications.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {roles.map((r) => (
              <article
                key={r.role}
                className="flex flex-col rounded-2xl border border-cream/10 bg-cream/[0.03] p-8"
              >
                <AircraftSilhouette className="mb-6 text-saffron" label={r.role} />
                <h2 className="font-serif text-xl text-cream">{r.role}</h2>
                <p className="mt-1 text-sm uppercase tracking-eyebrow text-cream/50">
                  Base: {r.base}
                </p>
                <p className="mt-4 text-pretty text-cream/70">{r.note}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-cream/10 bg-cream/[0.02] p-8">
            <Eyebrow>Why it works</Eyebrow>
            <p className="mt-4 max-w-3xl text-pretty text-lg text-cream/75">
              Commonality is the advantage on the government side too: shared
              tooling, supply chain, and type rating mean a special-mission
              variant inherits the regional program rather than starting a new
              one. See the wider program on the{" "}
              <span className="text-cream">Defense</span> section.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/defense" variant="primary">
                Revia Defense →
              </ButtonLink>
              <ButtonLink href="/aircraft" variant="secondary">
                All aircraft
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
