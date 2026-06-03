import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { RouteMap } from "@/components/routes/RouteMap";
import { communities } from "@/data/communities";
import { lostRoutes } from "@/data/routes";
import { communitiesLost } from "@/data/stats";

export const metadata: Metadata = {
  title: "Lost routes",
  description:
    "An interactive map of the severed regional network — communities and city-pairs that lost service.",
};

export default function RoutesPage() {
  return (
    <>
      <PageHeader
        eyebrow="The severed network"
        title="Every place that lost its way to the rest of the map."
        intro={`${communitiesLost.value} U.S. communities lost their last commercial flight between 1995 and 2020. Filter, toggle before and after, and click any community to see what it lost — and which Revia aircraft brings it back.`}
      />

      <section className="bg-navy py-16">
        <Container>
          <RouteMap communities={communities} routes={lostRoutes} />
        </Container>
      </section>
    </>
  );
}
