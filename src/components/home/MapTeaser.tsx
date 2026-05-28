import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { RouteMap } from "@/components/routes/RouteMap";
import { communities } from "@/data/communities";
import { lostRoutes } from "@/data/routes";
import { communitiesLost, routesLostSample } from "@/data/stats";

export function MapTeaser() {
  return (
    <section id="map-teaser" className="bg-navy py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <Eyebrow>The severed network</Eyebrow>
            <h2 className="mt-5 text-balance font-serif text-3xl leading-tight text-cream sm:text-4xl">
              {communitiesLost.value} communities. {routesLostSample}+ routes in
              this sample alone.
            </h2>
            <p className="mt-5 max-w-md text-pretty text-cream/70">
              Every faded line is a connection that used to exist — a city-pair
              that quietly disappeared from the map. Explore it community by
              community.
            </p>
            <div className="mt-8">
              <ButtonLink href="/routes" variant="primary">
                Explore every lost route →
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-3xl border border-cream/10 bg-navy/40 p-4">
            <RouteMap
              communities={communities}
              routes={lostRoutes}
              preview
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
