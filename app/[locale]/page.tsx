import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import CaseMockup, { type MockupTextes } from "@/components/CaseMockup";
import DemoWindow from "@/components/DemoWindow";
import MagneticTitle from "@/components/MagneticTitle";
import ManifestoScroll from "@/components/ManifestoScroll";
import ProcessScroll, { type EcranTextes } from "@/components/ProcessScroll";
import SectionLabel from "@/components/SectionLabel";
import SelectionFrame from "@/components/SelectionFrame";
import SplitHeading from "@/components/SplitHeading";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "home", "/");
}

const coverVariants = ["vitrine", "metier", "api"] as const;

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tw = await getTranslations("work");

  const steps = t.raw("process.steps") as { title: string; text: string }[];
  const mockups = tw.raw("mockups") as MockupTextes;
  const projects = tw.raw("projects") as {
    name: string;
    sector: string;
    tags: string[];
  }[];

  return (
    <>
      {/* ——— Hero : le titre mis en scène comme un calque sélectionné ——— */}
      <section className="relative overflow-hidden">
        {/* Halos pastel : trois plans de lumière fixes. Ils ne dérivent
            plus — rien ne bouge sur cette page tant que le visiteur
            n'a pas fait un geste. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 -left-52 size-[42rem]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(169,191,160,0.5), transparent 72%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-60 -bottom-48 size-[46rem]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(223,161,132,0.42), transparent 72%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-[14%] size-[24rem]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(169,191,160,0.26), transparent 70%)",
          }}
        />
        <div className="container-site relative flex min-h-svh flex-col items-center justify-center pt-24 pb-14 text-center">
          <Reveal className="relative z-30">
            <SectionLabel>{t("eyebrow")}</SectionLabel>
          </Reveal>

          <div className="mt-14 md:mt-16">
            <SelectionFrame label={t("layerLabel")}>
              <MagneticTitle
                lineA={t("titleA")}
                lineB={t("titleB")}
                className="font-display text-[clamp(2.2rem,9.5vw,8rem)] leading-[0.98] tracking-[-0.035em] text-ink"
              />
            </SelectionFrame>
          </div>

          <Reveal delay={0.45} className="relative z-30">
            <p className="mx-auto mt-14 max-w-xl text-xl leading-relaxed text-ink-soft md:mt-16">
              {t("lede")}
            </p>
          </Reveal>
          <Reveal delay={0.55} className="relative z-30">
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link href="/services" className="btn btn-primary btn-lg group">
                {t("ctaServices")}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link href="/contact" className="btn btn-secondary btn-lg">
                {t("ctaContact")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— Manifeste : les mots s'illuminent au fil du scroll ——— */}
      <ManifestoScroll lead={t("manifesto.lead")} emph={t("manifesto.emph")} />

      {/* ——— Méthode : cinq étapes, chacune sur son poste ——— */}
      <ProcessScroll
        eyebrow={t("process.eyebrow")}
        title={t("process.title")}
        steps={steps}
        onlineLabel={t("process.online")}
        ecrans={t.raw("process.screens") as EcranTextes}
      />

      {/* ——— Réalisations en vitrine ——— */}
      <section className="container-site py-24 md:py-32">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionLabel n={3}>{t("work.eyebrow")}</SectionLabel>
              <SplitHeading
                text={t("work.title")}
                className="mt-5 max-w-2xl font-display text-[clamp(1.9rem,5.5vw,4.5rem)] font-bold leading-[1.04] tracking-tight text-balance text-ink"
              />
            </div>
            <Link
              href="/realisations"
              className="group inline-flex items-center gap-2 pb-2 text-sm font-semibold text-sage-deep transition-colors hover:text-ink"
            >
              {t("work.cta")}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Link
              key={p.name}
              href="/realisations"
              className="group block"
            >
              <Reveal variant="mask" delay={0.08 * i}>
                <div className="transition-transform duration-500 ease-out group-hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                  <DemoWindow titre={mockups[coverVariants[i]].fenetre}>
                    <CaseMockup variant={coverVariants[i]} textes={mockups} />
                  </DemoWindow>
                </div>
              </Reveal>
              <Reveal delay={0.08 * i + 0.15}>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage-deep">
                      {p.sector}
                    </p>
                    <h3 className="mt-1.5 font-display text-2xl font-bold text-ink">
                      {p.name}
                    </h3>
                  </div>
                  <span className="press inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink transition-all duration-300 group-hover:bg-ink group-hover:text-sand">
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((tag, ti) => (
                    <li
                      key={tag}
                      className={`rounded-full px-3 py-1 text-xs font-semibold text-ink-soft ${
                        ti % 2 ? "bg-terra-wash" : "bg-sage-wash"
                      }`}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </Link>
          ))}
        </div>
      </section>

      <CtaBand
        title={t("cta.title")}
        text={t("cta.text")}
        buttonLabel={t("cta.button")}
      />
    </>
  );
}
