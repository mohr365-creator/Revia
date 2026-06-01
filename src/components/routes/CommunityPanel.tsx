import { clsx } from "clsx";
import type { Community } from "@/lib/types";
import { DataFlag } from "@/components/ui/DataFlag";

const statusLabel: Record<Community["status"], string> = {
  "lost-all-service": "Lost all service",
  diminished: "Service diminished",
};

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

  return (
    <div className="flex h-full flex-col rounded-2xl border border-amber/30 bg-navy/60 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl text-cream">
            {community.city}, {community.state}
          </h3>
          <span
            className={clsx(
              "mt-1 inline-block text-xs font-medium uppercase tracking-eyebrow",
              community.status === "lost-all-service"
                ? "text-ember"
                : "text-saffron",
            )}
          >
            {statusLabel[community.status]}
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
          <dd className="text-cream">~{community.lastYearServed}</dd>
        </div>
        <div>
          <dt className="text-cream/50">Routes lost</dt>
          <dd className="text-cream">{community.routesLost}</dd>
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
            <span className="font-medium text-amber">{community.restorableBy}</span>{" "}
            closes this gap: {community.routesLost} route
            {community.routesLost === 1 ? "" : "s"} back on.
          </p>
        </div>
        {!community.verified && (
          <p className="mt-3 flex items-center gap-2 text-xs text-cream/50">
            <DataFlag>Sample</DataFlag>
            Service details are placeholder data.
          </p>
        )}
      </div>
    </div>
  );
}
