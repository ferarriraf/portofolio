import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import CaseCover from "@/components/CaseCover";
import GrandArc from "@/components/GrandArc";
import HeroTitle from "@/components/HeroTitle";
import Marquee from "@/components/Marquee";
import ApproachList from "@/components/ApproachList";
import SplitHeading from "@/components/SplitHeading";
import { RingGlyph } from "@/components/Logo";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "home", "/");
}

const coverVariants = ["dashboard", "shop"] as const;

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tw = await getTranslations("work");

  const approach = t.raw("approach.items") as { title: string; text: string }[];
  const steps = t.raw("process.steps") as { title: string; text: string }[];
  const marquee = t.raw("marquee") as string[];
  const projects = (
    tw.raw("projects") as { name: string; sector: string; tags: string[] }[]
  ).slice(0, 2);

  return (
    <>
      {/* ——— Hero : typo géante + grands arcs ——— */}
      <section className="relative overflow-hidden">
        <GrandArc className="pointer-events-none absolute -top-44 right-[-30rem] w-300 opacity-90 md:right-[-26rem] lg:right-[-20rem]" />
        <div className="container-site relative flex min-h-svh flex-col justify-center pt-36 pb-20 lg:pt-28">
          <Reveal>
            <span className="eyebrow">
              <RingGlyph size={15} />
              {t("eyebrow")}
            </span>
          </Reveal>
          <HeroTitle
            lineA={t("titleA")}
            lineB={t("titleB")}
            caption={t("ringCenter")}
          />
          <Reveal delay={0.4}>
            <p className="mt-10 max-w-xl text-xl leading-relaxed text-ink-soft">
              {t("lede")}
            </p>
          </Reveal>
          <Reveal delay={0.5}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/services" className="btn btn-primary btn-lg group">
                {t("ctaServices")}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link href="/contact" className="btn btn-secondary btn-lg">
                {t("ctaContact")}
              </Link>
            </div>
          </Reveal>
        </div>
        <Marquee items={marquee} className="relative" />
      </section>

      {/* ——— Approche : liste éditoriale, titres en contour ——— */}
      <section className="container-site py-24 md:py-32">
        <Reveal>
          <span className="eyebrow">
            <RingGlyph size={15} />
            {t("approach.eyebrow")}
          </span>
        </Reveal>
        <SplitHeading
          text={t("approach.title")}
          delay={0.06}
          className="mt-5 max-w-3xl font-display text-[clamp(2.4rem,5.5vw,4.5rem)] font-bold leading-[1.04] tracking-tight text-ink"
        />
        <div className="mt-14">
          <ApproachList items={approach} />
        </div>
      </section>

      {/* ——— Manifeste : bloc encre, plein contraste ——— */}
      <section className="relative overflow-hidden bg-ink-deep text-sand">
        <GrandArc className="pointer-events-none absolute -bottom-125 -left-60 w-225 opacity-40" />
        <div className="container-site relative py-24 md:py-40">
          <RingGlyph size={26} />
          <p className="mt-8 max-w-4xl font-display text-[clamp(2.2rem,6vw,5.5rem)] font-bold leading-[1.05] tracking-tight">
            <SplitHeading as="span" text={t("manifesto.lead")} className="text-sand" />{" "}
            <SplitHeading
              as="span"
              text={t("manifesto.emph")}
              delay={0.25}
              className="text-terra"
            />
          </p>
        </div>
      </section>

      {/* ——— Méthode : bloc sauge, numéros en contour ——— */}
      <section className="border-b border-line bg-sage-wash">
        <div className="container-site py-24 md:py-32">
          <Reveal>
            <span className="eyebrow">
              <RingGlyph size={15} />
              {t("process.eyebrow")}
            </span>
          </Reveal>
          <SplitHeading
            text={t("process.title")}
            delay={0.06}
            className="mt-5 max-w-3xl font-display text-[clamp(2.4rem,5.5vw,4.5rem)] font-bold leading-[1.04] tracking-tight text-ink"
          />
          <ol className="mt-16 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step.title} className="h-full">
                <Reveal delay={0.07 * i} className="h-full">
                  <span className="text-outline-ink font-display text-6xl font-bold md:text-7xl">
                    0{i + 1}
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 leading-relaxed text-ink-soft">
                    {step.text}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ——— Réalisations en vitrine ——— */}
      <section className="container-site py-24 md:py-32">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="eyebrow">
                <RingGlyph size={15} />
                {t("work.eyebrow")}
              </span>
              <SplitHeading
                text={t("work.title")}
                className="mt-5 max-w-2xl font-display text-[clamp(2.4rem,5.5vw,4.5rem)] font-bold leading-[1.04] tracking-tight text-ink"
              />
            </div>
            <Link
              href="/realisations"
              className="group inline-flex items-center gap-2 pb-2 text-sm font-semibold text-sage-deep transition-colors hover:text-ink"
            >
              {t("work.cta")}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2">
          {projects.map((p, i) => (
            <Link
              key={p.name}
              href="/realisations"
              className="group block"
            >
              <Reveal variant="mask" delay={0.08 * i}>
                <div className="overflow-hidden rounded-3xl">
                  <div className="aspect-4/3 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                    <CaseCover variant={coverVariants[i]} />
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.08 * i + 0.15}>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage-deep">
                      {p.sector}
                    </p>
                    <h3 className="mt-1.5 font-display text-2xl font-bold text-ink md:text-3xl">
                      {p.name}
                    </h3>
                  </div>
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink transition-all duration-300 group-hover:bg-ink group-hover:text-sand">
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-line bg-sand-card px-3 py-1 text-xs font-medium text-ink-soft"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </Link>
          ))}
        </div>
      </section>

      <CtaBand
        title={t("cta.title")}
        text={t("cta.text")}
        buttonLabel={t("cta.button")}
      />
    </>
  );
}
