import { clsx } from "clsx";
import type { OverCapableRoute } from "@/lib/types";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DataFlag } from "@/components/ui/DataFlag";
import { regionalRoutes } from "@/data/overcapable";
import { overCapableCount } from "@/data/stats";

function RouteTable({ routes }: { routes: OverCapableRoute[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-cream/10 bg-navy/40">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-cream/10 text-xs uppercase tracking-eyebrow text-cream/45">
            <th className="px-4 py-3 font-medium">Route</th>
            <th className="px-4 py-3 font-medium">Stage</th>
            <th className="px-4 py-3 font-medium">Aircraft today</th>
            <th className="px-4 py-3 font-medium">Range</th>
            <th className="px-4 py-3 text-right font-medium">Over-capability</th>
            <th className="px-4 py-3 font-medium">Right-size</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((r) => (
            <tr
              key={r.id}
              className="border-b border-cream/5 last:border-0 hover:bg-cream/[0.02]"
            >
              <td className="px-4 py-3">
                <span className="font-medium text-cream">
                  {r.origin.iata} → {r.dest.iata}
                </span>
                <span className="block text-xs text-cream/40">
                  {r.origin.city} – {r.dest.city}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-cream/70">
                {r.distanceNm} nm
              </td>
              <td className="px-4 py-3 text-cream/70">
                {r.aircraft}
                <span className="block text-xs text-cream/40">
                  {r.aircraftSeats} seats
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-cream/70">
                {r.aircraftRangeNm.toLocaleString()} nm
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right">
                <span
                  className={clsx(
                    "font-serif text-lg",
                    r.capabilityRatio >= 20 ? "text-ember" : "text-amber",
                  )}
                >
                  {r.capabilityRatio.toFixed(1)}×
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <span className="rounded-full border border-amber/40 bg-amber/10 px-2.5 py-0.5 text-xs font-medium text-amber">
                  {r.matchLabel}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function OverCapableSection() {
  return (
    <section className="bg-navy py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Eyebrow>The other half of the gap</Eyebrow>
        <h2 className="mt-5 max-w-3xl text-balance font-serif text-3xl leading-tight text-cream sm:text-4xl">
          Where service didn&apos;t vanish, the wrong aircraft is flying it.
        </h2>
        <p className="mt-5 max-w-2xl text-pretty text-cream/70">
          The flip side of the severed map: short hops flown today by aircraft
          built for missions five, ten, even forty times longer. Capability
          ratio is range ÷ stage length; every route below is{" "}
          <span className="text-cream">severe</span> (≥ 5×), carrying structural
          weight and trip fuel the mission never needed. These {overCapableCount}{" "}
          are real, illustrative anchors.
        </p>
        <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-cream/50">
          <DataFlag title="Aircraft ranges are nominal manufacturer/industry figures; the route + equipment pairings are real. Frequencies and passenger counts come from running the pipeline against BTS T-100; see data-sources/route-analysis/METHODOLOGY.md.">
            Ratios confirmed · traffic pending T-100
          </DataFlag>
        </p>

        <div className="mt-12">
          <h3 className="font-serif text-xl text-amber">
            Right-sizes onto the regional family
          </h3>
          <p className="mt-2 max-w-2xl text-sm text-cream/60">
            Regional jets (E175, CRJ-900, E190) over-ranged for the mission.
            Same seats, a fraction of the trip fuel; these map cleanly onto
            R-75 / R-100 and size the regional commercial story.
          </p>
          <div className="mt-5">
            <RouteTable routes={regionalRoutes} />
          </div>
        </div>
      </div>
    </section>
  );
}
