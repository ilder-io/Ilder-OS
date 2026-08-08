import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

/**
 * Every page under this group is auth-gated and reads workspace-scoped data
 * straight from Postgres per request — never build-time static content.
 * Forcing dynamic rendering here (inherited by every nested page) also
 * avoids `next build` attempting to prerender them by spinning up several
 * Prisma Client workers concurrently, which is what caused sporadic
 * `PageNotFoundError`s during "Collecting page data" on Windows.
 */
export const dynamic = "force-dynamic";

/**
 * Shared shell for every authenticated module. Route protection itself
 * lives in `middleware.ts` (Clerk), not here — this layout only composes
 * the visual chrome. Per-page titles are set by each page rendering its
 * own <Topbar title="…" />, since a single shared header would need a
 * client-side route→title lookup for no real benefit.
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background bg-grid bg-fixed">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
      <MobileNav />
    </div>
  );
}
