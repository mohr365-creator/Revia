import { clsx } from "clsx";
import type { MapFilterState } from "./filters";

const statusOptions: { value: MapFilterState["status"]; label: string }[] = [
  { value: "all", label: "All" },
  { value: "lost-all-service", label: "Lost all service" },
  { value: "diminished", label: "Diminished" },
];

const regionOptions: { value: MapFilterState["region"]; label: string }[] = [
  { value: "all", label: "All regions" },
  { value: "west", label: "West" },
  { value: "midwest", label: "Midwest" },
  { value: "south", label: "South" },
  { value: "northeast", label: "Northeast" },
];

const restorableOptions: {
  value: MapFilterState["restorableBy"];
  label: string;
}[] = [
  { value: "all", label: "Any" },
  { value: "R-50", label: "R-50" },
  { value: "R-75", label: "R-75" },
  { value: "R-100", label: "R-100" },
];

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
}: {
  filters: MapFilterState;
  onChange: (next: MapFilterState) => void;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <Group
        label="Status"
        value={filters.status}
        options={statusOptions}
        onChange={(status) => onChange({ ...filters, status })}
      />
      <Group
        label="Region"
        value={filters.region}
        options={regionOptions}
        onChange={(region) => onChange({ ...filters, region })}
      />
      <Group
        label="Restorable by"
        value={filters.restorableBy}
        options={restorableOptions}
        onChange={(restorableBy) => onChange({ ...filters, restorableBy })}
      />
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-eyebrow text-cream/50">
          Service ended since {filters.sinceYear}
        </p>
        <input
          type="range"
          min={1978}
          max={2024}
          step={1}
          value={filters.sinceYear}
          onChange={(e) =>
            onChange({ ...filters, sinceYear: Number(e.target.value) })
          }
          className="w-full accent-[var(--amber)]"
          aria-label="Filter by year service ended"
        />
        <div className="mt-1 flex justify-between text-[0.625rem] text-cream/40">
          <span>1978</span>
          <span>2024</span>
        </div>
      </div>
    </div>
  );
}
