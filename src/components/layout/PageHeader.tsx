import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
}) {
  return (
    <header className="border-b border-cream/10 bg-navy pb-16 pt-36">
      <Container>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-5 max-w-3xl text-balance font-serif text-4xl leading-tight text-cream sm:text-5xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-6 max-w-2xl text-pretty text-lg text-cream/70">
            {intro}
          </p>
        )}
      </Container>
    </header>
  );
}
