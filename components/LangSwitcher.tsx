"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

/**
 * FR / EN en lettres. Pas de drapeaux : un drapeau désigne un pays, pas
 * une langue, et c'étaient les seules couleurs saturées hors palette.
 */
export default function LangSwitcher({
  onNavigate,
}: {
  /** Appelé au clic (ex. refermer le menu mobile) */
  onNavigate?: () => void;
} = {}) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("lang");

  const options = [
    { code: "fr" as const, short: "FR", full: t("fr") },
    { code: "en" as const, short: "EN", full: t("en") },
  ];

  return (
    <nav aria-label={t("label")} className="inline-flex items-center gap-1 text-[0.8rem] font-semibold tracking-[0.08em]">
      {options.map((o, i) => {
        const active = o.code === locale;
        return (
          <span key={o.code} className="inline-flex items-center gap-1">
            {i > 0 && <span aria-hidden="true" className="text-[var(--nav-texte-doux,var(--ink-soft))]">/</span>}
            <Link
              href={pathname}
              locale={o.code}
              aria-current={active ? "true" : undefined}
              onClick={onNavigate}
              aria-label={o.full}
              className={`px-1.5 py-2 transition-colors duration-200 ${
                active
                  ? "text-[var(--nav-texte,var(--ink))]"
                  : "text-[var(--nav-texte-doux,var(--ink-soft))] hover:text-[var(--nav-texte,var(--ink))]"
              }`}
            >
              {o.short}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
