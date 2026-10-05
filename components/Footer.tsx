import { useLocale, useTranslations } from "next-intl";
import { Link, getPathname } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import MailLink from "./MailLink";
import Marquee from "./Marquee";

const navLinks: { href: AppPathname; key: "home" | "services" | "work" | "about" | "contact" }[] = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/realisations", key: "work" },
  { href: "/a-propos", key: "about" },
  { href: "/contact", key: "contact" },
];

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale() as "fr" | "en";
  const year = new Date().getFullYear();

  // Les mots du bandeau renvoient chacun à son offre sur la page Services.
  const services = getPathname({ locale, href: "/services" });
  const marquee = (t.raw("home.marquee") as { label: string; offer: string }[]).map((m) => ({
    label: m.label,
    href: `${services}#${m.offer}`,
  }));

  return (
    <footer className="bande-encre overflow-hidden">
      <Marquee items={marquee} />

      <div className="container-site pt-10 md:pt-14">
        {/* La plaque gravée : letterpress, immobile. */}
        <p aria-hidden="true" className="marque-gravee -mb-[0.08em] font-display text-[clamp(4rem,16vw,11rem)] leading-none font-bold tracking-tight">
          R-X
        </p>

        <div className="grid gap-10 pt-10 pb-12 md:grid-cols-[1.4fr_1fr_1fr_auto]">
          <div className="max-w-sm text-sm leading-relaxed text-encre-doux">
            <p>{t("footer.tagline")}</p>
            <p className="mt-2 text-sand">{t("footer.who")}</p>
          </div>

          <nav aria-label={t("footer.navTitle")}>
            <h2 className="eyebrow text-sage">{t("footer.navTitle")}</h2>
            <ul className="mt-4 space-y-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-encre-doux transition-colors hover:text-sand">
                    {t(`nav.${l.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow text-sage">{t("footer.contactTitle")}</h2>
            <p className="mt-4 text-sm">
              <MailLink className="text-sand transition-colors hover:text-terra" />
            </p>
            <p className="mt-2 text-sm text-encre-doux">{t("contact.reply")}</p>
          </div>

          <div>
            <h2 className="eyebrow text-sage">{t("footer.langTitle")}</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {(["fr", "en"] as const).map((code) => (
                <li key={code}>
                  <Link
                    href="/"
                    locale={code}
                    aria-current={code === locale ? "true" : undefined}
                    className={code === locale ? "text-sand" : "text-encre-doux transition-colors hover:text-sand"}
                  >
                    {t(`lang.${code}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-black/40">
        <div className="container-site flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-5 text-xs text-encre-doux">
          <p>
            © {year} R-X. {t("footer.rights")}
          </p>
          <p>{t("footer.noCookie")}</p>
          <Link href="/mentions-legales" className="transition-colors hover:text-sand">
            {t("footer.legal")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
