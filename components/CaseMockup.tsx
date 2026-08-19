import type { ReactNode } from "react";

type Variant = "dashboard" | "shop" | "health";
type Etat = "avant" | "apres";

export type MockupTextes = {
  dashboard: {
    titre: string;
    colonnes: string[];
    lignes: string[][];
    apresTitre: string;
    apresCartes: { valeur: string; libelle: string }[];
    apresAction: string;
    recherche: string;
  };
  shop: {
    etapes: string[];
    champs: string[];
    produit: string;
    prix: string;
    action: string;
    reassurance: string;
  };
  health: {
    titre: string;
    champs: string[];
    question: string;
    reponses: string[];
    etape: string;
  };
};

/**
 * Les maquettes des études de cas : de vraies interfaces, avec de
 * vrais mots. « Avant » montre la densité d'origine, « après » la
 * version remise à plat. Tout est en HTML : le texte se traduit, se
 * sélectionne, et reste lisible à l'écran comme à la loupe.
 */
export default function CaseMockup({
  variant,
  etat,
  textes,
}: {
  variant: Variant;
  etat: Etat;
  textes: MockupTextes;
}) {
  if (variant === "dashboard") return <Dashboard etat={etat} t={textes.dashboard} />;
  if (variant === "shop") return <Shop etat={etat} t={textes.shop} />;
  return <Health etat={etat} t={textes.health} />;
}

/* ——— Cadre commun ——— */

function Ecran({
  children,
  sombre = false,
}: {
  children: ReactNode;
  sombre?: boolean;
}) {
  return (
    <div
      className={`absolute inset-0 flex flex-col overflow-hidden text-[0.62rem] leading-tight ${
        sombre ? "bg-ink-deep text-sand" : "bg-sand text-ink"
      }`}
    >
      {children}
    </div>
  );
}

/* ——— 01 · Tableau de bord RH ——— */

