import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "legal", "/mentions-legales");
}

const sections = ["editor", "host", "ip", "privacy"] as const;

export default async function LegalPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <>
      <PageHeader eyebrow="r-x.fr" title={t("title")} />
      <section className="container-site pb-28">
        <div className="max-w-3xl space-y-10">
          {sections.map((key) => (
            <Reveal key={key}>
              <h2 className="font-display text-xl font-bold text-ink">
                {t(`${key}.title`)}
              </h2>
              <p className="mt-3 leading-relaxed whitespace-pre-line text-ink-soft">
                {t(`${key}.text`)}
              </p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
