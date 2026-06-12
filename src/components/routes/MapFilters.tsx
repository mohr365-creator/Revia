import { clsx } from "clsx";
import { TIMELINE_MAX, TIMELINE_MIN, type MapFilterState } from "./filters";

/**
 * The lost-connections view names what was severed; the restoration view names
 * the scope of what Revia brings back over the same status categories.
 */
function statusOptions(
  restoration: boolean,
): { value: MapFilterState["status"]; label: string }[] {
  return [
    { value: "all", label: "All" },
    {
      value: "lost-all-service",
      label: restoration ? "Full restoration" : "Lost all service",
    },
    {
      value: "diminished",
      label: restoration ? "Partial restoration" : "Diminished",
    },
  ];
}

const regionOptions: { value: MapFilterState["region"]; label: string }[] = [
  { value: "all", label: "All regions" },
  { value: "west", label: "West" },
  { value: "midwest", label: "Midwest" },
  { value: "south", label: "South" },
  { value: "northeast", label: "Northeast" },
];

function restorableOptions(
  restoration: boolean,
): { value: MapFilterState["restorableBy"]; label: string }[] {
  return [
    { value: "all", label: restoration ? "Best fit" : "Any" },
    { value: "R-50", label: "R-50" },
    { value: "R-75", label: "R-75" },
    { value: "R-100", label: "R-100" },
  ];
}

function Group<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-eyebrow text-cream/50">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={clsx(
              "rounded-full border px-3 py-1 text-xs transition-colors",
              value === opt.value
                ? "border-amber bg-amber/15 text-amber"
                : "border-cream/15 text-cream/70 hover:border-cream/40",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function MapFilters({
  filters,
  onChange,
  showRestorable = true,
  restoration = false,
}: {
  filters: MapFilterState;
  onChange: (next: MapFilterState) => void;
  /** The lost-connections view keeps Revia out of frame: no variant filter. */
  showRestorable?: boolean;
  /** Forward-looking framing for the restoration view's labels. */
  restoration?: boolean;
}) {
  return (
    <div
      className={clsx(
        "grid gap-5 sm:grid-cols-2",
        showRestorable ? "lg:grid-cols-4" : "lg:grid-cols-3",
      )}
    >
      <Group
        label={restoration ? "Restoration scope" : "Status"}
        value={filters.status}
        options={statusOptions(restoration)}
        onChange={(status) => onChange({ ...filters, status })}
      />
      <Group
        label="Region"
        value={filters.region}
        options={regionOptions}
        onChange={(region) => onChange({ ...filters, region })}
      />
      {showRestorable && (
        <Group
          label="Restorable by"
          value={filters.restorableBy}
          options={restorableOptions(restoration)}
          onChange={(restorableBy) => onChange({ ...filters, restorableBy })}
        />
      )}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-eyebrow text-cream/50">
          {restoration ? "Restoration backlog through" : "Cumulative losses through"}{" "}
          {filters.throughYear >= TIMELINE_MAX ? "today" : filters.throughYear}
        </p>
        <input
          type="range"
          min={TIMELINE_MIN}
          max={TIMELINE_MAX}
          step={1}
          value={filters.throughYear}
          onChange={(e) =>
            onChange({ ...filters, throughYear: Number(e.target.value) })
          }
          className="w-full accent-[var(--amber)]"
          aria-label="Show all losses through this year"
        />
        <div className="mt-1 flex justify-between text-[0.625rem] text-cream/40">
          <span>← deregulation</span>
          <span>today →</span>
        </div>
      </div>
    </div>
  );
}
