type Variant = "dashboard" | "shop" | "health";

/**
 * Couvertures abstraites des études de cas : compositions SVG
 * dans la palette du site, une par projet. À remplacer par de
 * vraies captures d'écran quand les projets réels arriveront.
 */
export default function CaseCover({ variant }: { variant: Variant }) {
  return (
    <svg
      viewBox="0 0 480 340"
      fill="none"
      className="h-full w-full"
      aria-hidden="true"
    >
      <rect width="480" height="340" fill="var(--sand-deep)" />

      {variant === "dashboard" && (
        <>
          {/* Panneau de gauche : lignes d'un tableau de bord apaisé */}
          <rect x="48" y="64" width="176" height="20" rx="10" fill="var(--sage)" />
          <rect x="48" y="104" width="132" height="20" rx="10" fill="var(--sage)" opacity="0.65" />
          <rect x="48" y="144" width="96" height="20" rx="10" fill="var(--sage)" opacity="0.4" />
          <rect x="48" y="204" width="176" height="72" rx="14" fill="var(--sand-card)" stroke="var(--line)" />
          <rect x="66" y="226" width="76" height="10" rx="5" fill="var(--terra)" />
          <rect x="66" y="248" width="112" height="10" rx="5" fill="var(--line)" />
          {/* La cible : l'information trouvée en deux clics */}
          <circle cx="352" cy="170" r="92" stroke="var(--terra)" strokeWidth="2" strokeDasharray="2 12" strokeLinecap="round" />
          <circle cx="352" cy="170" r="56" stroke="var(--sage-strong)" strokeWidth="1.6" />
          <circle cx="352" cy="170" r="10" fill="var(--terra-strong)" />
        </>
      )}

      {variant === "shop" && (
        <>
          {/* Le parcours d'achat : un chemin de points vers la cible */}
          <path
            d="M60 268 C140 250, 180 210, 240 178 S 350 130, 396 112"
            stroke="var(--line)"
            strokeWidth="2"
            strokeDasharray="1 14"
            strokeLinecap="round"
          />
          <circle cx="60" cy="268" r="7" fill="var(--sage)" />
          <circle cx="152" cy="236" r="8" fill="var(--sage)" />
          <circle cx="240" cy="178" r="9" fill="var(--sage-strong)" />
          <circle cx="322" cy="140" r="10" fill="var(--sage-strong)" />
          {/* L'arrivée : le paiement, serein */}
          <circle cx="396" cy="112" r="40" stroke="var(--terra)" strokeWidth="2.4" />
          <circle cx="396" cy="112" r="13" fill="var(--terra-strong)" />
          <path d="M390 112 l4.5 4.5 l8 -9" stroke="var(--sand-card)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="52" y="60" width="120" height="14" rx="7" fill="var(--terra)" opacity="0.55" />
          <rect x="52" y="86" width="84" height="14" rx="7" fill="var(--line)" />
        </>
      )}

      {variant === "health" && (
        <>
          {/* Le tracé du pouls, apaisé */}
          <path
            d="M36 190 H150 l20 -44 26 84 24 -40 h60 l18 -28 22 28 h124"
            stroke="var(--sage-strong)"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Le battement au centre de l'attention */}
          <circle cx="220" cy="186" r="66" stroke="var(--terra)" strokeWidth="2" strokeDasharray="2 12" strokeLinecap="round" />
          <circle cx="220" cy="186" r="9" fill="var(--terra-strong)" />
          <rect x="316" y="238" width="116" height="16" rx="8" fill="var(--sage)" opacity="0.6" />
          <rect x="316" y="266" width="84" height="16" rx="8" fill="var(--line)" />
        </>
      )}
    </svg>
  );
}
