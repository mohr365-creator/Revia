import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { RouteMap } from "@/components/routes/RouteMap";
import { communities } from "@/data/communities";
import { lostRoutes } from "@/data/routes";
import {
  communitiesLost,
  communitiesDocumented,
} from "@/data/stats";

export const metadata: Metadata = {
  title: "Lost Connections",
  description:
    "An interactive map of the severed regional network: every documented community and city-pair that lost commercial air service since deregulation.",
};

export default function LostConnectionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="The severed network"
        title="Every place that lost its way to the rest of the map."
        intro={`${communitiesLost.value} U.S. communities have lost all commercial air service since deregulation. ${communitiesDocumented} are documented here — traced to DOT orders, EAS records, and news sources. Filter by region, status, and era, then click any community to see what it lost.`}
      />

      <section className="bg-navy py-16">
        <Container>
          <RouteMap communities={communities} routes={lostRoutes} view="lost" />
        </Container>
      </section>
    </>
  );
}
