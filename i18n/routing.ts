import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  // Aucun cookie de langue : la promesse « zéro cookie » du site est
  // littérale. La langue est entièrement portée par l'URL — sans
  // détection par Accept-Language, sinon un navigateur anglophone
  // serait renvoyé vers /en à chaque clic sur « FR ».
  localeCookie: false,
  localeDetection: false,
  defaultLocale: "fr",
  // Le français est servi sans préfixe (r-x.fr/services),
  // l'anglais sous /en (r-x.fr/en/services)
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/services": "/services",
    "/realisations": { fr: "/realisations", en: "/work" },
    // La demo jouable : meme mot dans les deux langues, et l URL
    // annonce elle-meme qu il s agit d une demonstration.
    "/demo": "/demo",
    "/a-propos": { fr: "/a-propos", en: "/about" },
    "/contact": "/contact",
    "/mentions-legales": { fr: "/mentions-legales", en: "/legal" },
  },
});

export type AppPathname = keyof typeof routing.pathnames;
