"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

/**
 * La fiche technique du studio : les faits, rien d'autre — et une
 * horloge qui tourne pour rappeler qu'il y a quelqu'un derrière.
 * L'heure n'est affichée qu'après le montage : la calculer au serveur
 * donnerait un affichage faux le temps de l'hydratation.
 */
export default function StudioCard() {
  const t = useTranslations("about.card");
  const locale = useLocale();
  const [heure, setHeure] = useState<string | null>(null);

  useEffect(() => {
    const tic = () =>
      setHeure(
        new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Europe/Paris",
          hour12: false,
        }).format(new Date())
      );
    tic();
    const id = setInterval(tic, 1000);
    return () => clearInterval(id);
  }, [locale]);

  const lignes = [
    { cle: t("basedLabel"), valeur: t("basedValue") },
    { cle: t("sinceLabel"), valeur: t("sinceValue") },
    { cle: t("langLabel"), valeur: t("langValue") },
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-sand-card">
      {/* L'en-tête : l'heure locale du studio */}
      <div className="flex items-center justify-between border-b border-line bg-sand px-6 py-4">
        <span className="font-mono text-[0.62rem] font-semibold tracking-[0.16em] text-ink-soft uppercase">
          {t("title")}
        </span>
        <span className="font-mono text-sm tabular-nums text-ink">
          {heure ?? "--:--:--"}
        </span>
      </div>

      <dl className="divide-y divide-line">
        {lignes.map((l) => (
          <div key={l.cle} className="flex items-baseline justify-between gap-6 px-6 py-4">
            <dt className="font-mono text-[0.62rem] tracking-[0.14em] text-ink-soft uppercase">
              {l.cle}
            </dt>
            <dd className="text-right font-display text-lg font-bold text-ink">
              {l.valeur}
            </dd>
          </div>
        ))}
      </dl>

      {/* La disponibilité, avec son témoin */}
      <div className="flex items-center gap-3 border-t border-line bg-sage-wash px-6 py-4">
        <span className="relative flex size-2.5 shrink-0" aria-hidden="true">
          <span className="ring-pulse absolute inset-0 rounded-full border border-sage-deep" />
          <span className="size-2.5 rounded-full bg-sage-deep" />
        </span>
        <span className="text-sm font-semibold text-sage-deep">
          {t("availability")}
        </span>
      </div>
    </div>
  );
}
