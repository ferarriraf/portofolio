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

/**
 * À propos : qui est derrière le site, comment il travaille, les faits.
 * Pas de colonnes numérotées ni de frise semaine par semaine — le
 * propriétaire les a trouvées « trop IA », et la méthode en cinq étapes
 * est déjà sur l'accueil. Du texte, une liste de faits, l'appel.
 */
export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const facts = t.raw("facts.items") as { label: string; value: string }[];

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} />

      <section className="container-site grid gap-12 pb-16 md:pb-24 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
        <div>
          <h2 className="titre-2 text-ink">{t("who.title")}</h2>
          <p className="mt-6 text-ink-soft">{t("who.p1")}</p>
          <p className="mt-4 text-ink-soft">{t("who.p2")}</p>
          <p className="mt-4 text-ink-soft">{t("who.p3")}</p>
        </div>
        <div>
          <h2 className="eyebrow">{t("facts.title")}</h2>
          <dl className="mt-4">
            {facts.map((f) => (
              <div key={f.label} className="flex items-baseline justify-between gap-6 border-t border-line py-3 last:border-b">
                <dt className="text-sm text-ink-soft">{f.label}</dt>
                <dd className="text-right font-semibold text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="pb-16 md:pb-24">
        <ContactBand title={t("cta.title")} text={t("cta.text")} buttonLabel={t("cta.button")} />
      </div>
    </>
  );
}
