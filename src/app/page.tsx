import { Hero } from "@/components/home/Hero";
import { HumanAnchor } from "@/components/home/HumanAnchor";
import { MapTeaser } from "@/components/home/MapTeaser";
import { StructuralCause } from "@/components/home/StructuralCause";
import { TheAnswer } from "@/components/home/TheAnswer";
import { WhyNow } from "@/components/home/WhyNow";
import { ClosingCTA } from "@/components/home/ClosingCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HumanAnchor />
      <MapTeaser />
      <StructuralCause />
      <TheAnswer />
      <WhyNow />
      <ClosingCTA />
    </>
  );
}
