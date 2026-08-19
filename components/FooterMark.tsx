"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/**
 * Le R-X géant du pied de page, gravé dans la matière (letterpress :
 * arête de lumière dessous, ombre dessus) — il monte se caler contre
 * le filet quand on atteint le bas de page, comme une plaque qui se
 * pose. Statique si les animations sont réduites.
 */
export default function FooterMark() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [48, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.55, 1]);

  return (
    <div ref={ref}>
      <motion.p
        aria-hidden="true"
        style={reduce ? undefined : { y, opacity }}
        className="-mb-[0.09em] font-display text-[clamp(5rem,20vw,15rem)] leading-none font-bold tracking-tight text-[#1e2318] [text-shadow:0_1px_0_rgba(246,241,230,0.10),0_-1px_0_rgba(0,0,0,0.4)]"
      >
        R-X
      </motion.p>
    </div>
  );
}
