import { NextResponse } from "next/server";
import { ACTIVE_ENGINE } from "@/features/ai-insights/engine";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

/** GET /api/ai-insights?windowDays=90 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const windowDays = Number(searchParams.get("windowDays") ?? 90);
  const workspaceId = await getDemoWorkspaceId();

  const insights = await ACTIVE_ENGINE.generate({ workspaceId, windowDays });
  return NextResponse.json({ data: insights, engine: ACTIVE_ENGINE.id });
}
