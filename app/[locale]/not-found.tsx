import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="container-site pt-16 pb-24 md:pt-24 md:pb-32">
      <p className="eyebrow">404</p>
      <h1 className="titre-1 mt-5 text-ink">{t("title")}</h1>
      <p className="lede mt-6">{t("text")}</p>
      <Link href="/" className="btn btn-primary mt-9">
        {t("back")}
      </Link>
    </div>
  );
}
