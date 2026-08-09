import type { ReactNode } from "react";
import { AuroraBackground } from "@/features/auth/components/aurora-background";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-x-hidden px-4 py-12">
      <AuroraBackground />
      {children}
    </div>
  );
}
