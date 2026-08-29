"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import RetroComputer from "./RetroComputer";
import SectionLabel from "./SectionLabel";
import { interpoler } from "@/lib/interpoler";

type Step = { title: string; text: string };

export type EcranTextes = {
  client: string;
  notesTitre: string;
  notes: string[];
  enregistrement: string;
  archiFront: string;
  archiApi: string;
  archiDb: string;
  archiLegende: string;
  codeFichier: string;
  codeOk: string;
  testsTitre: string;
  testsItems: string[];
  testsResume: string;
};

type ProcessScrollProps = {
  eyebrow: string;
  title: string;
  steps: Step[];
  onlineLabel: string;
  prevLabel: string;
  nextLabel: string;
  ecrans: EcranTextes;
};

/**
 * Scrollytelling de la méthode : un écran épinglé qui se métamorphose
 * au fil du scroll — visio de découverte, schéma d'architecture,
 * éditeur de code, tests au vert, site livré. Le texte de l'étape
 * suit le rythme. « Réduire les animations » : les étapes s'affichent
 * en grille statique, sans épinglage ni effet lié au scroll.
 */
export default function ProcessScroll({
  eyebrow,
  title,
  steps,
  onlineLabel,
  prevLabel,
  nextLabel,
  ecrans,
}: ProcessScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // L'étape courante, pour les boutons « flemme de scroller » :
  // un clic saute au centre de l'étape voisine
  const [etape, setEtape] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const e = Math.max(0, Math.min(steps.length - 1, Math.floor(v * steps.length)));
    if (e !== etape) setEtape(e);
  });

  /**
   * Sauter d'une étape — en passant le temps mort.
   *
   * Entre deux étapes, l'écran ne change que sur une fenêtre étroite
   * autour de la frontière : le reste du trajet, plus de la moitié, est
   * un plateau où rien ne bouge. Faire défiler tout ça d'un bloc donnait
   * l'impression d'un bouton qui ne répond pas.
   *
   * Le saut se fait donc en deux temps : on se pose instantanément juste
   * avant la transition — le plateau ne mérite pas qu'on le regarde
   * défiler — puis on joue la transition elle-même, à la vitesse où
   * elle se lit. On n'escamote que ce qui n'a rien à montrer.
   */
  // Le défilement en cours, et l'étape qu'il vise. Les deux comptent :
  // pendant un déplacement, la position courante se trouve AU MILIEU
  // d'une transition, et s'en servir pour décider où aller recalculait
  // la même cible — deux clics rapprochés ne faisaient donc avancer que
  // d'une étape, voire d'aucune près de la dernière.
  const defilement = useRef<{ stop: () => void } | null>(null);
  const etapeVisee = useRef<number | null>(null);

  const sauter = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;

    const borner = (n: number) => Math.max(0, Math.min(steps.length - 1, n));

    // Pendant un déplacement on part de la cible visée, pas de là où
    // l'on se trouve : c'est ce qui permet d'enchaîner les clics.
    const courant =
      etapeVisee.current !== null
        ? etapeVisee.current
        : borner(Math.floor(scrollYProgress.get() * steps.length));
    const cible = borner(courant + dir);
    if (cible === courant) return;

    defilement.current?.stop();
    etapeVisee.current = cible;

    const haut = el.getBoundingClientRect().top + window.scrollY;
    const course = el.offsetHeight - window.innerHeight;
    const position = (p: number) => haut + p * course;

    // La frontière franchie : celle de l'étape d'arrivée en descendant,
    // celle de l'étape de départ en remontant.
    const frontiere = (dir === 1 ? cible : courant) / steps.length;
    /* La demi-fenêtre où quelque chose bouge réellement, mesurée sur le
       code plutôt qu'estimée. Autour d'une frontière à 0,2 :
         · l'écran balaie sur ±0,045   (ScreenPanel, w = 0.045)
         · l'étape sortante s'efface de 0,130 à 0,228  (segment(0, 5))
         · l'étape entrante apparaît de 0,172 à 0,270  (segment(1, 5))
       Soit une zone vivante de 0,130 à 0,270 : ±0,07 exactement. Le
       reste du segment — 0,100 à 0,130 puis 0,270 à 0,300, soit 30 % du
       trajet — est un plateau où rien ne change. C'est lui qu'on saute.
       Élargir cette marge à 0,1 reviendrait à la moitié d'un segment :
       le saut ne sauterait plus rien. */
    const MARGE = 0.07;

    const depart = position(frontiere - dir * MARGE);
    const arrivee = position(frontiere + dir * MARGE);

    // On ne saute que si l'on est loin : déjà dans la transition, un
    // saut en arrière serait un à-coup gratuit.
    if (Math.abs(window.scrollY - depart) > 4) {
      window.scrollTo({ top: depart, behavior: "instant" });
    }

    defilement.current = animate(window.scrollY, arrivee, {
      duration: 0.62,
      ease: [0.32, 0, 0.2, 1],
      onUpdate: (v) => window.scrollTo({ top: v, behavior: "instant" }),
      onComplete: () => {
        defilement.current = null;
        etapeVisee.current = null;
      },
    });
  };
  const railScale = useTransform(scrollYProgress, (p) =>
    interpoler(p, [0.02, 0.98], [0, 1]),
  );
  // L'écran s'allume tout seul dès que le poste entre dans le champ —
  // le flash de mise sous tension ne demande aucun scroll
  const macRef = useRef<HTMLDivElement>(null);
  const enVue = useInView(macRef, { once: true, margin: "-10% 0px" });
  const power = useMotionValue(0);
  useEffect(() => {
    if (!enVue) return;
    const anim = animate(power, 1, { duration: 0.9, ease: "easeOut" });
    return () => anim.stop();
  }, [enVue, power]);
  // Le poste est posé de trois quarts, immobile : la perspective fait
  // le volume, l'écran reste parfaitement lisible
  const rotateY = 9;
  // Il se pose en entrant dans la section, recule avant qu'elle se
  // détache — plus de verrouillage sec du pin
  const poseScale = useTransform(scrollYProgress, (p) =>
    interpoler(p, [0, 0.06, 0.94, 1], [0.955, 1, 1, 0.97]),
  );
  const poseY = useTransform(scrollYProgress, (p) =>
    interpoler(p, [0, 0.06, 0.94, 1], [28, 0, 0, -14]),
  );

  /* ——— Le faisceau du tube, dérivé du défilement réel ———
     `ScreenPanel` fait basculer l'écran n autour de n/5, sur une fenêtre
     de ±0,045 en progression. Ramenée à l'échelle des écrans (×5), cette
     demi-fenêtre vaut 0,225. On repère la frontière la plus proche, et
     on n'allume la machine que si l'on est dedans — l'écran 0 n'a pas de
     transition, il n'y a donc rien à écrire avant la première.
     Résultat : le tube est éteint sur près des deux tiers du parcours. */
  const DEMI = 0.225;
  const activite = useTransform(scrollYProgress, (p) => {
    const x = p * steps.length;
    const i = Math.round(x);
    if (i < 1 || i > steps.length - 1) return 0;
    return Math.max(0, Math.min(1, 1 - Math.abs(x - i) / DEMI));
  });
  const faisceau = useTransform(scrollYProgress, (p) => {
    const x = p * steps.length;
    const i = Math.round(x);
    return Math.max(0, Math.min(1, (x - i + DEMI) / (DEMI * 2))) * 100;
  });

  const screens = [
    <ScreenListen key="s1" t={ecrans} />,
    <ScreenArchi key="s2" t={ecrans} />,
    <ScreenCode key="s3" t={ecrans} />,
    <ScreenTests key="s4" t={ecrans} />,
    <ScreenLaunch key="s5" onlineLabel={onlineLabel} />,
  ];

  /* La version déroulée : les cinq étapes à la suite, rien d'épinglé.
     Elle servait déjà aux visiteurs en mouvement réduit. Elle sert
     désormais AUSSI à tous les écrans sous 1024 px : le cadre épinglé
     mesure la hauteur de l'écran pour un contenu de 748 px, si bien que
     sur un téléphone le titre de la section passait entièrement au-
     dessus du cadre et les boutons entièrement en dessous — invisibles,
     alors que les boutons restaient atteignables au clavier et
     faisaient sauter la page. */
  const grilleDeroulee = (
    <section className="border-b border-line bg-sage-wash">
      <div className="container-site py-24">
        <SectionLabel n={2}>{eyebrow}</SectionLabel>
        <h2 className="mt-5 max-w-3xl font-display text-4xl font-bold tracking-tight text-balance text-ink md:text-5xl">
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

  if (reduce) return grilleDeroulee;

  /* La version épinglée, réservée aux grands écrans. */
  const scrollytelling = (
    <section
      ref={ref}
      className="relative border-b border-line bg-sage-wash"
      style={{ height: `${steps.length * 150}vh` }}
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
            {/* Étapes + glissière crantée : la gorge se remplit et
                s'allume cran par cran, en phase avec les écrans */}
            <div className="order-2 lg:order-1">
              <div className="relative min-h-64 pl-8 lg:min-h-80">
                {/* La glissière s'arrête pile sur ses crans extrêmes :
                    elle ne déborde plus du contenu */}
                <div
                  aria-hidden="true"
                  className="absolute top-[10%] bottom-[10%] left-1 w-[3px] rounded-full bg-ink/10 shadow-[inset_0_1px_2px_rgba(36,41,31,0.4)]"
                />
                <motion.div
                  aria-hidden="true"
                  style={{ scaleY: railScale }}
                  className="absolute top-[10%] bottom-[10%] left-1 w-[3px] origin-top rounded-full bg-terra-strong"
                />
                {steps.map((_, i) => (
                  <Cran
                    key={i}
                    index={i}
                    count={steps.length}
                    progress={scrollYProgress}
                  />
                ))}
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

              {/* Pour qui a la flemme de scroller : sauter d'une étape */}
              <div className="mt-6 flex items-center gap-3 pl-8">
                <button
                  type="button"
                  onClick={() => sauter(-1)}
                  disabled={etape === 0}
                  aria-label={prevLabel}
                  className="press inline-flex size-10 items-center justify-center rounded-full border border-ink/20 bg-sand-card text-ink transition-colors duration-200 hover:bg-ink hover:text-sand disabled:pointer-events-none disabled:opacity-35"
                >
                  <ChevronUp className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => sauter(1)}
                  disabled={etape === steps.length - 1}
                  aria-label={nextLabel}
                  className="press inline-flex size-10 items-center justify-center rounded-full border border-ink/20 bg-sand-card text-ink transition-colors duration-200 hover:bg-ink hover:text-sand disabled:pointer-events-none disabled:opacity-35"
                >
                  <ChevronDown className="size-4" />
                </button>
                <span
                  aria-hidden="true"
                  className="ml-1 font-mono text-xs tracking-[0.14em] text-terra-deep"
                >
                  0{etape + 1} / 0{steps.length}
                </span>
              </div>
            </div>

            {/* L'ordinateur qui s'allume, se pose, pivote et se
                transforme — son ombre reste au sol, hors du pivot */}
            <div
              className="order-1 lg:order-2"
              style={{ perspective: "1100px" }}
            >
              <div ref={macRef} className="relative mx-auto w-full max-w-[31rem]">
                {/* L'ombre au sol, décalée à l'opposé de la face visible */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-8 -bottom-1 h-7 -translate-x-3 rounded-[50%] bg-ink/30 blur-lg"
                />
                <motion.div style={{ rotateY, scale: poseScale, y: poseY }}>
                  <RetroComputer
                    power={power}
                    faisceau={faisceau}
                    activite={activite}
                    ombre={false}
                  >
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
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  /* Le choix se fait en CSS, pas en JavaScript : une bascule après
     montage provoquerait soit un saut de mise en page sur ordinateur,
     soit un éclair de la version cassée sur téléphone. `hidden` retire
     réellement l'élément du flux, donc les 750 vh ne comptent pas dans
     la hauteur du document sur les petits écrans. */
  return (
    <>
      <div className="lg:hidden">{grilleDeroulee}</div>
      <div className="hidden lg:block">{scrollytelling}</div>
    </>
  );
}

/* ——— Panneaux pilotés par le scroll ——— */

/** Un cran de la glissière : sa pastille s'allume au passage */
function Cran({
  index,
  count,
  progress,
}: {
  index: number;
  count: number;
  progress: MotionValue<number>;
}) {
  const c = (index + 0.5) / count;
  const allume = useTransform(progress, (p) =>
    interpoler(p, [c - 0.02, c + 0.02], [0, 1]),
  );

  return (
    <span
      aria-hidden="true"
      className="absolute left-[5.5px] -translate-x-1/2 -translate-y-1/2"
      style={{ top: `${c * 100}%` }}
    >
      <span className="block size-[7px] rounded-full border border-ink/25 bg-sand" />
      <motion.span
        style={{ opacity: allume }}
        className="absolute inset-0 rounded-full bg-terra-strong"
      />
    </span>
  );
}

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
  const bornes = [s.in0, s.in1, s.out0, s.out1];
  const opacity = useTransform(progress, (p) =>
    interpoler(p, bornes, [index === 0 ? 1 : 0, 1, 1, index === count - 1 ? 1 : 0]),
  );
  const y = useTransform(progress, (p) =>
    interpoler(p, bornes, [index === 0 ? 0 : 28, 0, 0, index === count - 1 ? 0 : -28]),
  );

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
  const bornes = [Math.max(0, a - w), Math.min(1, a + w)];
  const clipPath = useTransform(
    progress,
    (p) => `inset(0% 0% ${interpoler(p, bornes, [100, 0]).toFixed(2)}% 0%)`,
  );
  const y = useTransform(
    progress,
    (p) => `${interpoler(p, bornes, [-6, 0]).toFixed(2)}%`,
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
              className="w-1 rounded-full bg-sand/50"
              style={{ height: h }}
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
          <span className="h-3 w-0.5 shrink-0 bg-ink/60" />
        </span>
        <span className="mt-auto inline-flex items-center gap-1 self-start rounded-full bg-sage-wash px-2 py-1 text-[0.5rem] font-semibold tracking-wide text-sage-deep uppercase">
          {t.enregistrement}
        </span>
      </div>
    </div>
  );
}

