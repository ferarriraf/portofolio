import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Boxes, Check, Frame, RefreshCw, Smartphone } from "lucide-react";
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

const offerIcons = [Frame, RefreshCw, Boxes, Smartphone];

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");

  const offers = t.raw("offers") as { title: string; text: string }[];
  const deliverables = t.raw("deliverables.items") as string[];

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} />

      <section className="container-site pb-24 md:pb-32">
        <div className="grid gap-6 md:grid-cols-2">
          {offers.map((offer, i) => {
            const Icon = offerIcons[i];
            return (
              <Reveal key={offer.title} delay={0.06 * i} className="h-full">
                {/* Une seule teinte pour toute la section : les cartes
                    se distinguent par leur rang, pas par leur couleur */}
                <article
                  className="card-offre group relative h-full overflow-hidden rounded-3xl bg-sage-wash p-8 md:p-12"
                  style={{ borderTop: `${3 - Math.min(i, 2)}px solid var(--sage-deep)` }}
                >
                  {/* Contre-parallaxe : la carte monte, le numéro
                      descend d'autant — calque lointain, sans tilt */}
                  <span
                    aria-hidden="true"
                    className="absolute top-6 right-8 font-display text-6xl font-bold text-ink/10 transition-transform duration-500 group-hover:translate-y-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 md:text-7xl"
                  >
                    0{i + 1}
                  </span>
                  <span className="relative inline-flex size-16 items-center justify-center rounded-full bg-ink text-sand transition-all duration-500 group-hover:rotate-12 group-hover:shadow-[0_8px_16px_-8px_rgba(36,41,31,0.5)]">
                    <Icon className="size-6" />
                  </span>
                  <h2 className="mt-7 font-display text-2xl font-bold text-ink md:text-3xl">
                    {offer.title}
                  </h2>
                  <p className="mt-4 max-w-md leading-relaxed text-ink-soft">
                    {offer.text}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
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
