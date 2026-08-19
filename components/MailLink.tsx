"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * L'adresse de contact, absente du code source de la page.
 *
 * Les aspirateurs d'adresses lisent le HTML brut sans exécuter le
 * JavaScript : tant que l'adresse n'y figure pas, ils repartent les
 * mains vides. Elle est donc gardée en morceaux et recomposée à
 * l'affichage. Un visiteur sans JavaScript voit une forme lisible
 * qu'il peut recopier à la main.
 */
// Chaque morceau est stocké à l'envers : la chaîne complète
// n'apparaît nulle part, ni dans le code livré ni dans le HTML.
const MORCEAUX = ["tcatnoc", "x-r", "rf"];

const envers = (m: string) => m.split("").reverse().join("");

export function recomposerAdresse() {
  const [boite, domaine, extension] = MORCEAUX.map(envers);
  return `${boite}@${domaine}.${extension}`;
}

/** Version lisible mais inutilisable par un robot */
const SECOURS = "contact [chez] r-x.fr";

export default function MailLink({
  className,
  children,
}: {
  className?: string;
  /** Contenu personnalisé ; sans lui, l'adresse s'affiche telle quelle */
  children?: (adresse: string) => ReactNode;
}) {
  const [adresse, setAdresse] = useState<string | null>(null);

  useEffect(() => {
    // différé : composer l'adresse en pleine phase d'effet
    // déclencherait un rendu en cascade
    const t = setTimeout(() => setAdresse(recomposerAdresse()), 0);
    return () => clearTimeout(t);
  }, []);

  if (!adresse) {
    return <span className={className}>{SECOURS}</span>;
  }

  return (
    <a href={`mailto:${adresse}`} className={className}>
      {children ? children(adresse) : adresse}
    </a>
  );
}
