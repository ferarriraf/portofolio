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
          {/* Chaque question est une fenêtre de terminal : la commande
              se tape, la réponse tombe comme une sortie de programme */}
          <div className="space-y-5">
            {faq.map((item, i) => (
              <Reveal key={item.q} delay={0.06 * i}>
                <details className="group overflow-hidden rounded-2xl bg-ink-deep inset-shadow-cisele-sombre shadow-elev-2">
                  <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    {/* Barre de titre de la fenêtre */}
                    <div className="flex items-center gap-3 border-b border-sand/10 bg-ink/70 px-4 py-2.5 md:px-5">
                      <span className="flex items-center gap-1.5" aria-hidden="true">
                        <span className="size-2.5 rounded-full bg-terra/80" />
                        <span className="size-2.5 rounded-full bg-sand/40" />
                        <span className="size-2.5 rounded-full bg-sage/80" />
                      </span>
                      <span className="ml-1 font-mono text-xs text-sand/60">
                        faq/0{i + 1}.sh
                      </span>
                      <ChevronDown className="ml-auto size-4 shrink-0 text-sand/60 transition-transform duration-300 group-open:rotate-180" />
                    </div>
                    {/* La commande : la question, curseur battant tant
                        qu'elle n'est pas « exécutée » */}
                    <div className="flex items-baseline gap-2.5 px-5 py-4 md:px-6 md:py-5">
                      <span
                        aria-hidden="true"
                        className="shrink-0 font-mono text-base font-bold text-sage"
                      >
                        $
                      </span>
                      <span className="font-display text-lg font-bold text-sand md:text-xl">
                        {item.q}
                      </span>
                      <span
                        aria-hidden="true"
                        className="caret-blink h-4 w-2 shrink-0 self-center bg-sand/70 group-open:hidden"
                      />
                    </div>
                  </summary>
                  {/* La sortie du programme : la réponse tombe comme
                      un stdout, en mono */}
                  <div className="faq-sortie px-5 pb-5 md:px-6 md:pb-6">
                    <p className="max-w-2xl font-mono text-[0.82rem] leading-relaxed text-sand/85">
                      {item.a}
                    </p>
                    <span
                      aria-hidden="true"
                      className="mt-3 flex items-baseline gap-2 font-mono text-sm font-bold text-sage"
                    >
                      $
                      <span className="caret-blink h-3.5 w-2 self-center bg-sand/70" />
                    </span>
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
