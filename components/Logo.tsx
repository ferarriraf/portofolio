export function RingGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10.5" stroke="var(--sage-strong)" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="6" stroke="var(--terra-strong)" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="2" fill="var(--ink)" />
    </svg>
  );
}

export default function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <RingGlyph />
      <span className="font-display text-xl font-bold tracking-tight text-ink">
        R-X
      </span>
    </span>
  );
}
