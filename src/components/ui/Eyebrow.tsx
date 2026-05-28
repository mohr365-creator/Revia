import { clsx } from "clsx";

export function Eyebrow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={clsx(
        "font-sans text-xs font-medium uppercase tracking-eyebrow text-amber",
        className,
      )}
    >
      {children}
    </p>
  );
}
