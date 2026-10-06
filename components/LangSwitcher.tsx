"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { FlagFR, FlagGB } from "./Flags";

/**
 * FR / EN avec leurs petits drapeaux : le propriétaire y tient
 * (« c'était pas mal »). La langue active est en lettres pleines, l'autre
 * en retrait ; la couleur suit la barre (papier ou encre).
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
    { code: "fr" as const, short: "FR", full: t("fr"), flag: <FlagFR /> },
    { code: "en" as const, short: "EN", full: t("en"), flag: <FlagGB /> },
  ];

  return (
    <nav aria-label={t("label")} className="inline-flex items-center gap-1 text-[0.8rem] font-semibold tracking-[0.06em]">
      {options.map((o) => {
        const active = o.code === locale;
        return (
          <Link
            key={o.code}
            href={pathname}
            locale={o.code}
            aria-current={active ? "true" : undefined}
            onClick={onNavigate}
            aria-label={o.full}
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-2 transition-colors duration-200 ${
              active
                ? "text-[var(--nav-texte,var(--ink))]"
                : "text-[var(--nav-texte-doux,var(--ink-soft))] opacity-80 hover:opacity-100 hover:text-[var(--nav-texte,var(--ink))]"
            }`}
          >
            {o.flag}
            <span>{o.short}</span>
          </Link>
        );
      })}
    </nav>
  );
}
