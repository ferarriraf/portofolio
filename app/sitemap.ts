import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";

const BASE = "https://www.r-x.fr";

const pages: AppPathname[] = [
  "/",
  "/services",
  "/realisations",
  "/a-propos",
  "/contact",
  "/mentions-legales",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((href) => ({
    url: BASE + getPathname({ locale: "fr", href }),
    changeFrequency: "monthly",
    priority: href === "/" ? 1 : 0.7,
    alternates: {
      languages: {
        fr: BASE + getPathname({ locale: "fr", href }),
        en: BASE + getPathname({ locale: "en", href }),
      },
    },
  }));
}
