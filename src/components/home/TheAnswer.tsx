import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { AircraftSilhouette } from "@/components/aircraft/AircraftSilhouette";

const families = [
  {
    name: "The regional family",
    variants: "R-50 · R-75 · R-100",
    blurb:
      "A 5-abreast family that shares one wing, one cross-section, and one engine family, built to restore the thin routes first.",
    phase: "Phase 1",
  },
  {
    name: "The narrowbody family",
    variants: "6-abreast · variants TBD",
    blurb:
      "The third manufacturer airline CEOs have asked for, with concurrent development positioned against the single-aisle duopoly.",
    phase: "Phase 2",
  },
];

export function TheAnswer() {
  return (
    <section className="bg-navy py-24">
      <Container>
        <Eyebrow>The answer</Eyebrow>
        <h2 className="mt-5 max-w-2xl text-balance font-serif text-3xl leading-tight text-cream sm:text-4xl">
          Two families. One clean-sheet bet on the routes everyone abandoned.
        </h2>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {families.map((f) => (
            <div
              key={f.name}
              className="flex flex-col rounded-2xl border border-cream/10 bg-cream/[0.03] p-8"
            >
              <span className="text-xs uppercase tracking-eyebrow text-amber">
                {f.phase}
              </span>
              <AircraftSilhouette className="my-8 text-saffron" label={f.name} />
              <h3 className="font-serif text-2xl text-cream">{f.name}</h3>
              <p className="mt-1 text-sm uppercase tracking-eyebrow text-cream/50">
                {f.variants}
              </p>
              <p className="mt-4 text-pretty text-cream/70">{f.blurb}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <ButtonLink href="/aircraft" variant="secondary">
            See the aircraft →
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
