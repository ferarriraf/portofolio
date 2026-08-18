type Variant = "dashboard" | "shop" | "health";

/**
 * Couvertures abstraites des études de cas : chaque projet a son
 * fond de couleur franc — sauge, terracotta, encre. À remplacer
 * par de vraies captures d'écran quand les projets réels arriveront.
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
          {/* Panneau d'un tableau de bord apaisé */}
          <rect x="48" y="64" width="176" height="20" rx="10" fill="var(--sand-card)" />
          <rect x="48" y="104" width="132" height="20" rx="10" fill="var(--sand-card)" opacity="0.75" />
          <rect x="48" y="144" width="96" height="20" rx="10" fill="var(--sand-card)" opacity="0.5" />
          <rect x="48" y="204" width="176" height="72" rx="14" fill="var(--sand-card)" />
          <rect x="66" y="226" width="76" height="10" rx="5" fill="var(--terra-strong)" />
          <rect x="66" y="248" width="112" height="10" rx="5" fill="var(--sage)" />
          {/* La cible : l'information trouvée en deux clics */}
          <circle cx="352" cy="170" r="92" stroke="var(--sand-card)" strokeWidth="2.5" strokeDasharray="2 12" strokeLinecap="round" />
          <circle cx="352" cy="170" r="56" stroke="var(--ink-deep)" strokeWidth="2" />
          <circle cx="352" cy="170" r="12" fill="var(--terra-strong)" />
        </>
      )}

      {variant === "shop" && (
        <>
          <rect width="480" height="340" fill="var(--terra)" />
          {/* Le parcours d'achat : un chemin de points vers la cible */}
          <path
            d="M60 268 C140 250, 180 210, 240 178 S 350 130, 396 112"
            stroke="var(--sand-card)"
            strokeWidth="2.5"
            strokeDasharray="1 14"
            strokeLinecap="round"
          />
          <circle cx="60" cy="268" r="7" fill="var(--sand-card)" />
          <circle cx="152" cy="236" r="8" fill="var(--sand-card)" />
          <circle cx="240" cy="178" r="9" fill="var(--ink-deep)" />
          <circle cx="322" cy="140" r="10" fill="var(--ink-deep)" />
          {/* L'arrivée : le paiement, serein */}
          <circle cx="396" cy="112" r="40" stroke="var(--sand-card)" strokeWidth="3" />
          <circle cx="396" cy="112" r="14" fill="var(--ink-deep)" />
          <path d="M389.5 112 l4.5 4.5 l8.5 -9" stroke="var(--sand-card)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="52" y="60" width="120" height="14" rx="7" fill="var(--sand-card)" opacity="0.85" />
          <rect x="52" y="86" width="84" height="14" rx="7" fill="var(--sand-card)" opacity="0.5" />
        </>
      )}

      {variant === "health" && (
        <>
          <rect width="480" height="340" fill="var(--ink-deep)" />
          {/* Le tracé du pouls, apaisé */}
          <path
            d="M36 190 H150 l20 -44 26 84 24 -40 h60 l18 -28 22 28 h124"
            stroke="var(--sage)"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Le battement au centre de l'attention */}
          <circle cx="220" cy="186" r="66" stroke="var(--terra)" strokeWidth="2.2" strokeDasharray="2 12" strokeLinecap="round" />
          <circle cx="220" cy="186" r="10" fill="var(--terra)" />
          <rect x="316" y="238" width="116" height="16" rx="8" fill="var(--sand)" opacity="0.35" />
          <rect x="316" y="266" width="84" height="16" rx="8" fill="var(--sand)" opacity="0.18" />
        </>
      )}
    </svg>
  );
}
