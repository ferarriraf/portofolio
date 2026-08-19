type Variant = "dashboard" | "shop" | "health";

/**
 * Couvertures des études de cas : des fragments d'interface, pas des
 * illustrations. Chaque projet a son aplat — sauge, terracotta, encre.
 * À remplacer par de vraies captures quand les projets réels arriveront.
 */
export default function CaseCover({ variant }: { variant: Variant }) {
  return (
    <svg
      viewBox="0 0 480 340"
      fill="none"
      className="h-full w-full"
      aria-hidden="true"
    >
      {variant === "dashboard" && (
        <>
          <rect width="480" height="340" fill="var(--sage)" />
          {/* Colonne de navigation */}
          <rect x="34" y="34" width="96" height="272" rx="10" fill="var(--sand-card)" opacity="0.55" />
          <rect x="48" y="52" width="60" height="9" rx="4.5" fill="var(--ink-deep)" opacity="0.45" />
          <rect x="48" y="74" width="46" height="9" rx="4.5" fill="var(--ink-deep)" opacity="0.28" />
          <rect x="48" y="96" width="52" height="9" rx="4.5" fill="var(--ink-deep)" opacity="0.28" />
          {/* Tableau : l'information trouvée en deux clics */}
          <rect x="150" y="34" width="296" height="60" rx="10" fill="var(--sand-card)" />
          <rect x="168" y="54" width="104" height="10" rx="5" fill="var(--terra-strong)" />
          <rect x="168" y="72" width="180" height="8" rx="4" fill="var(--ink-deep)" opacity="0.25" />
          <rect x="150" y="110" width="296" height="196" rx="10" fill="var(--sand-card)" opacity="0.9" />
          {[0, 1, 2, 3].map((r) => (
            <g key={r} transform={`translate(0 ${r * 44})`}>
              <rect x="170" y="134" width="70" height="8" rx="4" fill="var(--ink-deep)" opacity="0.35" />
              <rect x="262" y="134" width="112" height="8" rx="4" fill="var(--ink-deep)" opacity="0.18" />
              <rect x="392" y="128" width="36" height="20" rx="10" fill={r === 1 ? "var(--terra)" : "var(--sage)"} opacity={r === 1 ? 1 : 0.5} />
            </g>
          ))}
        </>
      )}

      {variant === "shop" && (
        <>
          <rect width="480" height="340" fill="var(--terra)" />
          {/* Fiche produit et panier : le parcours raccourci */}
          <rect x="34" y="40" width="180" height="180" rx="12" fill="var(--sand-card)" />
          <rect x="56" y="62" width="136" height="98" rx="8" fill="var(--terra-wash)" />
          <rect x="56" y="176" width="92" height="10" rx="5" fill="var(--ink-deep)" opacity="0.5" />
          <rect x="56" y="194" width="58" height="10" rx="5" fill="var(--ink-deep)" opacity="0.25" />
          <rect x="248" y="40" width="198" height="42" rx="10" fill="var(--sand-card)" opacity="0.65" />
          <rect x="248" y="96" width="198" height="42" rx="10" fill="var(--sand-card)" opacity="0.65" />
          {/* L'étape en cours */}
          <rect x="248" y="152" width="198" height="52" rx="10" fill="var(--sand-card)" />
          <rect x="268" y="172" width="76" height="12" rx="6" fill="var(--ink-deep)" opacity="0.55" />
          {/* Le bouton de paiement, seul élément plein */}
          <rect x="34" y="248" width="412" height="52" rx="26" fill="var(--ink-deep)" />
          <rect x="192" y="268" width="96" height="12" rx="6" fill="var(--sand)" />
        </>
      )}

      {variant === "health" && (
        <>
          <rect width="480" height="340" fill="var(--ink-deep)" />
          {/* Parcours patient : des étapes courtes, de gros caractères */}
          <rect x="40" y="44" width="400" height="12" rx="6" fill="var(--sand)" opacity="0.14" />
          <rect x="40" y="44" width="150" height="12" rx="6" fill="var(--sage)" />
          <rect x="40" y="96" width="260" height="22" rx="8" fill="var(--sand)" opacity="0.9" />
          <rect x="40" y="132" width="188" height="14" rx="7" fill="var(--sand)" opacity="0.4" />
          {/* Deux réponses possibles, larges et lisibles */}
          <rect x="40" y="182" width="400" height="52" rx="12" fill="var(--sand)" opacity="0.12" stroke="var(--sage)" strokeWidth="2" />
          <rect x="64" y="202" width="120" height="12" rx="6" fill="var(--sand)" opacity="0.75" />
          <rect x="40" y="248" width="400" height="52" rx="12" fill="var(--sand)" opacity="0.08" />
          <rect x="64" y="268" width="150" height="12" rx="6" fill="var(--sand)" opacity="0.45" />
        </>
      )}
    </svg>
  );
}
