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

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Apparition au scroll, une seule fois, pilotée par useInView sur
 * un conteneur jamais rogné (un élément masqué par son propre
 * clip-path est invisible pour l'IntersectionObserver).
 * - "fade" : translation + fondu.
 * - "mask" : dévoilement par masque, de haut en bas (pour les visuels).
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
  const shown = inView || !!reduce;

  if (variant === "mask") {
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
          transition={{ duration: 0.9, delay, ease: EASE }}
        >
          {children}
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 30 }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
