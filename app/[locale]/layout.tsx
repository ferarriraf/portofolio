import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";
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

  return (
    <html
      lang={locale}
      className={`${display.variable} ${bodyFont.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col overflow-x-clip">
        <NextIntlClientProvider>
          <Topbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
