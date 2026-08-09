"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

export const fadeUpItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * The glass card itself: fades + scales in on mount with staggered
 * children, and floats on a slow infinite loop. Kept deliberately simple —
 * an earlier version also tilted toward the cursor via 3D transforms, but
 * combined with `overflow-hidden` it produced visible clipping artifacts,
 * so it's gone in favor of something that reads as premium without being
 * fragile.
 */
export function AuthCardShell({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative w-full max-w-[420px]"
    >
      <motion.div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[2rem] blur-2xl"
        style={{ background: "radial-gradient(60% 60% at 50% 20%, rgba(124,92,252,0.35), transparent 70%)" }}
        animate={prefersReducedMotion ? undefined : { opacity: [0.45, 0.75, 0.45] }}
        transition={prefersReducedMotion ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        animate={prefersReducedMotion ? undefined : { y: [0, -7, 0] }}
        transition={prefersReducedMotion ? undefined : { duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[#0c0c10]/90 shadow-[0_8px_50px_-12px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        <div className="relative px-7 py-9 sm:px-9">{children}</div>
      </motion.div>
    </motion.div>
  );
}
