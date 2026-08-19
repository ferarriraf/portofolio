"use client";

import { useEffect } from "react";

/**
 * Désactive le menu contextuel sur l'ensemble du site.
 *
 * Les champs de saisie en sont exclus : y bloquer le clic droit
 * empêcherait de coller ou de corriger un mot, ce qui gênerait
 * l'utilisateur sans rien protéger.
 */
export default function NoContextMenu() {
  useEffect(() => {
    const onMenu = (e: MouseEvent) => {
      const cible = e.target as HTMLElement | null;
      if (
        cible?.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(cible?.tagName ?? "")
      ) {
        return;
      }
      e.preventDefault();
    };
    document.addEventListener("contextmenu", onMenu);
    return () => document.removeEventListener("contextmenu", onMenu);
  }, []);

  return null;
}
