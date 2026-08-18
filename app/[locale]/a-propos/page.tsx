import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Feather, Handshake, Ruler } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { RingGlyph } from "@/components/Logo";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "about", "/a-propos");
}

const valueIcons = [Feather, Ruler, Handshake];

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const values = t.raw("values") as { title: string; text: string }[];

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} />

      {/* ——— Histoire + carte « radiographie » ——— */}
      <section className="container-site grid items-center gap-10 pb-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <Reveal>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            {t("storyTitle")}
          </h2>
          <p className="mt-6 leading-relaxed text-ink-soft">{t("story1")}</p>
          <p className="mt-4 leading-relaxed text-ink-soft">{t("story2")}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-sand-card p-10">
            <svg
              viewBox="0 0 320 320"
              fill="none"
              className="mx-auto w-full max-w-70"
              aria-hidden="true"
            >
              <circle cx="160" cy="160" r="150" stroke="var(--line)" strokeWidth="1" />
              <g className="ring-rotor" style={{ "--spin": "70s" } as never}>
                <circle
                  cx="160"
                  cy="160"
                  r="118"
                  stroke="var(--terra)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeDasharray="2 12"
                />
                <circle cx="160" cy="42" r="4.5" fill="var(--terra-strong)" />
              </g>
              <circle
                cx="160"
                cy="160"
                r="84"
                stroke="var(--sage)"
                strokeOpacity="0.55"
                strokeWidth="1.4"
              />
              {/* Réticule de visée : la radiographie */}
              <path
                d="M160 22 V64 M160 256 V298 M22 160 H64 M256 160 H298"
                stroke="var(--sage-strong)"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <circle cx="160" cy="160" r="6" fill="var(--ink)" />
            </svg>
            <div
              aria-hidden="true"
              className="scanline pointer-events-none absolute inset-x-10 top-1/2 h-12 bg-gradient-to-b from-transparent via-sage/30 to-transparent"
            />
          </div>
        </Reveal>
      </section>

      {/* ——— Convictions ——— */}
      <section className="border-y border-line bg-sand-deep">
        <div className="container-site py-20">
          <Reveal>
            <span className="eyebrow">
              <RingGlyph size={15} />
              {t("valuesEyebrow")}
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
              {t("valuesTitle")}
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((value, i) => {
              const Icon = valueIcons[i];
              const tones = ["bg-sage-wash", "bg-terra-wash", "bg-sand-card"];
              return (
                <Reveal key={value.title} delay={0.07 * i} className="h-full">
                  <article
                    className={`group relative h-full overflow-hidden rounded-3xl p-8 transition-transform duration-300 hover:-translate-y-1 md:p-10 ${tones[i]}`}
                  >
                    <span
                      aria-hidden="true"
                      className="text-outline-ink absolute top-5 right-7 font-display text-5xl font-bold opacity-50"
                    >
                      0{i + 1}
                    </span>
                    <span className="inline-flex size-14 items-center justify-center rounded-full bg-ink text-sand transition-transform duration-500 group-hover:rotate-12">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-6 font-display text-2xl font-bold text-ink">
                      {value.title}
                    </h3>
                    <p className="mt-3 leading-relaxed text-ink-soft">
                      {value.text}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
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
