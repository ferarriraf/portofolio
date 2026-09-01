"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * La brique du hero. « Le web, bien construit » — alors on pose un bloc
 * de construction à côté du titre : une brique en matière sable, un
 * petit coin terracotta appuyé contre elle, une vraie lumière qui vient
 * du haut comme partout ailleurs sur le site.
 *
 * LES TROIS RÈGLES DE CE FICHIER, dans l'ordre d'importance :
 *
 * 1. RIEN NE BOUGE DE SOI-MÊME. Il n'y a AUCUNE boucle d'animation
 *    permanente : le rendu ne tourne que pendant que la brique rejoint
 *    la position visée par le curseur, puis s'arrête net. Au repos, ce
 *    composant consomme zéro image par seconde. Ne jamais ajouter de
 *    flottement « idle », de rotation automatique, ni d'inertie infinie.
 *
 * 2. LA PAGE NE DOIT PAS EN DÉPENDRE. Le canvas est absolu, aria-hidden,
 *    pointer-events:none : il ne décale aucun contenu (pas de saut de
 *    mise en page), ne bloque ni la sélection ni les clics, et n'existe
 *    pas pour les lecteurs d'écran. Sans WebGL, le composant ne rend
 *    rien et le hero reste exactement celui d'avant.
 *
 * 3. LE POIDS RESTE DEHORS. three.js pèse lourd : ce fichier n'est
 *    jamais importé statiquement par une page — uniquement via
 *    BriqueHero (next/dynamic, ssr:false), qui le met dans un morceau
 *    à part, chargé après l'hydratation. Le premier rendu du site ne
 *    paie pas un octet de 3D.
 */

/* La brique s'incline d'au plus ±0,16 rad (≈ 9°) : assez pour être
   vivante sous le curseur, pas assez pour montrer son dos ni faire
   tourner l'ombre de façon étrange. */
const AMPLITUDE_X = 0.12;
const AMPLITUDE_Y = 0.16;
/* Vitesse de poursuite : fraction du chemin restant parcourue à chaque
   image. 0,10 donne ~300 ms de retard doux, sans ressort ni rebond. */
const POURSUITE = 0.1;
const EPSILON = 0.0006;

