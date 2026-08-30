import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChevronDown } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
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
      <section className="container-site pb-14">
        <Reveal>
          <ContactForm />
        </Reveal>
      </section>

      {/* ——— Pour qui préfère sa propre boîte mail : l'adresse ——— */}
      <section className="container-site pb-20">
        <Reveal>
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
            {t("autre")}
          </p>
          <CopyEmail />
        </Reveal>
      </section>

      {/* ——— Questions fréquentes : titre à gauche, réponses à droite ——— */}
      <section className="container-site pb-28">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14">
          <Reveal>
            {/* pt-4 : la question de la première carte est décalée de son
                propre rembourrage (py-6). Sans ce rappel, le titre se cale
                sur le BORD de la carte et non sur le TEXTE de la question —
                il flotte alors une vingtaine de pixels trop haut. */}
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink md:text-3xl lg:sticky lg:top-28 lg:pt-4">
              {t("faqTitle")}
            </h2>
          </Reveal>
          {/* Des cartes éditoriales sobres : numéro discret, question
              en display, réponse lisible — la carte verdit à l'ouverture */}
          <div className="space-y-4">
            {faq.map((item, i) => (
              <Reveal key={item.q} delay={0.06 * i}>
                <details className="faq-carte group rounded-2xl bg-sand-card inset-shadow-cisele shadow-elev-1 transition-colors duration-300">
                  <summary className="flex cursor-pointer list-none items-baseline gap-4 px-6 py-5 [&::-webkit-details-marker]:hidden md:px-8 md:py-6">
                    <span
                      aria-hidden="true"
                      className="shrink-0 font-mono text-xs font-semibold text-terra-deep"
                    >
                      0{i + 1}
                    </span>
                    <span className="flex-1 font-display text-lg font-bold text-ink md:text-xl">
                      {item.q}
                    </span>
                    <ChevronDown className="size-5 shrink-0 self-center text-sage-deep transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <div className="faq-sortie px-6 pb-6 md:px-8 md:pb-7">
                    <p className="max-w-2xl leading-relaxed text-ink-soft md:pl-8">
                      {item.a}
                    </p>
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
