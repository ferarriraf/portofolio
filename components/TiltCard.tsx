"use client";

import { useState, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  radiusClass?: string;
};

/**
 * Carte qui s'incline en 3D sous la souris, avec un reflet brillant
 * qui suit le pointeur. Inactif au tactile et si l'utilisateur
 * préfère réduire les animations.
 */
export default function TiltCard({
  children,
  className,
  radiusClass = "rounded-3xl",
}: TiltCardProps) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [6.5, -6.5]), {
    stiffness: 220,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-8, 8]), {
    stiffness: 220,
    damping: 22,
  });
  const glareX = useTransform(px, [0, 1], ["12%", "88%"]);
  const glareY = useTransform(py, [0, 1], ["10%", "90%"]);
  const glare = useMotionTemplate`radial-gradient(340px circle at ${glareX} ${glareY}, rgba(255,255,255,0.32), transparent 65%)`;
  const [hover, setHover] = useState(false);

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={`${className ?? ""} [perspective:900px]`}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.x) / r.width);
        py.set((e.clientY - r.y) / r.height);
      }}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setHover(true);
      }}
      onPointerLeave={() => {
        setHover(false);
        px.set(0.5);
        py.set(0.5);
      }}
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative h-full w-full will-change-transform"
      >
        {children}
        <motion.div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${radiusClass} ${
            hover ? "opacity-100" : "opacity-0"
          }`}
          style={{ background: glare }}
        />
      </motion.div>
    </div>
  );
}
