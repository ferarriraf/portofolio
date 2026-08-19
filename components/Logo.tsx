/**
 * Le logotype : R-X en grand, le tiret en terracotta. Au survol le
 * nom glisse et laisse entrer la flèche de retour — un déplacement,
 * pas une pirouette.
 */
export default function Logo() {
  return (
    <span className="group/logo relative inline-flex h-9 items-center overflow-hidden pr-1">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="-ml-5 shrink-0 opacity-0 transition-all duration-300 ease-out group-hover/logo:ml-0 group-hover/logo:opacity-100"
      >
        <path
          d="M14.5 5.5 8 12l6.5 6.5"
          stroke="var(--terra-hot)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-display text-3xl font-[800] tracking-[-0.05em] text-ink transition-transform duration-300 ease-out group-hover/logo:translate-x-1">
        R<span className="text-terra-hot">-</span>X
      </span>
    </span>
  );
}
