import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";

const BASE = "https://www.r-x.fr";

const pages: AppPathname[] = [
  "/",
  "/services",
  "/realisations",
  "/demo",
  "/a-propos",
  "/contact",
  "/mentions-legales",
];

/** Chaque page existe deux fois — une entrée par langue, chacune
    déclarant l'autre en alternative. */
export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((href) => {
    const alternates = {
      languages: {
        fr: BASE + getPathname({ locale: "fr", href }),
        en: BASE + getPathname({ locale: "en", href }),
      },
    };
    return (["fr", "en"] as const).map((locale) => ({
      url: BASE + getPathname({ locale, href }),
      changeFrequency: "monthly" as const,
      priority: href === "/" ? 1 : 0.7,
      alternates,
    }));
  });
}
