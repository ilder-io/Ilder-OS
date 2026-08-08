import { db } from "@/lib/core/db";

/**
 * v1 is single-tenant in practice: every repository is scoped by
 * `workspaceId`, but until `requireWorkspaceContext()` (see
 * `src/lib/core/auth.ts`) is wired into every route and page, callers pass
 * the seeded demo workspace. This resolves that workspace's real `id` (a
 * cuid, the actual foreign key every model relates to) from its stable
 * `slug`, instead of routes hardcoding the id or — worse — passing the slug
 * itself where an id is expected. Swapping this out for
 * `requireWorkspaceContext()` per-request is the multi-tenant follow-up (see
 * ROADMAP.md item 4) and touches call sites, not repositories.
 */
const DEMO_WORKSPACE_SLUG = "demo-workspace";

let cachedDemoWorkspaceId: string | null = null;

export async function getDemoWorkspaceId(): Promise<string> {
  if (cachedDemoWorkspaceId) return cachedDemoWorkspaceId;

  const workspace = await db.workspace.findUniqueOrThrow({
    where: { slug: DEMO_WORKSPACE_SLUG },
    select: { id: true },
  });

  cachedDemoWorkspaceId = workspace.id;
  return workspace.id;
}
