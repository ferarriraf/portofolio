import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChevronDown } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import CopyEmail from "@/components/CopyEmail";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "contact", "/contact");
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  const faq = t.raw("faq") as { q: string; a: string }[];

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} />

      <section className="container-site pb-20">
        <Reveal>
          <CopyEmail />
        </Reveal>
      </section>

      {/* ——— Questions fréquentes : titre à gauche, réponses à droite ——— */}
      <section className="container-site pb-28">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14">
          <Reveal>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink md:text-3xl lg:sticky lg:top-28">
              {t("faqTitle")}
            </h2>
          </Reveal>
          <div className="space-y-4">
            {faq.map((item, i) => (
              <Reveal key={item.q} delay={0.06 * i}>
                <details className="group rounded-2xl bg-sand-card px-6 py-5 transition-colors duration-300 open:bg-sage-wash md:px-8 md:py-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold text-ink [&::-webkit-details-marker]:hidden md:text-xl">
                    {item.q}
                    <ChevronDown className="size-5 shrink-0 text-sage-deep transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
                    {item.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
