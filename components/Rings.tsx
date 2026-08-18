"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

type RingsProps = {
  centerLabel: string;
  className?: string;
};

/**
 * Signature visuelle du site : un système d'anneaux concentriques
 * en rotation lente autour d'un point central — l'utilisateur.
 * Les rotations tournent en CSS (compositor), l'entrée et la
 * parallaxe souris passent par framer-motion.
 */
export default function Rings({ centerLabel, className }: RingsProps) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 40, damping: 14 });
  const y = useSpring(my, { stiffness: 40, damping: 14 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      mx.set(nx * 18);
      my.set(ny * 14);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my, reduce]);

  const entrance = (i: number) =>
    reduce
      ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, scale: 0.82 },
          animate: { opacity: 1, scale: 1 },
          transition: {
            duration: 1.1,
            delay: 0.12 * i,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  return (
    <motion.div style={{ x, y }} className={className} aria-hidden="true">
      <svg
        viewBox="0 0 600 600"
        fill="none"
        className="h-full w-full select-none"
      >
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--terra)" />
            <stop offset="100%" stopColor="var(--sage)" />
          </linearGradient>
        </defs>

        {/* Anneau-guide extérieur, fin et immobile */}
        <motion.g {...entrance(0)} style={{ transformOrigin: "300px 300px" }}>
          <circle
            cx="300"
            cy="300"
            r="272"
            stroke="var(--line)"
            strokeWidth="1"
          />
        </motion.g>

        {/* Anneau pointillé terracotta + son satellite */}
        <motion.g {...entrance(1)} style={{ transformOrigin: "300px 300px" }}>
          <g className="ring-rotor" style={{ "--spin": "85s" } as never}>
            <circle
              cx="300"
              cy="300"
              r="226"
              stroke="var(--terra)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="2 14"
            />
            <circle cx="300" cy="74" r="6" fill="var(--terra-strong)" />
          </g>
        </motion.g>

        {/* Bande sauge épaisse, très douce */}
        <motion.g {...entrance(2)} style={{ transformOrigin: "300px 300px" }}>
          <circle
            cx="300"
            cy="300"
            r="182"
            stroke="var(--sage)"
            strokeOpacity="0.28"
            strokeWidth="30"
          />
          <g
            className="ring-rotor ring-rotor--reverse"
            style={{ "--spin": "60s" } as never}
          >
            <circle
              cx="300"
              cy="300"
              r="182"
              stroke="transparent"
              strokeWidth="1"
            />
            <circle cx="300" cy="118" r="7" fill="var(--sage-strong)" />
            <circle cx="482" cy="300" r="4" fill="var(--sage-strong)" />
          </g>
        </motion.g>

        {/* Arc dégradé, rotation plus vive */}
        <motion.g {...entrance(3)} style={{ transformOrigin: "300px 300px" }}>
          <g className="ring-rotor" style={{ "--spin": "26s" } as never}>
            <circle
              cx="300"
              cy="300"
              r="138"
              stroke="url(#ring-grad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="216 651"
            />
          </g>
        </motion.g>

        {/* Anneau intérieur fin + satellite encre */}
        <motion.g {...entrance(4)} style={{ transformOrigin: "300px 300px" }}>
          <circle
            cx="300"
            cy="300"
            r="96"
            stroke="var(--line)"
            strokeWidth="1"
          />
          <g
            className="ring-rotor ring-rotor--reverse"
            style={{ "--spin": "40s" } as never}
          >
            <circle
              cx="300"
              cy="300"
              r="96"
              stroke="transparent"
              strokeWidth="1"
            />
            <circle cx="300" cy="204" r="4" fill="var(--ink)" />
          </g>
        </motion.g>

        {/* Le centre : l'utilisateur */}
        <motion.g {...entrance(5)} style={{ transformOrigin: "300px 300px" }}>
          <circle
            className="ring-pulse"
            cx="300"
            cy="300"
            r="16"
            stroke="var(--terra-strong)"
            strokeWidth="1.5"
          />
          <circle cx="300" cy="300" r="8" fill="var(--terra-strong)" />
          <text
            x="300"
            y="336"
            textAnchor="middle"
            fill="var(--ink-soft)"
            fontSize="13"
            fontStyle="italic"
            fontFamily="var(--font-body), system-ui, sans-serif"
          >
            {centerLabel}
          </text>
        </motion.g>
      </svg>
    </motion.div>
  );
}
