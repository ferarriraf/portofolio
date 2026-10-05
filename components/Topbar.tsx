"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import Logo from "./Logo";
import LangSwitcher from "./LangSwitcher";

const links: { href: AppPathname; key: "services" | "work" | "about" | "contact" }[] = [
  { href: "/services", key: "services" },
  { href: "/realisations", key: "work" },
  { href: "/a-propos", key: "about" },
  { href: "/contact", key: "contact" },
];

/**
 * La barre du haut. Dans le flux de la page, pas fixe : elle se lit une
 * fois puis laisse la place. À droite, ce qu'un visiteur cherche — le
 * bouton pour écrire, et la langue en lettres, sans drapeaux.
 *
 * Sa couleur suit la surface qu'elle ouvre (papier ou encre) : voir
 * `.entete` dans globals.css, piloté par le marqueur du hero.
 */
export default function Topbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const fermerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Referme le menu à chaque navigation, sans passer par un effet.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    if (open) setOpen(false);
  }

  // Menu ouvert : la page ne défile plus, le focus va sur « Fermer »,
  // et revient sur le bouton du menu à la fermeture.
  const dejaOuvert = useRef(false);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (open) {
      dejaOuvert.current = true;
      fermerRef.current?.focus();
    } else if (dejaOuvert.current) {
      burgerRef.current?.focus();
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // Si la fenêtre repasse en largeur bureau, le menu se ferme : sinon le
  // défilement resterait verrouillé sans aucun moyen de le rendre.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [open]);

  // Échap ferme ; Tab reste dans le menu tant qu'il est ouvert.
  const onOverlayKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key !== "Tab") return;
    const focusables = overlayRef.current?.querySelectorAll<HTMLElement>("a[href], button");
    if (!focusables || focusables.length === 0) return;
    const premier = focusables[0];
    const dernier = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === premier) {
      e.preventDefault();
      dernier.focus();
    } else if (!e.shiftKey && document.activeElement === dernier) {
      e.preventDefault();
      premier.focus();
    }
  };

  return (
    <header className="entete">
      <div className="container-site flex h-20 items-center gap-6">
        <Link href="/" aria-label={t("home")} className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-7 md:flex" aria-label={t("ariaMain")}>
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`text-[0.95rem] font-medium transition-colors duration-200 hover:text-[var(--nav-texte)] ${
                  active
                    ? "text-[var(--nav-texte)] underline decoration-terra-hot decoration-2 underline-offset-[0.55em]"
                    : "text-[var(--nav-texte-doux)]"
                }`}
              >
                {t(l.key)}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-4 md:ml-0">
          <div className="hidden md:block">
            <LangSwitcher />
          </div>
          <Link href="/contact" className="btn btn-primary hidden px-5 py-2.5 sm:inline-flex">
            {t("cta")}
          </Link>
          <button
            ref={burgerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t("menuOpen")}
            aria-expanded={open}
            aria-controls={open ? "menu-mobile" : undefined}
            className="press inline-flex size-11 items-center justify-center rounded-full border border-current/30 text-[var(--nav-texte)] md:hidden"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      {open && (
        <div
          ref={overlayRef}
          id="menu-mobile"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label={t("ariaMainMobile")}
          onKeyDown={onOverlayKeyDown}
          className="menu-mobile fixed inset-0 z-50 flex flex-col bg-sand text-ink md:hidden"
        >
          <div className="container-site flex h-20 items-center justify-between">
            <Link href="/" aria-label={t("home")} onClick={() => setOpen(false)}>
              <Logo />
            </Link>
            <button
              ref={fermerRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("menuClose")}
              className="press inline-flex size-11 items-center justify-center rounded-full border border-ink/30 text-ink"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav aria-label={t("ariaMainMobile")} className="container-site mt-4">
            <ul className="filets">
              {[{ href: "/" as AppPathname, key: "home" as const }, ...links].map((l) => {
                const active = pathname === l.href;
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`block py-4 font-display text-3xl font-bold tracking-tight ${
                        active ? "text-terra-deep" : "text-ink"
                      }`}
                    >
                      {t(l.key)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="container-site mt-auto flex flex-wrap items-center justify-between gap-4 pb-10">
            <LangSwitcher onNavigate={() => setOpen(false)} />
            <Link href="/contact" className="btn btn-primary" onClick={() => setOpen(false)}>
              {t("cta")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
