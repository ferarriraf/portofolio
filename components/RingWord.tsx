"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RingWordProps = {
  children: ReactNode;
};

/**
 * Souligne un mot d'un trait « à la main » qui se dessine au
 * chargement — le regard se pose exactement là où il faut.
 */
export default function RingWord({ children }: RingWordProps) {
  const reduce = useReducedMotion();

  return (
    <span className="relative inline-block whitespace-nowrap">
      <span className="relative z-10">{children}</span>
      <svg
        className="absolute right-[0.05em] -bottom-[0.11em] left-[0.02em] h-[0.1em] w-[calc(100%-0.07em)] overflow-visible"
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <motion.path
          d="M2 8.5 C 30 6, 65 5.5, 98 7"
          stroke="var(--terra-strong)"
          strokeWidth="4"
          strokeLinecap="round"
          initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.85, ease: "easeInOut" }}
        />
      </svg>
    </span>
  );
}
