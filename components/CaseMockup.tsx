import { Check } from "lucide-react";

type Variant = "vitrine" | "metier" | "api";

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
  api: {
    fenetre: string;
    requete: string;
    statut: string;
    lignes: [string, string][];
    note: string;
  };
};

/**
 * Les trois démos types — un site vitrine, une application métier,
 * une API — avec de vrais mots. Tout est en HTML : le texte se
 * traduit, se sélectionne, et reste lisible à l'écran comme à la
 * loupe. Chaque écran vit doucement (blocs qui se posent, curseur).
 */
export default function CaseMockup({
  variant,
  textes,
}: {
  variant: Variant;
  textes: MockupTextes;
}) {
  if (variant === "vitrine") return <Vitrine t={textes.vitrine} />;
  if (variant === "metier") return <Metier t={textes.metier} />;
  return <Api t={textes.api} />;
}

/* ——— 01 · Site vitrine : l'atelier de céramique ——— */

function Vitrine({ t }: { t: MockupTextes["vitrine"] }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-sand text-ink">
      <div className="flex items-center justify-between border-b border-line bg-sand-card px-4 py-2">
        <span className="font-display text-[0.68rem] font-bold">{t.marque}</span>
        <span className="flex gap-2.5 text-[0.5rem] text-ink-soft">
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
          <span className="pulse-doux mt-1 self-start rounded-full bg-terra-strong px-2.5 py-1 text-[0.52rem] font-semibold text-sand-card">
            {t.action}
          </span>
        </div>
        <span
          aria-hidden="true"
          className="size-16 shrink-0 rounded-full border-4 border-sage-strong bg-terra-wash shadow-inner"
        />
      </div>
      <div className="grid h-1/4 grid-cols-3 gap-2 px-4 pb-3">
        {t.cartes.map((c, i) => (
          <div
            key={c}
            className={`wf-settle flex items-end rounded-lg px-2 pb-1.5 text-[0.5rem] font-semibold text-ink-soft ${
              ["bg-sage-wash", "bg-terra-wash", "bg-sand-card shadow-elev-1"][i]
            }`}
            style={{ animationDelay: `${i * 0.2}s` }}
          >
            {c}
          </div>
        ))}
      </div>
    </div>
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
        <div className="wf-settle flex items-center justify-between rounded-xl bg-sage-wash px-3 py-2">
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
        {t.lignes.slice(1).map(([nom, dates], i) => (
          <div
            key={nom}
            className="wf-settle flex items-center justify-between rounded-xl bg-sand-card px-3 py-2 shadow-elev-1"
            style={{ animationDelay: `${0.3 + i * 0.25}s` }}
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
        <span className="pulse-doux inline-block rounded-full bg-terra-hot px-3 py-1.5 text-[0.58rem] font-semibold text-sand-card">
          {t.action}
        </span>
      </div>
    </div>
  );
}

/* ——— 03 · API : la réponse qui circule toute seule ——— */

function Api({ t }: { t: MockupTextes["api"] }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-ink-deep p-3.5 font-mono text-sand">
      <div className="flex items-center justify-between rounded-t-lg bg-ink/70 px-2.5 py-1.5">
        <span className="text-[0.55rem] font-bold text-sage">{t.requete}</span>
        <span className="rounded-full bg-sage px-1.5 py-0.5 text-[0.48rem] font-bold text-ink-deep">
          {t.statut}
        </span>
      </div>
      <div
        aria-hidden="true"
        className="flex flex-1 flex-col justify-center gap-1.5 rounded-b-lg border-x border-b border-sand/10 px-3 text-[0.55rem]"
      >
        <span className="text-sand/40">{"{"}</span>
        {t.lignes.map(([cle, valeur], i) => (
          <span key={cle} className="pl-3">
            <span className="text-sage">&quot;{cle}&quot;</span>
            <span className="text-sand/40">: </span>
            <span className="text-terra">&quot;{valeur}&quot;</span>
            {i < t.lignes.length - 1 && <span className="text-sand/40">,</span>}
          </span>
        ))}
        <span className="text-sand/40">{"}"}</span>
        {/* La requête suivante, déjà en train de partir */}
        <span className="mt-1 flex items-center gap-1.5">
          <span className="typing-line h-1.5 rounded-full bg-sage/70" />
          <span className="caret-blink h-2.5 w-0.5 shrink-0 bg-sand/80" />
        </span>
      </div>
      <div className="mt-2 flex items-center gap-1.5 rounded-md bg-ink/70 px-2.5 py-1">
        <span className="size-1.5 rounded-full bg-sage" aria-hidden="true" />
        <span className="text-[0.5rem] text-sage">{t.note}</span>
      </div>
    </div>
  );
}
