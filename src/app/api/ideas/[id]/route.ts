import { NextResponse } from "next/server";
import { ideasService } from "@/features/ideas/api/ideas.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workspaceId = await getDemoWorkspaceId();
  await ideasService.deleteIdea(workspaceId, id);
  return new NextResponse(null, { status: 204 });
}
