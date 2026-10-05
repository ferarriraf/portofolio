"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { recomposerAdresse } from "./MailLink";
import Recu from "./Recu";

/**
 * L'adresse de contact, recomposée à l'affichage : le code source de la
 * page n'en porte aucune trace. Deux boutons, un reçu quand la copie a
 * réellement eu lieu. Sur papier, entre deux filets — pas une carte.
 */
export default function CopyEmail() {
  const [email, setEmail] = useState<string | null>(null);
  const t = useTranslations("contact");
  const [copied, setCopied] = useState(false);
  // Compte les copies réussies : c'est ce qui rejoue l'éclat du reçu.
  const [copies, setCopies] = useState(0);
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
      setCopies((n) => n + 1);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      // Presse-papiers indisponible : le lien mailto reste utilisable
    }
  }

  return (
    <div className="grid gap-6 border-y-2 border-ink py-10 md:grid-cols-[1fr_auto] md:items-center">
      <div>
        <p className="eyebrow">{t("emailLabel")}</p>
        {email ? (
          <a
            href={`mailto:${email}`}
            className="titre-2 mt-3 block text-ink transition-colors hover:text-terra-deep"
          >
            {email}
          </a>
        ) : (
          <span className="titre-2 mt-3 block text-ink">contact [chez] r-x.fr</span>
        )}
        <p className="mt-3 text-sm text-ink-soft">{t("reply")}</p>
        {/* Le reçu : la seule ligne qui n'apparaît que si la copie a eu lieu. */}
        <Recu signature={copies} className="mt-2">
          {copies > 0 ? t("recuCopie") : undefined}
        </Recu>
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={copy} className="btn btn-secondary">
          {copied ? <Check className="size-4 text-sage-strong" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
          {copied ? t("copied") : t("copy")}
        </button>
        <a href={email ? `mailto:${email}` : undefined} className="btn btn-primary">
          <Mail className="size-4" aria-hidden="true" />
          {t("mailto")}
        </a>
      </div>
    </div>
  );
}
