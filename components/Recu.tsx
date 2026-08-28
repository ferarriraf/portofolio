import type { ReactNode } from "react";

/**
 * Le reçu : la ligne qu'imprime une machine quand elle vient d'agir.
 *
 * RÈGLE, à ne pas contourner — c'est elle qui empêche le procédé de
 * redevenir un costume :
 *
 *   1. Un reçu ne s'affiche QUE si une machine a réellement agi.
 *      Pas au défilement, pas à l'apparition d'un bloc, pas pour
 *      décorer un titre. Un constat n'est pas un reçu.
 *   2. Il ne porte JAMAIS une information qui ne soit pas déjà écrite
 *      en clair juste à côté. On les supprime tous, le site reste
 *      entier — le reçu est une matière, jamais un passage obligé.
 *   3. Il énonce un fait vérifiable, si possible chiffré. Une durée
 *      mesurée, un décompte recalculé. Jamais une promesse.
 *
 * La région vivante est montée en permanence et vide au repos : un
 * nœud créé après coup n'est pas annoncé par les lecteurs d'écran. Sa
 * hauteur est réservée, sinon l'écran remonterait sous le doigt au
 * moment précis du clic.
 *
 * L'éclat de rémanence est porté par un span INTÉRIEUR dont la clé
 * change : une animation posée sur le nœud permanent se jouerait au
 * montage — sur le vide — et ne rejouerait jamais.
 */
export default function Recu({
  children,
  signature,
  sombre = false,
  className,
}: {
  /** Le texte du reçu. Absent = région vide, au repos. */
  children?: ReactNode;
  /** Change à chaque événement : c'est ce qui rejoue l'éclat. */
  signature?: string | number;
  /** Sur les aplats encre, où la lueur et le calme changent de teinte */
  sombre?: boolean;
  className?: string;
}) {
  return (
    <p
      role="status"
      aria-live="polite"
      className={[
        "recu font-mono text-[0.75rem] tracking-[0.06em]",
        sombre ? "recu-sombre" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children ? (
        <span key={signature ?? String(children)} className="recu-vif">
          {/* Le carré plein : « c'est l'appareil qui parle ». Il ne
              porte aucune information, il est donc masqué. */}
          <span aria-hidden="true" className="recu-carre" />
          {children}
        </span>
      ) : null}
    </p>
  );
}
