import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import RingsDecor from "@/components/RingsDecor";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="container-site flex min-h-svh flex-col items-center justify-center py-32 text-center">
      <RingsDecor className="w-44 opacity-80" />
      <h1 className="mt-9 font-display text-4xl font-bold tracking-tight text-ink">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-md leading-relaxed text-ink-soft">{t("text")}</p>
      <Link href="/" className="btn btn-primary mt-9">
        {t("back")}
      </Link>
    </div>
  );
}
