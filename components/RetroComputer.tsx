"use client";

import type { ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";

/**
 * Un ordinateur de bureau beige des années 90 : boîtier moulé,
 * dalle bombée encastrée, aérations, fente de disquette. L'écran
 * s'allume au scroll (flash de mise sous tension d'un tube
 * cathodique) et affiche les étapes de la méthode.
 */
export default function RetroComputer({
  children,
  power,
}: {
  children: ReactNode;
  /** 0 = éteint, 1 = allumé. Absent : l'écran est allumé d'emblée. */
  power?: MotionValue<number>;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[31rem]">
      {/* Ombre portée au sol */}
      <div
        aria-hidden="true"
        className="absolute inset-x-8 -bottom-1 h-7 rounded-[50%] bg-ink/30 blur-lg"
      />

      {/* Boîtier */}
      <div className="relative rounded-t-[2.4rem] rounded-b-[1.1rem] bg-[linear-gradient(150deg,#f4ecdc_0%,#e5d9c2_45%,#cdbea3_100%)] p-[6%] pb-[3.5%] shadow-[0_30px_60px_-28px_rgba(46,52,40,0.55),inset_0_2px_0_rgba(255,255,255,0.8),inset_0_-3px_10px_rgba(120,105,80,0.3)]">
        {/* Creux dans lequel la dalle est encastrée */}
        <div className="rounded-[1.5rem] bg-[linear-gradient(160deg,#c9ba9e,#e2d7bf)] p-[3.5%] shadow-[inset_0_3px_9px_rgba(90,78,58,0.45)]">
          <div className="relative overflow-hidden rounded-[1rem] bg-ink-deep shadow-[inset_0_0_0_3px_#2b2f26,inset_0_0_30px_rgba(0,0,0,0.9)]">
            <div className="relative aspect-[4/3]">
              {children}

              {/* Lignes de balayage */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-30 opacity-[0.15] mix-blend-multiply"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, rgba(0,0,0,0.9) 0 1px, transparent 1px 3px)",
                }}
              />
              {/* Vignettage du tube */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-30"
                style={{
                  background:
                    "radial-gradient(122% 100% at 50% 45%, transparent 54%, rgba(0,0,0,0.45) 100%)",
                }}
              />
              {/* Reflet de verre */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-30"
                style={{
                  background:
                    "linear-gradient(122deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 26%, transparent 46%)",
                }}
              />

              {power && <PowerOn power={power} />}
            </div>
          </div>
        </div>

        {/* Bandeau sous l'écran : marque, aérations, témoin */}
        <div className="mt-[4.5%] flex items-center gap-[4%] px-[2%]">
          <span className="font-display text-[0.6rem] font-bold tracking-[0.22em] text-[#8d7f66] uppercase">
            R-X
          </span>
          <span
            aria-hidden="true"
            className="flex h-2.5 flex-1 items-center gap-[3px] overflow-hidden opacity-60"
          >
            {Array.from({ length: 30 }).map((_, i) => (
              <span
                key={i}
                className="h-full w-px shrink-0 rounded-full bg-[#a2937a]"
              />
            ))}
          </span>
          <span
            aria-hidden="true"
            className="size-2 rounded-full bg-sage-strong shadow-[0_0_7px_rgba(110,138,98,0.95)]"
          />
        </div>

        {/* Fente du lecteur de disquette */}
        <div className="mt-[3.5%] flex justify-center">
          <span
            aria-hidden="true"
            className="h-2 w-[46%] rounded-full bg-[#b4a68c] shadow-[inset_0_2px_4px_rgba(80,70,52,0.8)]"
          />
        </div>
      </div>

      {/* Socle */}
      <div
        aria-hidden="true"
        className="mx-auto h-2 w-[76%] rounded-b-xl bg-[linear-gradient(180deg,#c6b79b,#a3947b)]"
      />
    </div>
  );
}

/** Mise sous tension : le noir se rétracte, une ligne blanche flashe. */
function PowerOn({ power }: { power: MotionValue<number> }) {
  const voile = useTransform(power, [0, 0.55, 1], [1, 0.8, 0]);
  const flash = useTransform(power, [0, 0.3, 0.6, 1], [0, 0.95, 0.7, 0]);
  const ligne = useTransform(power, [0, 0.3, 1], [0.06, 1, 1]);

  return (
    <>
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-40 bg-ink-deep"
        style={{ opacity: voile }}
      />
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 z-40 h-px -translate-y-1/2 bg-sand shadow-[0_0_20px_7px_rgba(246,241,230,0.9)]"
        style={{ opacity: flash, scaleX: ligne }}
      />
    </>
  );
}
