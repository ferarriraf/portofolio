import Reveal from "./Reveal";
import RingsDecor from "./RingsDecor";
import { RingGlyph } from "./Logo";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  lede?: string;
};

export default function PageHeader({ eyebrow, title, lede }: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden pt-36 pb-12 md:pt-44 md:pb-16">
      <RingsDecor className="pointer-events-none absolute -top-24 -right-28 w-105 opacity-70 max-md:hidden" />
      <div className="container-site relative">
        <Reveal>
          <span className="eyebrow">
            <RingGlyph size={15} />
            {eyebrow}
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold tracking-tight text-ink md:text-6xl">
            {title}
          </h1>
        </Reveal>
        {lede && (
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              {lede}
            </p>
          </Reveal>
        )}
      </div>
    </header>
  );
}
