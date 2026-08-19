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
        <div className="container-site relative py-24 md:py-40">
          <p className="mt-8 max-w-4xl font-display text-[clamp(2.2rem,6vw,5.5rem)] font-bold leading-[1.05] tracking-tight">
            <span className="text-sand">{lead}</span>{" "}
            <span className="text-terra">{emph}</span>
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
  // Chaque mot s'allume dans sa propre fenêtre de scroll
  const span = 0.72;
  const start = 0.12 + span * (index / count);
  const end = start + span / count;
  const opacity = useTransform(progress, [start, end], [0.16, 1]);

  return (
    <motion.span
      style={{ opacity }}
      className={emphasis ? "text-terra" : "text-sand"}
    >
      {word}
      {index < count - 1 ? " " : ""}
    </motion.span>
  );
}
