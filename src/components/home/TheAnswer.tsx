import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { AircraftSilhouette } from "@/components/aircraft/AircraftSilhouette";

const families = [
  {
    name: "The R-50",
    variants: "~50 seats · ~1,200 nm",
    blurb:
      "The thin-route restorer — sized for the 50-seat missions the market abandoned when the small jets retired.",
  },
  {
    name: "The R-75",
    variants: "~75 seats · ~1,500 nm",
    blurb:
      "The workhorse of the family, right where the over-capable regional jets are flying today.",
  },
  {
    name: "The R-100",
    variants: "~100 seats · ~1,800 nm",
    blurb:
      "Regional capacity with mainline economics — the top of a 5-abreast family sharing one wing, one cross-section, one engine.",
  },
];

export function TheAnswer() {
  return (
    <section className="bg-navy py-24">
      <Container>
        <Eyebrow>The answer</Eyebrow>
        <h2 className="mt-5 max-w-2xl text-balance font-serif text-3xl leading-tight text-cream sm:text-4xl">
          One regional family. A clean-sheet bet on the routes everyone abandoned.
        </h2>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {families.map((f) => (
            <div
              key={f.name}
              className="flex flex-col rounded-2xl border border-cream/10 bg-cream/[0.03] p-8"
            >
              <AircraftSilhouette className="mb-8 text-saffron" label={f.name} />
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
