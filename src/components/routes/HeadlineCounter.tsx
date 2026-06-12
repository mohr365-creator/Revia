/**
 * Live count of what the current filters actually show. The lost-connections
 * view frames it as what was severed; the restoration view frames the same
 * numbers as what Revia brings back.
 */
export function HeadlineCounter({
  communities,
  routes,
  restoration = false,
}: {
  communities: number;
  routes: number;
  restoration?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
      <div>
        <div className="font-serif text-4xl text-cream sm:text-5xl">
          150<span className="text-amber">+</span>
        </div>
        <p className="text-xs uppercase tracking-eyebrow text-cream/50">
          {restoration ? "communities Revia can serve" : "communities lost all service"}
        </p>
      </div>
      <div>
        <div className="font-serif text-4xl text-amber sm:text-5xl">{communities}</div>
        <p className="text-xs uppercase tracking-eyebrow text-cream/50">
          {restoration ? "Revia reconnects here" : "documented here"}
        </p>
      </div>
      <div>
        <div className="font-serif text-4xl text-cream/60 sm:text-5xl">{routes}</div>
        <p className="text-xs uppercase tracking-eyebrow text-cream/50">
          {restoration ? "links Revia restores" : "hub links shown"}
        </p>
      </div>
    </div>
  );
}
