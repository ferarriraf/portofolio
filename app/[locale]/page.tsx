import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import CaseCover from "@/components/CaseCover";
import HeroTitle from "@/components/HeroTitle";
import Ring3D from "@/components/Ring3D";
import Marquee from "@/components/Marquee";
import ApproachList from "@/components/ApproachList";
import ManifestoScroll from "@/components/ManifestoScroll";
import ProcessScroll from "@/components/ProcessScroll";
import SplitHeading from "@/components/SplitHeading";
import TiltCard from "@/components/TiltCard";
import { RingGlyph } from "@/components/Logo";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "home", "/");
}

const coverVariants = ["dashboard", "shop"] as const;

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tw = await getTranslations("work");

  const approach = t.raw("approach.items") as { title: string; text: string }[];
  const steps = t.raw("process.steps") as { title: string; text: string }[];
  const marquee = t.raw("marquee") as string[];
  const projects = (
    tw.raw("projects") as { name: string; sector: string; tags: string[] }[]
  ).slice(0, 2);

  return (
    <>
      {/* ——— Hero centré : l'anneau 3D devant le titre ——— */}
      <section className="relative overflow-hidden">
        {/* Halos pastel très doux dans le fond */}
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
        <div className="container-site relative flex min-h-svh flex-col items-center justify-center pt-32 pb-16 text-center lg:pt-28">
          <Reveal className="relative z-30">
            <span className="eyebrow">
              <RingGlyph size={15} />
              {t("eyebrow")}
            </span>
          </Reveal>

          {/* Le titre est pris dans la profondeur de l'anneau :
              bande lointaine derrière lui, bande proche devant */}
          <div className="mt-8 w-full">
            <Ring3D>
              <HeroTitle lineA={t("titleA")} lineB={t("titleB")} />
            </Ring3D>
          </div>

          {/* La légende vit sous la bande métallique, pas dessus */}
          <Reveal delay={0.9} className="relative z-30 mt-36 md:mt-52">
            <span className="inline-flex items-center gap-2 text-base font-medium italic text-terra-strong md:text-lg">
              <span className="relative flex size-2.5" aria-hidden="true">
                <span className="ring-pulse absolute inset-0 rounded-full border border-terra-strong" />
                <span className="size-2.5 rounded-full bg-terra-strong" />
              </span>
              {t("ringCenter")}
            </span>
          </Reveal>

          <Reveal delay={0.45} className="relative z-30">
            <p className="mx-auto mt-8 max-w-xl text-xl leading-relaxed text-ink-soft">
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
        <Marquee items={marquee} className="relative" />
      </section>

      {/* ——— Approche : liste éditoriale, titres en contour ——— */}
      <section className="container-site py-24 md:py-32">
        <Reveal>
          <span className="eyebrow">
            <RingGlyph size={15} />
            {t("approach.eyebrow")}
          </span>
        </Reveal>
        <SplitHeading
          text={t("approach.title")}
          delay={0.06}
          className="mt-5 max-w-3xl font-display text-[clamp(2.4rem,5.5vw,4.5rem)] font-bold leading-[1.04] tracking-tight text-ink"
        />
        <div className="mt-14">
          <ApproachList items={approach} />
        </div>
      </section>

      {/* ——— Manifeste : les mots s'illuminent au fil du scroll ——— */}
      <ManifestoScroll lead={t("manifesto.lead")} emph={t("manifesto.emph")} />

      {/* ——— Méthode : l'écran qui se transforme au scroll ——— */}
      <ProcessScroll
        eyebrow={t("process.eyebrow")}
        title={t("process.title")}
        steps={steps}
        onlineLabel={t("process.online")}
      />

      {/* ——— Réalisations en vitrine ——— */}
      <section className="container-site py-24 md:py-32">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="eyebrow">
                <RingGlyph size={15} />
                {t("work.eyebrow")}
              </span>
              <SplitHeading
                text={t("work.title")}
                className="mt-5 max-w-2xl font-display text-[clamp(2.4rem,5.5vw,4.5rem)] font-bold leading-[1.04] tracking-tight text-ink"
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
        <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2">
          {projects.map((p, i) => (
            <Link
              key={p.name}
              href="/realisations"
              className="group block"
            >
              <Reveal variant="mask" delay={0.08 * i}>
                <TiltCard>
                  <div className="overflow-hidden rounded-3xl">
                    <div className="aspect-4/3 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                      <CaseCover variant={coverVariants[i]} />
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
              <Reveal delay={0.08 * i + 0.15}>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage-deep">
                      {p.sector}
                    </p>
                    <h3 className="mt-1.5 font-display text-2xl font-bold text-ink md:text-3xl">
                      {p.name}
                    </h3>
                  </div>
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink transition-all duration-300 group-hover:bg-ink group-hover:text-sand">
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
