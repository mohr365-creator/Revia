import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";
import { Container } from "@/components/ui/Container";
import { communitiesLost, routesLostHeadline } from "@/data/stats";
import { DataFlag } from "@/components/ui/DataFlag";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-navy">
      {/* Ambient severed route lines drawing and fading in the background. */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18]"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        {[
          "M120 700 Q500 300 1300 220",
          "M200 820 Q700 500 1200 640",
          "M80 400 Q600 120 1380 540",
          "M300 200 Q800 600 1320 760",
        ].map((d, i) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke="var(--amber)"
            strokeWidth={1}
            strokeDasharray="1"
            pathLength={1}
            className="animate-[draw-in_3s_ease-out_forwards]"
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        ))}
      </svg>

      <Container className="relative py-32">
        <div className="max-w-3xl">
          <Wordmark size="text-3xl" beacon />
          <h1 className="mt-10 text-balance font-serif text-4xl leading-tight text-cream sm:text-6xl">
            <span className="italic">{routesLostHeadline.value} routes</span> went
            dark.
            <br />
            We&apos;re turning them back on.
          </h1>
          <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-cream/60">
            <span>
              {communitiesLost.value} U.S. communities lost their last flight
              (1995–2020).
            </span>
            <DataFlag title={routesLostHeadline.source}>
              “{routesLostHeadline.value}” unsourced
            </DataFlag>
          </p>
          <p className="mt-8 font-serif text-2xl italic text-amber">
            The way, revived.
          </p>
          <div className="mt-10">
            <Link
              href="#map-teaser"
              className="group inline-flex items-center gap-2 text-sm uppercase tracking-eyebrow text-cream/70 transition-colors hover:text-amber"
            >
              See what was lost
              <span className="transition-transform group-hover:translate-y-1">
                ↓
              </span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
