type Variant = "dashboard" | "shop" | "health";

/**
 * L'état d'origine de chaque projet : dense, gris, saturé de bordures.
 * Rien de caricatural — juste ce que devient une interface qu'on a
 * empilée pendant dix ans.
 */
export default function CaseCoverBefore({ variant }: { variant: Variant }) {
  const trait = "#b9b4a6";
  const bloc = "#e4e1d8";

  return (
    <svg
      viewBox="0 0 480 340"
      fill="none"
      className="h-full w-full"
      aria-hidden="true"
    >
      <rect width="480" height="340" fill="#eeece5" />

      {variant === "dashboard" && (
        <>
          {/* Menus empilés et tableau surchargé */}
          <rect x="0" y="0" width="480" height="22" fill={bloc} stroke={trait} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x={10 + i * 62} y="6" width="52" height="10" fill="#cfcabb" />
          ))}
          <rect x="0" y="22" width="480" height="18" fill="#e9e6dd" stroke={trait} />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <rect key={i} x={8 + i * 44} y="27" width="36" height="8" fill="#d6d1c2" />
          ))}
          {/* Grille dense */}
          {Array.from({ length: 9 }).map((_, r) => (
            <g key={r}>
              <rect x="8" y={48 + r * 30} width="464" height="28" fill={r % 2 ? "#e7e4db" : "#f2f0e9"} stroke={trait} strokeWidth="0.8" />
              {[0, 1, 2, 3, 4, 5].map((c) => (
                <rect key={c} x={18 + c * 76} y={58 + r * 30} width={c === 0 ? 58 : 44} height="8" fill="#c3bfb1" />
              ))}
            </g>
          ))}
        </>
      )}

      {variant === "shop" && (
        <>
          {/* Tunnel d'achat à rallonge */}
          <rect x="0" y="0" width="480" height="26" fill={bloc} stroke={trait} />
          <rect x="12" y="8" width="80" height="10" fill="#cfcabb" />
          <rect x="380" y="6" width="88" height="14" fill="#d6d1c2" stroke={trait} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={i}>
              <rect x="20" y={44 + i * 44} width="440" height="34" fill="#f2f0e9" stroke={trait} strokeWidth="0.8" />
              <rect x="32" y={56 + i * 44} width="120" height="9" fill="#c3bfb1" />
              <rect x="170" y={56 + i * 44} width="200" height="9" fill="#d8d4c8" />
              <rect x="392" y={52 + i * 44} width="56" height="18" fill="#ddd9cd" stroke={trait} />
            </g>
          ))}
          <rect x="20" y="308" width="130" height="20" fill="#ddd9cd" stroke={trait} />
        </>
      )}

      {variant === "health" && (
        <>
          {/* Formulaire administratif, tout en petit */}
          <rect x="0" y="0" width="480" height="30" fill={bloc} stroke={trait} />
          <rect x="14" y="10" width="130" height="10" fill="#cfcabb" />
          <rect x="24" y="48" width="432" height="250" fill="#f4f2ec" stroke={trait} />
          {Array.from({ length: 7 }).map((_, i) => (
            <g key={i}>
              <rect x="40" y={66 + i * 32} width="96" height="8" fill="#c3bfb1" />
              <rect x="150" y={60 + i * 32} width="286" height="18" fill="#ffffff" stroke={trait} strokeWidth="0.8" />
            </g>
          ))}
          <rect x="330" y="300" width="106" height="20" fill="#ddd9cd" stroke={trait} />
        </>
      )}
    </svg>
  );
}
