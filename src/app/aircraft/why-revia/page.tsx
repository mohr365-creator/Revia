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
    "The competitive landscape: a census of everyone who has tried to fix regional aviation — who is alive, who is gone, what it cost them, and the empty 50–100 seat box Revia occupies.",
};

export default function WhyReviaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Why Revia"
        title="Everyone tried to fix regional aviation. The box still sits empty."
        intro="A census of the field — who is alive, who is gone, what it cost them, and what that prices into the road ahead. The conclusion is the same one the routes keep pointing to: no one is building a conventional, clean-sheet aircraft in the 50–100 seat band. Except Revia."
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
          </p>
        </Container>
      </section>

      {/* Attrition */}
      <section className="border-t border-cream/10 bg-navy py-16">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Attrition</Eyebrow>
            <h2 className="mt-5 text-balance font-serif text-3xl leading-tight text-cream sm:text-4xl">
              Two eras of failure. The second is accelerating.
            </h2>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-cream/75">
              No conventional clean-sheet in this class has died of demand — they died of
              capital, certification execution, or geopolitics. The propulsion cohort dies
              of physics plus funding. The incumbents simply decline to play: ATR&rsquo;s EVO
              keeps slipping, Embraer shelved its next-gen turboprop, and the E175-E2 sits
              scope-frozen with zero US orders.
            </p>
          </div>
          <div className="mt-10">
            <AttritionTimeline />
          </div>
          <div className="mt-8 rounded-2xl border border-amber/40 bg-amber/10 p-6">
            <p className="text-pretty font-serif text-xl italic text-cream">
              Four propulsion-bet exits in 36 months — the cohort is collapsing on the
              schedule the failure-mode analysis predicts.
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
              What the field&rsquo;s money actually bought.
            </h2>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-cream/75">
              Billions have flowed into this problem. Most of it bought prototypes, pivots,
              and press — not certified aircraft. A clean-sheet Part 25 family is a
              multi-billion-dollar, multi-round program, and every plan that pretended
              otherwise is on the timeline above.
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
