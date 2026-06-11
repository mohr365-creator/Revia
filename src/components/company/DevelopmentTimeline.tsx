import { clsx } from "clsx";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { developmentPhases, type PhaseStatus } from "@/data/phases";

function StatusBadge({ status }: { status: PhaseStatus }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.625rem] font-medium uppercase tracking-wide",
        status === "active" &&
          "border border-amber/40 bg-amber/10 text-amber",
        status === "upcoming" &&
          "border border-cream/20 bg-cream/5 text-cream/60",
        status === "future" &&
          "border border-cream/10 bg-transparent text-cream/35",
      )}
    >
      {status === "active" && (
        <span className="h-1.5 w-1.5 rounded-full bg-amber" />
      )}
      {status === "active" ? "In progress" : status === "upcoming" ? "Next" : "Planned"}
    </span>
  );
}

export function DevelopmentTimeline() {
  return (
    <div>
      <Eyebrow>Development roadmap</Eyebrow>
      <h2 className="mt-4 font-serif text-3xl text-cream">
        A sequenced path to market.
      </h2>
      <p className="mt-4 max-w-2xl text-pretty text-cream/60">
        The program is structured deliberately: defense and cargo first, then
        commercial. Each phase builds the certification basis and demand signal
        the next one requires.
      </p>

      <div className="mt-12 space-y-0">
        {developmentPhases.map((phase, i) => (
          <div key={phase.id} className="flex gap-6 sm:gap-10">
            {/* Timeline spine */}
            <div className="flex flex-col items-center">
              <div
                className={clsx(
                  "mt-1 h-3 w-3 shrink-0 rounded-full ring-2 ring-offset-2 ring-offset-navy",
                  phase.status === "active"
                    ? "bg-amber ring-amber/50"
                    : phase.status === "upcoming"
                      ? "bg-cream/40 ring-cream/20"
                      : "bg-cream/15 ring-cream/10",
                )}
              />
              {i < developmentPhases.length - 1 && (
                <div
                  className={clsx(
                    "mt-2 w-px flex-1",
                    phase.status === "active"
                      ? "bg-amber/30"
                      : "bg-cream/10",
                  )}
                  style={{ minHeight: "4rem" }}
                />
              )}
            </div>

            {/* Content */}
            <div className="pb-12">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={clsx(
                    "font-sans text-xs font-medium uppercase tracking-eyebrow",
                    phase.status === "active" ? "text-amber" : "text-cream/40",
                  )}
                >
                  {phase.horizon}
                </span>
                <StatusBadge status={phase.status} />
              </div>

              <h3
                className={clsx(
                  "mt-2 font-serif text-xl leading-snug",
                  phase.status === "active" ? "text-cream" : "text-cream/70",
                )}
              >
                {phase.title}
              </h3>

              <p
                className={clsx(
                  "mt-3 max-w-2xl text-pretty text-sm leading-relaxed",
                  phase.status === "active" ? "text-cream/65" : "text-cream/45",
                )}
              >
                {phase.description}
              </p>

              <ul className="mt-4 space-y-1.5">
                {phase.milestones.map((m) => (
                  <li
                    key={m}
                    className={clsx(
                      "flex items-start gap-2 text-sm",
                      phase.status === "active" ? "text-cream/60" : "text-cream/35",
                    )}
                  >
                    <span
                      className={clsx(
                        "mt-2 h-1 w-1 shrink-0 rounded-full",
                        phase.status === "active" ? "bg-amber/60" : "bg-cream/20",
                      )}
                    />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
