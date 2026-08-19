"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { FlagFR, FlagGB } from "./Flags";

export default function LangSwitcher({
  onNavigate,
}: {
  /** Appelé au clic sur une langue (ex. refermer le menu mobile) */
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
    <nav
      aria-label={t("label")}
      className="inline-flex w-fit items-center gap-1 rounded-full border border-line bg-sand-card p-1"
    >
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
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors duration-200 ${
              active
                ? "bg-ink text-sand-card"
                : "text-ink-soft hover:bg-sand-deep hover:text-ink"
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
