"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

/**
 * Transition entre les pages : un fondu de 400 ms — SEULEMENT entre
 * deux pages, jamais au premier chargement ni au rechargement. Fondre
 * toute la page depuis le papier faisait un éclair clair avant la bande
 * d'encre du hero (« le flash blanc du reload »).
 *
 * Le gabarit se remonte à chaque navigation. Avant son premier dessin
 * (useLayoutEffect), il regarde si une page a déjà été affichée dans cet
 * onglet (marqueur sur <html>) : si oui, il s'anime ; sinon il s'affiche
 * d'un coup et pose le marqueur pour les suivantes. Pas d'état React,
 * donc pas de divergence serveur/navigateur : le HTML servi n'a jamais
 * la classe d'animation.
 *
 * PAS DE `y` / `translate` ICI. JAMAIS. Ce bloc enveloppe TOUT le
 * contenu de la page ; un décalage de départ est additionné par le
 * navigateur à chaque restauration de position (voir CLAUDE.md).
 * L'opacité seule ne déplace aucun repère.
 */
export default function Template({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const html = document.documentElement;
    if (html.dataset.navigue === "1") {
      ref.current?.classList.add("entree-anime");
    } else {
      html.dataset.navigue = "1";
    }
  }, []);

  return (
    <div ref={ref} data-entree>
      {children}
    </div>
  );
}
