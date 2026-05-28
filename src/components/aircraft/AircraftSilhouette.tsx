import { clsx } from "clsx";

/**
 * PLACEHOLDER side-profile silhouette. The brief notes to-scale SVG/JPG side
 * profiles exist in the project — drop those in to replace this. Until then this
 * is a stylized stand-in (not to scale, not engineering-accurate).
 */
export function AircraftSilhouette({
  className,
  label,
}: {
  className?: string;
  label?: string;
}) {
  return (
    <svg
      viewBox="0 0 320 80"
      role="img"
      aria-label={label ? `${label} (placeholder silhouette)` : "Aircraft silhouette placeholder"}
      className={clsx("h-auto w-full", className)}
    >
      {/* fuselage */}
      <path
        d="M14 46 C40 40 120 38 210 39 C250 39 280 41 300 44 C306 45 306 50 300 51 C260 54 120 55 60 53 C36 52 20 50 14 49 Z"
        fill="currentColor"
        opacity={0.85}
      />
      {/* nose cockpit window */}
      <path d="M292 45 l9 0 c4 1 4 4 0 5 l-9 0 Z" fill="var(--navy)" opacity={0.5} />
      {/* tail fin */}
      <path d="M14 46 L4 18 L24 24 L34 44 Z" fill="currentColor" opacity={0.85} />
      {/* tailplane */}
      <path d="M16 47 L2 52 L26 50 Z" fill="currentColor" opacity={0.7} />
      {/* wing */}
      <path d="M150 50 L120 70 L172 53 Z" fill="currentColor" opacity={0.6} />
      {/* engine */}
      <ellipse cx="150" cy="54" rx="14" ry="6" fill="currentColor" opacity={0.9} />
    </svg>
  );
}
