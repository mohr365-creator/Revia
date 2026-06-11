export function ConceptBanner({ message }: { message?: string }) {
  return (
    <div className="mb-8 rounded-xl border border-ember/30 bg-ember/5 overflow-hidden">
      <div className="border-b border-ember/30 px-5 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-saffron">
          Initial Conceptual Development
        </h2>
      </div>
      <div className="flex items-start gap-4 px-5 py-4">
        <span className="text-2xl leading-none text-saffron" aria-label="Caution">⚠</span>
        <p className="text-sm text-cream/70">
          {message ?? "Representative Vehicle Configuration"}
        </p>
      </div>
    </div>
  );
}
