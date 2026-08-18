import Reveal from "./Reveal";

type Item = { title: string; text: string };

/**
 * Liste éditoriale : titres géants estompés qui reprennent leur
 * encre au survol, la rangée se teinte de sauge ou de terracotta.
 * Sur mobile, tout est visible d'emblée.
 */
export default function ApproachList({ items }: { items: Item[] }) {
  return (
    <div className="border-t border-line">
      {items.map((item, i) => (
        <Reveal key={item.title}>
          <div
            className={`group -mx-4 grid gap-3 border-b border-line px-4 py-8 transition-colors duration-500 md:-mx-6 md:grid-cols-[3.5rem_1fr_1fr] md:items-center md:gap-8 md:px-6 md:py-12 ${
              i % 2 ? "hover:bg-terra-wash" : "hover:bg-sage-wash"
            }`}
          >
            <span className="font-display text-base font-bold text-terra-strong">
              0{i + 1}
            </span>
            <h3 className="font-display text-4xl font-bold tracking-tight text-ink transition-colors duration-500 md:text-6xl md:text-ink/30 md:group-hover:text-ink lg:text-7xl">
              {item.title}
            </h3>
            <p className="max-w-md leading-relaxed text-ink-soft transition-all duration-500 md:translate-y-2 md:opacity-50 md:group-hover:translate-y-0 md:group-hover:opacity-100">
              {item.text}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
