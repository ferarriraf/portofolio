import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Check } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import SplitHeading from "@/components/SplitHeading";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "services", "/services");
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");

  const offers = t.raw("offers") as {
    verb: string;
    title: string;
    text: string;
  }[];
  const deliverables = t.raw("deliverables.items") as string[];

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} />

      {/* ——— Le bordereau ———
          Ni carte ni grille : quatre lignes d'un seul document. Deux
          filets d'encre traversent la fenêtre et bornent la zone ;
          entre les lignes, un joint creusé plutôt qu'un trait peint.
          La cote 01–04 s'assied DANS la coupure du filet, comme une
          cote sur un plan.

          Rien ne s'ouvre, rien ne se survole, rien ne se clique — parce
          que rien n'est caché. Les quatre paragraphes sont lisibles en
          entier, tout le temps, sans JavaScript. Un bloc qui se colore
          au survol sans être cliquable est une promesse qu'on ne tient
          pas ; le visiteur qui veut agir a le bouton juste en dessous. */}
      <section className="pb-16 md:pb-24">
        {/* Filet de tête : hors du conteneur, donc d'un bord de la
            fenêtre à l'autre, interrompu à l'aplomb du bord gauche du
            texte pour laisser passer la cote. */}
        <div aria-hidden="true" className="bordereau-filet">
          <span />
          <span />
          <span />
        </div>

        <ol className="container-site list-none">
          {offers.map((offer, i) => (
            <li key={offer.title} className="relative">
              {/* La première ligne n'a pas de joint : c'est le filet de
                  tête qui l'ouvre. */}
              {i > 0 && (
                <span aria-hidden="true" className="bordereau-joint">
                  <span />
                </span>
              )}

              {/* La cote est décorative : l'ordre est déjà porté par le
                  <ol>, un lecteur d'écran n'a pas à l'entendre deux fois. */}
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 -translate-y-1/2 font-mono text-xs font-bold tracking-[0.16em] tabular-nums text-ink-soft"
              >
                0{i + 1}
              </span>

              <div className="grid gap-x-10 pt-7 pb-8 md:grid-cols-[1.2fr_0.8fr] md:items-start md:pt-8 md:pb-9 lg:gap-x-16">
                <div>
                  {/* Le mot du client avant le mot du métier. La graisse
                      300 face au 800 du titre : c'est l'écart de graisse
                      qui hiérarchise, pas une couleur ni une pastille. */}
                  <p className="font-display text-[clamp(1.2rem,2.6vw,1.75rem)] leading-[1.15] font-light tracking-tight text-ink-soft">
                    {offer.verb}
                  </p>
                  <h2 className="mt-1 font-display text-[clamp(1.6rem,4vw,2.4rem)] leading-[1.06] font-extrabold tracking-[-0.03em] text-balance text-ink">
                    {offer.title}
                  </h2>
                </div>
                <p className="mt-4 max-w-[46ch] text-[1.0625rem] leading-[1.65] text-pretty text-ink-soft md:mt-0 md:pt-3">
                  {offer.text}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Filet de pied : il ferme, il ne numérote pas. */}
        <div aria-hidden="true" className="bordereau-pied" />
      </section>

      {/* ——— Livrables : bloc sauge plein ——— */}
      <section className="bande-calque bg-sage-deep text-sand">
        <div className="container-site grid gap-12 py-24 md:py-32 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <div>
            <Reveal>
              <span className="eyebrow eyebrow-invert">{t("deliverables.eyebrow")}</span>
            </Reveal>
            <SplitHeading
              text={t("deliverables.title")}
              delay={0.06}
              className="mt-5 font-display text-4xl font-bold tracking-tight text-sand md:text-5xl"
            />
          </div>
          <ul className="grid gap-5 sm:grid-cols-2">
            {deliverables.map((item, i) => (
              <li key={item}>
                <Reveal delay={0.05 * i}>
                  <div className="flex items-start gap-3.5">
                    <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-terra">
                      <Check className="size-4 text-ink-deep" />
                    </span>
                    <span className="leading-relaxed text-sand/90">{item}</span>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
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
