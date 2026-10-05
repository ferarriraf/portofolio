import type { ReactNode } from "react";

/**
 * Transition entre les pages : un fondu de 400 ms, en CSS pur.
 *
 * PAS DE `y` / `translate` ICI. JAMAIS. Ce bloc enveloppe TOUT le
 * contenu de la page, et son état de départ est servi dans le HTML. Un
 * décalage de départ est additionné par le navigateur à chaque
 * restauration de position (rechargement, retour arrière) : sept F5 et
 * le texte lu est passé derrière le haut de l'écran. L'opacité seule ne
 * déplace aucun repère. Voir CLAUDE.md pour la mesure.
 *
 * Le marqueur `data-entree` permet au <noscript> du layout de forcer
 * l'opacité à 1 ; une animation CSS tourne de toute façon sans
 * JavaScript, c'est une ceinture en plus des bretelles.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <div data-entree className="entree">
      {children}
    </div>
  );
}
