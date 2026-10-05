import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }];
}

/**
 * La carte de partage (réseaux sociaux, messageries), dessinée au
 * build dans la matière du hero : encre, la phrase, le mot qui luit.
 * Une par langue, à une adresse stable : /og/fr et /og/en.
 *
 * Le moteur d'image ne lit pas les woff2 du site : la police de secours
 * est une sans-serif système. Les textes sont ceux de l'accueil.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const fr = locale !== "en";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#24291f",
          color: "#f6f1e6",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 54, fontWeight: 800, letterSpacing: -3 }}>
            R<span style={{ color: "#d95f2e" }}>-</span>X
          </div>
          <div style={{ fontSize: 24, color: "#a9bfa0", letterSpacing: 3 }}>
            {fr ? "DÉVELOPPEUR WEB INDÉPENDANT · GERS" : "INDEPENDENT WEB DEVELOPER · GERS, FRANCE"}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
            {fr ? "Un bon site ne se fait pas remarquer." : "A good website doesn't draw attention to itself."}
          </div>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, color: "#dfa184" }}>
            {fr ? "Il fait son travail." : "It does its job."}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 26, color: "rgba(246,241,230,0.72)" }}>
          {fr
            ? "Sites web pour les commerces, les restaurants et les artisans · www.r-x.fr"
            : "Websites for shops, restaurants and tradespeople · www.r-x.fr"}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
