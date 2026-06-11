/**
 * Live count of what the current filters actually show, with context that this
 * is a documented sample — not the full national picture.
 */
export function HeadlineCounter({
  communities,
  routes,
}: {
  communities: number;
  routes: number;
}) {
  return (
    <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
      <div>
        <div className="font-serif text-4xl text-cream sm:text-5xl">
          150<span className="text-amber">+</span>
        </div>
        <p className="text-xs uppercase tracking-eyebrow text-cream/50">
          communities lost all service
        </p>
      </div>
      <div>
        <div className="font-serif text-4xl text-amber sm:text-5xl">{communities}</div>
        <p className="text-xs uppercase tracking-eyebrow text-cream/50">
          documented here
        </p>
      </div>
      <div>
        <div className="font-serif text-4xl text-cream/60 sm:text-5xl">{routes}</div>
        <p className="text-xs uppercase tracking-eyebrow text-cream/50">
          hub links shown
        </p>
      </div>
    </div>
  );
}
