"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Pause, Play } from "lucide-react";

type MarqueeProps = {
  items: string[];
  className?: string;
};

/**
 * Bandeau défilant : les mots du métier, alternant plein et contour.
 *
 * Il ne s'arrête PLUS au passage de la souris. C'était un bon réflexe
 * d'ergonomie sur le papier, mais à l'usage il donne l'impression que
 * la page a planté : on traverse la bande sans intention, elle se fige,
 * on ne comprend pas pourquoi.
 *
 * En échange il fallait une vraie commande : une animation infinie sans
 * aucun moyen de l'arrêter est un échec du critère WCAG 2.2.2, niveau A
 * — et au doigt comme au clavier, le survol n'existe pas. Le bouton la
 * remplace : il fonctionne partout, il est atteignable au clavier, et
 * il ne se déclenche que si on le veut.
 */
export default function Marquee({ items, className }: MarqueeProps) {
  const t = useTranslations("footer");
  const [enPause, setEnPause] = useState(false);

  const row = (hidden: boolean) => (
    <ul
      className="flex shrink-0 items-center"
      aria-hidden={hidden || undefined}
    >
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-center font-display text-3xl font-bold tracking-tight md:text-5xl"
        >
          <span
            className={`px-6 md:px-9 ${
              ["text-sand", "text-terra", "text-sage"][i % 3]
            }`}
          >
            {item}
          </span>
          <span
            aria-hidden="true"
            className={`size-2.5 rounded-full md:size-3 ${
              i % 2 ? "bg-sage" : "bg-terra"
            }`}
          />
        </li>
      ))}
    </ul>
  );

  return (
    // Une fente usinée dans la page : gorge en creux, bords qui
    // avalent les mots — cousine de la fente disquette du Mac.
    <div
      data-pause={enPause ? "true" : undefined}
      className={`marquee-slot relative overflow-hidden bg-ink-deep py-5 shadow-[inset_0_10px_16px_-10px_rgba(0,0,0,0.7),inset_0_-10px_16px_-10px_rgba(0,0,0,0.6)] md:py-6 ${className ?? ""}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink-deep to-transparent md:w-28"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink-deep to-transparent md:w-28"
      />
      {/* QUATRE répétitions, pas deux.
          La piste se décale de la moitié de sa largeur, puis repart :
          l'illusion ne tient que si ce qui reste à droite couvre encore
          tout l'écran. Avec deux répétitions, il faut qu'UNE seule soit
          plus large que la fenêtre — vrai sur un portable, faux sur un
          grand écran, où l'on voyait la bande finir puis recommencer.
          Avec quatre, la marge couvre les écrans jusqu'à 4 000 px. */}
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
        {row(true)}
        {row(true)}
      </div>

      {/* La commande d'arrêt. Discrète, posée dans le dégradé de droite
          qui avale déjà les mots — elle ne recouvre donc jamais un mot
          lisible. Masquée quand le visiteur a demandé moins de
          mouvement : le bandeau est alors immobile, il n'y a rien à
          mettre en pause. */}
      <button
        type="button"
        onClick={() => setEnPause((p) => !p)}
        aria-pressed={enPause}
        aria-label={enPause ? t("marqueeLecture") : t("marqueePause")}
        className="press absolute top-1/2 right-3 z-20 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-sand/10 text-sand/70 transition-colors duration-200 hover:bg-sand/20 hover:text-sand motion-reduce:hidden md:right-5"
      >
        {enPause ? (
          <Play className="size-3.5" aria-hidden="true" />
        ) : (
          <Pause className="size-3.5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
