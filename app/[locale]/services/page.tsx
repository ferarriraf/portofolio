import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Boxes, Check, Frame, RefreshCw, Smartphone } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
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

      <section className="container-site pb-24">
        <div className="grid gap-5 md:grid-cols-2">
          {offers.map((offer, i) => {
            const Icon = offerIcons[i];
            return (
              <Reveal key={offer.title} delay={0.06 * i} className="h-full">
                <article className="card-hover group h-full rounded-2xl border border-line bg-sand-card p-8 md:p-10">
                  <span className="relative inline-flex size-14 items-center justify-center">
                    <span className="absolute inset-0 rounded-full border border-sage transition-transform duration-500 group-hover:scale-110" />
                    <span className="absolute inset-2 rounded-full border border-terra/70 transition-transform duration-500 group-hover:scale-90" />
                    <Icon className="size-5 text-sage-deep" />
                  </span>
                  <h2 className="mt-6 font-display text-2xl font-bold text-ink">
                    {offer.title}
                  </h2>
                  <p className="mt-3 leading-relaxed text-ink-soft">
                    {offer.text}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ——— Livrables ——— */}
      <section className="border-y border-line bg-sand-deep">
        <div className="container-site grid gap-10 py-20 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <Reveal>
            <span className="eyebrow">{t("deliverables.eyebrow")}</span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
              {t("deliverables.title")}
            </h2>
          </Reveal>
          <ul className="grid gap-4 sm:grid-cols-2">
            {deliverables.map((item, i) => (
              <li key={item}>
                <Reveal delay={0.05 * i}>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-sage/40">
                      <Check className="size-3.5 text-sage-deep" />
                    </span>
                    <span className="leading-relaxed text-ink">{item}</span>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
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
