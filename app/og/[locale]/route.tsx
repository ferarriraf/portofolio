import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }];
}

/**
 * La carte de partage (réseaux sociaux, messageries), dessinée au
 * build dans la palette du site — une par langue, à une adresse
 * stable et sans redirection : /og/fr et /og/en.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
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
          background: "#f6f1e6",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#6e8a62",
            }}
          />
          <div style={{ fontSize: 28, color: "#5c6353", letterSpacing: 2 }}>
            www.r-x.fr
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 130, fontWeight: 700, color: "#2e3428" }}>
            R<span style={{ color: "#d95f2e" }}>-</span>X
          </div>
          <div style={{ display: "flex", fontSize: 44, color: "#2e3428", marginTop: 8 }}>
            {fr
              ? "Développeur web fullstack"
              : "Fullstack web developer"}
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#5c6353", marginTop: 14 }}>
            {fr ? "Le web, bien construit." : "The web, built right."}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 3, height: 16, borderRadius: 999, background: "#d95f2e", display: "flex" }} />
          <div style={{ flex: 2, height: 16, borderRadius: 999, background: "#a9bfa0", display: "flex" }} />
          <div style={{ flex: 1, height: 16, borderRadius: 999, background: "#24291f", display: "flex" }} />
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
