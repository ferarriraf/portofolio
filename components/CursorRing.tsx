"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Signature interactive du site : un anneau qui suit le pointeur
 * et s'élargit sur les éléments cliquables. Le curseur natif reste
 * visible — l'anneau l'accompagne, il ne le remplace pas.
 * Désactivé sur écrans tactiles.
 */
export default function CursorRing() {
  const [enabled, setEnabled] = useState(false);
  const [hot, setHot] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 400, damping: 30 });
  const sy = useSpring(y, { stiffness: 400, damping: 30 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as Element | null;
      setHot(!!target?.closest?.("a, button, [role='button'], summary, input, label"));
    };
    const onLeave = () => {
      x.set(-100);
      y.set(-100);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[99] hidden md:block"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="-ml-4 -mt-4 size-8 rounded-full border-[1.5px] border-terra-strong"
        animate={{
          scale: hot ? 1.9 : 1,
          backgroundColor: hot
            ? "rgba(169, 191, 160, 0.28)"
            : "rgba(169, 191, 160, 0)",
          borderColor: hot ? "var(--sage-deep)" : "var(--terra-strong)",
        }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
      />
    </motion.div>
  );
}
