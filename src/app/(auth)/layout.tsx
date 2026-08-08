import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background bg-grid gap-8 px-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">{APP_NAME}</p>
          <p className="text-2xs text-muted-foreground leading-tight">{APP_TAGLINE}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
