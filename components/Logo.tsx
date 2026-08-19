/**
 * Le logotype : R-X en grand, le tiret en terracotta. Au survol il
 * pivote et découvre la flèche de retour — l'animation signale que
 * c'est bien le chemin vers l'accueil, sans habiller le nom.
 */
export default function Logo() {
  return (
    <span className="group/logo relative inline-flex h-9 w-16 items-center [perspective:500px]">
      <span className="relative size-full [transform-style:preserve-3d] transition-transform duration-500 group-hover/logo:[transform:rotateX(180deg)]">
        {/* Face avant : le nom */}
        <span className="absolute inset-0 flex items-center [backface-visibility:hidden]">
          <span className="font-display text-3xl font-[800] tracking-[-0.05em] text-ink">
            R<span className="text-terra-hot">-</span>X
          </span>
        </span>
        {/* Face arrière : le retour à l'accueil */}
        <span className="absolute inset-0 flex items-center gap-1.5 [backface-visibility:hidden] [transform:rotateX(180deg)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M14.5 5.5 8 12l6.5 6.5"
              stroke="var(--terra-hot)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-display text-lg font-bold tracking-tight text-ink">
            R-X
          </span>
        </span>
      </span>
    </span>
  );
}
