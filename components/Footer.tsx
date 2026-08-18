import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";

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
    <footer className="overflow-hidden bg-ink-deep text-sand">
      <div className="container-site pt-14 md:pt-16">
        <p
          aria-hidden="true"
          className="text-outline-sand -mb-[0.09em] font-display text-[clamp(5rem,20vw,15rem)] font-bold leading-none tracking-tight opacity-60"
        >
          R-X
        </p>
        <div className="grid gap-10 border-t border-sand/15 pt-10 pb-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <p className="max-w-xs text-sm leading-relaxed text-sand/70">
            {t("footer.tagline")}
          </p>

          <nav aria-label={t("footer.navTitle")}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-sage">
              {t("footer.navTitle")}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-sand/70 transition-colors hover:text-sand"
                  >
                    {t(`nav.${l.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-sage">
              {t("footer.contactTitle")}
            </h2>
            <a
              href="mailto:contact@r-x.fr"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-sand/90 transition-colors hover:text-terra"
            >
              <Mail className="size-4 text-terra" />
              contact@r-x.fr
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-sand/15">
        <div className="container-site flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-sand/50">
          <p>
            © {year} R-X. {t("footer.rights")}
          </p>
          <Link
            href="/mentions-legales"
            className="transition-colors hover:text-sand"
          >
            {t("footer.legal")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
