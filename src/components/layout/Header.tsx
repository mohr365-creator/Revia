"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { Wordmark } from "@/components/brand/Wordmark";
import { ButtonLink } from "@/components/ui/Button";
import { primaryNav } from "@/data/site";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled || open
          ? "border-b border-cream/10 bg-navy/85 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
        <Link href="/" aria-label="Revia home" className="shrink-0">
          <Wordmark size="text-xl" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {primaryNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "text-sm tracking-wide transition-colors",
                  active ? "text-amber" : "text-cream/80 hover:text-amber",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <ButtonLink href="/contact" variant="primary" className="px-5 py-2">
            Get in touch
          </ButtonLink>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 md:hidden"
        >
          <span className="sr-only">Menu</span>
          <div className="space-y-1.5">
            <span
              className={clsx(
                "block h-0.5 w-5 bg-cream transition-transform",
                open && "translate-y-2 rotate-45",
              )}
            />
            <span className={clsx("block h-0.5 w-5 bg-cream transition-opacity", open && "opacity-0")} />
            <span
              className={clsx(
                "block h-0.5 w-5 bg-cream transition-transform",
                open && "-translate-y-2 -rotate-45",
              )}
            />
          </div>
        </button>
      </div>

      {open && (
        <nav className="border-t border-cream/10 bg-navy/95 px-6 py-6 md:hidden">
          <div className="flex flex-col gap-4">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-base text-cream/90 hover:text-amber"
              >
                {item.label}
              </Link>
            ))}
            <ButtonLink href="/contact" variant="primary" className="mt-2 self-start">
              Get in touch
            </ButtonLink>
          </div>
        </nav>
      )}
    </header>
  );
}
