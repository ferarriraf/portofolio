/**
 * Version décorative et discrète du motif d'anneaux, pour les
 * en-têtes de pages et les bandeaux. Purement ornementale.
 */
export default function RingsDecor({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="200" cy="200" r="192" stroke="var(--line)" strokeWidth="1" />
      <g className="ring-rotor" style={{ "--spin": "110s" } as never}>
        <circle
          cx="200"
          cy="200"
          r="152"
          stroke="var(--terra)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray="2 12"
        />
        <circle cx="200" cy="48" r="4" fill="var(--terra-strong)" />
      </g>
      <circle
        cx="200"
        cy="200"
        r="112"
        stroke="var(--sage)"
        strokeOpacity="0.55"
        strokeWidth="1.4"
      />
      <g
        className="ring-rotor ring-rotor--reverse"
        style={{ "--spin": "80s" } as never}
      >
        <circle cx="200" cy="200" r="112" stroke="transparent" strokeWidth="1" />
        <circle cx="200" cy="88" r="4.5" fill="var(--sage-strong)" />
      </g>
      <circle cx="200" cy="200" r="5" fill="var(--terra-strong)" />
    </svg>
  );
}
