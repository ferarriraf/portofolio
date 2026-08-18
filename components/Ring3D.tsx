"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * L'anneau du hero : une alliance en argent poli rendue en 3D temps
 * réel (Three.js), avec le texte pris en sandwich dans la profondeur —
 * la moitié lointaine de l'anneau passe DERRIÈRE le contenu, la moitié
 * proche passe DEVANT. Deux canvas superposés, découpés par un plan de
 * coupe au centre de l'anneau, encadrent les enfants (z 0 / 10 / 20).
 *
 * Le module three est chargé dynamiquement : seule la page d'accueil
 * en paie le poids, rien ne s'exécute côté serveur. Boucle de rendu
 * coupée hors viewport ou onglet caché ; « réduire les animations » →
 * une seule image fixe, ni rotation ni souris.
 */
export default function Ring3D({ children }: { children: ReactNode }) {
  const farRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // WebGL indisponible (désactivé, ancien matériel…) → images fixes
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

        // Une couche = un renderer + une scène identique, découpée
        // par un plan de coupe (z<0 : moitié lointaine, z>0 : proche)
        const makeLayer = (host: HTMLDivElement, side: "far" | "near") => {
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 20);
          camera.position.set(0, 0, 5.3);

          const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "low-power",
          });
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          renderer.toneMapping = THREE.ACESFilmicToneMapping;
          renderer.toneMappingExposure = 1.38;
          renderer.clippingPlanes = [
            side === "far"
              ? new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)
              : new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
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
          const geometry = new THREE.TorusGeometry(1.18, 0.105, 64, 180);
          const material = new THREE.MeshStandardMaterial({
            color: 0xdcdcdc,
            metalness: 0.95,
            roughness: 0.1,
            envMapIntensity: 1.35,
            side: THREE.DoubleSide,
          });
          const ring = new THREE.Mesh(geometry, material);
          ring.scale.z = 3.1;

          const group = new THREE.Group();
          group.add(ring);
          scene.add(group);

          // Lumière d'appoint douce : relève les faces internes sombres
          scene.add(new THREE.HemisphereLight(0xffffff, 0xb0b0b0, 2.0));

          const resize = () => {
            const w = host.clientWidth;
            const h = host.clientHeight;
            if (w === 0 || h === 0) return;
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
          };
          resize();

          return {
            group,
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
        const BASE_X = -1.0;
        const BASE_Y = -0.16;

        const setRotation = (x: number, y: number) => {
          for (const l of layers) l.group.rotation.set(x, y, 0);
        };
        const renderAll = () => {
          for (const l of layers) l.render();
        };
        setRotation(BASE_X, BASE_Y);

        const resizeObserver = new ResizeObserver(() => {
          for (const l of layers) l.resize();
          if (reduce) renderAll();
        });
        resizeObserver.observe(farHost);

        const disposeAll = () => {
          resizeObserver.disconnect();
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
        const onPointer = (e: PointerEvent) => {
          if (e.pointerType !== "mouse") return;
          targetY = (e.clientX / window.innerWidth - 0.5) * 0.5;
          targetX = (e.clientY / window.innerHeight - 0.5) * 0.35;
        };
        window.addEventListener("pointermove", onPointer, { passive: true });

        const clock = new THREE.Clock();
        let rafId = 0;
        let running = false;

        const frame = () => {
          const t = clock.getElapsedTime();
          tiltX += (targetX - tiltX) * 0.045;
          tiltY += (targetY - tiltY) * 0.045;
          // Précession lente : les reflets glissent sur le métal
          setRotation(
            BASE_X + Math.sin(t * 0.28) * 0.1 + tiltX,
            BASE_Y + Math.cos(t * 0.21) * 0.16 + tiltY
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
              setRotation(BASE_X, BASE_Y);
              renderAll();
            },
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

  // Large : l'anneau déborde sur les côtés, quitte à être rogné en
  // haut/bas. Calé pour que la bande proche morde le bas de la 2e ligne.
  const layerClass =
    "pointer-events-none absolute top-[calc(50%+0.75rem)] left-1/2 aspect-square w-[min(124vw,62rem)] -translate-x-1/2 -translate-y-1/2";

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

  return (
    <div className="relative flex w-full flex-col items-center">
      {/* Moitié lointaine : derrière le contenu */}
      <motion.div aria-hidden="true" className={`${layerClass} z-0`} {...entrance}>
        {fallback ? (
          <img src="/ring-far.png" alt="" className="h-full w-full" />
        ) : (
          <div ref={farRef} className="h-full w-full" />
        )}
      </motion.div>

      <div className="relative z-10 flex flex-col items-center">{children}</div>

      {/* Moitié proche : devant le contenu */}
      <motion.div aria-hidden="true" className={`${layerClass} z-20`} {...entrance}>
        {fallback ? (
          <img src="/ring-near.png" alt="" className="h-full w-full" />
        ) : (
          <div ref={nearRef} className="h-full w-full" />
        )}
      </motion.div>
    </div>
  );
}
