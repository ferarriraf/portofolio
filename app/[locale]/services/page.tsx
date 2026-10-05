import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHeader from "@/components/PageHeader";
import ContactBand from "@/components/ContactBand";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "services", "/services");
}

type Offre = { id: string; verb: string; title: string; text: string; included: string[] };

/**
 * Les offres en bordereau : quatre lignes d'un même document, le verbe
 * dans la marge, ce qui est compris en colonne de droite. Rien ne
 * s'ouvre, rien ne se survole — tout est lisible d'un coup. Chaque
 * ligne a son ancre : les mots du bandeau du pied de page y renvoient.
 */
export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");

  const offers = t.raw("offers") as Offre[];
  const pricing = t.raw("pricing.items") as string[];

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} />

      <section className="container-site pb-16 md:pb-24">
        <ol className="filets filets-forts">
          {offers.map((offer) => (
            <li
              key={offer.id}
              id={offer.id}
              className="grid gap-x-10 gap-y-4 py-8 scroll-mt-6 md:grid-cols-[7rem_minmax(0,1fr)_15rem] md:py-10 lg:gap-x-14"
            >
              <p className="font-display text-lg font-light text-ink-soft">{offer.verb}</p>
              <div>
                <h2 className="titre-2 text-ink">{offer.title}</h2>
                <p className="mt-4 max-w-[54ch] text-ink-soft">{offer.text}</p>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-ink">{t("includedLabel")}</p>
                <ul className="mt-2 space-y-1.5 text-ink-soft">
                  {offer.included.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden="true" className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-terra-hot" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ——— Comment je chiffre ——— */}
      <section className="container-site pb-16 md:pb-24">
        <p className="eyebrow">{t("pricing.eyebrow")}</p>
        <div className="mt-4 grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="titre-2 text-ink">{t("pricing.title")}</h2>
            <ul className="filets mt-6">
              {pricing.map((item) => (
                <li key={item} className="py-3 text-ink-soft">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="md:pt-[0.4em]">
            <h3 className="titre-3 text-ink">{t("pricing.faqQ")}</h3>
            <p className="mt-4 max-w-[50ch] text-ink-soft">{t("pricing.faqA")}</p>
          </div>
        </div>
      </section>

      <div className="pb-16 md:pb-24">
        <ContactBand title={t("cta.title")} text={t("cta.text")} buttonLabel={t("cta.button")} />
      </div>
    </>
  );
}
