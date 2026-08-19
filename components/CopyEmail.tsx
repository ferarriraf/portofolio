"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { recomposerAdresse } from "./MailLink";

export default function CopyEmail() {
  // Recomposée à l'affichage : le code source de la page n'en porte
  // aucune trace, les aspirateurs d'adresses repartent bredouilles.
  const [email, setEmail] = useState<string | null>(null);
  const t = useTranslations("contact");
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard indisponible (vieux navigateur) : le mailto reste utilisable
    }
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-terra-wash px-8 py-14 text-center md:py-20">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-terra-deep">
        {t("emailLabel")}
      </span>
      {email ? (
        <a
          href={`mailto:${email}`}
          className="mt-5 block font-display text-[clamp(1.9rem,5.5vw,4.5rem)] font-bold tracking-tight text-ink transition-colors hover:text-terra-strong"
        >
          {email}
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
          aria-live="polite"
          className="btn btn-secondary"
        >
          {copied ? (
            <Check className="size-4 text-sage-strong" />
          ) : (
            <Copy className="size-4" />
          )}
          {copied ? t("copied") : t("copy")}
        </button>
        <a href={email ? `mailto:${email}` : undefined} className="btn btn-primary">
          <Mail className="size-4" />
          {t("mailto")}
        </a>
      </div>
      <p className="mt-7 text-sm italic text-ink-soft">{t("reply")}</p>
    </div>
  );
}
