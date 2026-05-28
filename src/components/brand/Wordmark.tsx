import { clsx } from "clsx";

interface WordmarkProps {
  className?: string;
  /** Tailwind text-size class controls the overall scale. */
  size?: string;
  beacon?: boolean;
}

/**
 * REVIA wordmark + arc lockup. Antonio (geometric) is the locked wordmark face,
 * all caps with generous tracking and the amber arc beneath; endpoint dots
 * extend past the wordmark each side.
 */
export function Wordmark({
  className,
  size = "text-2xl",
  beacon = false,
}: WordmarkProps) {
  return (
    <span className={clsx("inline-flex flex-col items-stretch", className)}>
      <span
        className={clsx(
          "font-wordmark font-medium uppercase leading-none tracking-wordmark text-cream",
          size,
        )}
      >
        Revia
      </span>
      <svg
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
        aria-hidden
        className="-mx-[7%] mt-[0.18em] h-[0.34em] w-[114%] overflow-visible"
      >
        <path
          d="M4 9 Q50 1.5 96 9"
          fill="none"
          stroke="var(--amber)"
          strokeWidth={2.4}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <circle cx={4} cy={9} r={3.2} fill="var(--amber)" className={beacon ? "animate-beacon" : undefined} />
        <circle cx={96} cy={9} r={3.2} fill="var(--amber)" className={beacon ? "animate-beacon [animation-delay:1.6s]" : undefined} />
      </svg>
    </span>
  );
}
