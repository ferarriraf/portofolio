"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

type ManifestoScrollProps = {
  lead: string;
  emph: string;
};

/**
 * Le manifeste, surligné au scroll : la phrase est épinglée à
 * l'écran et ses mots s'illuminent un à un au fil du défilement,
 * la chute en terracotta. « Réduire les animations » : bloc
 * statique, tout allumé.
 */
export default function ManifestoScroll({ lead, emph }: ManifestoScrollProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const words = [
    ...lead.split(" ").map((w) => ({ w, emph: false })),
    ...emph.split(" ").map((w) => ({ w, emph: true })),
  ];

  if (reduce) {
    return (
      <section className="relative overflow-hidden bg-ink-deep text-sand">
        <TubeOverlays />
        <div className="container-site relative py-24 md:py-40">
          <p className="mt-8 max-w-4xl font-display text-[clamp(2.2rem,6vw,5.5rem)] font-bold leading-[1.05] tracking-tight">
            <span className="text-sand">{lead}</span>{" "}
            <span className="text-terra" style={{ textShadow: HALO_PHOSPHORE }}>
              {emph}
            </span>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="relative bg-ink-deep text-sand"
      style={{ height: "220vh" }}
    >
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <TubeOverlays />
        <div className="container-site relative">
          <p className="mt-8 max-w-4xl font-display text-[clamp(2.2rem,6vw,5.5rem)] font-bold leading-[1.05] tracking-tight">
            {words.map((item, i) => (
              <Word
                key={i}
                word={item.w}
                emphasis={item.emph}
                index={i}
                count={words.length}
                progress={scrollYProgress}
              />
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

/* Le halo terracotta des mots d'emphase : l'opacité animée du mot
   fait respirer le phosphore toute seule */
const HALO_PHOSPHORE =
  "0 0 26px rgba(223,161,132,0.5), 0 0 6px rgba(223,161,132,0.3)";

/** Le manifeste se lit dans un écran : vignettage + scanlines du tube */
function TubeOverlays() {
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(115% 100% at 50% 45%, transparent 58%, rgba(0,0,0,0.4) 100%)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(0,0,0,0.9) 0 1px, transparent 1px 3px)",
        }}
      />
    </>
  );
}

function Word({
  word,
  emphasis,
  index,
  count,
  progress,
}: {
  word: string;
  emphasis: boolean;
  index: number;
  count: number;
  progress: MotionValue<number>;
}) {
  // Chaque mot s'allume dans sa propre fenêtre de scroll, et se
  // soulève légèrement en prenant sa lumière
  const span = 0.72;
  const start = 0.12 + span * (index / count);
  const end = start + span / count;
  const opacity = useTransform(progress, [start, end], [0.16, 1]);
  const y = useTransform(progress, [start, end], [14, 0]);

  return (
    <motion.span
      style={{
        opacity,
        y,
        textShadow: emphasis ? HALO_PHOSPHORE : undefined,
      }}
      className={`inline-block mr-[0.28em] ${emphasis ? "text-terra" : "text-sand"}`}
    >
      {word}
    </motion.span>
  );
}
