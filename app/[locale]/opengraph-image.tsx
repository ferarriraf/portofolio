import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "R-X — Studio d'ergonomie & design d'interface";

/**
 * La carte de partage (réseaux sociaux, messageries), dessinée au
 * build dans la palette du site — aucun fichier image à maintenir.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
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
              ? "Studio d'ergonomie & design d'interface"
              : "Ergonomics & interface design studio"}
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#5c6353", marginTop: 14 }}>
            {fr ? "L'utilisateur au centre." : "The user at the centre."}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 3, height: 16, borderRadius: 999, background: "#d95f2e", display: "flex" }} />
          <div style={{ flex: 2, height: 16, borderRadius: 999, background: "#a9bfa0", display: "flex" }} />
          <div style={{ flex: 1, height: 16, borderRadius: 999, background: "#24291f", display: "flex" }} />
        </div>
      </div>
    ),
    size
  );
}
