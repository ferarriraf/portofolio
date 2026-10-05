import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHeader from "@/components/PageHeader";
import ContactBand from "@/components/ContactBand";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "about", "/a-propos");
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const facts = t.raw("facts.items") as { label: string; value: string }[];
  const steps = t.raw("how.steps") as { quand: string; moi: string; client: string }[];
  const principles = t.raw("principles.items") as { title: string; text: string }[];

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} />

      {/* ——— Comment je travaille + les faits ——— */}
      <section className="container-site grid gap-12 pb-16 md:pb-24 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
        <div>
          <h2 className="titre-2 text-ink">{t("who.title")}</h2>
          <p className="mt-6 text-ink-soft">{t("who.p1")}</p>
          <p className="mt-4 text-ink-soft">{t("who.p2")}</p>
        </div>
        <div>
          <h2 className="eyebrow">{t("facts.title")}</h2>
          <dl className="filets mt-4">
            {facts.map((f) => (
              <div key={f.label} className="flex items-baseline justify-between gap-6 border-t border-line py-3 last:border-b">
                <dt className="text-sm text-ink-soft">{f.label}</dt>
                <dd className="text-right font-semibold text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ——— Le déroulé d'un projet ——— */}
      <section className="container-site pb-16 md:pb-24">
        <h2 className="titre-2 text-ink">{t("how.title")}</h2>
        <ol className="filets filets-forts mt-8">
          {steps.map((s) => (
            <li key={s.quand} className="grid gap-x-8 gap-y-2 py-6 md:grid-cols-[9rem_1fr_1fr]">
              <p className="eyebrow pt-1">{s.quand}</p>
              <p>
                <span className="mr-2 text-xs font-semibold tracking-[0.12em] text-terra-deep uppercase">{t("how.meLabel")}</span>
                <span className="font-semibold text-ink">{s.moi}</span>
              </p>
              <p className="text-ink-soft">
                <span className="mr-2 text-xs font-semibold tracking-[0.12em] text-sage-deep uppercase">{t("how.youLabel")}</span>
                {s.client}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ——— Trois engagements, sur l'encre ——— */}
      <section className="bande-encre">
        <div className="container-site section">
          <h2 className="titre-2 text-sand">{t("principles.title")}</h2>
          <ul className="filets mt-10 grid gap-x-10 md:grid-cols-3">
            {principles.map((p, i) => (
              <li key={p.title} className="py-6 md:border-b md:border-[var(--encre-creux)]">
                <span aria-hidden="true" className="lueur-douce font-display text-base tabular-nums">
                  0{i + 1}
                </span>
                <h3 className="titre-3 mt-3 text-sand">{p.title}</h3>
                <p className="mt-3 text-encre-doux">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="section">
        <ContactBand title={t("cta.title")} text={t("cta.text")} buttonLabel={t("cta.button")} />
      </div>
    </>
  );
}
