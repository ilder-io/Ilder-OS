import { NextResponse } from "next/server";
import { knowledgeDocSchema } from "@/features/knowledge-base/schemas/knowledge-doc.schema";
import { knowledgeBaseService } from "@/features/knowledge-base/api/knowledge-base.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const parsed = knowledgeDocSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const workspaceId = await getDemoWorkspaceId();
  const doc = await knowledgeBaseService.updateDoc(workspaceId, id, parsed.data);
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: doc });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workspaceId = await getDemoWorkspaceId();
  await knowledgeBaseService.deleteDoc(workspaceId, id);
  return new NextResponse(null, { status: 204 });
}
