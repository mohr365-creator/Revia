import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DataFlag } from "@/components/ui/DataFlag";
import { ceoQuotes } from "@/data/aircraft";
import { supportingStats } from "@/data/stats";

export function WhyNow() {
  return (
    <section className="bg-navy py-24">
      <Container>
        <Eyebrow>Why now</Eyebrow>
        <h2 className="mt-5 max-w-2xl text-balance font-serif text-3xl leading-tight text-cream sm:text-4xl">
          The demand is already on the record.
        </h2>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {ceoQuotes.map((q) => (
            <figure
              key={q.attribution}
              className="rounded-2xl border border-cream/10 bg-cream/[0.03] p-8"
            >
              <blockquote className="font-serif text-2xl italic leading-snug text-cream">
                “{q.text}”
              </blockquote>
              <figcaption className="mt-5 flex flex-wrap items-center gap-3 text-sm text-cream/60">
                <span>{q.attribution}</span>
                {!q.verified && <DataFlag title={q.context}>Verify quote</DataFlag>}
              </figcaption>
            </figure>
          ))}
        </div>

        <dl className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {supportingStats.map((s) => (
            <div key={s.label}>
              <dt className="flex items-center gap-2 font-serif text-4xl text-amber">
                {s.value}
                {!s.verified && <DataFlag title={s.source}>?</DataFlag>}
              </dt>
              <dd className="mt-2 text-sm text-cream/60">{s.label}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
