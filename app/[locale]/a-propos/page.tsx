import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Feather, Handshake, Ruler } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import Ring3D from "@/components/Ring3D";
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
          {/* L'anneau, ici en objet posé : entier, sans rien recouvrir */}
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-line bg-sand-card">
            <Ring3D variant="object" />
            <div
              aria-hidden="true"
              className="scanline pointer-events-none absolute inset-x-10 top-1/2 h-12 bg-gradient-to-b from-transparent via-sage/25 to-transparent"
            />
          </div>
        </Reveal>
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
