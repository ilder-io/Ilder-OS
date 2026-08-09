"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

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
 * children, floats on a slow infinite loop, and tilts a few degrees
 * toward the cursor (mouse only — touch never fires enough pointermove
 * to matter, so it's naturally inert on mobile without extra branching).
 */
export function AuthCardShell({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const rotateX = useSpring(rotateXRaw, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(rotateYRaw, { stiffness: 150, damping: 20 });
  const glowOpacity = useTransform(rotateX, [-4, 4], [0.55, 0.85]);

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion || e.pointerType !== "mouse") return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateYRaw.set(px * 6);
    rotateXRaw.set(py * -6);
  }

  function handlePointerLeave() {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative w-full max-w-[420px]"
      style={{ perspective: 1200 }}
    >
      <motion.div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[2rem] blur-2xl"
        style={{
          opacity: prefersReducedMotion ? 0.6 : glowOpacity,
          background: "radial-gradient(60% 60% at 50% 20%, rgba(124,92,252,0.35), transparent 70%)",
        }}
        animate={prefersReducedMotion ? undefined : { opacity: [0.45, 0.75, 0.45] }}
        transition={prefersReducedMotion ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={prefersReducedMotion ? undefined : { y: [0, -7, 0] }}
        transition={prefersReducedMotion ? undefined : { duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-white/[0.035] shadow-[0_8px_50px_-12px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[140%] -translate-x-1/2 rounded-full bg-white/[0.06] blur-3xl" />
        <div className="relative px-8 py-10 sm:px-10">{children}</div>
      </motion.div>
    </motion.div>
  );
}
