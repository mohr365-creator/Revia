import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { SeatsRangeChart } from "@/components/competitive/SeatsRangeChart";
import { CapitalChart } from "@/components/competitive/CapitalChart";
import { AttritionTimeline } from "@/components/competitive/AttritionTimeline";
import { capitalBenchmarks, takeaways } from "@/data/competitive";

export const metadata: Metadata = {
  title: "Why Revia",
  description:
    "The competitive landscape: a survey of the field working on regional aviation — who is active, what their programs have cost, and the open 50–100 seat box Revia occupies.",
};

export default function WhyReviaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Why Revia"
        title="Many have worked on regional aviation. The 50–100 seat box is still open."
        intro="A survey of the field — who is active, what programs have cost, and what that prices into the road ahead. The conclusion is the same one the routes keep pointing to: no one else is building a conventional, clean-sheet aircraft in the 50–100 seat band. That is the opening Revia is built for."
      />

      {/* The field — seats vs range */}
      <section className="bg-navy py-16">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>The field</Eyebrow>
            <h2 className="mt-5 text-balance font-serif text-3xl leading-tight text-cream sm:text-4xl">
              The map of everyone — and the box only we occupy.
            </h2>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-cream/75">
              Of nine active programs adjacent to the regional mission, two are airframe
              bets aimed at different markets, one is a 40-seat derivative, and six are
              propulsion bets. None combines conventional power, clean-sheet economics,
              and 50–100 seats — the box the abandoned routes actually need.
            </p>
          </div>
          <div className="mt-10">
            <SeatsRangeChart />
          </div>
          <p className="mt-4 text-sm italic text-cream/45">
            Baseline seats and design range; estimates included where programs have not
            published figures. Revia shown as a payload/range trade across one shared wing.
            Green rings mark the electric, hybrid, and new-propulsion programs.
          </p>
        </Container>
      </section>

      {/* Attrition */}
      <section className="border-t border-cream/10 bg-navy py-16">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Attrition</Eyebrow>
            <h2 className="mt-5 text-balance font-serif text-3xl leading-tight text-cream sm:text-4xl">
              Two eras of attrition — and the lessons repeat.
            </h2>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-cream/75">
              In this class, the constraint has rarely been demand — it has been capital,
              certification execution, or geopolitics. Propulsion-focused programs face
              physics plus funding. And incumbents have largely stayed out: ATR&rsquo;s EVO
              decision keeps slipping, Embraer shelved its next-gen turboprop, and the
              E175-E2 remains scope-constrained in the US.
            </p>
          </div>
          <div className="mt-10">
            <AttritionTimeline />
          </div>
          <div className="mt-8 rounded-2xl border border-amber/40 bg-amber/10 p-6">
            <p className="text-pretty font-serif text-xl italic text-cream">
              Several propulsion-focused programs have exited in just three years — the
              pattern the failure-mode analysis anticipated.
            </p>
          </div>
        </Container>
      </section>

      {/* Capital vs progress */}
      <section className="border-t border-cream/10 bg-navy py-16">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Capital vs progress</Eyebrow>
            <h2 className="mt-5 text-balance font-serif text-3xl leading-tight text-cream sm:text-4xl">
              What the field&rsquo;s capital has produced.
            </h2>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-cream/75">
              Billions have flowed into this problem. Most of it has produced prototypes and
              demonstrators rather than certified aircraft. A clean-sheet Part 25 family is a
              multi-billion-dollar, multi-round program — and that reality is what the
              timeline above reflects.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <CapitalChart />
            <div className="rounded-2xl border border-cream/10 bg-cream/[0.02] p-6">
              <p className="text-xs font-medium uppercase tracking-eyebrow text-saffron">
                What getting to EIS has cost
              </p>
              <ul className="mt-5 space-y-5">
                {capitalBenchmarks.map((b) => (
                  <li key={b.program}>
                    <p className="text-sm font-medium text-cream">{b.program}</p>
                    <p className="mt-1 text-sm text-cream/55">{b.detail}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-cream/10 pt-4 text-sm italic text-cream/60">
                Revia ties capital to proof: each round priced against delivered artifacts,
                with defense and cargo variants carrying clean-sheet engineering first.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Takeaways */}
      <section className="border-t border-cream/10 bg-navy py-16">
        <Container>
          <Eyebrow>What the census says</Eyebrow>
          <div className="mt-8 space-y-px">
            {takeaways.map((t) => (
              <div
                key={t.n}
                className="grid gap-4 border-t border-cream/10 py-8 first:border-t-0 md:grid-cols-[auto_1fr] md:gap-8"
              >
                <span className="font-serif text-4xl italic text-ember">{t.n}</span>
                <div>
                  <h3 className="font-serif text-2xl text-cream">{t.head}</h3>
                  <p className="mt-3 max-w-2xl text-pretty text-lg leading-relaxed text-cream/70">
                    {t.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-start gap-6 border-t border-cream/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-serif text-2xl italic text-amber">
              Same diagnosis as the field. Different physics. Revia.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/aircraft/regional" variant="secondary">
                The regional family →
              </ButtonLink>
              <ButtonLink href="/contact" variant="primary">
                Get in touch
              </ButtonLink>
            </div>
          </div>

          <p className="mt-10 text-xs italic text-cream/35">
            All figures drawn from public sources as of June 2026; estimates are marked
            (est.). Capital includes disclosed subsidies and government contracts where noted.
          </p>
        </Container>
      </section>
    </>
  );
}
