"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Transition entre les pages : un trait terracotta balaie le haut de
 * l'écran pendant que le contenu se pose. Court, discret, et il donne
 * le sentiment d'un chargement maîtrisé plutôt que d'un saut.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <>
      <motion.span
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[95] h-0.5 origin-left bg-terra-hot"
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{
          scaleX: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
          opacity: { delay: 0.5, duration: 0.25 },
        }}
      />
      {/* data-entree : sans JavaScript, l'état de départ (opacité nulle)
          est servi tel quel dans le HTML et rien ne vient jamais le
          lever. Le bloc <noscript> du layout s'appuie sur cet attribut
          pour rendre le contenu visible.

          PAS DE `y` ICI. JAMAIS. Ce bloc enveloppe TOUT le contenu de la
          page. Un `y: 12` de départ est servi dans le HTML sous la forme
          `transform: translateY(12px)` : la page entière commence donc
          12 px trop bas, puis remonte. Or le navigateur, quand il
          restaure la position de lecture après un rechargement, repère un
          élément et le remet où il était — en mesurant sa position AVEC ce
          décalage. Au moment où l'on recharge, l'animation est finie et le
          décalage vaut 0 ; au chargement suivant il vaut 12. Le navigateur
          descend donc de 12 px, et cette nouvelle position est celle qu'il
          sauvegardera au rechargement d'après : ça s'ADDITIONNE. Sept F5 et
          ce qu'on lisait est passé derrière la barre du haut (81 px).

          Loi vérifiée en production, décalage forcé à la main juste avant le
          rechargement : nouvelle position = ancienne + 12 − décalage.
          Forcé à 0 → +12 ; forcé à 50 → −38 (la page remonte) ; forcé à
          −30 → +42. Trois prédictions, trois mesures exactes.

          L'opacité seule ne déplace aucun repère : elle est sans danger.
          Si un glissement d'entrée redevient souhaitable un jour, il faut
          le porter par un `clip-path` (comme `components/Reveal.tsx` en
          mode masque), qui ne déplace pas la boîte. */}
      <motion.div
        data-entree
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
