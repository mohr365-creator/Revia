import { clsx } from "clsx";
import type { Community } from "@/lib/types";
import { DataFlag } from "@/components/ui/DataFlag";
import { hubs } from "@/data/hubs";

const statusLabel: Record<Community["status"], string> = {
  "lost-all-service": "Lost all service",
  diminished: "Service diminished",
};

function hubNames(codes: string[]): string {
  return codes.map((c) => hubs[c]?.name ?? c).join(", ");
}

export function CommunityPanel({
  community,
  onClose,
}: {
  community: Community | null;
  onClose: () => void;
}) {
  if (!community) {
    return (
      <div className="flex h-full flex-col justify-center rounded-2xl border border-cream/10 bg-navy/40 p-6 text-center">
        <p className="font-serif text-lg italic text-cream/60">
          Select a community on the map.
        </p>
        <p className="mt-2 text-sm text-cream/40">
          Each dot is a place that lost connections to the network.
        </p>
      </div>
    );
  }

  const easOnly = community.routesLost === 0;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-amber/30 bg-navy/60 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl text-cream">
            {community.city}, {community.state}
          </h3>
          <span className="mt-1 flex items-center gap-2">
            <span
              className={clsx(
                "text-xs font-medium uppercase tracking-eyebrow",
                community.status === "lost-all-service"
                  ? "text-ember"
                  : "text-saffron",
              )}
            >
              {statusLabel[community.status]}
            </span>
            <span className="text-xs text-cream/40">· {community.iata}</span>
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close panel"
          className="rounded-full border border-cream/20 px-2 py-0.5 text-sm text-cream/60 hover:text-amber"
        >
          ✕
        </button>
      </div>

      {community.detail && (
        <p className="mt-4 font-serif text-base italic text-cream/80">
          “{community.detail}”
        </p>
      )}

      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-cream/50">Last carrier</dt>
          <dd className="text-cream">{community.lastCarrier}</dd>
        </div>
        <div>
          <dt className="text-cream/50">Service ended</dt>
          <dd className="text-cream">
            {community.lastYearServed == null
              ? "EAS-served (ongoing)"
              : community.lastYearServed}
          </dd>
        </div>
        <div>
          <dt className="text-cream/50">
            {easOnly ? "Hub link" : "Hub links lost"}
          </dt>
          <dd className="text-cream">
            {community.formerHubs.length > 0
              ? hubNames(community.formerHubs)
              : "N/A"}
          </dd>
        </div>
        <div>
          <dt className="text-cream/50">Population</dt>
          <dd className="text-cream">
            {community.population.toLocaleString()}
          </dd>
        </div>
      </dl>

      <div className="mt-auto pt-6">
        <div className="rounded-xl border border-amber/40 bg-amber/10 p-4">
          <p className="text-sm text-cream">
            <span className="font-medium text-amber">
              {community.restorableBy}
            </span>{" "}
            {easOnly ? (
              <>flies this link without the subsidy: service that pays its own way.</>
            ) : (
              <>
                closes this gap: {community.routesLost} hub link
                {community.routesLost === 1 ? "" : "s"} back on.
              </>
            )}
          </p>
        </div>

        <div className="mt-3 flex items-start gap-2 text-xs text-cream/45">
          {community.verified && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber/40 bg-amber/10 px-2 py-0.5 font-medium uppercase tracking-wide text-amber">
              ✓ Confirmed
            </span>
          )}
          <span className="leading-relaxed">{community.source}</span>
        </div>
      </div>
    </div>
  );
}
