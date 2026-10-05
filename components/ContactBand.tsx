import { Link } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";

type ContactBandProps = {
  title: string;
  text: string;
  buttonLabel: string;
  href?: AppPathname;
};

/**
 * L'appel final de chaque page : un titre, une phrase, un bouton. Sur
 * papier, fermé par deux filets d'encre — c'est la dernière ligne du
 * document, pas une bannière.
 */
export default function ContactBand({ title, text, buttonLabel, href = "/contact" }: ContactBandProps) {
  return (
    <section className="container-site">
      <div className="grid gap-8 border-y-2 border-ink py-14 md:grid-cols-[1.4fr_1fr] md:items-end md:py-20">
        <div>
          <h2 className="titre-2 text-ink">{title}</h2>
          <p className="lede mt-5 text-base md:text-lg">{text}</p>
        </div>
        <div className="md:justify-self-end">
          <Link href={href} className="btn btn-primary btn-lg">
            {buttonLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
