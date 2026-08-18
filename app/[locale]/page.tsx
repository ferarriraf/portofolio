import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  PenTool,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import Rings from "@/components/Rings";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import CaseCover from "@/components/CaseCover";
import { RingGlyph } from "@/components/Logo";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "home", "/");
}

const approachIcons = [Search, PenTool, SlidersHorizontal];
const coverVariants = ["dashboard", "shop"] as const;

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tw = await getTranslations("work");

  const approach = t.raw("approach.items") as { title: string; text: string }[];
  const steps = t.raw("process.steps") as { title: string; text: string }[];
  const projects = (
    tw.raw("projects") as { name: string; sector: string; tags: string[] }[]
  ).slice(0, 2);

  return (
    <>
      {/* ——— Hero : l'utilisateur au centre ——— */}
      <section className="relative overflow-hidden">
        <div className="container-site grid items-center gap-8 pt-32 pb-16 lg:min-h-svh lg:grid-cols-[1.05fr_0.9fr] lg:pt-24 lg:pb-24">
          <div>
            <Reveal>
              <span className="eyebrow">
                <RingGlyph size={15} />
                {t("eyebrow")}
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-6 font-display text-5xl font-bold leading-[1.04] tracking-tight text-ink md:text-7xl">
                {t("titleA")}{" "}
                <br />
                <span className="text-terra-strong">{t("titleB")}</span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft">
                {t("lede")}
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/services" className="btn btn-primary group">
                  {t("ctaServices")}
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link href="/contact" className="btn btn-secondary">
                  {t("ctaContact")}
                </Link>
              </div>
            </Reveal>
          </div>

          <Rings
            centerLabel={t("ringCenter")}
            className="mx-auto aspect-square w-full max-w-95 lg:max-w-none"
          />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2.5 lg:flex"
        >
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-ink-soft">
            {t("scrollHint")}
          </span>
          <span className="scroll-hint-dot block h-7 w-px bg-ink-soft/70" />
        </div>
      </section>

      {/* ——— Approche : trois temps ——— */}
      <section className="container-site py-24">
        <Reveal>
          <span className="eyebrow">
            <RingGlyph size={15} />
            {t("approach.eyebrow")}
          </span>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight text-ink md:text-5xl">
            {t("approach.title")}
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {approach.map((item, i) => {
            const Icon = approachIcons[i];
            return (
              <Reveal key={item.title} delay={0.08 * i} className="h-full">
                <article className="card-hover group h-full rounded-2xl border border-line bg-sand-card p-8">
                  <span className="relative inline-flex size-14 items-center justify-center">
                    <span className="absolute inset-0 rounded-full border border-sage transition-transform duration-500 group-hover:scale-110" />
                    <span className="absolute inset-2 rounded-full border border-terra/70 transition-transform duration-500 group-hover:scale-90" />
                    <Icon className="size-5 text-sage-deep" />
                  </span>
                  <h3 className="mt-6 font-display text-xl font-bold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-ink-soft">
                    {item.text}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ——— Manifeste ——— */}
      <section className="border-y border-line bg-sand-deep">
        <div className="container-site py-20 md:py-28">
          <Reveal>
            <RingGlyph size={24} />
            <p className="mt-7 max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight text-ink md:text-5xl">
              {t("manifesto.lead")}{" "}
              <span className="text-terra-strong">{t("manifesto.emph")}</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ——— Méthode : quatre étapes ——— */}
      <section className="container-site py-24">
        <Reveal>
          <span className="eyebrow">
            <RingGlyph size={15} />
            {t("process.eyebrow")}
          </span>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight text-ink md:text-5xl">
            {t("process.title")}
          </h2>
        </Reveal>
        <ol className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="h-full">
              <Reveal delay={0.07 * i} className="h-full">
                <div className="flex items-center gap-3">
                  <span className="font-display text-2xl font-bold text-terra-strong">
                    0{i + 1}
                  </span>
                  <span aria-hidden="true" className="h-px flex-1 bg-line" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {step.text}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* ——— Réalisations en vitrine ——— */}
      <section className="container-site pb-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">
                <RingGlyph size={15} />
                {t("work.eyebrow")}
              </span>
              <h2 className="mt-4 max-w-xl font-display text-3xl font-bold tracking-tight text-ink md:text-5xl">
                {t("work.title")}
              </h2>
            </div>
            <Link
              href="/realisations"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-sage-deep transition-colors hover:text-ink"
            >
              {t("work.cta")}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.name} delay={0.08 * i} className="h-full">
              <Link href="/realisations" className="group block h-full">
                <article className="card-hover h-full overflow-hidden rounded-2xl border border-line bg-sand-card">
                  <div className="aspect-4/3 overflow-hidden border-b border-line">
                    <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]">
                      <CaseCover variant={coverVariants[i]} />
                    </div>
                  </div>
                  <div className="p-7">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage-deep">
                      {p.sector}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-bold text-ink">
                      {p.name}
                    </h3>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {p.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-line bg-sand px-3 py-1 text-xs font-medium text-ink-soft"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Link>
            </Reveal>
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
