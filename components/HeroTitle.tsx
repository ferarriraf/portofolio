"use client";

import { motion, useReducedMotion } from "framer-motion";
import RingWord from "./RingWord";

type HeroTitleProps = {
  lineA: string;
  lineB: string;
  caption: string;
};

/** Titre géant du hero : deux lignes qui montent depuis un masque. */
export default function HeroTitle({ lineA, lineB, caption }: HeroTitleProps) {
  const reduce = useReducedMotion();

  const rise = (delay: number) => ({
    initial: reduce ? { y: 0 } : { y: "108%" },
    animate: { y: 0 },
    transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <h1
      aria-label={`${lineA} ${lineB}`}
      className="mt-7 font-display text-[clamp(3.4rem,10.5vw,9rem)] font-bold leading-[0.98] tracking-tight text-ink"
    >
      <span aria-hidden="true" className="block overflow-hidden pb-[0.05em]">
        <motion.span className="block" {...rise(0.12)}>
          {lineA}
        </motion.span>
      </span>
      <span aria-hidden="true" className="relative block w-fit">
        <span className="block overflow-hidden pb-[0.14em]">
          <motion.span className="block" {...rise(0.26)}>
            <RingWord>{lineB}</RingWord>
          </motion.span>
        </span>
        {/* La légende vit hors du masque pour ne pas être rognée */}
        <motion.span
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.75, duration: 0.5 }}
          className="absolute top-full right-0 mt-1 inline-flex items-center gap-2 text-base font-medium italic tracking-normal text-terra-strong md:mt-2 md:text-lg"
          style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }}
        >
          <span className="relative flex size-2.5" aria-hidden="true">
            <span className="ring-pulse absolute inset-0 rounded-full border border-terra-strong" />
            <span className="size-2.5 rounded-full bg-terra-strong" />
          </span>
          {caption}
        </motion.span>
      </span>
    </h1>
  );
}
