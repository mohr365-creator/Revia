import Link from "next/link";
import { clsx } from "clsx";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-300 focus-visible:outline-none";

const variants: Record<Variant, string> = {
  primary: "bg-amber text-navy hover:bg-saffron",
  secondary:
    "border border-cream/30 text-cream hover:border-amber hover:text-amber",
  ghost: "text-cream/80 hover:text-amber",
};

interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export function ButtonLink({
  href,
  variant = "primary",
  className,
  onClick,
  children,
}: ButtonLinkProps) {
  const cls = clsx(base, variants[variant], className);
  const isInternal = href.startsWith("/");
  if (isInternal) {
    return (
      <Link href={href} className={cls} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={cls} onClick={onClick}>
      {children}
    </a>
  );
}
