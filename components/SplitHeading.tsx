"use client";

import { Fragment, useRef } from "react";
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
 * Révèle un titre mot par mot : chaque mot monte depuis un masque,
 * en cascade. Le déclencheur observe le titre entier via useInView
 * (les mots masqués, rognés, seraient invisibles pour un
 * IntersectionObserver). Les lecteurs d'écran lisent le texte d'un
 * bloc via aria-label.
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
  const words = text.split(" ");
  const MTag = tags[as] as typeof motion.h2;

  return (
    <MTag ref={ref as never} aria-label={text} className={className}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span
            aria-hidden="true"
            className="inline-block overflow-hidden pb-[0.09em] align-top"
          >
            <motion.span
              className="inline-block"
              initial={reduce ? { y: 0 } : { y: "115%" }}
              animate={{ y: inView || reduce ? 0 : "115%" }}
              transition={{
                duration: 0.65,
                delay: delay + i * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}
            </motion.span>
          </span>
          {/* L'espace vit entre les masques : dedans, elle serait avalée */}
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </MTag>
  );
}
