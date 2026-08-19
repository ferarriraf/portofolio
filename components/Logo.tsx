/**
 * Le logotype : une pastille pleine, franchement visible en haut à
 * gauche. Au survol elle se retourne et découvre la flèche de retour —
 * le lien vers l'accueil cesse d'être un détail.
 */
export default function Logo() {
  return (
    <span className="group/logo relative inline-flex size-11 items-center justify-center [perspective:400px]">
      <span className="relative size-full [transform-style:preserve-3d] transition-transform duration-500 group-hover/logo:[transform:rotateY(180deg)]">
        {/* Face avant : le logotype */}
        <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-terra-hot [backface-visibility:hidden]">
          <span className="font-display text-lg font-[800] tracking-[-0.05em] text-sand-card">
            R-X
          </span>
        </span>
        {/* Face arrière : la flèche de retour */}
        <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-ink-deep [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M14.5 5.5 8 12l6.5 6.5"
              stroke="var(--sand)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>
    </span>
  );
}
