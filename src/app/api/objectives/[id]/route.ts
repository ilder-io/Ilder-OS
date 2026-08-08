import { NextResponse } from "next/server";
import { okrsService } from "@/features/okrs/api/okrs.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workspaceId = await getDemoWorkspaceId();
  await okrsService.deleteObjective(workspaceId, id);
  return new NextResponse(null, { status: 204 });
}
