import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { AircraftSilhouette } from "@/components/aircraft/AircraftSilhouette";

export function TheAnswer() {
  return (
    <section className="bg-navy py-24">
      <Container>
        <Eyebrow>The answer</Eyebrow>
        <h2 className="mt-5 max-w-2xl text-balance font-serif text-3xl leading-tight text-cream sm:text-4xl">
          A regional family built on shared architecture, designed for the routes everyone abandoned.
        </h2>

        <div className="mt-14 flex flex-col rounded-2xl border border-cream/10 bg-cream/[0.03] p-8 md:flex-row md:items-center md:gap-12">
          <div className="md:w-1/2">
            <AircraftSilhouette className="text-saffron" label="Regional family" />
          </div>
          <div className="mt-8 md:mt-0 md:w-1/2">
            <h3 className="font-serif text-2xl text-cream">The regional family</h3>
            <p className="mt-1 text-sm uppercase tracking-eyebrow text-cream/50">
              R-50 · R-75 · R-100
            </p>
            <p className="mt-4 text-pretty text-cream/70">
              A 5-abreast family sharing one wing, one cross-section, and one
              engine family, built to restore the thin routes first and
              architected to scale as market needs grow.
            </p>
          </div>
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
