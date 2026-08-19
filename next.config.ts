import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const isDev = process.env.NODE_ENV === "development";

// Politique de sécurité du contenu : uniquement nos propres ressources.
// 'unsafe-inline' est requis par Next.js pour ses scripts d'hydratation,
// 'unsafe-eval' uniquement en développement (rechargement à chaud).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Un seul domaine fait autorité : www.r-x.fr. Servir le même contenu
  // sur deux adresses le ferait compter deux fois par les moteurs de
  // recherche, qui répartiraient la réputation du site entre les deux.
  async redirects() {
    return [
      {
        source: "/:chemin*",
        has: [{ type: "host", value: "r-x.fr" }],
        destination: "https://www.r-x.fr/:chemin*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
