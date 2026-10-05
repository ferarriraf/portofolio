import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHeader from "@/components/PageHeader";
import ContactBand from "@/components/ContactBand";
import Apercu, { type MockupTextes } from "@/components/Apercu";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "work", "/realisations");
}

type Projet = {
  id: keyof MockupTextes;
  name: string;
  sector: string;
  need: string;
  delivered: string;
  tags: string[];
};

export default async function WorkPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("work");

  const mockups = t.raw("mockups") as MockupTextes;
  const projects = t.raw("projects") as Projet[];

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} />

      <section className="container-site pb-16 md:pb-24">
        <ol className="filets filets-forts">
          {projects.map((p, i) => (
            <li key={p.id} className="grid items-center gap-8 py-10 md:grid-cols-2 md:gap-14 md:py-14">
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <Apercu variant={p.id} textes={mockups} />
              </div>
              <div>
                <p className="eyebrow">{p.sector}</p>
                <h2 className="titre-2 mt-3 text-ink">{p.name}</h2>
                <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-soft">
                  {p.tags.map((tag) => (
                    <li key={tag} className="flex items-center gap-2">
                      <span aria-hidden="true" className="size-1.5 rounded-full bg-sage-strong" />
                      {tag}
                    </li>
                  ))}
                </ul>
                <dl className="mt-7 space-y-5">
                  <div>
                    <dt className="text-sm font-semibold text-ink">{t("needLabel")}</dt>
                    <dd className="mt-1.5 text-ink-soft">{p.need}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-ink">{t("deliveredLabel")}</dt>
                    <dd className="mt-1.5 text-ink-soft">{p.delivered}</dd>
                  </div>
                </dl>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-xl border-l-2 border-terra pl-4 text-sm text-ink-soft">{t("note")}</p>
      </section>

      <div className="pb-16 md:pb-24">
        <ContactBand title={t("cta.title")} text={t("cta.text")} buttonLabel={t("cta.button")} />
      </div>
    </>
  );
}
