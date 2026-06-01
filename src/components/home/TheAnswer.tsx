import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";

const families = [
  {
    name: "The R-50",
    variants: "~50 seats · ~1,200 nm",
    blurb:
      "The thin-route restorer, sized for the 50-seat missions the market abandoned when the small jets retired.",
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
      "Regional capacity with mainline economics, at the top of a 5-abreast family sharing one wing, one cross-section, one engine.",
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

        {/* Family picture of the aircraft. */}
        <figure className="mt-12 overflow-hidden rounded-2xl border border-cream/10">
          <Image
            src="/images/aircraft-family.png"
            alt="The Revia regional family in formation flight"
            width={1654}
            height={951}
            className="h-auto w-full"
            sizes="(min-width: 1024px) 1024px, 100vw"
            priority
          />
        </figure>

        {/* The aircraft and their mission intent. */}
        <ul className="mt-12 border-y border-cream/10">
          {families.map((f) => (
            <li
              key={f.name}
              className="flex flex-col gap-2 border-t border-cream/10 py-6 first:border-t-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-serif text-2xl text-cream">{f.name}</span>
                <span className="text-xs uppercase tracking-eyebrow text-cream/50">
                  {f.variants}
                </span>
              </div>
              <p className="text-pretty text-cream/70 sm:max-w-md sm:text-right">
                {f.blurb}
              </p>
            </li>
          ))}
        </ul>

        {/* Boarding from the ground. */}
        <figure className="mt-12 overflow-hidden rounded-2xl border border-cream/10">
          <Image
            src="/images/boarding.png"
            alt="A passenger approaching a Revia aircraft from the ramp to board"
            width={1651}
            height={953}
            className="h-auto w-full"
            sizes="(min-width: 1024px) 1024px, 100vw"
          />
        </figure>

        <div className="mt-10">
          <ButtonLink href="/aircraft" variant="secondary">
            See the aircraft →
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
