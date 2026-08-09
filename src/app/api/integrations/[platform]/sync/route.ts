import { NextResponse } from "next/server";
import { getAdapter } from "@/features/integrations/adapters/registry";
import { syncPlatformConnection } from "@/features/integrations/api/platform-sync.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

/** POST /api/integrations/[platform]/sync — pulls the connected account's
 *  content and stats via syncPlatformConnection. Same route for every
 *  platform; the orchestrator resolves the adapter from the URL segment. */
export async function POST(_req: Request, { params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params;
  const adapter = getAdapter(platform);
  if (!adapter) return NextResponse.json({ error: "Unknown platform." }, { status: 404 });

  const workspaceId = await getDemoWorkspaceId();
  try {
    const result = await syncPlatformConnection(workspaceId, platform);
    return NextResponse.json({ data: result });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Sync failed." }, { status: 502 });
  }
}
