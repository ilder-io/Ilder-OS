"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * Full-viewport backdrop for the (auth) route group: three slow-drifting
 * aurora blobs, a masked grid, a faint mouse-parallax glow, and an inline
 * SVG noise layer for texture. Everything here is decorative — `pointer-
 * events-none` throughout except the tracking surface itself — so it never
 * competes with the actual sign-in form for input.
 */
export function AuroraBackground() {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const glowX = useSpring(px, { stiffness: 40, damping: 25, mass: 0.5 });
  const glowY = useSpring(py, { stiffness: 40, damping: 25, mass: 0.5 });

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion || e.pointerType !== "mouse") return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    px.set(e.clientX - rect.left);
    py.set(e.clientY - rect.top);
  }

  const drift = prefersReducedMotion
    ? {}
    : { animate: { x: [0, 30, -20, 0], y: [0, -24, 18, 0] }, transition: { duration: 28, repeat: Infinity, ease: "easeInOut" as const } };
  const driftSlow = prefersReducedMotion
    ? {}
    : { animate: { x: [0, -26, 16, 0], y: [0, 20, -16, 0] }, transition: { duration: 34, repeat: Infinity, ease: "easeInOut" as const } };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="fixed inset-0 -z-10 overflow-hidden bg-background"
    >
      <motion.div
        className="absolute left-[10%] top-[8%] h-[38rem] w-[38rem] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(124,92,252,0.28), transparent 70%)" }}
        {...drift}
      />
      <motion.div
        className="absolute bottom-[4%] right-[8%] h-[34rem] w-[34rem] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(167,139,250,0.22), transparent 70%)" }}
        {...driftSlow}
      />
      <motion.div
        className="absolute left-[42%] top-[46%] h-[26rem] w-[26rem] rounded-full blur-[110px]"
        style={{ background: "radial-gradient(circle, rgba(124,92,252,0.14), transparent 72%)" }}
        {...drift}
      />

      <div className="absolute inset-0 bg-grid opacity-[0.12] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,black,transparent_75%)]" />

      {!prefersReducedMotion && (
        <motion.div
          className="pointer-events-none absolute h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px] opacity-70"
          style={{ left: glowX, top: glowY, background: "radial-gradient(circle, rgba(167,139,250,0.16), transparent 72%)" }}
        />
      )}

      <svg className="absolute inset-0 h-full w-full opacity-[0.035] mix-blend-overlay">
        <filter id="auth-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#auth-noise)" />
      </svg>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
    </div>
  );
}
