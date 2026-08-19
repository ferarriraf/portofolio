"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const CLE = "rx-cookie-notice";

/**
 * Le site ne dépose rien : ce n'est donc pas un consentement, c'est
 * une déclaration. Un seul bouton, pas de choix piégeux, et la
 * mémoire du clic tient dans localStorage — pas dans un cookie.
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
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-4 z-[90] w-[min(23rem,calc(100vw-2rem))] rounded-2xl bg-ink-deep p-5 text-sand inset-shadow-cisele-sombre shadow-elev-4"
        >
          <p className="flex items-center gap-2 font-display text-base font-bold">
            <span
              aria-hidden="true"
              className="inline-block size-2 rounded-full bg-sage"
            />
            {t("title")}
          </p>
          <p className="mt-2.5 text-sm leading-relaxed text-sand/75">
            {t("text")}
          </p>
          <div className="mt-4 flex items-center gap-4">
            <button
              type="button"
              onClick={fermer}
              className="rounded-full bg-sand px-4 py-2 text-sm font-semibold text-ink-deep transition-colors hover:bg-terra-hot hover:text-sand"
            >
              {t("button")}
            </button>
            <Link
              href="/mentions-legales"
              className="hit-area text-xs font-medium text-sand/60 transition-colors hover:text-sand"
            >
              {t("more")}
            </Link>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
