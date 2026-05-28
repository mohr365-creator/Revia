import { DataFlag } from "@/components/ui/DataFlag";

/**
 * Live count of what the current filters actually show. The dataset is now
 * sourced (DOT / GAO / EAS), so this reports real documented figures; the flag
 * notes that some rows are still `needs-check` rather than `confirmed`.
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
          hub links shown
        </p>
      </div>
      <DataFlag title="Documented from DOT orders / GAO / EAS records. Some rows are still 'needs-check' rather than 'confirmed' — open a community to see its source.">
        Sourced · some need check
      </DataFlag>
    </div>
  );
}