function Dashboard({
  etat,
  t,
}: {
  etat: Etat;
  t: MockupTextes["dashboard"];
}) {
  if (etat === "avant") {
    return (
      <Ecran>
        <div className="flex items-center justify-between border-b border-[#cfcabb] bg-[#e7e4db] px-3 py-1.5">
          <span className="font-semibold text-[#6b675d]">{t.titre}</span>
          <span className="flex gap-1.5 text-[0.5rem] text-[#8b8679]">
            {["Fichier", "Édition", "Aide"].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </span>
        </div>
        <div className="flex-1 overflow-hidden bg-[#f3f1ea] p-1.5">
          <table className="w-full border-collapse text-[0.5rem] text-[#6b675d]">
            <thead>
              <tr className="bg-[#ddd9cd]">
                {t.colonnes.map((c) => (
                  <th
                    key={c}
                    className="border border-[#cfcabb] px-1 py-0.5 text-left font-semibold whitespace-nowrap"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.lignes.concat(t.lignes).map((ligne, i) => (
                <tr key={i} className={i % 2 ? "bg-[#eceadf]" : "bg-[#f7f5ef]"}>
                  {ligne.map((cell, j) => (
                    <td
                      key={j}
                      className="border border-[#d8d4c8] px-1 py-[3px] whitespace-nowrap"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Ecran>
    );
  }

  return (
    <Ecran>
      <div className="flex items-center justify-between border-b border-line bg-sand-card px-4 py-2.5">
        <span className="font-display text-xs font-bold">{t.apresTitre}</span>
        <span className="rounded-full bg-sand px-2.5 py-1 text-[0.55rem] text-ink-soft">
          {t.recherche}
        </span>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2 p-3">
        {t.apresCartes.map((c, i) => (
          <div
            key={c.libelle}
            className="wf-settle flex flex-col justify-between rounded-xl bg-sand-card p-2.5 shadow-sm"
            style={{ animationDelay: `${i * 0.25}s` }}
          >
            <span className="font-display text-lg font-bold text-terra-deep">
              {c.valeur}
            </span>
            <span className="text-[0.55rem] text-ink-soft">{c.libelle}</span>
          </div>
        ))}
      </div>
      <div className="px-3 pb-3">
        <span className="pulse-doux inline-block rounded-full bg-terra-hot px-3 py-1.5 text-[0.58rem] font-semibold text-sand-card">
          {t.apresAction}
        </span>
      </div>
    </Ecran>
  );
}

/* ——— 02 · Parcours d'achat ——— */

function Shop({ etat, t }: { etat: Etat; t: MockupTextes["shop"] }) {
  if (etat === "avant") {
    return (
      <Ecran>
        <div className="border-b border-[#cfcabb] bg-[#e7e4db] px-3 py-1.5 text-[0.55rem] font-semibold text-[#6b675d]">
          {t.etapes.map((e, i) => (
            <span key={e} className={i === 2 ? "text-[#3f3b33]" : "opacity-55"}>
              {i > 0 && <span className="mx-1 opacity-40">›</span>}
              {e}
            </span>
          ))}
        </div>
        <div className="flex-1 space-y-1.5 bg-[#f3f1ea] p-3">
          {t.champs.map((c) => (
            <label key={c} className="flex items-center gap-2 text-[0.52rem] text-[#6b675d]">
              <span className="w-16 shrink-0 text-right">{c}</span>
              <span className="h-4 flex-1 border border-[#cfcabb] bg-white" />
            </label>
          ))}
          <span className="mt-2 inline-block border border-[#cfcabb] bg-[#ddd9cd] px-2 py-1 text-[0.52rem] text-[#6b675d]">
            {t.etapes[3] ?? "Continuer"}
          </span>
        </div>
      </Ecran>
    );
  }

  return (
    <Ecran>
      <div className="flex flex-1 items-center gap-3 p-4">
        <div className="h-full w-2/5 rounded-xl bg-terra-wash" />
        <div className="flex flex-1 flex-col gap-1.5">
          <span className="font-display text-sm font-bold">{t.produit}</span>
          <span className="font-display text-lg font-bold text-terra-deep">
            {t.prix}
          </span>
          <span className="pulse-doux mt-1 inline-block rounded-full bg-ink px-3 py-1.5 text-center text-[0.58rem] font-semibold text-sand">
            {t.action}
          </span>
          <span className="mt-1 text-[0.52rem] text-ink-soft">
            {t.reassurance}
          </span>
        </div>
      </div>
    </Ecran>
  );
}

/* ——— 03 · Parcours patient ——— */

function Health({ etat, t }: { etat: Etat; t: MockupTextes["health"] }) {
  if (etat === "avant") {
    return (
      <Ecran>
        <div className="border-b border-[#cfcabb] bg-[#e7e4db] px-3 py-1.5 text-[0.55rem] font-semibold text-[#6b675d]">
          {t.titre}
        </div>
        <div className="flex-1 space-y-1 bg-[#f3f1ea] p-2.5">
          {t.champs.map((c) => (
            <label key={c} className="flex items-center gap-1.5 text-[0.48rem] text-[#6b675d]">
              <span className="w-20 shrink-0 text-right">{c}</span>
              <span className="h-3.5 flex-1 border border-[#cfcabb] bg-white" />
            </label>
          ))}
        </div>
      </Ecran>
    );
  }

  return (
    <Ecran>
      <div className="flex h-full flex-col justify-center gap-3 p-5">
        <span className="text-[0.55rem] font-semibold tracking-wide text-sage-deep uppercase">
          {t.etape}
        </span>
        <span className="font-display text-base leading-snug font-bold">
          {t.question}
        </span>
        <div className="flex flex-col gap-2">
          {t.reponses.map((r, i) => (
            <span
              key={r}
              className="wf-settle rounded-xl border-2 border-sage bg-sand-card px-3 py-2 text-[0.6rem] font-semibold"
              style={{ animationDelay: `${0.3 + i * 0.3}s` }}
            >
              {r}
            </span>
          ))}
        </div>
      </div>
    </Ecran>
  );
}
