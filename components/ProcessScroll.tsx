"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { Check } from "lucide-react";
import RetroComputer from "./RetroComputer";
import SectionLabel from "./SectionLabel";

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
  ecrans: EcranTextes;
};

/**
 * La méthode : UN SEUL poste, et c'est le défilement qui le pilote.
 *
 * Trois versions ont été écartées avant celle-ci, et les trois raisons
 * comptent — ne pas les refaire :
 *  · un scrollytelling épinglé sur 750 vh : magnifique, mais sept écrans
 *    et demi de molette pour cinq phrases ;
 *  · cinq postes à la suite : « je veux pas plusieurs écrans côte à
 *    côte », et c'était juste — ce n'est pas un magasin d'ordinateurs ;
 *  · un poste unique piloté au CLIC, avec les étapes en touches : le
 *    propriétaire ne veut pas avoir à cliquer, et des touches empilées
 *    ramenaient le motif de carte générique qu'on venait de chasser
 *    ailleurs.
 *
 * Donc : un seul poste, aucun bouton, aucun geste à comprendre. On passe
 * devant, l'écran change. La liste à côté est du TEXTE, pas des
 * commandes — rien n'est cliquable, donc personne ne se demande si ça
 * l'est. Les cinq textes sont écrits en entier tout le temps : rien
 * n'est caché derrière un geste, et la section reste lisible sans
 * JavaScript.
 *
 * 220 vh, et pas 750. Le calcul, pour qui voudrait y toucher : la
 * réserve de défilement utile vaut la hauteur de la section MOINS celle
 * du bloc collant, soit 120 vh ici — répartis sur cinq étapes, environ
 * 216 px chacune, soit deux crans de molette. À 180 vh on tombait à un
 * seul cran par étape et les écrans défilaient sans qu'on ait le temps
 * de les voir. Aucun défilement n'est confisqué pour autant : la page
 * continue de descendre normalement pendant que l'écran se réécrit.
 */

export default function ProcessScroll({
  eyebrow,
  title,
  steps,
  onlineLabel,
  ecrans,
}: ProcessScrollProps) {
  const reduce = useReducedMotion();
  const [actif, setActif] = useState(0);

  const screens = [
    <ScreenListen key="s1" t={ecrans} />,
    <ScreenArchi key="s2" t={ecrans} />,
    <ScreenCode key="s3" t={ecrans} />,
    <ScreenTests key="s4" t={ecrans} />,
    <ScreenLaunch key="s5" onlineLabel={onlineLabel} />,
  ];

  const ref = useRef<HTMLElement>(null);
  const power = useMotionValue(reduce ? 1 : 0);
  const enVue = useInView(ref, { once: true, margin: "-15% 0px" });

  /* Le poste s'allume une fois, quand il entre dans le champ. Il ne se
     rallume PAS à chaque étape : cinq mises sous tension d'affilée en
     descendant, c'est précisément le « trop répétitif » qu'on nous a
     reproché. À chaque changement, seule l'image se réécrit. */
  useEffect(() => {
    if (!enVue || reduce) return;
    const anim = animate(power, 1, { duration: 0.9, ease: "easeOut" });
    return () => anim.stop();
  }, [enVue, power, reduce]);

  /* L'étape suivie du défilement. On lit la progression et on en déduit
     un indice — surtout PAS un `useTransform` à tableaux : cette forme
     se compile en animation native liée au défilement, et sur une
     section haute elle sort de sa plage et retombe sur sa première
     valeur. Le piège est documenté dans CLAUDE.md, il a déjà coûté cher. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const i = Math.max(0, Math.min(steps.length - 1, Math.floor(p * steps.length)));
    setActif((precedent) => (precedent === i ? precedent : i));
  });

  return (
    <section
      ref={ref}
      className="relative border-b border-line bg-sage-wash"
      style={{ height: "220vh" }}
    >
      <div className="sticky top-0 flex min-h-svh flex-col justify-center py-16">
        <div className="container-site">
          <SectionLabel n={2}>{eyebrow}</SectionLabel>
          <h2 className="mt-5 max-w-3xl font-display text-4xl font-bold tracking-tight text-balance text-ink md:text-5xl">
            {title}
          </h2>

          <div className="mt-10 grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            {/* ——— L'index de la méthode ———
                Du texte, rien d'autre. Le filet à gauche passe en
                terracotta sur l'étape en cours : c'est le seul repère,
                et il suffit puisque l'écran d'à côté montre la même
                étape au même moment. */}
            <ol className="order-2 list-none lg:order-1">
              {steps.map((step, i) => {
                const ici = i === actif;
                return (
                  <li
                    key={step.title}
                    aria-current={ici ? "step" : undefined}
                    className={`border-l-2 py-2.5 pl-5 transition-colors duration-500 motion-reduce:transition-none ${
                      ici ? "border-terra-strong" : "border-ink/12"
                    }`}
                  >
                    <span className="flex items-baseline gap-3">
                      <span
                        className={`font-mono text-xs font-bold tabular-nums transition-colors duration-500 motion-reduce:transition-none ${
                          ici ? "text-terra-deep" : "text-ink-soft"
                        }`}
                      >
                        0{i + 1}
                      </span>
                      <span
                        className={`font-display text-lg font-bold tracking-tight transition-colors duration-500 motion-reduce:transition-none md:text-xl ${
                          ici ? "text-ink" : "text-ink-soft"
                        }`}
                      >
                        {step.title}
                      </span>
                    </span>
                    <span className="mt-1 block max-w-md text-sm leading-relaxed text-pretty text-ink-soft">
                      {step.text}
                    </span>
                  </li>
                );
              })}
            </ol>

            {/* ——— Le poste, un seul ——— */}
            <div className="order-1 lg:order-2">
              <RetroComputer power={reduce ? undefined : power}>
                <motion.div
                  key={actif}
                  initial={reduce ? false : { clipPath: "inset(0% 0% 100% 0%)" }}
                  animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                  transition={{ duration: 0.45, ease: [0.32, 0, 0.2, 1] }}
                  className="absolute inset-0"
                >
                  {screens[actif]}
                </motion.div>
              </RetroComputer>
            </div>
          </div>
        </div>
      </div>
    </section>
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
