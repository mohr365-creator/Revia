import { clsx } from "clsx";
import { Container } from "./Container";

interface SectionProps {
  id?: string;
  className?: string;
  /** Light section = navy text on cream. Default = cream on navy. */
  tone?: "dark" | "light";
  /** Render full-viewport-height (used for home scroll-narrative sections). */
  full?: boolean;
  containerClassName?: string;
  children: React.ReactNode;
}

export function Section({
  id,
  className,
  tone = "dark",
  full = false,
  containerClassName,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={clsx(
        "relative w-full",
        full ? "flex min-h-screen items-center py-24" : "py-20 sm:py-28",
        tone === "light" ? "bg-cream text-navy" : "bg-navy text-cream",
        className,
      )}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
