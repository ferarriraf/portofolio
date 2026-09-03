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
  ombre = true,
}: {
  children: ReactNode;
  /**
   * La mise sous tension, de 0 à 1. Elle pilote tout : le voile noir qui
   * se rétracte, le flash de la ligne blanche, le faisceau qui écrit
   * l'image, et le témoin d'activité. Absente, l'écran est simplement
   * allumé et la machine reste immobile — elle ne fait jamais semblant
   * de travailler.
   */
  power?: MotionValue<number>;
  /** false : l'ombre au sol est dessinée par le parent (poste qui pivote) */
  ombre?: boolean;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[31rem]">
      {/* Ombre portée au sol */}
      {ombre && (
        <div
          aria-hidden="true"
          className="absolute inset-x-8 -bottom-1 h-7 rounded-[50%] bg-ink/30 blur-lg"
        />
      )}

      {/* Boîtier */}
      <div className="poste-carter relative rounded-[1.25rem_1.25rem_0.45rem_0.45rem] p-[5%] pb-[3%]">
        {/* Creux dans lequel la dalle est encastrée */}
        <div className="poste-creux rounded-[0.5rem] p-[3%]">
          <div className="relative overflow-hidden rounded-[0.2rem] bg-ink-deep shadow-[inset_0_0_0_2px_#1c1f18,inset_0_0_34px_rgba(0,0,0,0.85)] [container-type:inline-size]">
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
              {/* Le balayage du tube. Il ne tourne pas en boucle : il
                  traverse la dalle UNE fois, pendant l'allumage, et
                  s'éteint dès que l'image est écrite. */}
              {power && <Faisceau power={power} />}

              {power && <PowerOn power={power} />}
            </div>
          </div>
        </div>

        {/* Le menton : marque estampée, aérations creusées, témoin percé.
            Les aérations étaient trente <span> d'un pixel à 60 %
            d'opacité — à toute taille ça faisait une palissade. Un
            dégradé répété donne la même chose en un nœud, et surtout il
            a une LÈVRE éclairée sous chaque rainure : une fente creusée
            plutôt qu'un trait peint. */}
        <div className="mt-[4%] flex items-center gap-[4%] px-[2%]">
          <span className="poste-marque font-display text-[0.6rem] font-bold tracking-[0.22em] uppercase">
            R-X
          </span>
          <span aria-hidden="true" className="poste-grille ml-auto h-[7px] w-[34%]" />
          {/* Le témoin, au fond d'un puits percé. Un point plein qui ne
              bouge pas, et un halo qui ne s'allume que pendant
              l'écriture — deux couches superposées plutôt qu'une ombre
              interpolée, qui repeindrait à chaque image. */}
          <span aria-hidden="true" className="poste-puits relative shrink-0">
            <span className="poste-diode" />
            {power && <Temoin power={power} />}
          </span>
        </div>

        {/* La fente 3,5" : un vrai creux, avec sa lèvre éclairée dessous. */}
        <div className="mt-[3%] flex justify-center">
          <span aria-hidden="true" className="poste-fente h-[6px] w-[42%]" />
        </div>
      </div>

      {/* Le pied, évasé et non un rectangle : une pièce moulée s'assied
          plus large qu'elle ne se tient. */}
      <div aria-hidden="true" className="poste-pied mx-auto h-[13px] w-[44%]" />
    </div>
  );
}

/**
 * La bande lumineuse qui écrit l'image.
 *
 * Elle fait 9 % de la hauteur de la dalle : pour la traverser
 * entièrement il faut aller de -100 % (juste au-dessus) à 1011 %,
 * soit (100 - 9) / 9 — sans quoi elle s'arrêterait en chemin.
 */
function Faisceau({ power }: { power: MotionValue<number> }) {
  const y = useTransform(power, [0, 1], ["-100%", "1011%"]);
  // Il s'allume en entrant, s'éteint en sortant : on ne voit jamais la
  // bande apparaître ou disparaître au milieu de la dalle.
  const opacite = useTransform(power, [0, 0.12, 0.88, 1], [0, 0.5, 0.5, 0]);

  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[9%]"
      style={{
        y,
        opacity: opacite,
        background:
          "linear-gradient(to bottom, transparent, rgba(255,255,255,0.16), transparent)",
      }}
    />
  );
}

/** Le témoin d'activité : un halo qui ne s'allume que pendant l'écriture. */
function Temoin({ power }: { power: MotionValue<number> }) {
  const opacite = useTransform(power, [0, 0.15, 0.9, 1], [0, 1, 1, 0.25]);
  return (
    <motion.span
      className="absolute -inset-[3px] rounded-full bg-terra-hot blur-[3px]"
      style={{ opacity: opacite }}
    />
  );
}

/** Mise sous tension : le noir se rétracte, une ligne blanche flashe. */
function PowerOn({ power }: { power: MotionValue<number> }) {
  const voile = useTransform(power, [0, 0.55, 1], [1, 0.8, 0]);
  const flash = useTransform(power, [0, 0.3, 0.6, 1], [0, 0.95, 0.7, 0]);
  const ligne = useTransform(power, [0, 0.3, 1], [0.06, 1, 1]);

  return (
    <>
      {/* data-voile : sans JavaScript, ce voile est servi OPAQUE et les
          cinq écrans du poste resteraient noirs. Le bloc <noscript> du
          layout le lève. */}
      <motion.span
        aria-hidden="true"
        data-voile
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
