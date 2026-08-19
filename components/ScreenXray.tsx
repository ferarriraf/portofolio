/**
 * L'écran de radiographie : une page ordinaire dont la structure
 * apparaît sous le faisceau — R-X, comme rayons X. Le balayage
 * descend sans fin et révèle les blocs et leurs cotes.
 */
export default function ScreenXray() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-ink-deep">
      {/* La page vue de dessus, en sourdine */}
      <div className="absolute inset-0 flex flex-col gap-2 p-4 opacity-30">
        <div className="h-6 rounded bg-sand/70" />
        <div className="flex flex-1 gap-2">
          <div className="w-1/3 rounded bg-sand/45" />
          <div className="flex-1 rounded bg-sand/25" />
        </div>
        <div className="grid h-1/4 grid-cols-3 gap-2">
          <div className="rounded bg-sand/40" />
          <div className="rounded bg-sand/40" />
          <div className="rounded bg-sand/40" />
        </div>
      </div>

      {/* La structure révélée : contours et cotes */}
      <div className="absolute inset-0 flex flex-col gap-2 p-4">
        <div className="h-6 rounded border border-sage/70" />
        <div className="flex flex-1 gap-2">
          <div className="relative w-1/3 rounded border border-terra-hot/80">
            <span className="absolute -top-px left-1/2 h-px w-8 -translate-x-1/2 bg-terra-hot" />
          </div>
          <div className="flex-1 rounded border border-sage/70" />
        </div>
        <div className="grid h-1/4 grid-cols-3 gap-2">
          <div className="rounded border border-sage/70" />
          <div className="rounded border border-sage/70" />
          <div className="rounded border border-sage/70" />
        </div>
      </div>

      {/* Le faisceau qui descend */}
      <span
        aria-hidden="true"
        className="tube-sweep pointer-events-none absolute inset-x-0 top-0 h-[16%]"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(169,191,160,0.55), transparent)",
        }}
      />

      <span className="absolute top-3 left-3 rounded-full bg-sand/15 px-2.5 py-1 font-mono text-[0.55rem] font-semibold tracking-[0.14em] text-sand uppercase">
        R-X · scan
      </span>
    </div>
  );
}
