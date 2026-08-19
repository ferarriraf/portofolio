"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

const CLE = "rx-boot";

/**
 * L'arrivée sur le site : un court écran de démarrage, le logotype et
 * un trait de progression. Il ne se montre qu'une fois par session.
 *
 * Le fondu de sortie et la barre sont en CSS, pas en JavaScript :
 * l'écran doit disparaître même si l'onglet démarre en arrière-plan,
 * où les animations pilotées par frame ne tournent pas.
 */
export default function BootScreen() {
  const t = useTranslations();
  const reduce = useReducedMotion();
  // On part affiché : au premier rendu on ne sait pas encore si la
  // session a déjà vu l'écran (sessionStorage n'existe pas au serveur).
  const [etat, setEtat] = useState<"montre" | "sort" | "retire">("montre");

  useEffect(() => {
    let vu = false;
    try {
      vu = sessionStorage.getItem(CLE) === "1";
    } catch {
      vu = false;
    }

    const marquer = () => {
      try {
        sessionStorage.setItem(CLE, "1");
      } catch {
        // sans stockage de session, l'écran reviendra : sans gravité
      }
    };

    // différé : changer l'état en pleine phase d'effet
    // déclencherait un rendu en cascade
    const attente = vu || reduce ? 0 : 1250;
    const t1 = setTimeout(() => {
      setEtat("sort");
      document.documentElement.style.overflow = "";
      marquer();
    }, attente);
    const t2 = setTimeout(() => setEtat("retire"), attente + 600);

    if (attente > 0) document.documentElement.style.overflow = "hidden";

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.documentElement.style.overflow = "";
    };
  }, [reduce]);

  if (etat === "retire") return null;

  return (
    <div
      className={`fixed inset-0 z-[120] flex flex-col items-center justify-center bg-sand transition-opacity duration-500 ${
        etat === "sort" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <p className="boot-logo font-display text-5xl font-[800] tracking-[-0.05em] text-ink">
        R<span className="text-terra-hot">-</span>X
      </p>

      {/* Le trait de progression */}
      <span className="mt-6 block h-px w-40 overflow-hidden bg-ink/10">
        <span className="boot-barre block h-full origin-left bg-terra-hot" />
      </span>

      <span className="mt-4 font-mono text-[0.62rem] tracking-[0.2em] text-ink-soft/60 uppercase">
        {t("loading")}
      </span>
    </div>
  );
}
