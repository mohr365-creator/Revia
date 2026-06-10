import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";
import { Container } from "@/components/ui/Container";
import { communitiesLost, routesLostHeadline } from "@/data/stats";
import { site } from "@/data/site";

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

          {/* Lead number — the scale of what was lost */}
          <p className="mt-10 font-serif italic leading-none text-amber text-[clamp(5rem,13vw,9rem)]">
            {routesLostHeadline.value}
          </p>
          <p className="mt-3 text-sm uppercase tracking-[0.15em] text-cream/50">
            routes went dark
          </p>

          {/* Belief / mission */}
          <h1 className="mt-10 text-balance font-serif text-3xl leading-snug text-cream sm:text-5xl">
            We believe the communities that lost their connection
            deserve it back.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-cream/65">
            {site.thesis}
          </p>

          <p className="mt-4 text-sm text-cream/40">
            {communitiesLost.value} U.S. communities lost their last commercial flight, 1995&ndash;2020.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-8">
            <Link
              href="/mission"
              className="group inline-flex items-center gap-2 text-sm uppercase tracking-eyebrow text-amber transition-colors hover:text-cream"
            >
              Our mission
              <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
            <Link
              href="#map-teaser"
              className="group inline-flex items-center gap-2 text-sm uppercase tracking-eyebrow text-cream/50 transition-colors hover:text-cream/80"
            >
              See the routes
              <span className="transition-transform group-hover:translate-y-1">&darr;</span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
