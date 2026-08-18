"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

type SplitHeadingProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
};

const tags = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
} as const;

/**
 * Grand titre qui monte d'un seul bloc depuis un masque — net et
 * rapide. Le déclencheur observe le titre entier via useInView
 * (le contenu masqué serait invisible pour un IntersectionObserver).
 */
export default function SplitHeading({
  text,
  as = "h2",
  className,
  delay = 0,
}: SplitHeadingProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  const MTag = tags[as] as typeof motion.h2;
  const shown = inView || !!reduce;

  return (
    <MTag ref={ref as never} aria-label={text} className={className}>
      <span aria-hidden="true" className="block overflow-hidden pb-[0.1em]">
        <motion.span
          className="block"
          initial={reduce ? { y: 0 } : { y: "104%" }}
          animate={{ y: shown ? 0 : "104%" }}
          transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
        >
          {text}
        </motion.span>
      </span>
    </MTag>
  );
}
