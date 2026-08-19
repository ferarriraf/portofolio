"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Réticule d'inspection : une croix fine suit le pointeur et affiche
 * ses coordonnées, comme dans un outil de design. Sur un élément
 * cliquable, la croix s'ouvre en cadre de sélection.
 *
 * Tout est écrit directement dans le DOM depuis la boucle d'animation :
 * repasser par l'état React à chaque mouvement de souris ferait rendre
 * la page entière soixante fois par seconde.
 */
export default function CursorRing() {
  const [actif, setActif] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const boite = useRef<HTMLSpanElement>(null);
  const coord = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    // via un timer plutôt qu'une frame : le réticule doit s'installer
    // même si l'onglet démarre en arrière-plan
    const t = setTimeout(() => setActif(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!actif) return;
    const el = wrap.current;
    if (!el) return;

    let x = -200;
    let y = -200;
    let cible = false;
    let rafId = 0;
    let enAttente = false;

    const peindre = () => {
      enAttente = false;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (boite.current) {
        boite.current.dataset.actif = cible ? "1" : "0";
      }
      if (coord.current) {
        coord.current.textContent = `${Math.round(x)} · ${Math.round(y)}`;
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      const t = e.target as Element | null;
      cible = !!t?.closest?.(
        "a, button, [role='button'], summary, input, label"
      );
      if (!enAttente) {
        enAttente = true;
        rafId = requestAnimationFrame(peindre);
      }
    };
    const onLeave = () => {
      x = -200;
      y = -200;
      peindre();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [actif]);

  if (!actif) return null;

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[99] hidden md:block"
      style={{ transform: "translate3d(-200px, -200px, 0)" }}
    >
      {/* La croix de visée */}
      <span className="absolute -left-3 top-0 block h-px w-6 bg-terra-hot/70" />
      <span className="absolute left-0 -top-3 block h-6 w-px bg-terra-hot/70" />
      {/* Le cadre, qui s'ouvre sur les éléments cliquables */}
      <span
        ref={boite}
        data-actif="0"
        className="curseur-boite absolute -left-3.5 -top-3.5 block size-7 rounded-[2px] border border-terra-hot"
      />
      {/* Les coordonnées */}
      <span
        ref={coord}
        className="absolute top-3 left-4 block font-mono text-[0.6rem] font-medium tracking-tight text-ink-soft/60 tabular-nums"
      />
    </div>
  );
}
