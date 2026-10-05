"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Pause, Play } from "lucide-react";

export type MarqueeItem = { label: string; href: string };

/**
 * Le bandeau défilant du pied de page : la liste de ce qu'on peut
 * commander, chaque mot renvoyant à son offre. C'est la seule
 * animation en boucle du site. Elle ne s'arrête pas au survol (on la
 * traversait sans intention et la page semblait plantée) ; elle
 * s'arrête par son bouton, atteignable au doigt et au clavier
 * (WCAG 2.2.2). Ne pas retirer le bouton sans retirer l'animation.
 */
export default function Marquee({ items }: { items: MarqueeItem[] }) {
  const t = useTranslations("footer");
  const [enPause, setEnPause] = useState(false);

  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={i} className="flex items-center font-display text-xl font-semibold tracking-tight md:text-2xl">
          <a
            href={item.href}
            tabIndex={hidden ? -1 : undefined}
            className="px-5 text-sand/85 transition-colors duration-200 hover:text-sand md:px-7"
          >
            {item.label}
          </a>
          <span aria-hidden="true" className="size-1.5 rounded-full bg-terra-hot" />
        </li>
      ))}
    </ul>
  );

  return (
    <nav
      aria-label={t("marqueeLabel")}
      data-pause={enPause ? "true" : undefined}
      className="marquee-slot relative overflow-hidden border-y border-black/40 py-4 md:py-5"
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-ink-deep to-transparent md:w-24" />
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-ink-deep to-transparent md:w-32" />
      {/* Quatre répétitions : la piste se décale de la moitié de sa
          largeur, et ce qui reste à droite doit couvrir tout l'écran
          jusqu'à 4 000 px. */}
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
        {row(true)}
        {row(true)}
      </div>
      <button
        type="button"
        onClick={() => setEnPause((p) => !p)}
        aria-pressed={enPause}
        aria-label={enPause ? t("marqueeLecture") : t("marqueePause")}
        className="press absolute top-1/2 right-3 z-20 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-sand/10 text-sand/80 transition-colors duration-200 hover:bg-sand/20 hover:text-sand motion-reduce:hidden md:right-5"
      >
        {enPause ? <Play className="size-3.5" aria-hidden="true" /> : <Pause className="size-3.5" aria-hidden="true" />}
      </button>
    </nav>
  );
}
