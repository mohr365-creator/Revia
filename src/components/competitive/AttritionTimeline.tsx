import { conventionalEra, propulsionEra, type AttritionEvent } from "@/data/competitive";

function Band({
  eyebrow,
  events,
  accent,
}: {
  eyebrow: string;
  events: AttritionEvent[];
  accent: "saffron" | "amber";
}) {
  const dot = accent === "saffron" ? "bg-saffron" : "bg-amber";
  const year = accent === "saffron" ? "text-saffron" : "text-amber";
  return (
    <div>
      <p className={`text-xs font-medium uppercase tracking-eyebrow ${year}`}>{eyebrow}</p>
      <div className="relative mt-5 pl-5">
        {/* spine */}
        <span className="absolute left-[3px] top-1 h-[calc(100%-0.5rem)] w-px bg-cream/15" />
        <ol className="space-y-5">
          {events.map((e, i) => (
            <li key={e.name} className="relative">
              <span
                className={`absolute -left-5 top-1 h-2 w-2 rounded-full ${dot} ${
                  i === events.length - 1 && accent === "amber" ? "ring-2 ring-cream/70" : ""
                }`}
              />
              <div className="flex flex-wrap items-baseline gap-x-3">
                <span className={`font-serif text-lg ${year}`}>{e.year}</span>
                <span className="font-medium text-cream">{e.name}</span>
              </div>
              <p className="text-sm text-cream/55">{e.why}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export function AttritionTimeline() {
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <Band eyebrow="Conventional era — constrained by capital & execution" events={conventionalEra} accent="saffron" />
      <Band eyebrow="Propulsion era — limited by physics & funding" events={propulsionEra} accent="amber" />
    </div>
  );
}
