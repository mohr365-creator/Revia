import { DataFlag } from "@/components/ui/DataFlag";

/**
 * Live count of what the current filters actually show. This is where the
 * "840+" headline is meant to eventually earn itself from the dataset rather
 * than being asserted. Today it reports the SAMPLE totals and says so.
 */
export function HeadlineCounter({
  communities,
  routes,
}: {
  communities: number;
  routes: number;
}) {
  return (
    <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
      <div>
        <div className="font-serif text-4xl text-cream sm:text-5xl">
          {communities}
        </div>
        <p className="text-xs uppercase tracking-eyebrow text-cream/50">
          communities shown
        </p>
      </div>
      <div>
        <div className="font-serif text-4xl text-amber sm:text-5xl">{routes}</div>
        <p className="text-xs uppercase tracking-eyebrow text-cream/50">
          routes shown
        </p>
      </div>
      <DataFlag title="Counts reflect the sample dataset, not the final sourced figures.">
        Sample dataset
      </DataFlag>
    </div>
  );
}
