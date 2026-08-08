import { NextResponse } from "next/server";
import { sprintsService } from "@/features/sprints/api/sprints.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workspaceId = await getDemoWorkspaceId();
  await sprintsService.deleteTask(workspaceId, id);
  return new NextResponse(null, { status: 204 });
}
