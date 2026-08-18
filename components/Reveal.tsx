"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: "fade" | "mask";
};

/**
 * Parti pris éditorial : le contenu texte s'affiche directement,
 * sans apparition au scroll (variant "fade" = simple conteneur).
 * Seuls les visuels gardent un dévoilement par masque ("mask"),
 * piloté par useInView sur un conteneur jamais rogné — un élément
 * masqué par son propre clip-path est invisible pour
 * l'IntersectionObserver.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
  variant = "fade",
}: RevealProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });

  if (variant === "mask") {
    const shown = inView || !!reduce;
    return (
      <div ref={ref} className={className}>
        <motion.div
          initial={
            reduce
              ? { clipPath: "inset(0% 0% 0% 0%)" }
              : { clipPath: "inset(0% 0% 100% 0%)" }
          }
          animate={{
            clipPath: shown ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
          }}
          transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </div>
    );
  }

  return <div className={className}>{children}</div>;
}
