import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import MailLink from "./MailLink";
import FooterMark from "./FooterMark";
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
    <footer className="bande-calque-haut overflow-hidden bg-ink-deep text-sand">
      <div className="container-site pt-14 md:pt-16">
        {/* La dalle gravée qui se pose en fin de page */}
        <FooterMark />
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
                    className="hit-area text-sm text-sand/70 transition-colors hover:text-sand"
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
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium">
              <Mail className="size-4 shrink-0 text-terra" />
              <MailLink className="text-sand/90 transition-colors hover:text-terra" />
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-sand/15">
        <div className="container-site flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-sand/60">
          <p>
            © {year} R-X. {t("footer.rights")}
          </p>
          {/* Le dernier mot du site : la session se ferme proprement */}
          <span aria-hidden="true" className="font-mono text-[0.7rem] text-sand/45">
            rx@r-x:~$ exit 0
            <span className="caret-blink ml-1 inline-block h-3 w-1.5 translate-y-px bg-sand/45" />
          </span>
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
