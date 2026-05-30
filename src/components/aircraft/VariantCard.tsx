import Image from "next/image";
import type { AircraftVariant } from "@/lib/types";
import { AircraftSilhouette } from "./AircraftSilhouette";
import { DataFlag } from "@/components/ui/DataFlag";

export function VariantCard({ variant }: { variant: AircraftVariant }) {
  return (
    <article className="flex flex-col rounded-2xl border border-cream/10 bg-cream/[0.03] p-8">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-serif text-3xl text-cream">{variant.name}</h3>
        <span className="text-sm text-cream/50">{variant.seats}</span>
      </div>
      <p className="mt-2 text-pretty text-cream/70">{variant.tagline}</p>

      {variant.image ? (
        <Image
          src={variant.image.src}
          alt={variant.image.alt}
          width={variant.image.width}
          height={variant.image.height}
          className="my-8 h-auto w-full rounded-xl"
        />
      ) : (
        <AircraftSilhouette className="my-8 text-saffron" label={String(variant.name)} />
      )}

      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
        {variant.specs.map((spec) => (
          <div key={spec.label}>
            <dt className="text-cream/50">{spec.label}</dt>
            <dd className="mt-0.5 flex items-center gap-2 text-cream">
              {spec.value}
              {!spec.verified && <DataFlag title="Flagged for verification">unverified</DataFlag>}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
