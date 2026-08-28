"use client";

import { useEffect, useState } from "react";

const CLE = "rx-boot";

/**
 * L'arrivée sur le site : le logotype se pose, un trait se remplit,
 * puis la marque grandit et se dissout pendant que le site s'ouvre par
 * un cercle parti d'elle. Une fois par session.
 *
 * Toute la séquence — y compris la disparition de l'écran — vit dans
 * `app/globals.css` (`.ecran-boot`), en CSS pur. Le JavaScript ne sert
 * qu'à deux choses : retirer le nœud du document une fois l'ouverture
 * finie, et sauter l'écran quand la session l'a déjà vu. Sans
 * JavaScript, l'ouverture se joue quand même et le site apparaît.
 *
 * Ces durées sont le miroir des variables --boot-* de globals.css :
 * les changer d'un côté sans l'autre laisserait le nœud en place ou le
 * retirerait en pleine ouverture.
 */
const SEQUENCE_MS = 350 + 450 + 900;

export default function BootScreen() {
  const [retire, setRetire] = useState(false);

  useEffect(() => {
    let vu = false;
    try {
      vu = sessionStorage.getItem(CLE) === "1";
    } catch {
      // navigation privée stricte : l'écran reviendra, sans gravité
    }

    // Lu ici et non pendant le rendu : la valeur n'existe pas côté
    // serveur, et s'en servir pour choisir le balisage casserait
    // l'hydratation.
    const mouvementReduit = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const rendreLaPage = () => setRetire(true);

    if (vu || mouvementReduit) {
      const immediat = setTimeout(rendreLaPage, 0);
      return () => clearTimeout(immediat);
    }

    // Pas de verrou de défilement : la séquence dure 1,7 s et le site
    // apparaît en place. Bloquer le défilement laisserait, en cas
    // d'interruption, une page qu'on ne peut plus faire défiler.
    const fin = setTimeout(() => {
      // La session n'est marquée qu'à la FIN, jamais au montage : en
      // développement React joue chaque effet deux fois, et marquer trop
      // tôt ferait croire au second passage que l'ouverture a déjà eu
      // lieu — l'écran se retirerait aussitôt.
      try {
        sessionStorage.setItem(CLE, "1");
      } catch {
        // sans stockage de session, l'écran reviendra : sans gravité
      }
      rendreLaPage();
    }, SEQUENCE_MS);

    return () => clearTimeout(fin);
  }, []);

  if (retire) return null;

  return (
    // Masqué aux lecteurs d'écran : ils lisent déjà le vrai contenu,
    // qui est présent dans le document sous l'ouverture.
    <div className="ecran-boot" aria-hidden="true">
      <span className="ecran-boot__fond" />
      <span className="ecran-boot__iris" />

      <span className="ecran-boot__marque">
        <span className="boot-logo font-display text-5xl font-[800] tracking-[-0.05em] text-ink">
          R<span className="text-terra-hot">-</span>X
        </span>

      </span>
    </div>
  );
}
