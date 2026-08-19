"use client";

import { useEffect, useState } from "react";

type Mode = "wireframe" | "inspection" | "retro";

const RACCOURCIS: Record<string, Mode> = { w: "wireframe", i: "inspection" };
const KONAMI = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
];

const ETIQUETTES: Record<Mode, { nom: string; touche: string }> = {
  wireframe: { nom: "Mode fil de fer", touche: "W" },
  inspection: { nom: "Mode inspection", touche: "I" },
  retro: { nom: "Mode 1988", touche: "Échap" },
};

/**
 * Les modes cachés du site : rien ne les annonce, on les trouve.
 * W passe la page en fil de fer, I ouvre l'inspecteur, et la vieille
 * séquence de manette bascule le site en 1988. Un mode actif affiche
 * toujours comment en sortir — un raccourci sans porte de sortie est
 * un piège.
 */
export default function SecretModes() {
  const [mode, setMode] = useState<Mode | null>(null);
  const [survol, setSurvol] = useState<string | null>(null);

  // Message pour qui ouvre les outils du navigateur
  useEffect(() => {
    const style =
      "color:#d95f2e;font:600 13px ui-monospace,monospace;padding:2px 0";
    console.log("%cR-X · studio d'ergonomie web", style);
    console.log(
      "%cVous êtes du métier ? Essayez les touches W et I. Et si vous connaissez le vieux code de manette…",
      "color:#5c6353;font:400 12px ui-monospace,monospace"
    );
  }, []);

  // Raccourcis clavier
  useEffect(() => {
    let sequence: string[] = [];

    const onKey = (e: KeyboardEvent) => {
      const cible = e.target as HTMLElement | null;
      if (
        e.metaKey ||
        e.ctrlKey ||
        e.altKey ||
        cible?.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(cible?.tagName ?? "")
      ) {
        return;
      }

      const touche = e.key.toLowerCase();

      if (touche === "escape") {
        setMode(null);
        return;
      }

      // La séquence de manette
      sequence = [...sequence, touche].slice(-KONAMI.length);
      if (KONAMI.every((k, i) => sequence[i] === k)) {
        sequence = [];
        setMode((m) => (m === "retro" ? null : "retro"));
        return;
      }

      const demande = RACCOURCIS[touche];
      if (demande) setMode((m) => (m === demande ? null : demande));
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Application du mode sur la page
  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("mode-wireframe", mode === "wireframe");
    html.classList.toggle("mode-retro", mode === "retro");
    html.classList.toggle("mode-inspection", mode === "inspection");
    return () => {
      html.classList.remove("mode-wireframe", "mode-retro", "mode-inspection");
    };
  }, [mode]);

  // L'inspecteur : dimensions et taille de texte de l'élément survolé
  useEffect(() => {
    if (mode !== "inspection") {
      // différé : vider l'état en pleine phase d'effet
      // déclencherait un rendu en cascade
      const vider = setTimeout(() => setSurvol(null), 0);
      return () => clearTimeout(vider);
    }
    const onMove = (e: PointerEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el || el.nodeType !== 1) return;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const taille = Math.round(parseFloat(cs.fontSize));
      setSurvol(
        `${el.tagName.toLowerCase()} · ${Math.round(r.width)}×${Math.round(
          r.height
        )} · ${taille}px`
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mode]);

  if (!mode) return null;
  const etiquette = ETIQUETTES[mode];

  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-[110] -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-full bg-ink-deep px-4 py-2 shadow-lg">
        <span className="size-2 shrink-0 rounded-full bg-terra-hot" />
        <span className="font-mono text-[0.68rem] font-semibold tracking-wide text-sand">
          {etiquette.nom}
        </span>
        <span className="font-mono text-[0.62rem] text-sand/55">
          {etiquette.touche === "Échap"
            ? "Échap pour quitter"
            : `${etiquette.touche} ou Échap pour quitter`}
        </span>
        {survol && (
          <span className="border-l border-sand/20 pl-3 font-mono text-[0.62rem] text-sage">
            {survol}
          </span>
        )}
      </div>
    </div>
  );
}
