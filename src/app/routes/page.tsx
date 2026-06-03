import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { RouteMap } from "@/components/routes/RouteMap";
import { OverCapableSection } from "@/components/routes/OverCapableSection";
import { communities } from "@/data/communities";
import { lostRoutes } from "@/data/routes";
import {
  communitiesLost,
  communitiesDocumented,
} from "@/data/stats";

export const metadata: Metadata = {
  title: "Lost routes",
  description:
    "An interactive map of the severed regional network: communities and city-pairs that lost service, plus the short routes flown today by over-capable aircraft.",
};

export default function RoutesPage() {
  return (
    <>
      <PageHeader
        eyebrow="The severed network"
        title="Every place that lost its way to the rest of the map."
        intro={`${communitiesLost.value} U.S. communities lost all commercial service since 1995. ${communitiesDocumented} are documented here, route by route. Filter, toggle before and after, and click any community to see what it lost, its source, and which Revia aircraft brings it back.`}
      />

      <section className="bg-navy py-16">
        <Container>
          <RouteMap communities={communities} routes={lostRoutes} />
        </Container>
      </section>

      <OverCapableSection />
    </>
  );
}
