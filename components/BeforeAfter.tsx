"use client";

import { useRef, useState, type ReactNode } from "react";

type BeforeAfterProps = {
  avant: ReactNode;
  apres: ReactNode;
  labelAvant: string;
  labelApres: string;
};

/**
 * Le comparateur : une poignée que l'on glisse pour passer de
 * l'interface d'origine à la refonte. La démonstration se fait par
 * la main du visiteur, pas par un argumentaire.
 *
 * Le curseur est un vrai champ de saisie : il fonctionne à la souris,
 * au doigt et au clavier, et il est annoncé aux lecteurs d'écran.
 */
export default function BeforeAfter({
  avant,
  apres,
  labelAvant,
  labelApres,
}: BeforeAfterProps) {
  const [position, setPosition] = useState(50);
  const cadre = useRef<HTMLDivElement>(null);

  const deplacer = (clientX: number) => {
    const r = cadre.current?.getBoundingClientRect();
    if (!r) return;
    const p = ((clientX - r.x) / r.width) * 100;
    setPosition(Math.min(100, Math.max(0, p)));
  };

  return (
    <div
      ref={cadre}
      className="ba-frame relative overflow-hidden rounded-3xl border border-line select-none"
      onPointerDown={(e) => {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        deplacer(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.buttons === 1) deplacer(e.clientX);
      }}
    >
      {/* L'après, en fond */}
      <div className="aspect-4/3">{apres}</div>

      {/* L'avant, découpé par la poignée */}
      <div
        className="absolute inset-0 aspect-4/3"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        {avant}
      </div>

      {/* Les deux étiquettes */}
      <span
        className="pointer-events-none absolute top-4 left-4 rounded-full bg-ink-deep/85 px-3 py-1 font-mono text-[0.6rem] font-semibold tracking-wide text-sand uppercase transition-opacity duration-200"
        style={{ opacity: position > 12 ? 1 : 0 }}
      >
        {labelAvant}
      </span>
      <span
        className="pointer-events-none absolute top-4 right-4 rounded-full bg-terra-hot px-3 py-1 font-mono text-[0.6rem] font-semibold tracking-wide text-sand uppercase transition-opacity duration-200"
        style={{ opacity: position < 88 ? 1 : 0 }}
      >
        {labelApres}
      </span>

      {/* La ligne de séparation et sa poignée */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-sand shadow-[0_0_10px_rgba(36,41,31,0.45)]"
        style={{ left: `${position}%` }}
      >
        <span className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-sand shadow-md">
          <span className="text-[0.7rem] font-bold tracking-tighter text-ink">
            ‹ ›
          </span>
        </span>
      </span>

      {/* Le curseur réel : souris, doigt et clavier */}
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(position)}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-label={`${labelAvant} / ${labelApres}`}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
