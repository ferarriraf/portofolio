type MarqueeProps = {
  items: string[];
  className?: string;
};

/** Bandeau défilant : les mots du métier, alternant plein et contour. */
export default function Marquee({ items, className }: MarqueeProps) {
  const row = (hidden: boolean) => (
    <ul
      className="flex shrink-0 items-center"
      aria-hidden={hidden || undefined}
    >
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-center font-display text-3xl font-bold tracking-tight md:text-5xl"
        >
          <span
            className={`px-6 md:px-9 ${
              ["text-sand", "text-terra", "text-sage"][i % 3]
            }`}
          >
            {item}
          </span>
          <span
            aria-hidden="true"
            className={`size-2.5 rounded-full md:size-3 ${
              i % 2 ? "bg-sage" : "bg-terra"
            }`}
          />
        </li>
      ))}
    </ul>
  );

  return (
    // Une fente usinée dans la page : gorge en creux, bords qui
    // avalent les mots — cousine de la fente disquette du Mac.
    // Elle s'arrête sous la souris pour laisser lire.
    <div
      className={`marquee-slot relative overflow-hidden bg-ink-deep py-5 shadow-[inset_0_10px_16px_-10px_rgba(0,0,0,0.7),inset_0_-10px_16px_-10px_rgba(0,0,0,0.6)] md:py-6 ${className ?? ""}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink-deep to-transparent md:w-28"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink-deep to-transparent md:w-28"
      />
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
