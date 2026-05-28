"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { communities } from "@/data/communities";

const featured = communities.filter((c) => c.detail).slice(0, 8);

export function HumanAnchor() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % featured.length),
      5200,
    );
    return () => clearInterval(id);
  }, []);

  const current = featured[index];

  return (
    <section className="flex min-h-screen items-center bg-navy py-24">
      <Container>
        <Eyebrow>One community, told specifically</Eyebrow>
        <blockquote className="mt-8 max-w-4xl text-balance font-serif text-3xl leading-snug text-cream sm:text-5xl">
          <span className="text-amber">“</span>
          {current.detail}
          <span className="text-amber">”</span>
        </blockquote>
        <p className="mt-6 font-sans text-sm uppercase tracking-eyebrow text-cream/50">
          {current.city}, {current.state} · last service ~{current.lastYearServed}
        </p>

        <div className="mt-14 flex flex-wrap gap-3">
          {featured.map((c, i) => (
            <Link
              key={c.id}
              href={`/routes#${c.id}`}
              onMouseEnter={() => setIndex(i)}
              className={clsx(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                i === index
                  ? "border-amber bg-amber/10 text-amber"
                  : "border-cream/15 text-cream/70 hover:border-cream/40 hover:text-cream",
              )}
            >
              {c.city}, {c.state}
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
