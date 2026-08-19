"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Un nombre qui monte jusqu'à sa valeur quand il entre à l'écran.
 * Le compte se fait sur le temps écoulé, pas sur un pas fixe : la
 * durée reste la même quel que soit le rythme d'affichage.
 */
export default function CountUp({
  valeur,
  suffixe = "",
  duree = 1400,
}: {
  valeur: number;
  suffixe?: string;
  duree?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const vu = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [affiche, setAffiche] = useState(0);

  // Filet : si l'observateur de visibilité ne notifie jamais (onglet
  // ouvert en arrière-plan), le nombre ne doit pas rester à zéro.
  useEffect(() => {
    const t = setTimeout(() => setAffiche((a) => (a === 0 ? valeur : a)), 3000);
    return () => clearTimeout(t);
  }, [valeur]);

  useEffect(() => {
    if (!vu) return;
    if (reduce) {
      // différé : poser la valeur en pleine phase d'effet
      // déclencherait un rendu en cascade
      const t = setTimeout(() => setAffiche(valeur), 0);
      return () => clearTimeout(t);
    }
    let rafId = 0;
    const depart = performance.now();
    const avance = (t: number) => {
      const p = Math.min(1, (t - depart) / duree);
      // décélération : le nombre freine en approchant de sa valeur
      const adouci = 1 - Math.pow(1 - p, 3);
      setAffiche(Math.round(valeur * adouci));
      if (p < 1) rafId = requestAnimationFrame(avance);
    };
    rafId = requestAnimationFrame(avance);

    // Filet de sécurité : un onglet en arrière-plan ne rejoue pas les
    // frames, et le nombre resterait bloqué à zéro
    const secours = setTimeout(() => setAffiche(valeur), duree + 250);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(secours);
    };
  }, [vu, valeur, duree, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {affiche}
      {suffixe}
    </span>
  );
}
