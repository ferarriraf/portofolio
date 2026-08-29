import { Check } from "lucide-react";

type Variant = "vitrine" | "metier";

export type MockupTextes = {
  vitrine: {
    fenetre: string;
    marque: string;
    menu: string[];
    titre: string;
    lede: string;
    action: string;
    cartes: string[];
  };
  metier: {
    fenetre: string;
    titre: string;
    badge: string;
    lignes: [string, string][];
    valide: string;
    action: string;
  };
};

/**
 * Les deux démos types — un site vitrine et une application métier —
 * avec de vrais mots. Tout est en HTML : le texte se traduit, se
 * sélectionne, et reste lisible à l'écran comme à la loupe.
 *
 * Une troisième démo montrait une réponse d'API : elle a été retirée,
 * jugée trop technique pour le public visé. Une console, pour un
 * artisan qui cherche un site, est un mur.
 */
export default function CaseMockup({
  variant,
  textes,
}: {
  variant: Variant;
  textes: MockupTextes;
}) {
  if (variant === "vitrine") return <Vitrine t={textes.vitrine} />;
  return <Metier t={textes.metier} />;
}

/* ——— 01 · Site vitrine : l'atelier de céramique ——— */

function Vitrine({ t }: { t: MockupTextes["vitrine"] }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-sand text-ink">
      <div className="flex items-center justify-between border-b border-line bg-sand-card px-4 py-2">
        <span className="font-display text-[0.68rem] font-bold">{t.marque}</span>
        <span className="flex items-center gap-2.5 text-[0.5rem] text-ink-soft">
          {t.menu.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </span>
      </div>
      <div className="flex flex-1 items-center justify-between gap-3 px-4">
        <div className="flex flex-col gap-1.5">
          <span className="font-display text-[0.95rem] leading-tight font-bold">
            {t.titre}
          </span>
          <span className="text-[0.52rem] text-ink-soft">{t.lede}</span>
          <span className="mt-1 self-start rounded-full bg-terra-strong px-2.5 py-1 text-[0.52rem] font-semibold text-sand-card">
            {t.action}
          </span>
        </div>
        {/* Une pièce vue du dessus : les cercles concentriques du tournage */}
        <span
          aria-hidden="true"
          className="relative flex size-16 shrink-0 items-center justify-center rounded-full bg-terra-wash shadow-inner"
        >
          <span className="absolute inset-1.5 rounded-full border border-terra-strong/40" />
          <span className="absolute inset-3 rounded-full border border-terra-strong/30" />
          <span className="absolute inset-[18px] rounded-full border border-terra-strong/25" />
          <span className="size-2 rounded-full bg-terra-strong/60" />
        </span>
      </div>
      {/* Les collections, avec la silhouette de leurs pièces */}
      <div className="grid h-[30%] grid-cols-3 gap-2 px-4 pb-3">
        {t.cartes.map((c, i) => (
          <div
            key={c}
            className={`flex flex-col items-center justify-end gap-1 rounded-lg pb-1.5 ${
              ["bg-sage-wash", "bg-terra-wash", "bg-sand-card shadow-elev-1"][i]
            }`}
            style={{ }}
          >
            <Silhouette forme={i} />
            <span className="text-[0.5rem] font-semibold text-ink-soft">{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Bol, vase, tasse : la silhouette de chaque collection */
function Silhouette({ forme }: { forme: number }) {
  if (forme === 0) {
    return <span aria-hidden="true" className="h-3.5 w-7 rounded-b-full bg-ink/25" />;
  }
  if (forme === 1) {
    return (
      <span
        aria-hidden="true"
        className="h-6 w-4 bg-ink/25 [border-radius:45%_45%_35%_35%/15%_15%_45%_45%]"
      />
    );
  }
  return (
    <span aria-hidden="true" className="relative h-4 w-5">
      <span className="absolute inset-y-0 left-0 w-4 rounded-b-lg bg-ink/25" />
      <span className="absolute top-0.5 right-0 h-2 w-1.5 rounded-r-full border-[1.5px] border-ink/25" />
    </span>
  );
}

/* ——— 02 · Application métier : les demandes qui attendent une
   décision, et rien d'autre — la première vient d'être validée ——— */

function Metier({ t }: { t: MockupTextes["metier"] }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-sand text-ink">
      <div className="flex items-center justify-between border-b border-line bg-sand-card px-4 py-2.5">
        <span className="font-display text-xs font-bold">{t.titre}</span>
        <span className="rounded-full bg-terra-wash px-2.5 py-1 text-[0.55rem] font-semibold text-terra-deep">
          {t.badge}
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-2 p-3">
        {/* La demande déjà traitée : le geste que montre la démo */}
        <div className="flex items-center justify-between rounded-xl bg-sage-wash px-3 py-2">
          <span className="flex flex-col">
            <span className="text-[0.62rem] font-semibold">{t.lignes[0][0]}</span>
            <span className="text-[0.52rem] text-ink-soft">{t.lignes[0][1]}</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-sage-strong px-2 py-0.5 text-[0.5rem] font-semibold text-sand-card">
            <Check className="size-2.5" aria-hidden="true" />
            {t.valide}
          </span>
        </div>
        {/* Celles qui attendent un clic */}
        {t.lignes.slice(1).map(([nom, dates]) => (
          <div
            key={nom}
            className="flex items-center justify-between rounded-xl bg-sand-card px-3 py-2 shadow-elev-1"
            style={{ }}
          >
            <span className="flex flex-col">
              <span className="text-[0.62rem] font-semibold">{nom}</span>
              <span className="text-[0.52rem] text-ink-soft">{dates}</span>
            </span>
            <span
              aria-hidden="true"
              className="inline-flex size-5 items-center justify-center rounded-full border border-sage-strong text-sage-strong"
            >
              <Check className="size-3" />
            </span>
          </div>
        ))}
      </div>
      <div className="px-3 pb-3">
        <span className="inline-block rounded-full bg-terra-hot px-3 py-1.5 text-[0.58rem] font-semibold text-sand-card">
          {t.action}
        </span>
      </div>
    </div>
  );
}
