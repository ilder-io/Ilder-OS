"use client";

import { SignUp } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { AuthCardShell, fadeUpItem } from "@/features/auth/components/auth-card-shell";
import { LogoMark } from "@/features/auth/components/logo-mark";
import { DynamicGreeting } from "@/features/auth/components/dynamic-greeting";
import { StatusBadges } from "@/features/auth/components/status-badges";
import { authAppearance } from "@/features/auth/lib/clerk-appearance";

export default function SignUpPage() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <AuthCardShell>
        <div className="flex flex-col gap-6">
          <LogoMark />
          <DynamicGreeting variant="sign-up" />
          <motion.div variants={fadeUpItem}>
            <SignUp appearance={authAppearance} />
          </motion.div>
        </div>
      </AuthCardShell>
      <StatusBadges />
    </div>
  );
}
