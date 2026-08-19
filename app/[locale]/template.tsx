"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Transition entre les pages : un fondu court, sans rideau ni délai —
 * la page arrive tout de suite, elle ne se fait pas attendre.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22, ease: "linear" }}
    >
      {children}
    </motion.div>
  );
}
