import { ArcMark } from "@/components/brand/ArcMark";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center bg-navy">
      <Container className="text-center">
        <ArcMark className="mx-auto h-12 w-36" />
        <p className="mt-8 font-serif text-5xl text-cream">404</p>
        <p className="mt-4 font-serif text-xl italic text-cream/60">
          This route went dark.
        </p>
        <div className="mt-10">
          <ButtonLink href="/" variant="primary">
            Back to the map
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
