"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

type BeforeAfterProps = {
  avant: ReactNode;
  apres: ReactNode;
  labelAvant: string;
  labelApres: string;
  /** Titre de la fenêtre du moniteur, façon terminal : « $ diff … » */
  titre: string;
};

/**
 * Le comparateur : une poignée que l'on glisse pour passer de
 * l'interface d'origine à la refonte, montée dans un moniteur sombre
 * (même famille que les fenêtres terminal de la FAQ). À l'arrivée
 * dans le viewport, la poignée fait une fois la démonstration toute
 * seule — et s'arrête dès que le visiteur prend la main.
 *
 * Le curseur est un vrai champ de saisie : il fonctionne à la souris,
 * au doigt et au clavier, et il est annoncé aux lecteurs d'écran.
 */
export default function BeforeAfter({
  avant,
  apres,
  labelAvant,
  labelApres,
  titre,
}: BeforeAfterProps) {
  const [position, setPosition] = useState(50);
  const [saisi, setSaisi] = useState(false);
  const cadre = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const enVue = useInView(cadre, { once: true, margin: "-80px" });
  const demo = useRef<ReturnType<typeof animate> | null>(null);
  const touche = useRef(false);

  // L'auto-démonstration, une seule fois — jamais contre la main du
  // visiteur : le moindre geste (pointeur ou clavier) la coupe net
  useEffect(() => {
    if (!enVue || reduce || touche.current) return;
    demo.current = animate(50, 64, {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: setPosition,
      onComplete: () => {
        if (touche.current) return;
        demo.current = animate(64, 50, {
          duration: 0.9,
          ease: [0.22, 1, 0.36, 1],
          onUpdate: setPosition,
        });
      },
    });
    return () => demo.current?.stop();
  }, [enVue, reduce]);

  const prendreLaMain = () => {
    touche.current = true;
    demo.current?.stop();
  };

  const deplacer = (clientX: number) => {
    const r = cadre.current?.getBoundingClientRect();
    if (!r) return;
    const p = ((clientX - r.x) / r.width) * 100;
    setPosition(Math.min(100, Math.max(0, p)));
  };

  return (
    <div className="rounded-[1.4rem] bg-ink-deep p-2 pt-0 inset-shadow-cisele-sombre shadow-elev-3">
      {/* Barre de fenêtre du moniteur */}
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

      <div
        ref={cadre}
        className="ba-frame relative overflow-hidden rounded-[0.9rem] select-none"
        onPointerDown={(e) => {
          prendreLaMain();
          setSaisi(true);
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          deplacer(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.buttons === 1) deplacer(e.clientX);
        }}
        onPointerUp={() => setSaisi(false)}
        onPointerCancel={() => setSaisi(false)}
        onLostPointerCapture={() => setSaisi(false)}
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

        {/* Le calque « avant » projette son ombre sur l'« après »,
            comme une feuille posée dessus */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-10 bg-gradient-to-r from-ink-deep/25 to-transparent"
          style={{ left: `${position}%` }}
        />

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

        {/* La ligne de séparation et sa poignée, qui répondent à la main */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 w-0.5 bg-sand ${
            saisi
              ? "shadow-[0_0_14px_rgba(36,41,31,0.65)]"
              : "shadow-[0_0_10px_rgba(36,41,31,0.45)]"
          }`}
          style={{ left: `${position}%` }}
        >
          <span
            className={`ba-poignee absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-sand transition-[scale,box-shadow] duration-200 ${
              saisi
                ? "scale-110 shadow-[0_10px_24px_-10px_rgba(36,41,31,0.6)] motion-reduce:scale-100"
                : "shadow-elev-2"
            }`}
          >
            <span
              className={`text-[0.7rem] font-bold text-ink transition-[letter-spacing] duration-200 ${
                saisi ? "tracking-[0.14em] motion-reduce:tracking-tighter" : "tracking-tighter"
              }`}
            >
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
          onChange={(e) => {
            prendreLaMain();
            setPosition(Number(e.target.value));
          }}
          aria-label={`${labelAvant} / ${labelApres}`}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
    </div>
  );
}
