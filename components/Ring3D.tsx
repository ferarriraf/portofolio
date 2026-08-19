"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * L'anneau du hero : une alliance en argent brossé rendue en 3D temps
 * réel (Three.js), au format panoramique — large sur les côtés, rognée
 * en haut/bas. Le texte est pris en sandwich dans la profondeur : la
 * moitié lointaine passe DERRIÈRE le contenu, la proche DEVANT. Les
 * deux plans de coupe se chevauchent légèrement pour que la jonction
 * soit invisible. L'anneau tourne sur lui-même (la texture brossée
 * rend la rotation visible) avec une précession lente + suivi souris.
 *
 * Sans WebGL : images pré-rendues avec un léger balancement CSS.
 * « Réduire les animations » : une seule image fixe.
 */
export default function Ring3D({ children }: { children: ReactNode }) {
  const farRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const farHost = farRef.current;
    const nearHost = nearRef.current;
    if (!farHost || !nearHost) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      try {
        const THREE = await import("three");
        const { RoomEnvironment } = await import(
          "three/examples/jsm/environments/RoomEnvironment.js"
        );
        if (disposed) return;

        // Texture de rugosité « métal brossé », partagée par les deux
        // couches (sinon la jonction se verrait) : stries circulaires
        const texCanvas = document.createElement("canvas");
        texCanvas.width = 1024;
        texCanvas.height = 64;
        const tctx = texCanvas.getContext("2d")!;
        tctx.fillStyle = "#2a2a2a";
        tctx.fillRect(0, 0, 1024, 64);
        for (let i = 0; i < 500; i++) {
          const y = Math.random() * 64;
          const x = Math.random() * 1024;
          const w = 30 + Math.random() * 120;
          const v = 30 + Math.random() * 50;
          tctx.strokeStyle = `rgba(${v},${v},${v},0.5)`;
          tctx.lineWidth = 0.6 + Math.random() * 1.2;
          tctx.beginPath();
          tctx.moveTo(x, y);
          tctx.lineTo(x + w, y);
          tctx.stroke();
        }
        const roughTex = new THREE.CanvasTexture(texCanvas);
        roughTex.wrapS = THREE.RepeatWrapping;
        roughTex.wrapT = THREE.RepeatWrapping;
        roughTex.repeat.set(3, 1);

        // Une couche = un renderer + une scène identique, découpée par
        // un plan de coupe légèrement au-delà du centre (chevauchement)
        const makeLayer = (host: HTMLDivElement, side: "far" | "near") => {
          const scene = new THREE.Scene();
          // Téléobjectif : la perspective s'aplatit, l'anneau incliné
          // remplit le cadre au lieu de fuir vers le fond
          const camera = new THREE.PerspectiveCamera(6.5, 2, 0.1, 200);
          camera.position.set(0, 0, 24);

          const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "low-power",
          });
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          renderer.toneMapping = THREE.ACESFilmicToneMapping;
          renderer.toneMappingExposure = 1.45;
          renderer.clippingPlanes = [
            side === "far"
              ? new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.05)
              : new THREE.Plane(new THREE.Vector3(0, 0, 1), 0.05),
          ];
          renderer.domElement.style.width = "100%";
          renderer.domElement.style.height = "100%";
          renderer.domElement.style.display = "block";
          host.appendChild(renderer.domElement);

          // Environnement studio généré localement : zéro requête réseau
          const pmrem = new THREE.PMREMGenerator(renderer);
          const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
          scene.environment = envTexture;

          // Tube aplati radialement, étiré sur l'axe : profil d'alliance
          const geometry = new THREE.TorusGeometry(1.18, 0.105, 64, 200);
          const material = new THREE.MeshStandardMaterial({
            color: 0xe2e2e2,
            metalness: 0.95,
            roughness: 0.55,
            roughnessMap: roughTex,
            envMapIntensity: 1.5,
            side: THREE.DoubleSide,
          });
          const ring = new THREE.Mesh(geometry, material);
          ring.scale.z = 3.1;

          const group = new THREE.Group();
          group.add(ring);
          scene.add(group);

          // Lumière d'appoint : relève les faces internes sombres
          scene.add(new THREE.HemisphereLight(0xffffff, 0xbdbdbd, 2.4));

          // Cadrage exact : pour chaque point de la surface, la distance
          // caméra minimale qui le garde dans l'image vaut
          // |coord| / (marge · tan(demi-champ)) + z. On prend le maximum.
          // Une bounding box serait bien trop pessimiste pour un anneau
          // incliné ; on échantillonne donc la géométrie réelle.
          const MARGE_NDC = 0.965;
          const echantillon: number[] = [];
          {
            const pos = geometry.getAttribute("position");
            const pas = Math.max(1, Math.floor(pos.count / 900));
            for (let i = 0; i < pos.count; i += pas) {
              echantillon.push(pos.getX(i), pos.getY(i), pos.getZ(i));
            }
          }
          const p = new THREE.Vector3();

          // Le cadrage doit tenir pour toutes les poses de l'animation :
          // on évalue les orientations extrêmes et on garde la plus exigeante
          const fit = (poses: [number, number][]) => {
            const tanV = Math.tan((camera.fov * Math.PI) / 360) * MARGE_NDC;
            const tanH = tanV * camera.aspect;
            const memoX = group.rotation.x;
            const memoY = group.rotation.y;
            let dist = 2;

            for (const [rx, ry] of poses) {
              group.rotation.set(rx, ry, 0);
              // depuis la scène : sinon la rotation du parent n'est pas
              // prise en compte au premier cadrage
              scene.updateMatrixWorld(true);
              for (let i = 0; i < echantillon.length; i += 3) {
                p.set(echantillon[i], echantillon[i + 1], echantillon[i + 2]);
                p.applyMatrix4(ring.matrixWorld);
                const dv = Math.abs(p.y) / tanV + p.z;
                const dh = Math.abs(p.x) / tanH + p.z;
                if (dv > dist) dist = dv;
                if (dh > dist) dist = dh;
              }
            }

            group.rotation.set(memoX, memoY, 0);
            scene.updateMatrixWorld(true);
            camera.position.z = dist;
            camera.updateProjectionMatrix();
          };

          let poses: [number, number][] = [[0, 0]];
          const resize = () => {
            const w = host.clientWidth;
            const h = host.clientHeight;
            if (w === 0 || h === 0) return;
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            fit(poses);
          };

          const setPoses = (p: [number, number][]) => {
            poses = p;
            resize();
          };
          resize();

          return {
            group,
            ring,
            camera,
            setPoses,
            resize,
            render: () => renderer.render(scene, camera),
            dispose: () => {
              geometry.dispose();
              material.dispose();
              envTexture.dispose();
              pmrem.dispose();
              renderer.dispose();
              renderer.domElement.remove();
            },
          };
        };

        const layers = [makeLayer(farHost, "far"), makeLayer(nearHost, "near")];

        // Orientation de base : le haut de l'anneau bascule au loin,
        // sa bande basse vient devant — on regarde dans l'ouverture
        // Plus l'anneau est incliné, plus sa silhouette est large :
        // à hauteur d'écran égale, il gagne les côtés
        const BASE_X = -1.28;
        const BASE_Y = -0.14;

        const setPose = (x: number, y: number, spin: number) => {
          for (const l of layers) {
            l.group.rotation.set(x, y, 0);
            l.ring.rotation.z = spin;
          }
        };
        // Amplitudes de l'animation : précession + suivi souris.
        // Le cadrage doit tenir aux quatre coins de ce domaine.
        // L'inclinaison (X) change beaucoup la silhouette : on la garde
        // discrète pour que le cadrage reste serré. Le pivot (Y) peut
        // être plus ample, il modifie peu l'encombrement.
        const AMP_X = 0.03 + 0.045;
        const AMP_Y = 0.1 + 0.14;
        const fitAll = () => {
          const poses: [number, number][] = [];
          for (const sx of [-1, 0, 1]) {
            for (const sy of [-1, 0, 1]) {
              poses.push([BASE_X + sx * AMP_X, BASE_Y + sy * AMP_Y]);
            }
          }
          for (const l of layers) l.setPoses(poses);
        };
        const renderAll = () => {
          for (const l of layers) l.render();
        };
        setPose(BASE_X, BASE_Y, 0);
        fitAll();

        const resizeObserver = new ResizeObserver(() => {
          for (const l of layers) l.resize();
          if (reduce) renderAll();
        });
        resizeObserver.observe(farHost);

        const disposeAll = () => {
          resizeObserver.disconnect();
          roughTex.dispose();
          for (const l of layers) l.dispose();
        };

        if (reduce) {
          renderAll();
          cleanup = disposeAll;
          return;
        }

        // Suivi doux du pointeur (interpolé dans la boucle)
        let targetX = 0;
        let targetY = 0;
        let tiltX = 0;
        let tiltY = 0;
        // Amplitudes volontairement contenues : elles entrent dans le
        // calcul de cadrage (AMP_X / AMP_Y), donc plus elles sont larges,
        // plus la caméra doit reculer et plus l'anneau paraît petit.
        const onPointer = (e: PointerEvent) => {
          if (e.pointerType !== "mouse") return;
          targetY = (e.clientX / window.innerWidth - 0.5) * 0.28;
          targetX = (e.clientY / window.innerHeight - 0.5) * 0.3;
        };
        window.addEventListener("pointermove", onPointer, { passive: true });

        const clock = new THREE.Clock();
        let rafId = 0;
        let running = false;

        const frame = () => {
          const t = clock.getElapsedTime();
          tiltX += (targetX - tiltX) * 0.045;
          tiltY += (targetY - tiltY) * 0.045;
          // Rotation continue (visible grâce au brossage) + précession
          setPose(
            BASE_X + Math.sin(t * 0.28) * 0.03 + tiltX * 0.15,
            BASE_Y + Math.cos(t * 0.21) * 0.1 + tiltY * 0.5,
            t * 0.22
          );
          renderAll();
          rafId = requestAnimationFrame(frame);
        };

        const setRunning = (on: boolean) => {
          if (on === running) return;
          running = on;
          if (on) {
            clock.start();
            rafId = requestAnimationFrame(frame);
          } else {
            cancelAnimationFrame(rafId);
          }
        };

        let inView = true;
        const io = new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting;
          setRunning(inView && !document.hidden);
        });
        io.observe(farHost);

        const onVisibility = () => setRunning(inView && !document.hidden);
        document.addEventListener("visibilitychange", onVisibility);

        setRunning(true);

        if (process.env.NODE_ENV === "development") {
          // Point d'accès debug : forcer une frame depuis la console
          (window as unknown as Record<string, unknown>).__ringDebug = {
            render: renderAll,
            setBase: () => {
              setPose(BASE_X, BASE_Y, 0);
              renderAll();
            },
            refit: () => {
              fitAll();
              setPose(BASE_X, BASE_Y, 0);
              renderAll();
            },
            infos: () =>
              layers.map((l) => ({
                z: l.camera.position.z,
                fov: l.camera.fov,
                aspect: l.camera.aspect,
                rotX: l.group.rotation.x,
              })),
            canvases: [farHost.firstChild, nearHost.firstChild],
          };
        }

        cleanup = () => {
          setRunning(false);
          io.disconnect();
          document.removeEventListener("visibilitychange", onVisibility);
          window.removeEventListener("pointermove", onPointer);
          disposeAll();
        };
      } catch (err) {
        // WebGL indisponible : on bascule sur les images pré-rendues
        if (!disposed) setFallback(true);
        console.warn("[Ring3D] rendu 3D indisponible, images fixes utilisées", err);
      }
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [reduce]);

  // Panoramique et ENTIER : large sur les côtés, jamais coupé par sa
  // zone de rendu, descendu sous le menu.
  // La largeur est aussi bornée par la hauteur d'écran (190vh pour un
  // ratio 2/1) : sur un écran bas, l'anneau reste dans le hero.
  const layerClass =
    "pointer-events-none absolute top-[calc(50%+1.25rem)] left-1/2 aspect-[2/1] w-[min(185vw,120rem,235vh)] -translate-x-1/2 -translate-y-1/2";

  const entrance = reduce
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, scale: 0.92 },
        animate: { opacity: 1, scale: 1 },
        transition: {
          duration: 1.1,
          delay: 0.55,
          ease: [0.22, 1, 0.36, 1] as const,
        },
      };

  const swayClass = reduce ? "" : "ring-sway";

  return (
    <div className="relative flex w-full flex-col items-center">
      {/* Moitié lointaine : derrière le contenu */}
      <motion.div aria-hidden="true" className={`${layerClass} z-0`} {...entrance}>
        {fallback ? (
          <img
            src="/ring-far.png"
            alt=""
            className={`h-full w-full object-cover ${swayClass}`}
          />
        ) : (
          <div ref={farRef} className="h-full w-full" />
        )}
      </motion.div>

      <div className="relative z-10 flex flex-col items-center">{children}</div>

      {/* Moitié proche : devant le contenu */}
      <motion.div aria-hidden="true" className={`${layerClass} z-20`} {...entrance}>
        {fallback ? (
          <img
            src="/ring-near.png"
            alt=""
            className={`h-full w-full object-cover ${swayClass}`}
          />
        ) : (
          <div ref={nearRef} className="h-full w-full" />
        )}
      </motion.div>
    </div>
  );
}
