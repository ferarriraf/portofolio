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
          pour rendre le contenu visible. */}
      <motion.div
        data-entree
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
