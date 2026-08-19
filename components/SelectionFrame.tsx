"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

type SelectionFrameProps = {
  children: ReactNode;
  /**
   * Étiquette de calque : réservée au mode inspection, elle parlerait
   * surtout aux gens du métier.
   */
  label?: string;
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

  // Les calques fantômes glissent vers leur décalage de repos après
  // l'arrivée du cadre ; au survol, la pile s'évente un peu plus
  const calque = (decalage: number, delay: number) =>
    reduce
      ? {
          initial: { opacity: 1, x: decalage, y: decalage },
          animate: { opacity: 1, x: decalage, y: decalage },
        }
      : {
          initial: { opacity: 0, x: 0, y: 0 },
          animate: { opacity: 1, x: decalage, y: decalage },
          transition: {
            duration: 0.5,
            delay,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  return (
    <div className={`group/sel relative isolate inline-block ${className ?? ""}`}>
      {/* La pile : le titre est physiquement le calque du dessus */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-5 -inset-y-3 -z-10 md:-inset-x-8 md:-inset-y-4"
        {...calque(14, 1.0)}
      >
        <span className="absolute inset-0 rounded-[3px] border border-line/55 transition-transform duration-500 ease-out group-hover/sel:translate-x-[5px] group-hover/sel:translate-y-[5px] motion-reduce:transition-none motion-reduce:group-hover/sel:translate-x-0 motion-reduce:group-hover/sel:translate-y-0" />
      </motion.span>
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-5 -inset-y-3 -z-10 md:-inset-x-8 md:-inset-y-4"
        {...calque(7, 1.1)}
      >
        <span className="absolute inset-0 rounded-[3px] border border-line transition-transform duration-500 ease-out group-hover/sel:translate-x-[3px] group-hover/sel:translate-y-[3px] motion-reduce:transition-none motion-reduce:group-hover/sel:translate-x-0 motion-reduce:group-hover/sel:translate-y-0" />
      </motion.span>

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

      {/* L'étiquette de calque : visible seulement en mode inspection */}
      {label && (
        <span
          aria-hidden="true"
          className="etiquette-calque pointer-events-none absolute -top-3 -left-5 -translate-y-full rounded-[3px] bg-terra-hot px-2 py-1 font-mono text-[0.62rem] font-semibold tracking-wide text-sand-card md:-left-8"
        >
          {label}
        </span>
      )}
    </div>
  );
}
