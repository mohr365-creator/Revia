import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { DataFlag } from "@/components/ui/DataFlag";

export const metadata: Metadata = {
  title: "Mission",
  description:
    "Why Revia exists: the full story of the lost connections and the bet to bring them back.",
};

function Pull({ children }: { children: React.ReactNode }) {
  return (
    <p className="my-12 border-l-2 border-amber pl-6 font-serif text-2xl italic leading-snug text-cream sm:text-3xl">
      {children}
    </p>
  );
}

function Chapter({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-prose py-12">
      <Eyebrow>{n}</Eyebrow>
      <h2 className="mt-4 font-serif text-3xl text-cream">{title}</h2>
      <div className="mt-6 space-y-5 text-pretty text-lg leading-relaxed text-cream/75">
        {children}
      </div>
    </section>
  );
}

export default function MissionPage() {
  return (
    <>
      <PageHeader
        eyebrow="Mission"
        title="America and the world lost the routes that connected ordinary places."
        intro="Revia exists to build the aircraft that bring them back. This is the full argument."
      />

      <div className="bg-navy">
        <Container>
          <Chapter n="01 · The problem" title="The connections we stopped noticing">
            <p>
              <span className="float-left mr-3 mt-1 font-serif text-7xl leading-[0.8] text-amber">
                F
              </span>
              or most of the twentieth century, flying out of a small American
              city was unremarkable. Then, quietly, it stopped being possible.
              Between 1995 and 2020, roughly{" "}
              <strong className="text-cream">150 U.S. communities</strong> lost
              their last scheduled commercial flight. Not
              in a single dramatic collapse, but seat by seat, route by route,
              until the airport was just a building by an empty runway.
            </p>
            <p>
              In 1990, you could fly out of Cheyenne. By 2019, the last carrier
              was gone — ninety years of air service, taken for granted, then
              removed. The same story repeated in Paducah, Wausau, Dubuque, and
              dozens of places that never made the news.
            </p>
            <Pull>
              The map didn&apos;t shrink all at once. It dimmed, one beacon at a
              time.
            </Pull>
          </Chapter>

          <Chapter n="02 · The global problem" title="A gap the whole world shares">
            <p>
              This is not only an American story. Across Africa, Southeast Asia
              and India, Latin America, and the Pacific Islands, the same{" "}
              <strong className="text-cream">50–100 seat segment</strong> is
              missing: the aircraft size that connects secondary cities to the
              network economically.
            </p>
            <p>
              We estimate a total addressable market of{" "}
              <strong className="text-cream">8,000–10,000 aircraft</strong>{" "}
              <DataFlag title="Internal estimate: PROJECT_BRIEF">
                estimate
              </DataFlag>{" "}
              in that gap, with no clean-sheet product to meet it.
            </p>
          </Chapter>

          <Chapter n="03 · The structural cause" title="The aircraft disappeared first">
            <p>
              The routes didn&apos;t vanish by accident. Three forces compounded:
              fuel prices quadrupled and broke the economics of small jets; pilot
              scope clauses froze the regional segment at 76 seats; and no
              manufacturer ever built a clean-sheet replacement for the
              50–100 seat aircraft.
            </p>
            <p>
              The attempts failed or retreated. Mitsubishi&apos;s SpaceJet died
              after roughly <strong className="text-cream">$10B</strong>.
              Bombardier exited commercial aircraft. Embraer moved upmarket. The
              gap was left wide open.
            </p>
          </Chapter>

          <Chapter n="04 · Revia's answer" title="Start where the need is sharpest">
            <p>
              Revia begins with a Phase 1 regional family — the{" "}
              <strong className="text-cream">R-50, R-75, and R-100</strong> — a
              5-abreast trio sharing one wing, one cross-section, and one engine
              family.
              Sequenced defense-and-cargo-first, where the certification path is
              cleaner and the demand is immediate.
            </p>
            <p>
              <Link href="/aircraft" className="text-amber hover:text-saffron">
                See the aircraft families →
              </Link>
            </p>
          </Chapter>

          <Chapter n="05 · The architecture" title="Built to grow">
            <p>
              The regional family is not a one-generation product. The shared
              wing, cross-section, and engine family are chosen for a reason:
              the same architecture that serves the 50-seat thin route today is
              the foundation for expanding into larger markets as Revia scales.
              The platform grows with the demand, without starting over.
            </p>
          </Chapter>

          <Chapter n="06 · Why now" title="The demand is already on the record">
            <p>
              The 50-seat fleet is retiring with no replacement. Airlines need a
              right-sized option for thin routes. The market gap is open, the
              certification path is clear, and the incumbents have walked away.
              The window is open now.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href="/routes/lost-connections" variant="primary">
                Explore the lost routes →
              </ButtonLink>
              <ButtonLink href="/contact?type=investor" variant="secondary">
                Investor inquiries
              </ButtonLink>
            </div>
          </Chapter>
        </Container>
      </div>
    </>
  );
}
