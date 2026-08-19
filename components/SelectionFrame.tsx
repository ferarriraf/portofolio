"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

type SelectionFrameProps = {
  children: ReactNode;
  /** Étiquette affichée sur le cadre, façon calque sélectionné */
  label: string;
  className?: string;
};

/**
 * Le titre mis en scène comme un calque sélectionné dans un éditeur
 * d'interface : cadre en pointillés, poignées de redimensionnement,
 * étiquette de calque. Le métier de R-X, montré au lieu d'être dit.
 */
export default function SelectionFrame({
  children,
  label,
  className,
}: SelectionFrameProps) {
  const reduce = useReducedMotion();

  const cadre = reduce
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, scale: 0.985 },
        animate: { opacity: 1, scale: 1 },
        transition: {
          duration: 0.7,
          delay: 0.75,
          ease: [0.22, 1, 0.36, 1] as const,
        },
      };

  const poignee = (i: number) =>
    reduce
      ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, scale: 0.3 },
          animate: { opacity: 1, scale: 1 },
          transition: {
            duration: 0.35,
            delay: 1.15 + i * 0.06,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  const coins = [
    "-top-1.5 -left-1.5",
    "-top-1.5 -right-1.5",
    "-bottom-1.5 -left-1.5",
    "-bottom-1.5 -right-1.5",
  ];

  return (
    <div className={`relative inline-block ${className ?? ""}`}>
      {children}

      {/* Le cadre de sélection */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-5 -inset-y-3 rounded-[3px] border border-terra-hot md:-inset-x-8 md:-inset-y-4"
        {...cadre}
      >
        {coins.map((pos, i) => (
          <motion.span
            key={pos}
            className={`absolute ${pos} size-3 rounded-[2px] border-[1.5px] border-terra-hot bg-sand-card`}
            {...poignee(i)}
          />
        ))}
      </motion.span>

      {/* L'étiquette de calque */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -top-3 -left-5 -translate-y-full rounded-[3px] bg-terra-hot px-2 py-1 font-mono text-[0.62rem] font-semibold tracking-wide text-sand-card md:-left-8"
        {...cadre}
      >
        {label}
      </motion.span>
    </div>
  );
}
