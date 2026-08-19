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
    <div
      className={`overflow-hidden bg-ink-deep py-5 md:py-6 ${className ?? ""}`}
    >
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
