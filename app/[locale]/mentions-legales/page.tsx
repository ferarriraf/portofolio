import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHeader from "@/components/PageHeader";
import MailLink from "@/components/MailLink";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "legal", "/mentions-legales");
}

const sections = ["editor", "host", "ip", "privacy"] as const;

export default async function LegalPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <>
      <PageHeader eyebrow="r-x.fr" title={t("title")} />
      <section className="container-site pb-16 md:pb-24">
        <dl className="filets filets-forts max-w-3xl">
          {sections.map((key) => (
            <div key={key} className="grid gap-x-10 gap-y-2 border-t-2 border-ink py-7 md:grid-cols-[14rem_1fr]">
              <dt className="titre-3 text-ink">{t(`${key}.title`)}</dt>
              <dd className="whitespace-pre-line text-ink-soft">
                {t(`${key}.text`)}
                {key === "editor" && (
                  <p className="mt-2">
                    {t("contactLabel")} <MailLink className="underline underline-offset-4 hover:text-ink" />
                  </p>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
