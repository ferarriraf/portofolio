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
          <CopyEmail email="contact@r-x.fr" />
        </Reveal>
      </section>

      {/* ——— Questions fréquentes ——— */}
      <section className="container-site pb-28">
        <Reveal>
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
            {t("faqTitle")}
          </h2>
        </Reveal>
        <div className="mt-8 max-w-3xl space-y-4">
          {faq.map((item, i) => (
            <Reveal key={item.q} delay={0.06 * i}>
              <details className="group rounded-2xl bg-sand-card px-6 py-5 transition-colors duration-300 open:bg-sage-wash">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronDown className="size-4 shrink-0 text-sage-deep transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="mt-4 leading-relaxed text-ink-soft">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
