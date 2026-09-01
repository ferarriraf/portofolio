"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const CLE = "rx-cookie-notice";

/**
 * Le site ne dépose rien : ce n'est donc pas un consentement, c'est une
 * déclaration. Un seul bouton, aucun choix piégeux, et la mémoire du
 * clic tient dans localStorage — pas dans un cookie.
 *
 * POURQUOI IL EST EN PAPIER ET NON EN PAVÉ SOMBRE. La version
 * précédente était un bloc encre flottant dans un coin : elle
 * ressemblait exactement à ce qu'elle n'est pas, un mur à cookies. Or le
 * message est l'inverse — on ne dépose rien, et c'est un motif de
 * fierté. Il porte donc la matière du site : papier, arête ciselée,
 * ombre d'élévation. Il se distingue de la page par son relief, pas en
 * l'assombrissant.
 *
 * SUR TÉLÉPHONE c'est une bande ancrée au bas de l'écran, pleine
 * largeur, et non une carte à marges. Une carte flottante y volait un
 * quart de l'écran et recouvrait le bouton principal du hero ; une
 * bande posée sur l'arête basse se lit comme une barre système, se
 * chasse d'un geste, et ne prétend pas être au milieu du contenu. Le
 * rembourrage bas suit `safe-area-inset-bottom` : sans lui, le bouton
 * passe sous la barre d'accueil des iPhone.
 */
export default function CookieNotice() {
  const t = useTranslations("cookies");
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let dejaVu = false;
    try {
      dejaVu = localStorage.getItem(CLE) === "1";
    } catch {
      // navigation privée verrouillée : on affichera le bandeau
    }
    if (dejaVu) return;
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const fermer = () => {
    setVisible(false);
    try {
      localStorage.setItem(CLE, "1");
    } catch {
      // sans stockage, le bandeau reviendra : ce n'est pas grave
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          role="note"
          aria-label={t("title")}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          /* L'ombre MONTE sur téléphone. Les ombres d'élévation du site
             tombent vers le bas : sur une bande collée à l'arête basse,
             elles partent hors de l'écran et le haut du bandeau n'a plus
             que son filet pour se détacher — 1,4:1 sur le papier de la
             page, autant dire rien. Une ombre inversée pose la bande
             au-dessus du contenu au lieu de l'y fondre. Sur grand écran
             la carte flotte, l'élévation normale reprend ses droits. */
          className="fixed inset-x-0 bottom-0 z-[90] border-t border-line bg-sand-card px-5 pt-4 text-ink shadow-[0_-12px_30px_-14px_rgba(46,52,40,0.32)] inset-shadow-cisele sm:inset-x-auto sm:bottom-5 sm:left-5 sm:w-[22.5rem] sm:rounded-2xl sm:border sm:p-5 sm:shadow-elev-4"
          style={{
            paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))",
          }}
        >
          <p className="flex items-center gap-2.5 font-display text-base font-bold">
            {/* Sauge soutenue et non sauge claire : sur le papier, la
                pastille pâle disparaissait. */}
            <span
              aria-hidden="true"
              className="inline-block size-2 shrink-0 rounded-full bg-sage-strong"
            />
            {t("title")}
          </p>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-pretty text-ink-soft">
            {t("text")}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
            {/* min-h-11 = 44 px, la cible tactile minimale. L'ancien
                bouton en faisait 34 et se ratait au doigt. */}
            <button
              type="button"
              onClick={fermer}
              className="btn btn-primary press min-h-11 px-6"
            >
              {t("button")}
            </button>
            <Link
              href="/mentions-legales"
              className="hit-area text-xs font-medium text-ink-soft underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              {t("more")}
            </Link>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
