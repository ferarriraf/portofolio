"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

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
const CLE_OFF = "rx-raccourcis-off";

/**
 * Les modes cachés du site : rien ne les annonce, on les trouve.
 * W passe la page en fil de fer, I ouvre l'inspecteur, et la vieille
 * séquence de manette bascule le site en 1988.
 *
 * Deux garde-fous : un mode actif affiche toujours comment en sortir,
 * et un bouton permet de couper définitivement les raccourcis — des
 * touches uniques peuvent gêner certains outils d'assistance
 * (WCAG 2.1.4), l'utilisateur doit pouvoir s'en défaire.
 */
export default function SecretModes() {
  const t = useTranslations("secret");
  const [mode, setMode] = useState<Mode | null>(null);
  const [coupes, setCoupes] = useState(false);
  const [survol, setSurvol] = useState<string | null>(null);

  // L'utilisateur a-t-il coupé les raccourcis lors d'une visite passée ?
  useEffect(() => {
    let off = false;
    try {
      off = localStorage.getItem(CLE_OFF) === "1";
    } catch {
      off = false;
    }
    if (!off) return;
    // différé : changer l'état en pleine phase d'effet
    // déclencherait un rendu en cascade
    const timer = setTimeout(() => setCoupes(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Message pour qui ouvre les outils du navigateur
  useEffect(() => {
    const style =
      "color:#d95f2e;font:600 13px ui-monospace,monospace;padding:2px 0";
    console.log("%c" + t("consoleTitre"), style);
    console.log(
      "%c" + t("consoleTexte"),
      "color:#5c6353;font:400 12px ui-monospace,monospace"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Raccourcis clavier
  useEffect(() => {
    if (coupes) return;
    let sequence: string[] = [];

    const onKey = (e: KeyboardEvent) => {
      const cible = e.target as HTMLElement | null;
      if (
        e.metaKey ||
        e.ctrlKey ||
        e.altKey ||
        e.shiftKey ||
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
  }, [coupes]);

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

  const couper = () => {
    setMode(null);
    setCoupes(true);
    // Le bouton focalisé disparaît avec la pastille : on pose le focus
    // sur le contenu plutôt que de l'abandonner sur <body>
    document.getElementById("contenu")?.focus();
    try {
      localStorage.setItem(CLE_OFF, "1");
    } catch {
      // sans stockage, la coupure ne vaut que pour cette page : tant pis
    }
    console.log(
      "%c" + t("consoleReactiver", { cle: CLE_OFF }),
      "color:#5c6353;font:400 12px ui-monospace,monospace"
    );
  };

  if (!mode) return null;

  // Pour le mode Konami, la touche de sortie EST Échap : ne pas
  // afficher « Échap ou Échap pour quitter »
  const sortie =
    mode === "retro"
      ? t("sortieEchap")
      : t("sortie", { touche: mode === "wireframe" ? "W" : "I" });

  return (
    <div className="fixed bottom-4 left-1/2 z-[110] -translate-x-1/2">
      {/* role=status : l'entrée et la sortie de mode sont annoncées
          aux lecteurs d'écran sans voler le focus */}
      <div
        role="status"
        className="flex items-center gap-3 rounded-full bg-ink-deep px-4 py-2 shadow-lg"
      >
        <span
          aria-hidden="true"
          className="size-2 shrink-0 rounded-full bg-terra-hot"
        />
        <span className="font-mono text-[0.68rem] font-semibold tracking-wide text-sand">
          {t(mode)}
        </span>
        <span className="font-mono text-[0.62rem] text-sand/55">{sortie}</span>
        {survol && (
          <span className="border-l border-sand/20 pl-3 font-mono text-[0.62rem] text-sage">
            {survol}
          </span>
        )}
        <button
          type="button"
          onClick={couper}
          className="rounded-full border border-sand/25 px-2 py-0.5 font-mono text-[0.6rem] text-sand/70 transition-colors hover:bg-sand/10 hover:text-sand"
        >
          {t("couper")}
        </button>
      </div>
    </div>
  );
}
