/**
 * Le logotype : R-X en grand, le tiret en terracotta. Au survol le
 * nom glisse et une flèche de retour se pose à sa gauche.
 *
 * La flèche est hors du flux : si elle poussait le texte, celui-ci
 * se décalerait hors du cadre et se ferait rogner.
 */
export default function Logo() {
  return (
    <span className="group/logo relative inline-flex items-center py-1 pl-1">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="absolute -left-3 opacity-0 transition-all duration-300 ease-out group-hover/logo:-left-4 group-hover/logo:opacity-100"
      >
        <path
          d="M14.5 5.5 8 12l6.5 6.5"
          stroke="var(--terra-hot)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-display text-3xl leading-none font-[800] tracking-[-0.05em] text-ink transition-transform duration-300 ease-out group-hover/logo:translate-x-1.5">
        R<span className="text-terra-hot">-</span>X
      </span>
    </span>
  );
}
