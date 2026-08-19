"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Check, MousePointer2 } from "lucide-react";
import RetroComputer from "./RetroComputer";
import SectionLabel from "./SectionLabel";

type Step = { title: string; text: string };

export type EcranTextes = {
  client: string;
  notesTitre: string;
  notes: string[];
  enregistrement: string;
  maquetteTitre: string;
  maquetteLede: string;
  maquetteAction: string;
};

type ProcessScrollProps = {
  eyebrow: string;
  title: string;
  steps: Step[];
  onlineLabel: string;
  ecrans: EcranTextes;
};

/**
 * Scrollytelling de la méthode : un écran de navigateur épinglé qui
 * se métamorphose au fil du scroll — visio de découverte, wireframe,
 * maquette colorée, site livré. Le texte de l'étape suit le rythme.
 * « Réduire les animations » : les quatre étapes s'affichent en grille
 * statique, sans épinglage ni effet lié au scroll.
 */
export default function ProcessScroll({
  eyebrow,
  title,
  steps,
  onlineLabel,
  ecrans,
}: ProcessScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const railScale = useTransform(scrollYProgress, [0.02, 0.98], [0, 1]);
  // L'écran s'allume en entrant dans la section
  const power = useTransform(scrollYProgress, [0, 0.07], [0, 1], {
    clamp: true,
  });

  const screens = [
    <ScreenListen key="s1" t={ecrans} />,
    <ScreenWireframe key="s2" />,
    <ScreenHeatmap key="s3" />,
    <ScreenDesign key="s4" t={ecrans} />,
    <ScreenLaunch key="s5" onlineLabel={onlineLabel} />,
  ];

  if (reduce) {
    return (
      <section className="border-b border-line bg-sage-wash">
        <div className="container-site py-24">
          <SectionLabel n={2}>{eyebrow}</SectionLabel>
          <h2 className="mt-5 max-w-3xl font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
            {title}
          </h2>
          <div className="mt-14 grid gap-10 md:grid-cols-2">
            {steps.map((step, i) => (
              <div key={step.title}>
                <RetroComputer>{screens[i]}</RetroComputer>
                <p className="mt-6 font-display text-lg font-bold text-ink">
                  <span className="mr-2 text-terra-deep">0{i + 1}</span>
                  {step.title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="relative border-b border-line bg-sage-wash"
      style={{ height: `${steps.length * 105}vh` }}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="container-site">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <SectionLabel n={2}>{eyebrow}</SectionLabel>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink md:text-4xl">
              {title}
            </h2>
          </div>

          <div className="mt-6 grid items-center gap-8 md:mt-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            {/* Étapes + rail de progression */}
            <div className="relative order-2 min-h-64 pl-8 lg:order-1 lg:min-h-80">
              <div
                aria-hidden="true"
                className="absolute top-1 bottom-1 left-1.5 w-px bg-ink/15"
              />
              <motion.div
                aria-hidden="true"
                style={{ scaleY: railScale }}
                className="absolute top-1 bottom-1 left-1.5 w-px origin-top bg-terra-strong"
              />
              {steps.map((step, i) => (
                <StepPanel
                  key={step.title}
                  step={step}
                  index={i}
                  count={steps.length}
                  progress={scrollYProgress}
                />
              ))}
            </div>

            {/* L'ordinateur qui s'allume, et son écran qui se transforme */}
            <div className="order-1 lg:order-2">
              <RetroComputer power={power}>
                {screens.map((screen, i) => (
                  <ScreenPanel
                    key={i}
                    index={i}
                    count={screens.length}
                    progress={scrollYProgress}
                  >
                    {screen}
                  </ScreenPanel>
                ))}
              </RetroComputer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ——— Panneaux pilotés par le scroll ——— */

function segment(index: number, count: number) {
  const a = index / count;
  const b = (index + 1) / count;
  const m = 0.35 / count;
  return { in0: Math.max(0, a - m * 0.4), in1: a + m, out0: b - m, out1: Math.min(1, b + m * 0.4) };
}

function StepPanel({
  step,
  index,
  count,
  progress,
}: {
  step: Step;
  index: number;
  count: number;
  progress: MotionValue<number>;
}) {
  const s = segment(index, count);
  const opacity = useTransform(progress, [s.in0, s.in1, s.out0, s.out1], [index === 0 ? 1 : 0, 1, 1, index === count - 1 ? 1 : 0]);
  const y = useTransform(progress, [s.in0, s.in1, s.out0, s.out1], [index === 0 ? 0 : 28, 0, 0, index === count - 1 ? 0 : -28]);

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-y-0 left-8 right-0 flex flex-col justify-center">
      <p className="font-display text-5xl font-bold text-terra-deep md:text-6xl">
        0{index + 1}
      </p>
      <h3 className="mt-3 font-display text-2xl font-bold text-ink md:text-3xl">
        {step.title}
      </h3>
      <p className="mt-2.5 max-w-md leading-relaxed text-ink-soft">{step.text}</p>
    </motion.div>
  );
}

function ScreenPanel({
  index,
  count,
  progress,
  children,
}: {
  index: number;
  count: number;
  progress: MotionValue<number>;
  children: ReactNode;
}) {
  // Transition balayée : chaque écran recouvre le précédent en se
  // dévoilant de haut en bas autour de la frontière de son segment.
  // Les plages restent dans [0,1] : WAAPI refuse les offsets négatifs.
  const a = index / count;
  const w = 0.045;
  const clipPath = useTransform(
    progress,
    [Math.max(0, a - w), Math.min(1, a + w)],
    ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"]
  );
  const y = useTransform(
    progress,
    [Math.max(0, a - w), Math.min(1, a + w)],
    ["-6%", "0%"]
  );

  // Le premier écran est le fond : toujours visible, jamais animé
  if (index === 0) {
    return <div className="absolute inset-0">{children}</div>;
  }

  return (
    <motion.div style={{ clipPath }} className="absolute inset-0">
      <motion.div style={{ y }} className="absolute inset-0">
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ——— Les écrans affichés dans l'ordinateur ——— */

/** 01 — Écoute : la visio de découverte et les notes */
function ScreenListen({ t }: { t: EcranTextes }) {
  return (
    <div className="absolute inset-0 grid grid-cols-[1.2fr_1fr] gap-3 bg-sand p-4">
      <div className="flex flex-col rounded-xl bg-ink-deep p-3">
        <div className="grid flex-1 grid-cols-2 gap-2">
          <div className="relative flex items-center justify-center rounded-lg bg-sage/25">
            <span className="flex size-10 items-center justify-center rounded-full bg-sage font-display text-sm font-bold text-ink-deep">
              R-X
            </span>
          </div>
          <div className="relative flex items-center justify-center rounded-lg bg-terra/25">
            <span className="size-10 rounded-full bg-terra" />
            <span className="absolute bottom-1 left-1 rounded bg-ink-deep/70 px-1 py-0.5 text-[0.42rem] font-medium text-sand">
              {t.client}
            </span>
          </div>
        </div>
        <div className="mt-2 flex h-[18px] items-end justify-center gap-1" aria-hidden="true">
          {[8, 14, 10, 18, 12, 7, 15].map((h, i) => (
            <span
              key={i}
              className="bar-dance w-1 rounded-full bg-sand/50"
              style={{ height: h, animationDelay: `${i * 0.13}s` }}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1.5 rounded-xl bg-sand-card p-3 text-[0.5rem] leading-snug text-ink-soft">
        <span className="font-semibold tracking-wide text-sage-deep uppercase">
          {t.notesTitre}
        </span>
        {t.notes.map((note) => (
          <span key={note}>· {note}</span>
        ))}
        {/* La ligne en train de s'écrire, avec son curseur qui clignote */}
        <span className="flex items-center gap-1">
          <span className="typing-line h-2.5 rounded-full bg-terra/60" />
          <span className="caret-blink h-3 w-0.5 shrink-0 bg-ink/60" />
        </span>
        <span className="mt-auto inline-flex items-center gap-1 self-start rounded-full bg-sage-wash px-2 py-1 text-[0.5rem] font-semibold tracking-wide text-sage-deep uppercase">
          {t.enregistrement}
        </span>
      </div>
    </div>
  );
}

/**
 * 02 — Structure : le wireframe se construit en boucle. Les blocs se
 * posent l'un après l'autre et les cotes de mesure se tracent, comme
 * une maquette en train d'être montée.
 */
function ScreenWireframe() {
  const box = "rounded-lg border-2 border-dashed border-ink/25";
  return (
    <div className="absolute inset-0 flex flex-col gap-2.5 bg-sand-card p-4">
      <div
        className={`wf-settle flex h-8 items-center justify-between px-3 ${box}`}
      >
        <span className="h-2 w-10 rounded-full bg-ink/20" />
        <span className="flex gap-2">
          <span className="h-2 w-6 rounded-full bg-ink/15" />
          <span className="h-2 w-6 rounded-full bg-ink/15" />
          <span className="h-2 w-6 rounded-full bg-ink/15" />
        </span>
      </div>

      <div
        className={`wf-settle relative flex flex-1 items-center justify-center ${box}`}
        style={{ animationDelay: "0.35s" }}
      >
        <svg
          className="absolute inset-0 h-full w-full text-ink/10"
          aria-hidden="true"
        >
          <line className="dash-march" x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="2" />
          <line className="dash-march" x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="2" />
        </svg>
        <span className="relative h-3 w-28 rounded-full bg-ink/20" />
        {/* La cote de largeur, qui se trace puis s'efface */}
        <span
          aria-hidden="true"
          className="wf-measure absolute bottom-2 left-3 right-3 flex items-center gap-1"
          style={{ animationDelay: "0.7s" }}
        >
          <span className="size-1.5 shrink-0 rotate-45 border-l border-b border-terra-hot" />
          <span className="h-px flex-1 bg-terra-hot/70" />
          <span className="font-mono text-[0.5rem] text-terra-hot">100%</span>
          <span className="h-px flex-1 bg-terra-hot/70" />
          <span className="size-1.5 shrink-0 -rotate-135 border-l border-b border-terra-hot" />
        </span>
      </div>

      <div className="grid h-1/4 grid-cols-3 gap-2.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`wf-settle ${box}`}
            style={{ animationDelay: `${0.9 + i * 0.22}s` }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * 03 — Observation : un enregistrement de session. Le curseur d'un
 * vrai visiteur traverse l'écran, hésite devant un choix, revient,
 * puis clique — et chaque clic laisse une marque qui reste.
 */
function ScreenHeatmap() {
  const marques = [
    { x: "29%", y: "33%", d: "0s" },
    { x: "68%", y: "30%", d: "3.6s" },
    { x: "41%", y: "66%", d: "7s" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden bg-sand">
      {/* La page observée */}
      <div className="absolute inset-0 flex flex-col gap-2.5 p-4">
        <div className="flex h-7 items-center justify-between rounded-lg bg-sand-card px-3 shadow-sm">
          <span className="h-2 w-8 rounded-full bg-ink/45" />
          <span className="h-4 w-12 rounded-full bg-ink/15" />
        </div>
        <div className="flex flex-1 gap-2.5">
          <div className="flex w-1/2 flex-col justify-center gap-2 rounded-lg bg-sage-wash px-4">
            <span className="h-2.5 w-24 rounded-full bg-ink/45" />
            <span className="h-2 w-16 rounded-full bg-ink/25" />
            <span className="mt-1 h-6 w-20 rounded-full bg-sage-strong/70" />
          </div>
          <div className="flex w-1/2 flex-col justify-center gap-2 rounded-lg bg-terra-wash px-4">
            <span className="h-2.5 w-24 rounded-full bg-ink/45" />
            <span className="h-2 w-16 rounded-full bg-ink/25" />
            <span className="mt-1 h-6 w-20 rounded-full bg-terra-strong" />
          </div>
        </div>
        <div className="h-1/5 rounded-lg bg-sand-card shadow-sm" />
      </div>

      {/* Les clics laissés en chemin */}
      {marques.map((m, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="session-mark pointer-events-none absolute -ml-4 -mt-4 flex size-8 items-center justify-center rounded-full bg-terra-hot/25"
          style={{ left: m.x, top: m.y, animationDelay: m.d }}
        >
          <span className="size-2.5 rounded-full bg-terra-hot" />
        </span>
      ))}

      {/* Le curseur enregistré */}
      <span
        aria-hidden="true"
        className="session-cursor pointer-events-none absolute z-10 -ml-1 -mt-1"
      >
        <MousePointer2 className="size-5 fill-ink-deep text-sand drop-shadow" />
        {/* L'hésitation, notée par l'observateur */}
        <span className="session-hesite absolute top-5 left-4 rounded bg-ink-deep px-1.5 py-0.5 font-mono text-[0.5rem] whitespace-nowrap text-sand">
          hésite 2,4 s
        </span>
      </span>

      <span className="absolute top-3 left-3 z-10 rounded-full bg-ink-deep/85 px-2.5 py-1 font-mono text-[0.55rem] font-semibold tracking-[0.14em] text-sand uppercase">
        Session 04
      </span>
    </div>
  );
}

/** 04 — Design : la maquette prend ses couleurs */
function ScreenDesign({ t }: { t: EcranTextes }) {
  return (
    <div className="absolute inset-0 flex flex-col gap-2.5 bg-sand p-4">
      <div className="flex h-8 items-center justify-between rounded-lg bg-sand-card px-3 shadow-sm">
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-full border-2 border-sage-strong" />
          <span className="h-2 w-8 rounded-full bg-ink/70" />
        </span>
        <span className="flex gap-2">
          <span className="h-2 w-6 rounded-full bg-ink/20" />
          <span className="h-2 w-6 rounded-full bg-ink/20" />
          <span className="h-6 w-14 rounded-full bg-terra-strong" />
        </span>
      </div>
      <div className="flex flex-1 items-center justify-between gap-3 rounded-lg bg-sage-wash px-4">
        <div className="flex flex-col gap-1.5">
          <span className="font-display text-[0.72rem] leading-tight font-bold text-ink">
            {t.maquetteTitre}
          </span>
          <span className="text-[0.5rem] text-ink-soft">{t.maquetteLede}</span>
          <span className="pulse-doux mt-1 rounded-full bg-terra-strong px-2 py-1 text-center text-[0.5rem] font-semibold text-sand-card">
            {t.maquetteAction}
          </span>
        </div>
        <span className="size-14 rounded-full border-4 border-sage-strong bg-sand-card shadow-inner" />
      </div>
      <div className="grid h-1/4 grid-cols-3 gap-2.5">
        <div className="rounded-lg bg-terra-wash" />
        <div className="rounded-lg bg-sand-card shadow-sm" />
        <div className="rounded-lg bg-sage-wash" />
      </div>
    </div>
  );
}

/** 05 — Transmission : le site est livré, en ligne */
function ScreenLaunch({ onlineLabel }: { onlineLabel: string }) {
  return (
    <div className="absolute inset-0 bg-sand">
      <div className="flex h-full flex-col gap-2.5 p-4">
        <div className="flex h-8 items-center justify-between rounded-lg bg-ink-deep px-3">
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-full border-2 border-sage" />
            <span className="h-2 w-8 rounded-full bg-sand/80" />
          </span>
          <span className="h-6 w-14 rounded-full bg-terra" />
        </div>
        <div className="flex flex-1 items-center justify-between gap-3 rounded-lg bg-sage-wash px-4">
          <div className="flex flex-col gap-2">
            <span className="h-3.5 w-32 rounded-full bg-ink/80" />
            <span className="h-2.5 w-24 rounded-full bg-ink/30" />
            <span className="mt-1 h-6 w-20 rounded-full bg-terra-strong" />
          </div>
          <span className="size-14 rounded-full border-4 border-sage-strong bg-sand-card shadow-inner" />
        </div>
        <div className="grid h-1/4 grid-cols-3 gap-2.5">
          <div className="rounded-lg bg-terra-wash" />
          <div className="rounded-lg bg-sand-card shadow-sm" />
          <div className="rounded-lg bg-sage-wash" />
        </div>
      </div>
      {/* Le sceau de mise en ligne, avec ses confettis */}
      <div className="absolute inset-0 flex items-center justify-center bg-ink-deep/20 backdrop-blur-[2px]">
        <span aria-hidden="true" className="confetti-float absolute top-1/2 left-[38%] size-2 rounded-full bg-terra" />
        <span aria-hidden="true" className="confetti-float absolute top-[55%] left-[58%] size-1.5 rounded-full bg-sage" style={{ animationDelay: "0.6s" }} />
        <span aria-hidden="true" className="confetti-float absolute top-[48%] left-[64%] size-2 rounded-full bg-sand" style={{ animationDelay: "1.2s" }} />
        <span aria-hidden="true" className="confetti-float absolute top-[58%] left-[43%] size-1.5 rounded-full bg-terra-strong" style={{ animationDelay: "1.8s" }} />
        <span className="badge-pop inline-flex items-center gap-2.5 rounded-full bg-ink-deep px-5 py-2.5 shadow-xl">
          <span className="flex size-6 items-center justify-center rounded-full bg-sage">
            <Check className="size-4 text-ink-deep" />
          </span>
          <span className="text-sm font-semibold text-sand">{onlineLabel}</span>
        </span>
      </div>
    </div>
  );
}
