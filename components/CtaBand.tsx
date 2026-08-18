import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import Reveal from "./Reveal";
import RingsDecor from "./RingsDecor";

type CtaBandProps = {
  title: string;
  text: string;
  buttonLabel: string;
  href?: AppPathname;
};

/** Grande bande d'appel à l'action, pleine largeur, terracotta pastel. */
export default function CtaBand({
  title,
  text,
  buttonLabel,
  href = "/contact",
}: CtaBandProps) {
  return (
    <section className="relative overflow-hidden border-y border-terra/40 bg-terra-wash">
      <RingsDecor className="pointer-events-none absolute -right-32 -bottom-48 w-130 opacity-70 max-sm:hidden" />
      <div className="container-site relative py-20 md:py-28">
        <Reveal>
          <h2 className="max-w-3xl font-display text-4xl font-bold tracking-tight text-ink md:text-6xl">
            {title}
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
            {text}
          </p>
          <Link href={href} className="btn btn-primary btn-lg group mt-10">
            {buttonLabel}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
