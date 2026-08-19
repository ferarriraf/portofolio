"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Check } from "lucide-react";
import { RingGlyph } from "./Logo";

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

  const screens = [
    <ScreenListen key="s1" />,
    <ScreenWireframe key="s2" />,
    <ScreenDesign key="s3" />,
    <ScreenLaunch key="s4" onlineLabel={onlineLabel} />,
  ];

  if (reduce) {
    return (
      <section className="border-b border-line bg-sage-wash">
        <div className="container-site py-24">
          <span className="eyebrow">
            <RingGlyph size={15} />
            {eyebrow}
          </span>
          <h2 className="mt-5 max-w-3xl font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
            {title}
          </h2>
          <div className="mt-14 grid gap-10 md:grid-cols-2">
            {steps.map((step, i) => (
              <div key={step.title}>
                <BrowserFrame>{screens[i]}</BrowserFrame>
                <p className="mt-5 font-display text-lg font-bold text-ink">
                  <span className="mr-2 text-terra-strong">0{i + 1}</span>
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
      style={{ height: `${steps.length * 120}vh` }}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="container-site">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="eyebrow">
              <RingGlyph size={15} />
              {eyebrow}
            </span>
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

            {/* L'écran qui se transforme */}
            <div className="order-1 lg:order-2">
              <BrowserFrame>
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
              </BrowserFrame>
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
      <p className="font-display text-5xl font-bold text-terra md:text-6xl">
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
  const s = segment(index, count);
  const opacity = useTransform(progress, [s.in0, s.in1, s.out0, s.out1], [index === 0 ? 1 : 0, 1, 1, index === count - 1 ? 1 : 0]);
  const scale = useTransform(progress, [s.in0, s.in1, s.out0, s.out1], [index === 0 ? 1 : 1.04, 1, 1, index === count - 1 ? 1 : 0.97]);

  return (
    <motion.div style={{ opacity, scale }} className="absolute inset-0">
      {children}
    </motion.div>
  );
}

/* ——— Le cadre navigateur et ses quatre écrans ——— */

function BrowserFrame({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink/10 bg-sand-card shadow-[0_40px_90px_-40px_rgba(46,52,40,0.5)]">
      <div className="flex items-center gap-2 border-b border-ink/10 bg-ink-deep px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-terra" />
        <span className="size-2.5 rounded-full bg-sage" />
        <span className="size-2.5 rounded-full bg-sand/30" />
        <span className="mx-auto w-1/2 rounded-full bg-sand/10 px-3 py-1 text-center text-[0.65rem] font-medium tracking-wide text-sand/70">
          www.r-x.fr
        </span>
        <span className="w-12" />
      </div>
      <div className="relative aspect-[16/10]">{children}</div>
    </div>
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
        <div className="mt-2 flex items-end justify-center gap-1" aria-hidden="true">
          {[8, 14, 10, 18, 12, 7, 15].map((h, i) => (
            <span
              key={i}
              className="w-1 rounded-full bg-sand/50"
              style={{ height: h }}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 rounded-xl bg-sand-card p-3">
        <span className="h-2.5 w-3/4 rounded-full bg-ink/20" />
        <span className="h-2.5 w-full rounded-full bg-ink/10" />
        <span className="h-2.5 w-5/6 rounded-full bg-ink/10" />
        <span className="h-2.5 w-2/3 rounded-full bg-terra/50" />
        <span className="h-2.5 w-4/5 rounded-full bg-ink/10" />
        <span className="mt-auto inline-flex h-6 w-24 items-center justify-center rounded-full bg-sage-wash text-[0.55rem] font-semibold tracking-wide text-sage-deep uppercase">
          Notes
        </span>
      </div>
    </div>
  );
}

/** 02 — Structure : le wireframe en fil de fer */
function ScreenWireframe() {
  const box = "rounded-lg border-2 border-dashed border-ink/25";
  return (
    <div className="absolute inset-0 flex flex-col gap-2.5 bg-sand-card p-4">
      <div className={`flex h-8 items-center justify-between px-3 ${box}`}>
        <span className="h-2 w-10 rounded-full bg-ink/20" />
        <span className="flex gap-2">
          <span className="h-2 w-6 rounded-full bg-ink/15" />
          <span className="h-2 w-6 rounded-full bg-ink/15" />
          <span className="h-2 w-6 rounded-full bg-ink/15" />
        </span>
      </div>
      <div className={`relative flex flex-1 items-center justify-center ${box}`}>
        <svg className="absolute inset-0 h-full w-full text-ink/10" aria-hidden="true">
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="2" />
          <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="2" />
        </svg>
        <span className="relative h-3 w-28 rounded-full bg-ink/20" />
      </div>
      <div className="grid h-1/4 grid-cols-3 gap-2.5">
        <div className={box} />
        <div className={box} />
        <div className={box} />
      </div>
    </div>
  );
}

/** 03 — Design : la maquette prend ses couleurs */
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
  );
}

/** 04 — Transmission : le site est livré, en ligne */
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
      {/* Le sceau de mise en ligne */}
      <div className="absolute inset-0 flex items-center justify-center bg-ink-deep/20 backdrop-blur-[2px]">
        <span className="inline-flex items-center gap-2.5 rounded-full bg-ink-deep px-5 py-2.5 shadow-xl">
          <span className="flex size-6 items-center justify-center rounded-full bg-sage">
            <Check className="size-4 text-ink-deep" />
          </span>
          <span className="text-sm font-semibold text-sand">{onlineLabel}</span>
        </span>
      </div>
    </div>
  );
}
