import { clsx } from "clsx";

interface WordmarkProps {
  className?: string;
  /** Tailwind text-size class controls the overall scale. */
  size?: string;
  beacon?: boolean;
}

/**
 * REVIA wordmark + arc lockup. The wordmark is the custom REVIA logo art
 * (cream on transparent, blends on the navy ground); the amber arc sits
 * beneath with endpoint dots extending past the wordmark each side. The
 * `size` text class drives the overall scale — the logo height tracks the
 * font size so the lockup keeps its proportions everywhere it's used.
 */
export function Wordmark({
  className,
  size = "text-2xl",
  beacon = false,
}: WordmarkProps) {
  return (
    <span className={clsx("inline-flex flex-col items-stretch leading-none", size, className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/revia-wordmark.png"
        alt="Revia"
        width={1029}
        height={253}
        className="h-[1.15em] w-auto self-center"
      />
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
