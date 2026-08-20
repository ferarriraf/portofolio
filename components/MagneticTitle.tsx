"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type MagneticTitleProps = {
  lineA: string;
  lineB: string;
  className?: string;
};

/**
 * Le titre du hero, sensible au pointeur : chaque lettre épaissit et
 * se soulève quand le curseur l'approche, puis retrouve sa place.
 * Le geste n'est possible que parce que la police est variable
 * (Bricolage Grotesque, 200→800) : c'est la matière typographique
 * elle-même qui réagit, pas un effet plaqué par-dessus.
 *
 * Au clic, l'onde part du point cliqué et traverse le mot.
 * « Réduire les animations » : titre figé, aucune écoute du pointeur.
 */
export default function MagneticTitle({
  lineA,
  lineB,
  className,
}: MagneticTitleProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const lettres = Array.from(
      el.querySelectorAll<HTMLElement>("[data-lettre]")
    );
    // Poids de repos propre à chaque ligne (fine puis grasse)
    const repos = lettres.map((l) => Number(l.dataset.repos));
    const centres = lettres.map(() => ({ x: 0, y: 0 }));
    // La force appliquée est amortie : chaque lettre glisse vers sa
    // cible au lieu de la suivre au pixel — sans quoi les petits
    // mouvements de souris en bord de rayon font trembler les lettres
    const forces = lettres.map(() => 0);
    const RAYON = 190;

    const mesurer = () => {
      lettres.forEach((l, i) => {
        const r = l.getBoundingClientRect();
        centres[i] = { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      });
    };
    mesurer();
    // Les lettres montent encore à l'arrivée : on reprend leurs
    // positions une fois l'animation d'entrée terminée
    const remesure = setTimeout(mesurer, 1300);

    let sourisX = -9999;
    let sourisY = -9999;
    let onde: { x: number; y: number; t: number } | null = null;
    let rafId = 0;
    let actif = false;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      sourisX = e.clientX;
      sourisY = e.clientY;
      lancer();
    };
    const onLeave = () => {
      sourisX = -9999;
      sourisY = -9999;
    };
    const onClick = (e: PointerEvent) => {
      // L'onde ne part que d'un clic sur le titre lui-même — pas des
      // zones vides à gauche ou à droite de sa boîte
      onde = { x: e.clientX, y: e.clientY, t: performance.now() };
      lancer();
    };

    const frame = () => {
      let bouge = false;
      const maintenant = performance.now();
      const ondeAge = onde ? maintenant - onde.t : Infinity;
      if (ondeAge > 900) onde = null;

      lettres.forEach((l, i) => {
        const c = centres[i];
        // Distance anisotrope : l'écart vertical pèse plus lourd, pour
        // que survoler une ligne ne réveille pas sa voisine
        const d = Math.hypot(c.x - sourisX, (c.y - sourisY) * 2.4);
        let cible = d < RAYON ? 1 - d / RAYON : 0;
        cible = cible * cible * (3 - 2 * cible); // adoucit les bords

        // L'onde du clic : un anneau qui s'éloigne du point cliqué
        if (onde) {
          const dOnde = Math.hypot(c.x - onde.x, c.y - onde.y);
          const rayonOnde = (ondeAge / 900) * 900;
          const ecart = Math.abs(dOnde - rayonOnde);
          if (ecart < 130) {
            const puls = (1 - ecart / 130) * (1 - ondeAge / 900);
            cible = Math.min(1, cible + puls);
          }
        }

        // Amortissement : on tend vers la cible, on ne saute pas dessus
        forces[i] += (cible - forces[i]) * 0.16;
        if (Math.abs(cible - forces[i]) < 0.004) forces[i] = cible;
        const force = forces[i];

        if (force > 0.001 || cible > 0) bouge = true;
        const base = repos[i];
        // Amplitude contenue : +300 de graisse au plus — l'épaississement
        // se sent sans déformer la lettre
        const poids = Math.round(base + Math.min(800 - base, 300) * force);
        l.style.fontVariationSettings = `"wght" ${poids}`;
        l.style.transform =
          force > 0.001 ? `translateY(${(-force * 9).toFixed(2)}px)` : "";
      });

      if (bouge || onde) {
        rafId = requestAnimationFrame(frame);
      } else {
        actif = false;
      }
    };

    const lancer = () => {
      if (actif) return;
      actif = true;
      rafId = requestAnimationFrame(frame);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerdown", onClick, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", mesurer);
    window.addEventListener("scroll", mesurer, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(remesure);
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onClick);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", mesurer);
      window.removeEventListener("scroll", mesurer);
    };
  }, [reduce]);

  const ligne = (texte: string, poidsRepos: number, retard: number) => (
    <span aria-hidden="true" className="block overflow-hidden pb-[0.08em]">
      <span
        className="block"
        style={{
          animation: reduce
            ? undefined
            : `title-rise 0.85s cubic-bezier(0.22,1,0.36,1) ${retard}s both`,
        }}
      >
        {Array.from(texte).map((ch, i) =>
          ch === " " ? (
            <span key={i}> </span>
          ) : (
            <span
              key={i}
              data-lettre
              data-repos={poidsRepos}
              className="inline-block will-change-transform"
              style={{ fontVariationSettings: `"wght" ${poidsRepos}` }}
            >
              {ch}
            </span>
          )
        )}
      </span>
    </span>
  );

  return (
    <h1
      ref={ref}
      aria-label={`${lineA} ${lineB}`}
      className={className}
    >
      {ligne(lineA, 280, 0.12)}
      {ligne(lineB, 800, 0.26)}
    </h1>
  );
}
