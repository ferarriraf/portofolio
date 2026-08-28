import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Info } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import EffectifApp from "@/components/EffectifApp";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "demo", "/demo");
}

export default async function DemoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("demo");
  const tw = await getTranslations("work");

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} />

      <section className="container-site pb-20">
        {/* Le cadre est annoncé avant d'être ouvert : on ne laisse
            personne croire qu'il tape dans un vrai outil. */}
        <Reveal>
          <p className="mb-6 flex items-start gap-2.5 rounded-2xl bg-sand-deep px-5 py-4 text-sm text-ink-soft inset-shadow-cisele">
            <Info
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-terra-hot"
            />
            {t("bacASable")}
          </p>
        </Reveal>

        <Reveal variant="mask">
          <EffectifApp />
        </Reveal>
      </section>

      <div className="pt-4">
        <CtaBand
          title={tw("cta.title")}
          text={tw("cta.text")}
          buttonLabel={tw("cta.button")}
        />
      </div>
    </>
  );
}
