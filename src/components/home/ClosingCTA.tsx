import { ArcMark } from "@/components/brand/ArcMark";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export function ClosingCTA() {
  return (
    <section className="relative overflow-hidden bg-navy py-32">
      <Container className="text-center">
        <ArcMark beacon className="mx-auto h-16 w-48" title="Revia arc" />
        <p className="mt-10 font-serif text-4xl italic text-cream sm:text-6xl">
          The way, revived.
        </p>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-cream/60">
          We&apos;re building the aircraft to turn the routes back on. If that&apos;s
          a future you want to help build, let&apos;s talk.
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <ButtonLink href="/contact?type=investor" variant="primary">
            Investor inquiries
          </ButtonLink>
          <ButtonLink href="/contact?type=partner" variant="secondary">
            Partner with us
          </ButtonLink>
          <ButtonLink href="/contact?type=careers" variant="ghost">
            Careers
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