export default function Brique3D() {
  const conteneur = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const hote = conteneur.current;
    if (!hote) return;

    /* — Le rendu. Échec (vieille machine, WebGL coupé) : on disparaît. — */
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    /* Sans compression tonale, la matière sable — déjà presque blanche —
       sature au blanc pur sous l'éclairage et la brique ressemble à un
       bloc de papier. ACES ramène les hautes lumières dans le papier. */
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    /* PCFShadowMap et non PCFSoftShadowMap : ce dernier est déprécié en
       r185 — three basculait silencieusement sur PCF en loguant un
       avertissement à chaque visite. Le `shadow.radius` garde son effet
       (échantillonnage en disque de Vogel du chemin PCF). */
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    hote.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    /* L'environnement procédural : une pièce neutre générée en mémoire,
       aucune image chargée. C'est lui qui donne aux faces mates leur
       léger modelé — sans lui, une matière rugueuse est un aplat mort.
       Dans une fonction : il doit pouvoir être REFAIT, parce qu'une
       perte de contexte WebGL (veille, pilote réinitialisé, Safari qui
       évince les onglets cachés) détruit son render target et que three
       ne sait pas le re-remplir tout seul. */
    const genererEnvironnement = () => {
      const pmrem = new THREE.PMREMGenerator(renderer);
      const piece = new RoomEnvironment();
      const texture = pmrem.fromScene(piece, 0.04).texture;
      piece.dispose();
      pmrem.dispose();
      if (scene.environment) scene.environment.dispose();
      scene.environment = texture;
    };
    genererEnvironnement();
    scene.environmentIntensity = 0.5;

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 30);
    camera.position.set(0, 1.35, 6.4);
    camera.lookAt(0, 0.1, 0);

    /* — La lumière : UNE source, venant du haut, légèrement à gauche —
       la même convention que toutes les ombres CSS du site. */
    const soleil = new THREE.DirectionalLight(0xfff6e8, 1.9);
    /* x = 0 : les tokens shadow-elev du site ont tous un décalage
       horizontal NUL — l'ombre tombe à l'aplomb. La lumière 3D fait
       pareil, légèrement avancée vers la caméra pour modeler les faces. */
    soleil.position.set(0, 6, 3.2);
    soleil.castShadow = true;
    soleil.shadow.mapSize.set(1024, 1024);
    soleil.shadow.camera.near = 1;
    soleil.shadow.camera.far = 14;
    soleil.shadow.camera.left = -4;
    soleil.shadow.camera.right = 4;
    soleil.shadow.camera.top = 4;
    soleil.shadow.camera.bottom = -4;
    soleil.shadow.radius = 7;
    soleil.shadow.bias = -0.0004;
    scene.add(soleil);
    scene.add(new THREE.AmbientLight(0xf6f1e6, 0.4));

    /* — Les objets. Un groupe : tout s'incline ensemble. — */
    const groupe = new THREE.Group();
    scene.add(groupe);

    /* La brique : proportions d'une vraie brique, arêtes chanfreinées —
       le pendant volumique des arêtes ciselées du reste du site. */
    const matiereBrique = new THREE.MeshStandardMaterial({
      /* Entre --sand-deep et --sand-card : plus creusée que le papier
         de la page, sinon la brique disparaît dans le fond et ne se lit
         que par son ombre. */
      color: 0xf0e8d5,
      roughness: 0.68,
      metalness: 0,
    });
    const brique = new THREE.Mesh(
      new RoundedBoxGeometry(2.3, 1.05, 1.15, 5, 0.09),
      matiereBrique
    );
    brique.position.y = 1.05 / 2;
    brique.castShadow = true;
    brique.receiveShadow = true;
    groupe.add(brique);

    /* Le coin terracotta, appuyé contre la brique comme une cale. C'est
       lui qui porte l'accent de la palette — la brique reste sable. */
    const matiereCale = new THREE.MeshStandardMaterial({
      color: 0xc1714b, // --terra-strong
      roughness: 0.5,
      metalness: 0,
    });
    const cale = new THREE.Mesh(
      new RoundedBoxGeometry(0.62, 0.62, 0.62, 4, 0.05),
      matiereCale
    );
    cale.position.set(1.52, 0.31, 0.42);
    cale.rotation.y = 0.5;
    cale.castShadow = true;
    cale.receiveShadow = true;
    groupe.add(cale);

    /* Le sol n'existe que pour recevoir l'ombre : il est invisible. */
    const sol = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 14),
      new THREE.ShadowMaterial({ opacity: 0.16 })
    );
    sol.rotation.x = -Math.PI / 2;
    sol.receiveShadow = true;
    scene.add(sol);

    /* Pose de repos : la brique est déjà de trois quarts, comme un objet
       posé là — pas de face avant frontale, qui ferait paquet cadeau. */
    const BASE_X = 0.02;
    const BASE_Y = -0.42;
    groupe.rotation.set(BASE_X, BASE_Y, 0);

    const rendre = () => renderer.render(scene, camera);

    const dimensionner = () => {
      const l = hote.clientWidth;
      const h = hote.clientHeight;
      if (!l || !h) return;
      /* Relire le ratio à chaque fois : un zoom navigateur ou un passage
         sur un écran de densité différente le change sans toucher à la
         taille CSS — figé au montage, le canvas devenait flou. */
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(l, h);
      camera.aspect = l / h;
      camera.updateProjectionMatrix();
      rendre();
    };
    dimensionner();
    const observateur = new ResizeObserver(dimensionner);
    observateur.observe(hote);

    /* Le changement de densité ne déclenche PAS le ResizeObserver (la
       taille CSS ne bouge pas) : on le guette par un matchMedia sur la
       résolution courante, réarmé après chaque bascule. */
    let mediaDensite: MediaQueryList | null = null;
    const surDensite = () => {
      dimensionner();
      armerDensite();
    };
    const armerDensite = () => {
      mediaDensite?.removeEventListener("change", surDensite);
      mediaDensite = window.matchMedia(
        `(resolution: ${window.devicePixelRatio}dppx)`
      );
      mediaDensite.addEventListener("change", surDensite);
    };
    armerDensite();

    /* Après une restauration de contexte, three réinitialise le GL mais
       ne redessine jamais — et notre rendu est à la demande : sans ceci,
       le canvas restait transparent jusqu'au prochain geste, et
       l'environnement restait perdu même après. */
    const surRestauration = () => {
      genererEnvironnement();
      rendre();
    };
    renderer.domElement.addEventListener(
      "webglcontextrestored",
      surRestauration
    );

    /* — La poursuite du curseur. —
       La cible se met à jour au pointermove ; une petite boucle rapproche
       la rotation de la cible puis S'ARRÊTE dès qu'elle y est. C'est tout
       le contrat « rien ne bouge de soi-même » : pas de geste, pas
       d'image calculée. */
    let cibleX = 0;
    let cibleY = 0;
    let actuelX = 0;
    let actuelY = 0;
    let image = 0;

    const pas = () => {
      image = 0;
      const dx = cibleX - actuelX;
      const dy = cibleY - actuelY;
      actuelX += dx * POURSUITE;
      actuelY += dy * POURSUITE;
      groupe.rotation.x = BASE_X + actuelX;
      groupe.rotation.y = BASE_Y + actuelY;
      rendre();
      if (Math.abs(dx) > EPSILON || Math.abs(dy) > EPSILON) {
        image = requestAnimationFrame(pas);
      }
    };
    const lancer = () => {
      if (!image) image = requestAnimationFrame(pas);
    };

    /* Le geste est écouté sur le hero entier, pas sur le canvas (qui est
       en pointer-events:none) : la brique regarde le curseur où qu'il
       soit dans la section, sans jamais gêner un clic. */
    const heros = hote.closest("section");
    const surMouvement = (e: PointerEvent) => {
      const zone = heros?.getBoundingClientRect();
      if (!zone) return;
      const nx = ((e.clientX - zone.left) / zone.width) * 2 - 1;
      const ny = ((e.clientY - zone.top) / zone.height) * 2 - 1;
      cibleY = nx * AMPLITUDE_Y;
      cibleX = ny * AMPLITUDE_X;
      lancer();
    };
    const surSortie = () => {
      cibleX = 0;
      cibleY = 0;
      lancer();
    };

    /* Mouvement réduit : la brique existe, immobile, dans sa pose de
       repos — l'équivalent exact des animations remplacées par un état
       statique partout ailleurs. */
    if (!reduce && heros) {
      heros.addEventListener("pointermove", surMouvement, { passive: true });
      heros.addEventListener("pointerleave", surSortie, { passive: true });
    }

    return () => {
      if (image) cancelAnimationFrame(image);
      if (heros) {
        heros.removeEventListener("pointermove", surMouvement);
        heros.removeEventListener("pointerleave", surSortie);
      }
      observateur.disconnect();
      mediaDensite?.removeEventListener("change", surDensite);
      renderer.domElement.removeEventListener(
        "webglcontextrestored",
        surRestauration
      );
      brique.geometry.dispose();
      matiereBrique.dispose();
      cale.geometry.dispose();
      matiereCale.dispose();
      sol.geometry.dispose();
      (sol.material as THREE.Material).dispose();
      if (scene.environment) scene.environment.dispose();
      renderer.dispose();
      /* dispose() ne rend PAS le contexte WebGL : sans ceci, chaque
         franchissement du seuil 80rem en laissait un de plus en vie
         jusqu'au passage du ramasse-miettes, et le navigateur finissait
         par avertir « Too many active WebGL contexts ». */
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [reduce]);

  return (
    <div
      ref={conteneur}
      aria-hidden="true"
      /* xl et pas lg : sous 1280 px le titre occupe presque toute la
         largeur, la brique le chevaucherait. Et posée BAS — à hauteur du
         paragraphe, pas du titre. */
      className="pointer-events-none absolute top-[57%] right-[2%] z-10 hidden size-[20rem] -translate-y-1/3 xl:block 2xl:right-[5%] 2xl:size-[23rem]"
    />
  );
}
