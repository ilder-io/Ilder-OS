import type { ReactNode } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-6 py-5">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight text-foreground">{APP_NAME}</p>
              <p className="text-2xs text-muted-foreground leading-tight">{APP_TAGLINE}</p>
            </div>
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">{children}</main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-2 px-6 py-6 text-2xs text-muted-foreground">
          <span>© {new Date().getFullYear()} {APP_NAME}</span>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
