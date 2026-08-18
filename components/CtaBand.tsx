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

export default function CtaBand({
  title,
  text,
  buttonLabel,
  href = "/contact",
}: CtaBandProps) {
  return (
    <section className="container-site pb-24 md:pb-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-line bg-sand-card px-8 py-14 md:px-14">
          <RingsDecor className="pointer-events-none absolute -top-28 -right-24 w-95 opacity-60 max-sm:hidden" />
          <div className="relative">
            <h2 className="max-w-xl font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
              {title}
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-ink-soft">{text}</p>
            <Link href={href} className="btn btn-primary group mt-8">
              {buttonLabel}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
