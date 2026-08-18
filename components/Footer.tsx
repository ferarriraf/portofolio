import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import Logo from "./Logo";

const navLinks: { href: AppPathname; key: "home" | "services" | "work" | "about" | "contact" }[] = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/realisations", key: "work" },
  { href: "/a-propos", key: "about" },
  { href: "/contact", key: "contact" },
];

export default function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-sand-deep">
      <div className="container-site grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
            {t("footer.tagline")}
          </p>
        </div>

        <nav aria-label={t("footer.navTitle")}>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-sage-deep">
            {t("footer.navTitle")}
          </h2>
          <ul className="mt-4 space-y-2.5">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-ink-soft transition-colors hover:text-ink"
                >
                  {t(`nav.${l.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-sage-deep">
            {t("footer.contactTitle")}
          </h2>
          <a
            href="mailto:contact@r-x.fr"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-terra-strong"
          >
            <Mail className="size-4 text-sage-strong" />
            contact@r-x.fr
          </a>
        </div>
      </div>

      <div className="border-t border-line/70">
        <div className="container-site flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-ink-soft">
          <p>
            © {year} R-X. {t("footer.rights")}
          </p>
          <Link
            href="/mentions-legales"
            className="transition-colors hover:text-ink"
          >
            {t("footer.legal")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
