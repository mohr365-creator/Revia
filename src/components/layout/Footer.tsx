import Link from "next/link";
import { ArcMark } from "@/components/brand/ArcMark";
import { Wordmark } from "@/components/brand/Wordmark";
import { Container } from "@/components/ui/Container";
import { footerNav, site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-cream/10 bg-navy py-16 text-cream">
      <Container>
        <div className="grid gap-12 md:grid-cols-[1.5fr_repeat(2,1fr)]">
          <div className="max-w-xs">
            <Wordmark size="text-2xl" />
            <p className="mt-5 font-serif text-lg italic text-cream/70">
              {site.tagline}
            </p>
            <ArcMark className="mt-6 h-8 w-24" />
          </div>

          {footerNav.map((col) => (
            <div key={col.heading}>
              <p className="font-sans text-xs font-medium uppercase tracking-eyebrow text-amber">
                {col.heading}
              </p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream/75 transition-colors hover:text-amber"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-cream/10 pt-8 text-xs text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. {site.disclaimer}
          </p>
          <p className="text-cream/40">
            {site.domain} · The way, revived.
          </p>
        </div>
      </Container>
    </footer>
  );
}
