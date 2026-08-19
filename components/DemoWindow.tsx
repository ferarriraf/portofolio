import type { ReactNode } from "react";

/**
 * Le moniteur commun des démos : un bezel sombre, une barre de
 * fenêtre avec ses pastilles et un titre en mono — même famille que
 * les fenêtres terminal de la FAQ et le Mac rétro de la méthode.
 */
export default function DemoWindow({
  titre,
  children,
}: {
  titre: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[1.4rem] bg-ink-deep p-2 pt-0 inset-shadow-cisele-sombre shadow-elev-3">
      <div className="flex items-center justify-between px-3 py-2">
        <span className="flex items-center gap-1.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-terra/70" />
          <span className="size-2 rounded-full bg-sand/40" />
          <span className="size-2 rounded-full bg-sage/70" />
        </span>
        <span className="font-mono text-[0.6rem] tracking-wide text-sand/60">
          {titre}
        </span>
      </div>
      <div className="relative aspect-4/3 overflow-hidden rounded-[0.9rem]">
        {children}
      </div>
    </div>
  );
}
