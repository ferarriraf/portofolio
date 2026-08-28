import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Recu from "@/components/Recu";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="container-site flex min-h-svh flex-col items-center justify-center py-32 text-center">
      <h1 className="mt-9 font-display text-4xl font-bold tracking-tight text-ink">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-md leading-relaxed text-ink-soft">{t("text")}</p>
      <Link href="/" className="btn btn-primary mt-9">
        {t("back")}
      </Link>

      {/* La seule autre blague explicite du site, avec le « exit 0 » du
          pied de page. Une par site : c'est le rationnement qui empeche
          le procede de redevenir un costume. */}
      <Recu className="mt-8">{t("recu")}</Recu>
    </div>
  );
}
