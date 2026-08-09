"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { fadeUpItem } from "@/features/auth/components/auth-card-shell";

export function LogoMark() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div variants={fadeUpItem} className="relative flex h-11 w-11 items-center justify-center">
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-2xl blur-md"
        style={{ background: "linear-gradient(135deg, #7C5CFC, #A78BFA)" }}
        animate={prefersReducedMotion ? undefined : { opacity: [0.5, 0.9, 0.5] }}
        transition={prefersReducedMotion ? undefined : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 shadow-lg"
        style={{ background: "linear-gradient(135deg, #7C5CFC, #A78BFA)" }}
        initial={{ rotate: -8, scale: 0.85 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <Sparkles className="h-5 w-5 text-white" strokeWidth={2.25} />
      </motion.div>
    </motion.div>
  );
}