/**
 * 02 — Architecture : le plan technique se dessine. Trois étages —
 * pages, API, base de données — se posent l'un après l'autre,
 * reliés par des flux en pointillés qui circulent.
 */
function ScreenArchi({ t }: { t: EcranTextes }) {
  const etages = [
    {
      nom: t.archiFront,
      delai: "0s",
      decor: (
        <span className="flex gap-1" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-4 w-3 rounded-xs border border-ink/25 bg-sand"
            />
          ))}
        </span>
      ),
    },
    {
      nom: t.archiApi,
      delai: "0.45s",
      decor: (
        <span
          aria-hidden="true"
          className="font-mono text-[0.6rem] font-bold text-terra-deep"
        >
          {"{ · · · }"}
        </span>
      ),
    },
    {
      nom: t.archiDb,
      delai: "0.9s",
      decor: (
        <span className="flex flex-col gap-0.5" aria-hidden="true">
          {[0, 1].map((i) => (
            <span
              key={i}
              className="h-1.5 w-7 rounded-full border border-ink/25 bg-sand"
            />
          ))}
        </span>
      ),
    },
  ];

  return (
    <div className="absolute inset-0 flex flex-col bg-sand-card p-4">
      <span className="self-start rounded-full bg-sage-wash px-2 py-0.5 font-mono text-[0.5rem] font-semibold tracking-wide text-sage-deep">
        {t.archiLegende}
      </span>
      <div className="mt-1.5 flex flex-1 flex-col">
        {etages.map((e, i) => (
          <div key={e.nom} className="flex min-h-0 flex-1 flex-col">
            {i > 0 && (
              <svg
                aria-hidden="true"
                className="mx-auto h-3 w-0.5 shrink-0 text-ink/30"
              >
                <line
                  className="dash-march"
                  x1="50%"
                  y1="0"
                  x2="50%"
                  y2="100%"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            )}
            <div
              className="flex flex-1 items-center justify-between rounded-lg border-2 border-dashed border-ink/25 px-3"
              style={{ animationDelay: e.delai }}
            >
              <span className="font-mono text-[0.55rem] font-semibold text-ink/75">
                {e.nom}
              </span>
              {e.decor}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 03 — Développement : l'éditeur ouvert. Des lignes de code abstraites
 * — retrait puis segments colorés, comme une coloration syntaxique vue
 * de loin — et la dernière ligne qui s'écrit, curseur battant.
 */
function ScreenCode({ t }: { t: EcranTextes }) {
  const lignes: { retrait: number; segments: [number, string][] }[] = [
    { retrait: 0, segments: [[26, "bg-terra/80"], [40, "bg-sand/60"]] },
    { retrait: 12, segments: [[34, "bg-sage/80"], [22, "bg-sand/40"]] },
    { retrait: 12, segments: [[18, "bg-sand/60"], [42, "bg-terra/50"]] },
    { retrait: 24, segments: [[30, "bg-sage/60"]] },
    { retrait: 12, segments: [[24, "bg-sand/40"], [28, "bg-sage/80"]] },
    { retrait: 0, segments: [[14, "bg-terra/80"]] },
  ];

  return (
    <div className="absolute inset-0 flex flex-col bg-ink-deep p-3.5 font-mono">
      {/* L'onglet du fichier ouvert */}
      <div className="flex items-center gap-1.5 rounded-t-lg bg-ink/70 px-2.5 py-1.5">
        <span className="size-1.5 rounded-full bg-terra/80" aria-hidden="true" />
        <span className="text-[0.55rem] text-sand/80">{t.codeFichier}</span>
      </div>
      {/* Le code */}
      <div
        aria-hidden="true"
        className="flex flex-1 flex-col justify-center gap-2 rounded-b-lg border-x border-b border-sand/10 px-3"
      >
        {lignes.map((l, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-3 shrink-0 text-right text-[0.45rem] text-sand/30">
              {i + 1}
            </span>
            <span className="shrink-0" style={{ width: l.retrait }} />
            {l.segments.map(([w, c], j) => (
              <span
                key={j}
                className={`h-1.5 rounded-full ${c}`}
                style={{ width: w }}
              />
            ))}
          </div>
        ))}
        {/* La ligne en train de s'écrire */}
        <div className="flex items-center gap-2">
          <span className="w-3 shrink-0 text-right text-[0.45rem] text-sand/30">
            {lignes.length + 1}
          </span>
          <span className="typing-line h-1.5 rounded-full bg-sage/70" />
          <span className="h-2.5 w-0.5 shrink-0 bg-sand/80" />
        </div>
      </div>
      {/* La barre d'état : tout est au vert */}
      <div className="mt-2 flex items-center justify-between rounded-md bg-ink/70 px-2.5 py-1">
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-sage" aria-hidden="true" />
          <span className="text-[0.5rem] text-sage">{t.codeOk}</span>
        </span>
        <span className="text-[0.5rem] text-sand/50">main</span>
      </div>
    </div>
  );
}

/** 04 — Tests : le terminal déroule la suite, tout passe au vert */
function ScreenTests({ t }: { t: EcranTextes }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-ink-deep p-4 font-mono">
      {/* Les trois pastilles de fenêtre du terminal */}
      <div className="flex items-center gap-1.5" aria-hidden="true">
        <span className="size-2 rounded-full bg-terra/70" />
        <span className="size-2 rounded-full bg-sand/40" />
        <span className="size-2 rounded-full bg-sage/70" />
      </div>
      <div className="mt-3 flex flex-1 flex-col justify-center gap-2">
        <span className="text-[0.55rem] text-sand/60">$ {t.testsTitre}</span>
        {t.testsItems.map((item) => (
          <span
            key={item}
            className="flex items-center gap-1.5 text-[0.55rem] text-sand/90"
            style={{ }}
          >
            <Check className="size-2.5 shrink-0 text-sage" aria-hidden="true" />
            {item}
          </span>
        ))}
        <span className="mt-1.5 inline-flex items-center gap-1.5 self-start rounded-full bg-sage px-2.5 py-1 text-[0.55rem] font-bold text-ink-deep">
          <Check className="size-2.5" aria-hidden="true" />
          {t.testsResume}
        </span>
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
          <div className="rounded-lg bg-sand-card shadow-elev-1" />
          <div className="rounded-lg bg-sage-wash" />
        </div>
      </div>
      {/* Le sceau de mise en ligne, avec ses confettis */}
      <div className="absolute inset-0 flex items-center justify-center bg-ink-deep/20 backdrop-blur-[2px]">
        <span className="inline-flex items-center gap-2.5 rounded-full bg-ink-deep px-5 py-2.5 shadow-elev-3">
          <span className="flex size-6 items-center justify-center rounded-full bg-sage">
            <Check className="size-4 text-ink-deep" />
          </span>
          <span className="text-sm font-semibold text-sand">{onlineLabel}</span>
        </span>
      </div>
    </div>
  );
}
