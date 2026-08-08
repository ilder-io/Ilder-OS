import { NextResponse } from "next/server";
import { okrsService } from "@/features/okrs/api/okrs.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

export async function GET() {
  const workspaceId = await getDemoWorkspaceId();
  const quarters = await okrsService.listQuarters(workspaceId);
  return NextResponse.json({ data: quarters });
}
