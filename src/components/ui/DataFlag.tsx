import { clsx } from "clsx";

/**
 * Visible marker for placeholder / unverified data. Keeps the brief's promise
 * that no unsourced number ships disguised as fact. Use inline next to any
 * figure that is not yet traced to a source.
 */
export function DataFlag({
  className,
  children = "Unverified",
  title,
}: {
  className?: string;
  children?: React.ReactNode;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border border-ember/50 bg-ember/10 px-2 py-0.5 align-middle text-[0.625rem] font-medium uppercase tracking-wide text-saffron",
        className,
      )}
    >
      <span aria-hidden>⚠</span>
      {children}
    </span>
  );
}
