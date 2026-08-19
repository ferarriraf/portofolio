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

type ProcessScrollProps = {
  eyebrow: string;
  title: string;
  steps: Step[];
  onlineLabel: string;
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
    <ScreenListen key="s1" />,
    <ScreenWireframe key="s2" />,
    <ScreenHeatmap key="s3" />,
    <ScreenDesign key="s4" />,
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
                <FakeCursor />
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

/** Le curseur qui navigue et clique tout seul dans l'écran. */
function FakeCursor() {
  return (
    <span
      aria-hidden="true"
      className="fake-cursor pointer-events-none absolute z-20 -mt-1 -ml-1"
    >
      <span className="fake-cursor-click absolute -inset-3 rounded-full border-2 border-terra-strong" />
      <span className="fake-cursor-click2 absolute -inset-3 rounded-full border-2 border-sage-strong" />
      <MousePointer2 className="size-5 fill-ink-deep text-sand drop-shadow-md" />
    </span>
  );
}

/** 01 — Écoute : la visio de découverte et les notes */
function ScreenListen() {
  return (
    <div className="absolute inset-0 grid grid-cols-[1.2fr_1fr] gap-3 bg-sand p-4">
      <div className="flex flex-col rounded-xl bg-ink-deep p-3">
        <div className="grid flex-1 grid-cols-2 gap-2">
          <div className="flex items-center justify-center rounded-lg bg-sage/25">
            <span className="flex size-10 items-center justify-center rounded-full bg-sage font-display text-sm font-bold text-ink-deep">
              R-X
            </span>
          </div>
          <div className="flex items-center justify-center rounded-lg bg-terra/25">
            <span className="size-10 rounded-full bg-terra" />
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
      <div className="flex flex-col gap-2 rounded-xl bg-sand-card p-3">
        <span className="h-2.5 w-3/4 rounded-full bg-ink/20" />
        <span className="h-2.5 w-full rounded-full bg-ink/10" />
        <span className="h-2.5 w-5/6 rounded-full bg-ink/10" />
        {/* La ligne en train de s'écrire, avec son curseur qui clignote */}
        <span className="flex items-center gap-1">
          <span className="typing-line h-2.5 rounded-full bg-terra/60" />
          <span className="caret-blink h-3 w-0.5 shrink-0 bg-ink/60" />
        </span>
        <span className="h-2.5 w-4/5 rounded-full bg-ink/10" />
        <span className="mt-auto inline-flex h-6 w-24 items-center justify-center rounded-full bg-sage-wash text-[0.55rem] font-semibold tracking-wide text-sage-deep uppercase">
          Notes
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
 * 03 — Observation : la carte de chaleur du regard.
 * L'écran de l'étape précédente, recouvert des zones chaudes et du
 * parcours du regard — la signature d'un studio d'ergonomie.
 */
function ScreenHeatmap() {
  const blobs = [
    { x: "22%", y: "26%", s: 86, c: "rgba(193,113,75,0.75)", d: "0s" },
    { x: "58%", y: "34%", s: 66, c: "rgba(223,161,132,0.7)", d: "0.5s" },
    { x: "34%", y: "68%", s: 74, c: "rgba(193,113,75,0.6)", d: "1s" },
    { x: "76%", y: "72%", s: 52, c: "rgba(169,191,160,0.65)", d: "1.5s" },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden bg-ink-deep">
      {/* La page observée, en sourdine */}
      <div className="absolute inset-0 flex flex-col gap-2.5 p-4 opacity-25">
        <div className="flex h-7 items-center justify-between rounded-lg bg-sand/70 px-3">
          <span className="h-2 w-8 rounded-full bg-ink/60" />
          <span className="h-4 w-12 rounded-full bg-ink/40" />
        </div>
        <div className="flex flex-1 items-center gap-3 rounded-lg bg-sand/50 px-4">
          <span className="h-3 w-28 rounded-full bg-ink/50" />
        </div>
        <div className="grid h-1/4 grid-cols-3 gap-2.5">
          <div className="rounded-lg bg-sand/40" />
          <div className="rounded-lg bg-sand/40" />
          <div className="rounded-lg bg-sand/40" />
        </div>
      </div>

      {/* Les zones chaudes */}
      {blobs.map((b, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="heat-blob absolute rounded-full blur-md"
          style={{
            left: b.x,
            top: b.y,
            width: b.s,
            height: b.s,
            marginLeft: -b.s / 2,
            marginTop: -b.s / 2,
            background: `radial-gradient(closest-side, ${b.c}, transparent 70%)`,
            animationDelay: b.d,
          }}
        />
      ))}

      {/* Le parcours du regard : le tracé se dessine, et l'œil le suit */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 320 200"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <path
          className="gaze-path"
          d="M70 52 L186 68 L109 136 L243 144"
          stroke="var(--sand)"
          strokeOpacity="0.85"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4 5"
        />
        {[[70, 52], [186, 68], [109, 136], [243, 144]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="3.5" fill="var(--sand)" fillOpacity="0.9" />
        ))}
        {/* Le point de fixation, qui parcourt le trajet sans fin */}
        <circle r="6" fill="var(--terra-hot)" fillOpacity="0.95">
          <animateMotion
            dur="4.5s"
            repeatCount="indefinite"
            keyPoints="0;1"
            keyTimes="0;1"
            calcMode="linear"
            path="M70 52 L186 68 L109 136 L243 144"
          />
        </circle>
        <circle r="13" fill="none" stroke="var(--terra-hot)" strokeOpacity="0.5" strokeWidth="1.2">
          <animateMotion
            dur="4.5s"
            repeatCount="indefinite"
            path="M70 52 L186 68 L109 136 L243 144"
          />
          <animate
            attributeName="r"
            values="9;16;9"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      <span className="absolute top-3 left-3 rounded-full bg-sand/15 px-2.5 py-1 text-[0.55rem] font-semibold tracking-[0.14em] text-sand uppercase">
        Heatmap
      </span>
    </div>
  );
}

/** 04 — Design : la maquette prend ses couleurs */
function ScreenDesign() {
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
        <div className="flex flex-col gap-2">
          <span className="h-3.5 w-32 rounded-full bg-ink/80" />
          <span className="h-2.5 w-24 rounded-full bg-ink/30" />
          <span className="soft-pulse mt-1 h-6 w-20 rounded-full bg-terra-strong" />
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
