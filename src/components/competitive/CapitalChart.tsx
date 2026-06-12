import { capital, type Fate } from "@/data/competitive";

const FATE: Record<Fate, { color: string; label: string }> = {
  active: { color: "#7BA3CC", label: "Active — funded" },
  wounded: { color: "#E0A832", label: "Constrained / early-stage" },
  dead: { color: "#C04040", label: "Exited / on hold" },
};

// Log scale across the field: $5M → $20B.
const LO = Math.log10(5);
const HI = Math.log10(20000);
const pct = (m: number) => ((Math.log10(m) - LO) / (HI - LO)) * 100;

export function CapitalChart() {
  const rows = [...capital].sort((a, b) => b.capitalM - a.capitalM);

  return (
    <figure className="rounded-2xl border border-cream/10 bg-cream/[0.02] p-5 sm:p-7">
      <div className="space-y-5">
        {rows.map((r) => (
          <div key={r.name}>
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-sm font-medium text-cream">{r.name}</span>
              <span className="shrink-0 font-serif text-sm text-amber">{r.label}</span>
            </div>
            <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-cream/5">
              <div
                className="h-full rounded-full"
                style={{ width: `${pct(r.capitalM)}%`, backgroundColor: FATE[r.fate].color }}
              />
            </div>
            <p className="mt-1.5 text-xs leading-snug text-cream/45">{r.note}</p>
          </div>
        ))}
      </div>

      <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-cream/10 pt-4">
        {(Object.keys(FATE) as Fate[]).map((f) => (
          <li key={f} className="flex items-center gap-2 text-xs text-cream/60">
            <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: FATE[f].color }} />
            {FATE[f].label}
          </li>
        ))}
        <li className="text-xs italic text-cream/40">Bar length on a log scale ($10M → $10B)</li>
      </ul>
    </figure>
  );
}
