import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

const beats = [
  {
    n: "01",
    head: "Fuel quadrupled.",
    body: "The economics of small jets came apart as fuel prices climbed.",
  },
  {
    n: "02",
    head: "Scope clauses froze the segment at 76 seats.",
    body: "Labor agreements capped regional aircraft size, stranding the gap below mainline.",
  },
  {
    n: "03",
    head: "No clean-sheet replacement was ever built.",
    body: "The 50–100 seat aircraft simply stopped being made. The routes followed.",
  },
];

export function StructuralCause() {
  return (
    <section className="bg-cream py-24 text-navy">
      <Container>
        <Eyebrow className="text-ember">Why it happened</Eyebrow>
        <h2 className="mt-5 max-w-2xl text-balance font-serif text-3xl leading-tight sm:text-4xl">
          The routes didn&apos;t vanish by accident. The aircraft did.
        </h2>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {beats.map((b) => (
            <div key={b.n}>
              <div className="font-serif text-5xl text-ember/40">{b.n}</div>
              <h3 className="mt-4 font-serif text-2xl">{b.head}</h3>
              <p className="mt-3 text-navy/70">{b.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Link
            href="/mission"
            className="text-sm uppercase tracking-eyebrow text-ember transition-colors hover:text-amber"
          >
            Read the full story →
          </Link>
        </div>
      </Container>
    </section>
  );
}
