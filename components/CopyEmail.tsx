"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Copy, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { recomposerAdresse } from "./MailLink";
import Recu from "./Recu";

export default function CopyEmail() {
  // Recomposée à l'affichage : le code source de la page n'en porte
  // aucune trace, les aspirateurs d'adresses repartent bredouilles.
  const [email, setEmail] = useState<string | null>(null);
  const t = useTranslations("contact");
  const [copied, setCopied] = useState(false);
  // Compte les copies reussies : c'est ce qui rejoue l'eclat du recu
  // meme quand le visiteur copie deux fois de suite.
  const [copies, setCopies] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    // différé : composer l'adresse en pleine phase d'effet
    // déclencherait un rendu en cascade
    const t = setTimeout(() => setEmail(recomposerAdresse()), 0);
    return () => {
      clearTimeout(t);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setCopies((n) => n + 1);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard indisponible (vieux navigateur) : le mailto reste utilisable
    }
  }

  // Pendant la copie, l'adresse se surligne dans la couleur ::selection
  // du site — l'interface raconte le Ctrl+C qu'elle vient de faire
  const surlignage = copied && !reduce && (
    <motion.span
      aria-hidden="true"
      className="absolute -inset-x-[0.12em] inset-y-[0.06em] -z-10 origin-left rounded-[0.15em] bg-terra-soft"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    />
  );

  return (
    <div className="relative overflow-hidden rounded-3xl border border-terra-soft bg-terra-wash px-8 py-14 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_28px_60px_-34px_rgba(143,61,28,0.35)] md:py-20">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-terra-deep">
        {t("emailLabel")}
      </span>
      {email ? (
        <a
          href={`mailto:${email}`}
          className="mt-5 block font-display text-[clamp(1.9rem,5.5vw,4.5rem)] font-bold tracking-tight text-ink transition-colors hover:text-terra-strong"
        >
          <span className="relative isolate inline-block">
            <AnimatePresence>{surlignage}</AnimatePresence>
            {email}
          </span>
        </a>
      ) : (
        <span className="mt-5 block font-display text-[clamp(1.9rem,5.5vw,4.5rem)] font-bold tracking-tight text-ink">
          contact [chez] r-x.fr
        </span>
      )}
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={copy}
          className="btn btn-secondary"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? "ok" : "copy"}
              className="inline-flex"
              initial={reduce ? false : { scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduce ? undefined : { scale: 0.4, opacity: 0 }}
              transition={{ type: "spring", stiffness: 600, damping: 22 }}
            >
              {copied ? (
                <Check className="size-4 text-sage-strong" />
              ) : (
                <Copy className="size-4" />
              )}
            </motion.span>
          </AnimatePresence>
          {copied ? t("copied") : t("copy")}
        </button>
        <a href={email ? `mailto:${email}` : undefined} className="btn btn-primary">
          <Mail className="size-4" />
          {t("mailto")}
        </a>
      </div>
      {/* Le detail dont R-X est le plus fier — l'adresse jamais ecrite
          dans le HTML servi — cesse d'etre invisible exactement a la
          seconde ou le visiteur s'en sert. */}
      {copies > 0 && (
        <Recu signature={copies} className="mt-6 text-center">
          {t("recuCopie")}
        </Recu>
      )}

      <p className="mt-7 text-sm italic text-ink-soft">{t("reply")}</p>
    </div>
  );
}
