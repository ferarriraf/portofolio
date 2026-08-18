"use client";

import { motion, useReducedMotion } from "framer-motion";

type HeroTitleProps = {
  lineA: string;
  lineB: string;
};

/**
 * Titre géant du hero, centré : deux lignes qui montent depuis un
 * masque. L'anneau 3D passe devant lui (z-index géré par la page).
 */
export default function HeroTitle({ lineA, lineB }: HeroTitleProps) {
  const reduce = useReducedMotion();

  const rise = (delay: number) => ({
    initial: reduce ? { y: 0 } : { y: "108%" },
    animate: { y: 0 },
    transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <h1
      aria-label={`${lineA} ${lineB}`}
      className="font-display text-[clamp(3.2rem,9.5vw,8rem)] font-bold leading-[0.98] tracking-tight text-ink"
    >
      <span aria-hidden="true" className="block overflow-hidden pb-[0.05em]">
        <motion.span className="block" {...rise(0.12)}>
          {lineA}
        </motion.span>
      </span>
      <span aria-hidden="true" className="block overflow-hidden pb-[0.12em]">
        <motion.span className="block" {...rise(0.26)}>
          {lineB}
        </motion.span>
      </span>
    </h1>
  );
}
