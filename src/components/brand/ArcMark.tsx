import { clsx } from "clsx";

interface ArcMarkProps {
  className?: string;
  /** Animate the endpoint dots like beacons. */
  beacon?: boolean;
  title?: string;
}

/**
 * The Revia arc — a route drawn between two beacons. Used standalone (favicon,
 * footer, social avatar) and beneath the wordmark. Geometry per brand spec:
 * ~30% apex rise, endpoint dots ~1.5x stroke weight extending past each side.
 */
export function ArcMark({ className, beacon = false, title }: ArcMarkProps) {
  return (
    <svg
      viewBox="0 0 100 34"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={clsx("overflow-visible", className)}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M6 26 Q50 4 94 26"
        fill="none"
        stroke="var(--amber)"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <circle
        cx={6}
        cy={26}
        r={4.5}
        fill="var(--amber)"
        className={beacon ? "origin-center animate-beacon" : undefined}
        style={beacon ? { transformBox: "fill-box" } : undefined}
      />
      <circle
        cx={94}
        cy={26}
        r={4.5}
        fill="var(--amber)"
        className={beacon ? "origin-center animate-beacon [animation-delay:1.6s]" : undefined}
        style={beacon ? { transformBox: "fill-box" } : undefined}
      />
    </svg>
  );
}
