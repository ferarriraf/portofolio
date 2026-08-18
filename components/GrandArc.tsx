"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * De grands arcs de cercle qui débordent du cadre : le motif de
 * l'anneau, agrandi jusqu'à ne montrer que sa courbe. Parallaxe
 * douce au scroll, satellites en orbite lente.
 */
export default function GrandArc({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, 120]);

  return (
    <motion.div
      style={reduce ? undefined : { y }}
      className={className}
      aria-hidden="true"
    >
      <svg viewBox="0 0 800 800" fill="none" className="h-full w-full">
        <circle
          cx="400"
          cy="400"
          r="362"
          stroke="var(--terra-strong)"
          strokeWidth="2.5"
        />
        <g className="ring-rotor" style={{ "--spin": "70s" } as never}>
          <circle
            cx="400"
            cy="400"
            r="320"
            stroke="var(--sage-strong)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="3 18"
          />
          <circle cx="400" cy="80" r="8" fill="var(--terra-strong)" />
        </g>
        <circle
          cx="400"
          cy="400"
          r="248"
          stroke="var(--terra)"
          strokeOpacity="0.6"
          strokeWidth="1.6"
        />
        <g
          className="ring-rotor ring-rotor--reverse"
          style={{ "--spin": "48s" } as never}
        >
          <circle cx="400" cy="400" r="248" stroke="transparent" strokeWidth="1" />
          <circle cx="400" cy="152" r="5.5" fill="var(--sage-deep)" />
        </g>
      </svg>
    </motion.div>
  );
}
