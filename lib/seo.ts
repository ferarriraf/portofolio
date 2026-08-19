import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";

type MetaNs = "home" | "services" | "work" | "about" | "contact" | "legal";

/**
 * Métadonnées d'une page : titre et description traduits,
 * URL canonique et alternates hreflang fr/en.
 */
export async function pageMetadata(
  locale: string,
  ns: MetaNs,
  href: AppPathname
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  const canonical = getPathname({ locale: locale as "fr" | "en", href });
  return {
    // La page d'accueil porte le titre complet ; les autres passent
    // par le gabarit « %s — R-X » défini dans le layout.
    title: ns === "home" ? { absolute: t("home.title") } : t(`${ns}.title`),
    description: t(`${ns}.description`),
    // openGraph d'une page REMPLACE celui du layout (fusion superficielle
    // de Next) : on le fournit donc complet ici
    openGraph: {
      title: t(`${ns}.title`),
      description: t(`${ns}.description`),
      url: canonical,
      siteName: "R-X",
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_GB",
    },
    alternates: {
      canonical,
      languages: {
        fr: getPathname({ locale: "fr", href }),
        en: getPathname({ locale: "en", href }),
        "x-default": getPathname({ locale: "fr", href }),
      },
      // Le fil discret vers la version pour agents IA : présent dans le
      // <head> de chaque page, invisible pour un visiteur humain
      types: { "text/plain": "/llms.txt" },
    },
  };
}
