import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";
import BootScreen from "@/components/BootScreen";
import CookieNotice from "@/components/CookieNotice";
import SecretModes from "@/components/SecretModes";
import NoContextMenu from "@/components/NoContextMenu";
import "../globals.css";

const display = localFont({
  src: "../fonts/bricolage-grotesque-latin.woff2",
  variable: "--font-display",
  display: "swap",
  weight: "200 800",
  style: "normal",
});

const bodyFont = localFont({
  src: [
    {
      path: "../fonts/instrument-sans-latin.woff2",
      weight: "400 700",
      style: "normal",
    },
    {
      path: "../fonts/instrument-sans-italic-latin.woff2",
      weight: "400 700",
      style: "italic",
    },
  ],
  variable: "--font-body",
  display: "swap",
});

// Les pages restent pré-générées, mais les caches partagés ne peuvent
// plus retenir le HTML un an : régénération au plus tard toutes les heures.
export const revalidate = 3600;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL("https://www.r-x.fr"),
    title: { default: t("home.title"), template: "%s — R-X" },
    description: t("home.description"),
    openGraph: {
      siteName: "R-X",
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_GB",
    },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: "#f6f1e6",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("a11y");
  const tm = await getTranslations("meta");

  // Données structurées : uniquement des faits vérifiables — pas de
  // notes fabriquées, pas d'email (masqué aux robots par choix)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": "https://www.r-x.fr/#org",
        name: "R-X",
        description: tm("home.description"),
        url: "https://www.r-x.fr",
        logo: "https://www.r-x.fr/og/fr",
        foundingDate: "2026",
        areaServed: "FR",
        knowsLanguage: ["fr", "en"],
      },
      {
        "@type": "WebSite",
        "@id": "https://www.r-x.fr/#site",
        name: tm("siteName"),
        url: "https://www.r-x.fr",
        inLanguage: locale,
        publisher: { "@id": "https://www.r-x.fr/#org" },
      },
    ],
  };

  return (
    <html
      lang={locale}
      className={`${display.variable} ${bodyFont.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col overflow-x-clip">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Filet de sécurité : le HTML servi est complet, mais trois
            couches le masquent en attendant que React prenne la main —
            l'écran d'ouverture, l'entrée de page et les blocs dévoilés
            au défilement. Sans JavaScript, personne ne les lève. Ces
            deux règles rendent le site lisible tel quel. La CSP autorise
            les styles en ligne, c'est donc sans effet de bord. */}
        <noscript>
          <style>{`.ecran-boot{display:none!important}[data-entree]{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
        <NextIntlClientProvider>
          {/* Premier arrêt du clavier : sauter la navigation */}
          <a
            href="#contenu"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[130] focus:rounded-full focus:bg-ink-deep focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-sand"
          >
            {t("skip")}
          </a>
          <BootScreen />
          <Topbar />
          <main id="contenu" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <Footer />
          <CookieNotice />
          <SecretModes />
          <NoContextMenu />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
