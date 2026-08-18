"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CopyEmail({ email }: { email: string }) {
  const t = useTranslations("contact");
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
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
    <div className="relative overflow-hidden rounded-3xl border border-line bg-sand-card px-8 py-14 text-center md:py-16">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
        {t("emailLabel")}
      </span>
      <a
        href={`mailto:${email}`}
        className="mt-4 block font-display text-3xl font-bold tracking-tight text-ink transition-colors hover:text-sage-deep md:text-5xl"
      >
        {email}
      </a>
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
        <a href={`mailto:${email}`} className="btn btn-primary">
          <Mail className="size-4" />
          {t("mailto")}
        </a>
      </div>
      <p className="mt-7 text-sm italic text-ink-soft">{t("reply")}</p>
    </div>
  );
}
