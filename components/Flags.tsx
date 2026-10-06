/**
 * Drapeaux ronds en SVG pur (pas d'emoji : rendu identique sur
 * tous les systèmes, Windows compris). Le clip circulaire est fait
 * par le span englobant (overflow-hidden), pas par un clipPath SVG,
 * pour éviter les collisions d'identifiants quand le drapeau
 * apparaît plusieurs fois sur la même page.
 */

function FlagShell({
  children,
  label,
  size,
}: {
  children: React.ReactNode;
  label: string;
  size: number;
}) {
  return (
    <span
      role="img"
      aria-label={label}
      className="inline-flex shrink-0 overflow-hidden rounded-full ring-1 ring-ink/10"
      style={{ width: size, height: size }}
    >
      {children}
    </span>
  );
}

export function FlagFR({ size = 18 }: { size?: number }) {
  return (
    <FlagShell label="Français" size={size}>
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
        <rect width="8" height="24" fill="#28459c" />
        <rect x="8" width="8" height="24" fill="#f4f4f2" />
        <rect x="16" width="8" height="24" fill="#c8323e" />
      </svg>
    </FlagShell>
  );
}

export function FlagGB({ size = 18 }: { size?: number }) {
  return (
    <FlagShell label="English" size={size}>
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
        <rect width="24" height="24" fill="#1e3c78" />
        <path
          d="M0 0 L24 24 M24 0 L0 24"
          stroke="#f4f4f2"
          strokeWidth="5"
        />
        <path
          d="M0 0 L24 24 M24 0 L0 24"
          stroke="#c8323e"
          strokeWidth="2"
        />
        <path d="M12 0 V24 M0 12 H24" stroke="#f4f4f2" strokeWidth="8" />
        <path d="M12 0 V24 M0 12 H24" stroke="#c8323e" strokeWidth="4.5" />
      </svg>
    </FlagShell>
  );
}
