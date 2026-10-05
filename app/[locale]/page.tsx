import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Apercu, { type MockupTextes } from "@/components/Apercu";
import ContactBand from "@/components/ContactBand";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "home", "/");
}

/**
 * L'accueil, dans l'ordre du client : la promesse, ce qui lui arrive,
 * la preuve, la méthode, le contact. Cinq écrans, aucune section
 * épinglée, rien qui bouge de soi-même. La bande d'encre du hero
 * porte le marqueur qui teinte la barre du haut (voir `.entete`).
 */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tw = await getTranslations("work");

  const problems = t.raw("problems.items") as { q: string; r: string }[];
  const steps = t.raw("process.steps") as { title: string; text: string }[];
  const mockups = tw.raw("mockups") as MockupTextes;
  const projects = tw.raw("projects") as { id: keyof MockupTextes; name: string; sector: string }[];

  return (
    <>
      {/* ——— La promesse, sur l'encre ——— */}
      <section data-hero-encre className="bande-encre">
        <div className="container-site pt-16 pb-20 md:pt-24 md:pb-28">
          <p className="eyebrow text-sage">{t("eyebrow")}</p>
          <h1 className="titre-hero mt-6 max-w-5xl text-sand">
            {t("titleA")}
            <br />
            <span className="lueur">{t("titleB")}</span>
          </h1>
          <p className="lede mt-8 text-encre-doux">{t("lede")}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-primary btn-lg">
              {t("ctaPrimary")}
            </Link>
            <Link href="/realisations" className="btn btn-secondary-encre btn-lg">
              {t("ctaSecondary")}
            </Link>
          </div>
        </div>
      </section>

      {/* ——— Ce qui vous amène ——— */}
      <section className="container-site section">
        <p className="eyebrow">{t("problems.eyebrow")}</p>
        <h2 className="titre-2 mt-4 text-ink">{t("problems.title")}</h2>
        <ul className="filets filets-forts mt-10 grid gap-x-10 gap-y-8 md:grid-cols-3">
          {problems.map((p) => (
            <li key={p.q} className="pt-5">
              <h3 className="titre-3 text-ink">{p.q}</h3>
              <p className="mt-3 text-ink-soft">{p.r}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ——— La preuve : deux projets types ——— */}
      <section className="container-site section pt-0">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div>
            <p className="eyebrow">{t("proof.eyebrow")}</p>
            <h2 className="titre-2 mt-4 text-ink">{t("proof.title")}</h2>
          </div>
          <p className="max-w-md border-l-2 border-terra pl-4 text-sm text-ink-soft">{t("proof.note")}</p>
        </div>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          {projects.map((p) => (
            <figure key={p.id} className="m-0">
              <Link href="/realisations" className="block">
                <Apercu variant={p.id} textes={mockups} />
              </Link>
              <figcaption className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="titre-3 text-ink">{p.name}</h3>
                <span className="eyebrow">{p.sector}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <Link
          href="/realisations"
          className="group mt-10 inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-terra-deep"
        >
          {t("proof.cta")}
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
        </Link>
      </section>

      {/* ——— La méthode, sur l'encre ——— */}
      <section className="bande-encre">
        <div className="container-site section">
          <p className="eyebrow text-sage">{t("process.eyebrow")}</p>
          <h2 className="titre-2 mt-4 text-sand">{t("process.title")}</h2>
          <ol className="filets mt-10">
            {steps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-x-6 py-6 md:grid-cols-[5rem_minmax(0,1fr)]">
                <span aria-hidden="true" className="lueur-douce font-display text-base tabular-nums">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="titre-3 text-sand">{s.title}</h3>
                  <p className="mt-2 max-w-[56ch] text-encre-doux">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ——— Le contact ——— */}
      <div className="section">
        <ContactBand title={t("contact.title")} text={t("contact.text")} buttonLabel={t("contact.button")} />
      </div>
    </>
  );
}
