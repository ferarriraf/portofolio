"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

export default function Topbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const fermerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Referme le menu mobile à chaque navigation. On compare le chemin
  // rendu au chemin courant : fermer depuis un effet déclencherait un
  // rendu en cascade.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    if (open) setOpen(false);
  }

  // Bloque le défilement de la page quand le menu plein écran est ouvert,
  // et déplace le focus : vers « Fermer » à l'ouverture, retour au bouton
  // du menu à la fermeture — sans quoi le clavier reste perdu derrière
  // l'overlay.
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

  // Si la fenêtre repasse en largeur desktop pendant que le menu est
  // ouvert, l'overlay disparaît en CSS : on ferme aussi l'état, sinon
  // le défilement resterait verrouillé sans aucun moyen de le rendre.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [open]);

  // Échap ferme ; Tab reste enfermé dans le menu tant qu'il est ouvert
  const onOverlayKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key !== "Tab") return;
    const focusables = overlayRef.current?.querySelectorAll<HTMLElement>(
      "a[href], button"
    );
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
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-line/70 bg-sand/85 shadow-[0_8px_30px_-18px_rgba(46,52,40,0.25)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div
        className={`container-site flex items-center justify-between transition-all duration-300 ${
          scrolled ? "h-16" : "h-20"
        }`}
      >
        <Link href="/" aria-label={t("home")} className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label={t("ariaMain")}>
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`hit-area relative text-sm font-medium transition-colors duration-200 ${
                  active ? "text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                {t(l.key)}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-2 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-terra-strong"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <LangSwitcher />
          </div>
          <button
            ref={burgerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t("menuOpen")}
            aria-expanded={open}
            aria-controls={open ? "menu-mobile" : undefined}
            className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-sand-card text-ink md:hidden"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={overlayRef}
            id="menu-mobile"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={t("ariaMainMobile")}
            onKeyDown={onOverlayKeyDown}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex flex-col bg-sand md:hidden"
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
                className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-sand-card text-ink"
              >
                <X className="size-5" />
              </button>
            </div>

            <motion.nav
              aria-label={t("ariaMainMobile")}
              className="container-site mt-6 flex flex-col gap-2"
              initial="hidden"
              animate="show"
              variants={{
                show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
              }}
            >
              {[{ href: "/" as AppPathname, key: "home" as const }, ...links].map(
                (l) => {
                  const active = pathname === l.href;
                  return (
                    <motion.div
                      key={l.href}
                      variants={{
                        hidden: { opacity: 0, y: 18 },
                        show: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        href={l.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center gap-3 py-3 font-display text-3xl font-bold tracking-tight ${
                          active ? "text-terra-strong" : "text-ink"
                        }`}
                      >
                        {t(l.key)}
                      </Link>
                    </motion.div>
                  );
                }
              )}
            </motion.nav>

            <div className="container-site mt-auto pb-10">
              <LangSwitcher onNavigate={() => setOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
