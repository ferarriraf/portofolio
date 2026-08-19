import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Feather, Handshake, Ruler } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import StudioCard from "@/components/StudioCard";
import SectionLabel from "@/components/SectionLabel";
import CtaBand from "@/components/CtaBand";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "about", "/a-propos");
}

const valueIcons = [Feather, Ruler, Handshake];

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const values = t.raw("values") as { title: string; text: string }[];
  const figures = t.raw("figures") as {
    valeur: number;
    suffixe: string;
    libelle: string;
  }[];
  const tools = t.raw("tools") as string[];
  const timeline = t.raw("timeline") as {
    quand: string;
    studio: string;
    client: string;
  }[];

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} />

      {/* ——— Histoire + carte « radiographie » ——— */}
      <section className="container-site grid items-center gap-10 pb-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <Reveal>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            {t("storyTitle")}
          </h2>
          <p className="mt-6 leading-relaxed text-ink-soft">{t("story1")}</p>
          <p className="mt-4 leading-relaxed text-ink-soft">{t("story2")}</p>
        </Reveal>

        <Reveal delay={0.1}>
          {/* Les faits du studio, et l'heure qui tourne */}
          <StudioCard />
        </Reveal>
      </section>

      {/* ——— Les chiffres et l'atelier ——— */}
      <section className="border-y border-line bg-sand-deep">
        <div className="container-site grid gap-12 py-16 md:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <Reveal>
              <SectionLabel>{t("figuresTitle")}</SectionLabel>
            </Reveal>
            <dl className="mt-8 grid gap-8 sm:grid-cols-3">
              {figures.map((f, i) => (
                <Reveal key={f.libelle} delay={0.07 * i}>
                  <dt className="font-display text-5xl font-[800] tracking-tight text-terra-deep md:text-6xl">
                    <CountUp valeur={f.valeur} suffixe={f.suffixe} />
                  </dt>
                  <dd className="mt-2 text-sm leading-snug text-ink-soft">
                    {f.libelle}
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>

          <div>
            <Reveal>
              <SectionLabel>{t("toolsTitle")}</SectionLabel>
            </Reveal>
            <ul className="mt-8 flex flex-wrap gap-2">
              {tools.map((outil, i) => (
                <Reveal key={outil} delay={0.04 * i}>
                  <li className="rounded-full border border-line bg-sand-card px-3.5 py-1.5 text-sm font-medium text-ink">
                    {outil}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ——— Le déroulé d'un projet, semaine par semaine ——— */}
      <section className="container-site py-20 md:py-24">
        <Reveal>
          <SectionLabel n={1}>{t("timelineTitle")}</SectionLabel>
        </Reveal>
        <ol className="mt-10 border-t border-line">
          {timeline.map((etape, i) => (
            <Reveal key={etape.quand} delay={0.05 * i}>
              <li className="grid gap-2 border-b border-line py-6 md:grid-cols-[9rem_1fr_1fr] md:items-baseline md:gap-8">
                <span className="font-mono text-xs tracking-[0.14em] text-terra-deep uppercase">
                  {etape.quand}
                </span>
                <p className="font-display text-lg font-bold text-ink">
                  {etape.studio}
                </p>
                <p className="leading-relaxed text-ink-soft">
                  <span className="mr-2 font-mono text-[0.65rem] tracking-wide text-sage-deep uppercase">
                    {t("timelineYou")}
                  </span>
                  {etape.client}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ——— Convictions : bloc sauge plein ——— */}
      <section className="bg-sage-deep text-sand">
        <div className="container-site py-20">
          <Reveal>
            <SectionLabel n={2} invert>
              {t("valuesEyebrow")}
            </SectionLabel>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-sand md:text-4xl">
              {t("valuesTitle")}
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((value, i) => {
              const Icon = valueIcons[i];
              return (
                <Reveal key={value.title} delay={0.07 * i} className="h-full">
                  {/* Cartes en creux sur l'aplat : le rang les distingue */}
                  <article className="group relative h-full overflow-hidden rounded-3xl border border-sand/20 p-8 transition-colors duration-300 hover:bg-sand/5 md:p-10">
                    <span
                      aria-hidden="true"
                      className="absolute top-5 right-7 font-display text-5xl font-[240] text-sand/25"
                    >
                      0{i + 1}
                    </span>
                    <span className="inline-flex size-14 items-center justify-center rounded-full bg-sand text-sage-deep transition-transform duration-500 group-hover:rotate-12">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-6 font-display text-2xl font-bold text-sand">
                      {value.title}
                    </h3>
                    <p className="mt-3 leading-relaxed text-sand/75">
                      {value.text}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <div className="pt-24">
        <CtaBand
          title={t("cta.title")}
          text={t("cta.text")}
          buttonLabel={t("cta.button")}
        />
      </div>
    </>
  );
}
