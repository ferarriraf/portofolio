import Reveal from "./Reveal";
import SectionLabel from "./SectionLabel";
import SplitHeading from "./SplitHeading";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  lede?: string;
};

export default function PageHeader({ eyebrow, title, lede }: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden pt-36 pb-12 md:pt-48 md:pb-16">
      <div className="container-site relative">
        <Reveal>
          <SectionLabel>{eyebrow}</SectionLabel>
        </Reveal>
        <SplitHeading
          as="h1"
          text={title}
          delay={0.08}
          className="mt-6 max-w-4xl font-display text-[clamp(2.1rem,7.5vw,6.5rem)] font-bold leading-[1.02] tracking-tight text-balance text-ink"
        />
        {lede && (
          <Reveal delay={0.25}>
            <p className="mt-7 max-w-2xl text-xl leading-relaxed text-pretty text-ink-soft">
              {lede}
            </p>
          </Reveal>
        )}
      </div>
    </header>
  );
}
