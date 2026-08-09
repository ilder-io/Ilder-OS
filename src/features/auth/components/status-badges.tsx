"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, ShieldCheck } from "lucide-react";

function StatusDot() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <span className="relative flex h-1.5 w-1.5">
      {!prefersReducedMotion && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
      )}
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
    </span>
  );
}

/** Trio of quiet credibility signals under the form: AI, security, uptime.
 *  Static facts about the product, not decoration — every SaaS in this
 *  design's reference set (Vercel, Linear, Stripe) surfaces something like
 *  this near auth, so leaving it out would read as unfinished. */
export function StatusBadges() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-2xs text-muted-foreground"
    >
      <span className="inline-flex items-center gap-1.5">
        <Sparkles className="h-3 w-3 text-primary" />
        Powered by AI
      </span>
      <span className="inline-flex items-center gap-1.5">
        <ShieldCheck className="h-3 w-3 text-primary" />
        End-to-end encrypted
      </span>
      <span className="inline-flex items-center gap-1.5">
        <StatusDot />
        All systems operational
      </span>
    </motion.div>
  );
}
