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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu and any open dropdown on navigation.
  useEffect(() => {
    setOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

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
        <Link href="/" aria-label="Revia — home" className="shrink-0">
          <Wordmark size="text-xl" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {primaryNav.map((item) => {
            if ("children" in item && item.children) {
              const sectionActive = pathname.startsWith(item.href);
              const isOpen = openDropdown === item.href;
              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.href)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={item.href}
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    className={clsx(
                      "flex items-center gap-1 text-sm tracking-wide transition-colors",
                      sectionActive ? "text-amber" : "text-cream/80 hover:text-amber",
                    )}
                  >
                    {item.label}
                    <svg
                      viewBox="0 0 12 12"
                      aria-hidden="true"
                      className={clsx(
                        "h-3 w-3 transition-transform",
                        isOpen && "rotate-180",
                      )}
                    >
                      <path
                        d="M2.5 4.5 L6 8 L9.5 4.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                  {isOpen && (
                    <div className="absolute left-0 top-full pt-3">
                      <div className="min-w-[12rem] rounded-xl border border-cream/10 bg-navy/95 p-2 shadow-xl backdrop-blur-md">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block rounded-lg px-3 py-2 text-sm text-cream/80 transition-colors hover:bg-cream/5 hover:text-amber"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

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
            {primaryNav.map((item) => {
              if ("children" in item && item.children) {
                return (
                  <div key={item.href} className="flex flex-col gap-3">
                    <Link
                      href={item.href}
                      className="text-base text-cream/90 hover:text-amber"
                    >
                      {item.label}
                    </Link>
                    <div className="ml-1 flex flex-col gap-3 border-l border-cream/10 pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="text-sm text-cream/70 hover:text-amber"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-base text-cream/90 hover:text-amber"
                >
                  {item.label}
                </Link>
              );
            })}
            <ButtonLink href="/contact" variant="primary" className="mt-2 self-start">
              Get in touch
            </ButtonLink>
          </div>
        </nav>
      )}
    </header>
  );
}
