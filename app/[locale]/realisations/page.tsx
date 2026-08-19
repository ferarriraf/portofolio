import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import CaseMockup, { type MockupTextes } from "@/components/CaseMockup";
import DemoWindow from "@/components/DemoWindow";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "work", "/realisations");
}

const coverVariants = ["vitrine", "metier", "api"] as const;

export default async function WorkPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("work");

  const mockups = t.raw("mockups") as MockupTextes;
  const projects = t.raw("projects") as {
    name: string;
    sector: string;
    tags: string[];
    challenge: string;
    result: string;
  }[];

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} />

      <section className="container-site space-y-20 pb-16 md:space-y-28">
        {projects.map((p, i) => (
          <Reveal key={p.name}>
            <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
              {/* La démo, montée dans son moniteur */}
              <Reveal
                variant="mask"
                className={i % 2 === 1 ? "lg:order-2" : ""}
              >
                <DemoWindow titre={mockups[coverVariants[i]].fenetre}>
                  <CaseMockup variant={coverVariants[i]} textes={mockups} />
                </DemoWindow>
              </Reveal>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage-deep">
                  {p.sector}
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
                  {p.name}
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-line bg-sand-card px-3 py-1 text-xs font-medium text-ink-soft inset-shadow-cisele"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                <dl className="mt-7 space-y-6">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-terra-deep">
                      {t("challengeLabel")}
                    </dt>
                    <dd className="mt-2 leading-relaxed text-ink-soft">
                      {p.challenge}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-sage-deep">
                      {t("resultLabel")}
                    </dt>
                    <dd className="mt-2 leading-relaxed text-ink-soft">
                      {p.result}
                    </dd>
                  </div>
                </dl>
              </div>
            </article>
          </Reveal>
        ))}
        <p className="flex items-start gap-2.5 rounded-2xl bg-sand-deep px-5 py-4 text-sm text-ink-soft inset-shadow-cisele">
          <span
            aria-hidden="true"
            className="mt-1.5 inline-block size-1.5 shrink-0 rounded-full bg-terra-hot"
          />
          {t("note")}
        </p>
      </section>

      <div className="pt-8">
        <CtaBand
          title={t("cta.title")}
          text={t("cta.text")}
          buttonLabel={t("cta.button")}
        />
      </div>
    </>
  );
}
