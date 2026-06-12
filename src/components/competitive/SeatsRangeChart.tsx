import { seatsRange, type ProgramStatus } from "@/data/competitive";

// Categorical colors for the field. Revia uses the amber brand token.
const COLORS: Record<Exclude<ProgramStatus, "revia">, string> = {
  dev: "#7BA3CC",
  paused: "#E0A832",
  cancelled: "#C04040",
  legacy: "#7E8794",
};

const LEGEND: { label: string; color: string; revia?: boolean }[] = [
  { label: "Revia family", color: "rgb(var(--amber))", revia: true },
  { label: "In development", color: COLORS.dev },
  { label: "On hold", color: COLORS.paused },
  { label: "No longer active", color: COLORS.cancelled },
  { label: "Legacy (in service)", color: COLORS.legacy },
];

// Plot geometry (SVG user units; scales responsively via viewBox).
const W = 760;
const H = 480;
const M = { top: 28, right: 20, bottom: 46, left: 54 };
const PW = W - M.left - M.right;
const PH = H - M.top - M.bottom;
const X_MAX = 2500;
const Y_MAX = 115;

const x = (range: number) => M.left + (range / X_MAX) * PW;
const y = (seats: number) => M.top + (1 - seats / Y_MAX) * PH;

const X_TICKS = [0, 500, 1000, 1500, 2000, 2500];
const Y_TICKS = [0, 25, 50, 75, 100];

const fmt = (n: number) => n.toLocaleString("en-US");

export function SeatsRangeChart() {
  const revia = seatsRange.filter((p) => p.status === "revia");
  const others = seatsRange.filter((p) => p.status !== "revia");
  // Revia family line, ordered by range so the polyline reads cleanly.
  const reviaLine = [...revia]
    .sort((a, b) => a.range - b.range)
    .map((p) => `${x(p.range)},${y(p.seats)}`)
    .join(" ");

  return (
    <figure className="rounded-2xl border border-cream/10 bg-cream/[0.02] p-4 sm:p-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label="Scatter plot of regional aircraft programs by seats and design range. The Revia R-50, R-75 and R-100 sit alone in the 50-to-100 seat band as the only active conventional clean-sheet family."
      >
        <title>Seats vs design range — the box only Revia occupies</title>

        {/* 50–100 seat band */}
        <rect
          x={M.left}
          y={y(100)}
          width={PW}
          height={y(50) - y(100)}
          fill="rgb(var(--amber))"
          opacity={0.06}
        />

        {/* Gridlines + axis ticks */}
        {X_TICKS.map((t) => (
          <g key={`x${t}`}>
            <line x1={x(t)} y1={M.top} x2={x(t)} y2={M.top + PH} stroke="rgb(var(--cream))" strokeOpacity={0.06} />
            <text x={x(t)} y={M.top + PH + 22} fill="rgb(var(--cream))" fillOpacity={0.5} fontSize={12} textAnchor="middle">
              {fmt(t)}
            </text>
          </g>
        ))}
        {Y_TICKS.map((t) => (
          <g key={`y${t}`}>
            <line x1={M.left} y1={y(t)} x2={M.left + PW} y2={y(t)} stroke="rgb(var(--cream))" strokeOpacity={0.06} />
            <text x={M.left - 10} y={y(t) + 4} fill="rgb(var(--cream))" fillOpacity={0.5} fontSize={12} textAnchor="end">
              {t}
            </text>
          </g>
        ))}

        {/* Scope clause — 76 seats */}
        <line x1={M.left} y1={y(76)} x2={M.left + PW} y2={y(76)} stroke="rgb(var(--saffron))" strokeWidth={1.4} strokeDasharray="6 5" strokeOpacity={0.85} />
        <text x={M.left + 8} y={y(76) - 6} fill="rgb(var(--saffron))" fontSize={11} fontStyle="italic">
          US scope clause — 76 seats
        </text>

        {/* Median target mission ≈ 500 nm */}
        <line x1={x(500)} y1={M.top} x2={x(500)} y2={M.top + PH} stroke="rgb(var(--cream))" strokeWidth={1.4} strokeDasharray="6 5" strokeOpacity={0.4} />
        <text x={x(500) + 8} y={M.top + PH - 8} fill="rgb(var(--cream))" fillOpacity={0.6} fontSize={11} fontStyle="italic">
          median mission ≈ 500 nm (est.)
        </text>

        {/* Competitors */}
        {others.map((p) => {
          const left = p.range >= 1850;
          return (
            <g key={p.name}>
              <circle cx={x(p.range)} cy={y(p.seats)} r={5.5} fill={COLORS[p.status as keyof typeof COLORS]} stroke="rgb(var(--navy))" strokeWidth={0.5}>
                <title>{`${p.name} — ${p.seats} seats, ${fmt(p.range)} nm`}</title>
              </circle>
              <text
                x={x(p.range) + (left ? -9 : 9)}
                y={y(p.seats) + 4}
                fill="#A89789"
                fontSize={11}
                textAnchor={left ? "end" : "start"}
              >
                {p.name}
              </text>
            </g>
          );
        })}

        {/* Revia family — line + labelled nodes */}
        <polyline points={reviaLine} fill="none" stroke="rgb(var(--amber))" strokeWidth={2.4} strokeOpacity={0.85} />
        {revia.map((p) => (
          <g key={p.name}>
            <circle cx={x(p.range)} cy={y(p.seats)} r={7.5} fill="rgb(var(--amber))" stroke="rgb(var(--cream))" strokeWidth={2}>
              <title>{`${p.name} — ${p.seats} seats, ${fmt(p.range)} nm`}</title>
            </circle>
            <text x={x(p.range) + 12} y={y(p.seats) + 4} fill="rgb(var(--cream))" fontSize={13} fontWeight="bold">
              {p.name}
            </text>
          </g>
        ))}

        {/* Axis labels */}
        <text x={M.left + PW / 2} y={H - 4} fill="rgb(var(--cream))" fillOpacity={0.6} fontSize={12} textAnchor="middle">
          Design range (nm)
        </text>
        <text
          transform={`rotate(-90 14 ${M.top + PH / 2})`}
          x={14}
          y={M.top + PH / 2}
          fill="rgb(var(--cream))"
          fillOpacity={0.6}
          fontSize={12}
          textAnchor="middle"
        >
          Seats (baseline)
        </text>
      </svg>

      {/* Legend */}
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 px-1">
        {LEGEND.map((l) => (
          <li key={l.label} className="flex items-center gap-2 text-xs text-cream/60">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{
                backgroundColor: l.color,
                boxShadow: l.revia ? "0 0 0 1.5px rgb(var(--cream))" : undefined,
              }}
            />
            {l.label}
          </li>
        ))}
      </ul>
    </figure>
  );
}
