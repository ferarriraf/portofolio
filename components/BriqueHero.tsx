"use client";

import { Component, useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";

/* Le sas de chargement de la brique. three.js pèse lourd : ce détour par
   next/dynamic le range dans un morceau à part, téléchargé après
   l'hydratation — le premier affichage du site ne paie rien. Pas de
   rendu serveur (ssr: false) : un canvas WebGL n'a aucun HTML à servir,
   et sans lui le hero est simplement le hero, complet, d'avant. */
const Brique3D = dynamic(() => import("./Brique3D"), { ssr: false });

/* Le garde-fou. Si le téléchargement du morceau three.js échoue — un
   déploiement entre l'ouverture de la page et l'import (les empreintes
   des fichiers changent, l'ancien répond 404), un antivirus, un réseau
   qui tombe — next/dynamic laisse l'erreur remonter, et sans frontière
   c'est TOUTE la page d'accueil qui serait remplacée par l'écran
   d'erreur de Next. Pour un ornement. Ici : la brique échoue en
   silence, le hero reste le hero. */
class SiLaBriqueEchoue extends Component<
  { children: ReactNode },
  { casse: boolean }
> {
  state = { casse: false };
  static getDerivedStateFromError() {
    return { casse: true };
  }
  render() {
    return this.state.casse ? null : this.props.children;
  }
}

export default function BriqueHero() {
  /* La barrière mobile. Masquer la brique en CSS ne suffirait pas :
     `hidden` cache le canvas mais n'empêche ni le téléchargement des
     ~530 Ko de three.js, ni la création d'un contexte WebGL — sur un
     téléphone, on paierait tout pour ne rien montrer. On ne monte donc
     le composant QUE si la fenêtre est assez large ET qu'un vrai
     pointeur existe (sans survol, la brique resterait figée : autant ne
     rien coûter). La barrière suit les redimensionnements dans les deux
     sens — repasser sous le seuil démonte la brique, qui libère tout. */
  const [affichable, setAffichable] = useState(false);

  useEffect(() => {
    const requete = window.matchMedia("(min-width: 80rem) and (hover: hover)");
    const evaluer = () => setAffichable(requete.matches);
    // setTimeout(0) : le motif maison contre react-hooks/set-state-in-effect.
    const differe = setTimeout(evaluer, 0);
    requete.addEventListener("change", evaluer);
    /* `resize` en plus de `change` : certains environnements émulés (les
       outils de développement, le volet de prévisualisation) changent la
       taille de la fenêtre SANS émettre l'événement `change` du
       matchMedia. L'écoute est redondante dans un vrai navigateur et
       sans coût : `evaluer` ne fait un rendu que si la réponse change. */
    window.addEventListener("resize", evaluer, { passive: true });
    return () => {
      clearTimeout(differe);
      requete.removeEventListener("change", evaluer);
      window.removeEventListener("resize", evaluer);
    };
  }, []);

  return affichable ? (
    <SiLaBriqueEchoue>
      <Brique3D />
    </SiLaBriqueEchoue>
  ) : null;
}
