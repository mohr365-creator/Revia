import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { DefenseLogo } from "@/components/brand/DefenseLogo";

export const metadata: Metadata = {
  title: "Defense",
  description:
    "Revia Defense — the same common architecture, sequenced for special missions and government programs first.",
};

const missions = [
  {
    name: "ISR & special missions",
    blurb:
      "A roomy, efficient regional airframe is a natural sensor and mission-systems platform: long loiter, generous payload and power, and a cabin that reconfigures for operators and racks.",
  },
  {
    name: "Tactical & logistics airlift",
    blurb:
      "Short, unimproved-field performance and a flat cabin floor make the family a candidate for connector airlift between austere nodes the majors no longer serve.",
  },
  {
    name: "Medevac & humanitarian",
    blurb:
      "The same thin-route reach that revives civilian connections moves patients and relief into places without long runways or fixed infrastructure.",
  },
  {
    name: "Personnel & VIP transport",
    blurb:
      "Quiet, modern, and economic to operate — a fit for routine government and personnel movement that today rides on aging, fuel-hungry types.",
  },
];

const opportunities = [
  {
    heading: "Why defense first",
    body: "Government and special-mission demand pulls the program forward: it tolerates lower initial rate, values commonality, and underwrites the certification path that the commercial family inherits.",
  },
  {
    heading: "Built on commonality",
    body: "Defense variants share the wing, cross-section, and engine family of the regional aircraft. One supply chain and one type rating keep development capital efficient across civil and government lines.",
  },
  {
    heading: "Partner with us",
    body: "We are talking with primes, integrators, and government stakeholders about mission profiles, payload definition, and program timelines ahead of Series A.",
  },
];

export default function DefensePage() {
  return (
    <>
      {/* Logo-forward hero. The REVIA DEFENSE shield leads the section. */}
      <header className="border-b border-cream/10 bg-navy pb-16 pt-36">
        <Container>
          <DefenseLogo tone="light" height={84} priority className="mb-10" />
          <Eyebrow>Defense</Eyebrow>
          <h1 className="mt-5 max-w-3xl text-balance font-serif text-4xl leading-tight text-cream sm:text-5xl">
            The same architecture, sequenced for the mission.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg text-cream/70">
            Revia Defense applies the regional family — shared wing,
            cross-section, and engine — to special missions and government
            programs. Defense and cargo lead; commercial follows.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/aircraft/special-missions" variant="primary">
              Special missions →
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Partner with us
            </ButtonLink>
          </div>
        </Container>
      </header>

      <section className="bg-navy py-16">
        <Container>
          <Eyebrow>Mission set</Eyebrow>
          <h2 className="mt-4 max-w-3xl text-balance font-serif text-3xl text-cream">
            Where a common regional platform earns its keep.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {missions.map((m) => (
              <article
                key={m.name}
                className="rounded-2xl border border-cream/10 bg-cream/[0.03] p-8"
              >
                <h3 className="font-serif text-xl text-cream">{m.name}</h3>
                <p className="mt-3 text-pretty text-cream/70">{m.blurb}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-cream/10 bg-navy py-16">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {opportunities.map((o) => (
              <div
                key={o.heading}
                className="rounded-2xl border border-cream/10 bg-cream/[0.02] p-8"
              >
                <h3 className="font-serif text-lg text-cream">{o.heading}</h3>
                <p className="mt-3 text-pretty text-sm text-cream/70">
                  {o.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-cream/10 bg-cream/[0.03] p-8">
            <p className="font-serif text-xl text-cream">
              Exploring a mission profile or a program fit?
            </p>
            <p className="mt-3 max-w-2xl text-pretty text-cream/70">
              We work with primes, integrators, and government stakeholders on
              payload definition and timelines. See the platform on the{" "}
              <Link href="/aircraft/special-missions" className="text-amber hover:text-saffron">
                Special missions
              </Link>{" "}
              page, or reach out directly.
            </p>
            <div className="mt-6">
              <ButtonLink href="/contact" variant="primary">
                Get in touch
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
