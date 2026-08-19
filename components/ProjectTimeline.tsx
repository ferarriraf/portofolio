"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

type Etape = { quand: string; moi: string; client: string };

/**
 * Le déroulé d'un projet : un rail vertical qui se trace au fil de la
 * lecture (avec un léger retard de ressort, comme un trait qui suit la
 * main) et des jalons qui s'allument au passage. « Réduire les
 * animations » : rail plein et jalons posés d'emblée.
 */
export default function ProjectTimeline({
  etapes,
  youLabel,
}: {
  etapes: Etape[];
  youLabel: string;
}) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.45"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.4,
  });

  return (
    <ol ref={ref} className="relative mt-10 border-t border-line pl-7 md:pl-10">
      {/* La gorge du rail, et son remplissage qui suit la lecture */}
      <span
        aria-hidden="true"
        className="absolute top-0 bottom-0 left-[5px] w-px bg-line"
      />
      <motion.span
        aria-hidden="true"
        className="absolute top-0 bottom-0 left-[5px] w-px origin-top bg-sage-strong"
        style={{ scaleY: reduce ? 1 : scaleY }}
      />
      {etapes.map((etape) => (
        <li
          key={etape.quand}
          className="group relative grid gap-2 border-b border-line py-6 md:grid-cols-[9rem_1fr_1fr] md:items-baseline md:gap-8"
        >
          {/* Le jalon : il se pose en entrant dans le viewport */}
          <motion.span
            aria-hidden="true"
            className="absolute top-[1.9rem] -left-7 block size-[11px] rounded-full border-2 border-sage-strong bg-sand motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-125 md:-left-10"
            initial={reduce ? false : { scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: "-15% 0px -35% 0px" }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          />
          <span className="font-mono text-xs tracking-[0.14em] text-terra-deep uppercase">
            {etape.quand}
          </span>
          <p className="font-display text-lg font-bold text-ink motion-safe:transition-transform motion-safe:duration-300 md:group-hover:translate-x-1">
            {etape.moi}
          </p>
          <p className="leading-relaxed text-ink-soft">
            <span className="mr-2 font-mono text-[0.65rem] tracking-wide text-sage-deep uppercase">
              {youLabel}
            </span>
            {etape.client}
          </p>
        </li>
      ))}
    </ol>
  );
}
