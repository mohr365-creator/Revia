import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { regionalFamily } from "@/data/aircraft";

/**
 * The fleet, listed with its mission intent. Regional variants are pulled from
 * the shared aircraft data (name + tagline) so copy stays in sync; the
 * narrowbody family is summarized at the family level while variant names
 * remain TBD per the brief.
 */
const fleet = [
  ...regionalFamily.map((a) => ({
    name: a.name,
    detail: a.seats,
    intent: a.tagline,
  })),
  {
    name: "Narrowbody family",
    detail: "6-abreast · variants TBD",
    intent:
      "The third manufacturer airline CEOs have asked for — positioned against the single-aisle duopoly.",
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
          {fleet.map((a) => (
            <li
              key={a.name}
              className="flex flex-col gap-2 border-t border-cream/10 py-6 first:border-t-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-serif text-2xl text-cream">{a.name}</span>
                <span className="text-xs uppercase tracking-eyebrow text-cream/50">
                  {a.detail}
                </span>
              </div>
              <p className="text-pretty text-cream/70 sm:max-w-md sm:text-right">
                {a.intent}
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
