import type { AircraftVariant } from "@/lib/types";
import { AircraftSilhouette } from "./AircraftSilhouette";
import { DataFlag } from "@/components/ui/DataFlag";

export function VariantCard({
  variant,
  specStyle = "grid",
  showDataFlags = false,
}: {
  variant: AircraftVariant;
  specStyle?: "grid" | "list";
  showDataFlags?: boolean;
}) {
  return (
    <article className="flex flex-col rounded-2xl border border-cream/10 bg-cream/[0.03] p-8">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-serif text-3xl text-cream">{variant.name}</h3>
        {variant.seats && <span className="text-sm text-cream/50">{variant.seats}</span>}
      </div>
      <p className="mt-2 text-pretty text-cream/70">{variant.tagline}</p>

      {variant.image ? (
        <div className="my-8 overflow-hidden rounded-xl border border-cream/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={variant.image}
            alt={variant.imageAlt ?? String(variant.name)}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      ) : (
        <AircraftSilhouette className="my-8 text-saffron" label={String(variant.name)} />
      )}

      {specStyle === "list" ? (
        <ul className="space-y-2 text-sm">
          {variant.specs.map((spec) => (
            <li key={spec.label} className="flex items-baseline gap-2">
              <span className="shrink-0 text-cream/50">{spec.label}:</span>
              <span className="flex items-center gap-2 text-cream">
                {spec.value}
                {showDataFlags && !spec.verified && <DataFlag title="Flagged for verification">unverified</DataFlag>}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
          {variant.specs.map((spec) => (
            <div key={spec.label}>
              <dt className="text-cream/50">{spec.label}</dt>
              <dd className="mt-0.5 flex items-center gap-2 text-cream">
                {spec.value}
                {showDataFlags && !spec.verified && <DataFlag title="Flagged for verification">unverified</DataFlag>}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  );
}
