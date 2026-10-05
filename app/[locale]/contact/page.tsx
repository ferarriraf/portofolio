import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChevronDown } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import CopyEmail from "@/components/CopyEmail";
import ContactForm from "@/components/ContactForm";
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

      {/* ——— Le formulaire d'abord : écrire sans quitter le site ——— */}
      <section className="container-site pb-12">
        <ContactForm />
      </section>

      {/* ——— Pour qui préfère sa propre messagerie ——— */}
      <section className="container-site pb-16 md:pb-24">
        <p className="eyebrow mb-4">{t("autre")}</p>
        <CopyEmail />
      </section>

      {/* ——— Questions fréquentes : du texte à filets ——— */}
      <section className="container-site pb-16 md:pb-24">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14">
          <h2 className="titre-2 text-ink lg:sticky lg:top-8">{t("faqTitle")}</h2>
          <div className="filets">
            {faq.map((item) => (
              <details key={item.q} className="faq border-t border-line last:border-b">
                <summary className="flex items-baseline gap-4 py-5">
                  <span className="titre-3 flex-1 text-ink">{item.q}</span>
                  <ChevronDown aria-hidden="true" className="faq-chevron size-5 shrink-0 self-center text-sage-deep" />
                </summary>
                <p className="max-w-2xl pb-6 text-ink-soft">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
