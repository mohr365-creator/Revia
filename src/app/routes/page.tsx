import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { RouteMap } from "@/components/routes/RouteMap";
import { OverCapableSection } from "@/components/routes/OverCapableSection";
import { DataFlag } from "@/components/ui/DataFlag";
import { communities } from "@/data/communities";
import { lostRoutes } from "@/data/routes";
import {
  communitiesLost,
  communitiesDocumented,
  communitiesConfirmed,
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
          <div className="mb-8 flex items-start gap-3 rounded-xl border border-amber/30 bg-amber/5 p-4 text-sm text-cream/70">
            <DataFlag>Sourced data</DataFlag>
            <p>
              This map runs on documented communities from DOT orders, GAO
              reports and the EAS program ({communitiesConfirmed} of{" "}
              {communitiesDocumented} confirmed; the rest are{" "}
              <em>needs-check</em>; open any community to see its source). The
              full national dataset (every flagged city-pair with frequencies
              and passengers) is enumerated by the pipeline in{" "}
              <code className="text-cream/80">
                data-sources/route-analysis
              </code>{" "}
              against BTS T-100.
            </p>
          </div>

          <RouteMap communities={communities} routes={lostRoutes} />
        </Container>
      </section>

      <OverCapableSection />
    </>
  );
}
