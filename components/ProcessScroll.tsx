"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion } from "framer-motion";
import RetroComputer from "./RetroComputer";
import SectionLabel from "./SectionLabel";

type Step = { title: string; text: string };

export type EcranTextes = {
  demande: string[];
  pages: string[];
  formTitre: string;
  formDate: string;
  formDateValeur: string;
  formHeure: string;
  formHeureValeur: string;
  formCouverts: string;
  formCouvertsValeur: string;
  formBouton: string;
  verifs: string[];
  adresse: string;
  enLigne: string;
};

type ProcessScrollProps = {
  eyebrow: string;
  title: string;
  steps: Step[];
  onlineLabel: string;
  ecrans: EcranTextes;
};

/**
 * La méthode : le document passe sous la machine.
 *
 * CINQ VERSIONS ONT ÉTÉ REJETÉES AVANT CELLE-CI. Les lire dans
 * CLAUDE.md avant d'y toucher — un scrollytelling de 750 vh, cinq
 * postes côte à côte, deux pilotages au clic, puis une liste épinglée
 * pilotée au défilement. Cette dernière a échoué sur un défaut
 * MESURABLE et non sur un goût : la section faisait 220 vh pour un bloc
 * collant de 100 vh, soit 120 vh — 55 % de la section — pendant
 * lesquels pas un pixel ne bougeait. « Ça fait vide, il ne se passe
 * rien » était une observation exacte.
 *
 * Ici plus rien n'est épinglé sauf la machine. La hauteur de la section
 * est celle de son contenu : chaque pixel de molette fait avancer
 * quelque chose, et la page RACCOURCIT au lieu de s'allonger.
 *
 * Ce qui répond au geste, sans jamais l'exiger :
 *  · le filet de chaque ligne se remplit de gauche à droite au rythme
 *    de sa propre lecture, et il file jusqu'au bord de la fenêtre en
 *    passant DERRIÈRE la machine — une bande sous une tête de lecture ;
 *  · la ligne en cours devient une bande de papier clair, pleine
 *    largeur, qui passe elle aussi derrière le poste ;
 *  · l'écran de la machine écrit l'étape lue.
 * Le survol prévisualise une autre ligne, mais il est SUSPENDU pendant
 * le défilement : sans ça, le curseur posé sur le texte prendrait la
 * main sur la molette.
 *
 * AUCUN BOUTON, RIEN DE FOCUSABLE, RIEN À CLIQUER. Deux versions au
 * clic ont été refusées ; la liste est du texte, donc personne ne se
 * demande si c'en est.
 *
 * Les valeurs par pixel sont écrites DIRECTEMENT dans le DOM par un
 * écouteur de défilement, jamais par un `useTransform` à tableaux :
 * cette forme se compile en animation native calée sur une ViewTimeline
 * et retombe sur sa première image-clé hors plage — le piège le plus
 * coûteux du dépôt, documenté dans CLAUDE.md.
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

  const section = useRef<HTMLElement>(null);
  const lignes = useRef<(HTMLLIElement | null)[]>([]);
  const power = useMotionValue(reduce ? 1 : 0);
  const enVue = useInView(section, { once: true, margin: "-15% 0px" });

  // Le poste s'allume une fois, en entrant dans le champ. Il ne se
  // rallume pas à chaque étape : cinq mises sous tension d'affilée,
  // c'est le « trop répétitif » qu'on nous a reproché.
  useEffect(() => {
    if (!enVue || reduce) return;
    const anim = animate(power, 1, { duration: 0.9, ease: "easeOut" });
    return () => anim.stop();
  }, [enVue, power, reduce]);

  const survol = useRef<number | null>(null);
  const dernierDefilement = useRef(0);

  const peindre = useCallback(() => {
    const h = window.innerHeight;
    /* LA ZONE DE LECTURE. Une ligne commence à se remplir quand son
       haut atteint 85 % de l'écran, et son filet est plein quand il
       atteint 35 % : elle se remplit donc pendant qu'on la lit, sur une
       demi-hauteur d'écran.
       Premier réglage essayé : « pleine dès que le haut dépasse 62 % ».
       Mesuré, c'était faux — les cinq filets étaient pleins dès l'entrée
       dans la section, avant qu'on ait lu une ligne. La course doit être
       plus longue que la ligne, pas plus courte. */
    const DEBUT = h * 0.85;
    const COURSE = h * 0.5;
    let courante = 0;
    lignes.current.forEach((li, i) => {
      if (!li) return;
      const r = li.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (DEBUT - r.top) / COURSE));
      const jauge = li.querySelector<HTMLElement>("[data-jauge]");
      if (jauge) jauge.style.transform = `scaleX(${p})`;
      const bande = li.querySelector<HTMLElement>("[data-bande]");
      if (bande) bande.style.opacity = "0";
      li.dataset.vu = p > 0.5 ? "1" : "0";
      // La ligne « en cours » est la dernière à avoir franchi la ligne
      // de lecture : celle que l'œil est en train de parcourir.
      if (r.top < h * 0.55) courante = i;
    });

    const i = survol.current ?? courante;
    const li = lignes.current[i];
    if (li) {
      const bande = li.querySelector<HTMLElement>("[data-bande]");
      if (bande) bande.style.opacity = "1";
    }
    setActif((precedent) => (precedent === i ? precedent : i));
  }, []);

  useEffect(() => {
    /* On peint DIRECTEMENT dans l'écouteur, sans passer par
       `requestAnimationFrame`. Deux raisons : le navigateur limite déjà
       les événements de défilement à la cadence d'affichage, et cinq
       `getBoundingClientRect` ne coûtent rien — mais surtout, une
       boucle d'images est gelée dans certains environnements, ce qui
       laissait les jauges figées à zéro sans qu'on puisse le voir. */
    const demander = () => {
      dernierDefilement.current = performance.now();
      peindre();
    };
    peindre();
    window.addEventListener("scroll", demander, { passive: true });
    window.addEventListener("resize", demander, { passive: true });
    return () => {
      window.removeEventListener("scroll", demander);
      window.removeEventListener("resize", demander);
    };
  }, [peindre]);

  // Le survol ne prend la main que si l'on ne défile pas.
  const survoler = (i: number | null) => {
    if (performance.now() - dernierDefilement.current < 160) return;
    survol.current = i;
    peindre();
  };

  const ecransRendus = [
    <EcranDemande key="e1" t={ecrans} />,
    <EcranPages key="e2" t={ecrans} />,
    <EcranFormulaire key="e3" t={ecrans} />,
    <EcranVerifs key="e4" t={ecrans} />,
    <EcranEnLigne key="e5" t={ecrans} onlineLabel={onlineLabel} />,
  ];

  return (
    <section
      ref={section}
      /* `overflow-x: clip` et non `hidden` : les filets et les bandes
         filent au-delà des deux bords pour passer derrière la machine.
         `hidden` créerait un conteneur de défilement et casserait le
         `sticky` du poste ; `clip` rogne sans rien casser. */
      className="overflow-x-clip border-b border-line bg-sage-wash"
    >
      <div className="container-site py-24 md:py-28">
        <SectionLabel n={2}>{eyebrow}</SectionLabel>
        <h2 className="mt-5 max-w-3xl font-display text-4xl font-bold tracking-tight text-balance text-ink md:text-5xl">
          {title}
        </h2>

        {/* La liste vient AVANT la machine dans le balisage. Sur
            téléphone, l'ancienne version servait le poste en premier —
            400 px de haut avant le moindre mot — et les cinq étapes
            tombaient sous la ligne de flottaison. On lit d'abord, la
            machine referme ensuite. */}
        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <ol className="list-none">
            {steps.map((step, i) => (
              <li
                key={step.title}
                ref={(n) => {
                  lignes.current[i] = n;
                }}
                data-vu="0"
                onPointerEnter={() => survoler(i)}
                onPointerLeave={() => survoler(null)}
                className="group relative py-7 md:py-8"
              >
                {/* La bande de papier de la ligne lue. Elle sort des deux
                    côtés et passe derrière le poste. */}
                <span
                  aria-hidden="true"
                  data-bande
                  style={{ opacity: 0 }}
                  className="pointer-events-none absolute inset-y-0 -left-[50vw] -right-[50vw] z-0 bg-sand-card transition-opacity duration-300 motion-reduce:transition-none"
                />
                {/* Le filet, et sa jauge qui se remplit. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 -left-[50vw] -right-[50vw] z-[1] h-[2px] bg-ink/15"
                >
                  <span
                    data-jauge
                    style={{ transform: "scaleX(0)" }}
                    className="block h-full origin-left bg-terra-deep"
                  />
                </span>
                <span
                  aria-hidden="true"
                  className="relative z-[2] -mt-1 block font-mono text-xs font-bold tracking-[0.16em] tabular-nums text-ink-soft"
                >
                  0{i + 1}
                </span>
                <h3 className="relative z-[2] mt-4 font-display text-[clamp(1.6rem,4vw,2.4rem)] leading-[1.06] font-extrabold tracking-[-0.03em] text-balance text-ink-soft transition-colors duration-300 group-data-[vu=1]:text-ink motion-reduce:transition-none">
                  {step.title}
                </h3>
                <p className="relative z-[2] mt-2.5 max-w-[46ch] text-[1.0625rem] leading-[1.65] text-pretty text-ink-soft">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>

          {/* Le poste. Collant sur grand écran seulement : c'est ce qui
              fait passer la bande dessous. `z-10` pour être devant les
              filets.

              PLUS PETIT QU'AVANT, et surtout POSÉ. Sur téléphone il
              occupait 38 % de la hauteur d'écran, seul, sans ombre au
              sol : un grand aplat beige qui flottait sur le vert pâle.
              Il est ramené à 17 rem sous `lg`, et un plan se dessine
              sous lui — un objet posé sur une surface a une échelle,
              un panneau qui flotte n'en a pas. */}
          <div className="relative z-10 mx-auto w-full max-w-[17rem] pb-6 sm:max-w-[20rem] lg:sticky lg:top-[7.5rem] lg:max-w-[24rem] lg:pb-10">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[-8%] bottom-0 h-16 bg-[linear-gradient(to_bottom,rgba(46,52,40,0.08),transparent_72%)] [mask-image:linear-gradient(90deg,transparent,#000_16%,#000_84%,transparent)]"
            />
            <RetroComputer power={reduce ? undefined : power}>
              <motion.div
                key={actif}
                initial={reduce ? false : { clipPath: "inset(0% 0% 100% 0%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                transition={{ duration: 0.45, ease: [0.32, 0, 0.2, 1] }}
                className="absolute inset-0"
              >
                {ecransRendus[actif]}
              </motion.div>
            </RetroComputer>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ——— Les cinq écrans ———
   Une seule histoire suivie : votre restaurant qui veut prendre ses
   réservations en ligne. Ce que vous demandez, les quatre pages, la
   page de réservation, les vérifications, l'adresse.

   Ils affichaient auparavant « npm test », « app/reservation.tsx »,
   « API » et « 0 erreur · 0 avertissement » — sur la version FRANÇAISE
   du site, dont le public est explicitement « des commerçants et des
   artisans, pas des développeurs ». CLAUDE.md l'interdit noir sur
   blanc : ne pas réintroduire de vocabulaire de console.

   Et tout est en `cqw` avec un plancher en px : le texte grandit avec
   la dalle et ne descend jamais sous 11 px. L'ancienne version écrivait
   entre 6,7 et 9,6 px — illisible à tout âge. */

const CADRE =
  "absolute inset-0 flex flex-col items-center justify-center gap-[5cqw] p-[9cqw] text-center";

/** Une ligne de phosphore, avec sa pastille. */
function Ligne({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-[2.6cqw] text-[clamp(0.7rem,5.2cqw,1.15rem)] leading-snug text-terra">
      <span
        aria-hidden="true"
        className="size-[2.2cqw] min-h-[5px] min-w-[5px] shrink-0 rounded-full bg-terra/75"
      />
      {children}
    </span>
  );
}

/** 01 — Écoute : ce que le restaurateur demande, dans ses mots. */
function EcranDemande({ t }: { t: EcranTextes }) {
  return (
    <div className={CADRE}>
      <div className="flex w-full flex-col items-start gap-[3.2cqw] text-left">
        {t.demande.map((d) => (
          <Ligne key={d}>{d}</Ligne>
        ))}
      </div>
    </div>
  );
}

/** 02 — Architecture : les pages, nommées comme un client les nomme. */
function EcranPages({ t }: { t: EcranTextes }) {
  return (
    <div className={CADRE}>
      <div className="flex flex-wrap justify-center gap-[2.4cqw]">
        {t.pages.map((p, i) => (
          <span
            key={p}
            className={`rounded-[2px] border border-terra px-[3.4cqw] py-[1.8cqw] text-[clamp(0.62rem,4.4cqw,1rem)] ${
              i === 2 ? "bg-terra/15 text-terra" : "text-terra/85"
            }`}
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}

/** 03 — Développement : la page de réservation prend forme. */
function EcranFormulaire({ t }: { t: EcranTextes }) {
  const champs: [string, string][] = [
    [t.formDate, t.formDateValeur],
    [t.formHeure, t.formHeureValeur],
    [t.formCouverts, t.formCouvertsValeur],
  ];
  return (
    <div className={CADRE}>
      <div className="flex w-full flex-col gap-[2.4cqw]">
        {champs.map(([nom, valeur]) => (
          <span
            key={nom}
            className="flex items-center justify-between rounded-[2px] border border-terra/50 px-[3cqw] py-[2cqw] text-[clamp(0.62rem,4.2cqw,0.95rem)] text-terra"
          >
            <span>{nom}</span>
            <b className="font-semibold">{valeur}</b>
          </span>
        ))}
        <span className="rounded-[2px] border border-terra bg-terra/20 py-[2.2cqw] text-center text-[clamp(0.7rem,4.6cqw,1rem)] font-bold text-terra [text-shadow:0_0_10px_rgba(217,95,46,0.4)]">
          {t.formBouton}
        </span>
      </div>
    </div>
  );
}

/** 04 — Tests : on vérifie là où ça casse vraiment. */
function EcranVerifs({ t }: { t: EcranTextes }) {
  return (
    <div className={CADRE}>
      <div className="flex w-full flex-col items-start gap-[3.2cqw] text-left">
        {t.verifs.map((v) => (
          <Ligne key={v}>{v}</Ligne>
        ))}
      </div>
    </div>
  );
}

/** 05 — Mise en ligne : l'adresse, et c'est tout. */
function EcranEnLigne({
  t,
  onlineLabel,
}: {
  t: EcranTextes;
  onlineLabel: string;
}) {
  return (
    <div className={CADRE}>
      <span className="font-mono text-[clamp(0.72rem,5.6cqw,1.3rem)] tracking-[0.04em] text-terra [text-shadow:0_0_16px_rgba(217,95,46,0.5)]">
        {t.adresse}
      </span>
      <Ligne>{t.enLigne || onlineLabel}</Ligne>
    </div>
  );
}
