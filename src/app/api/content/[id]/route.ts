import { NextResponse } from "next/server";
import { contentItemSchema } from "@/features/content/schemas/content.schema";
import { contentService } from "@/features/content/api/content.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workspaceId = await getDemoWorkspaceId();
  const item = await contentService.getContentById(workspaceId, id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: item });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const parsed = contentItemSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const workspaceId = await getDemoWorkspaceId();
  const updated = await contentService.updateContent(workspaceId, id, parsed.data);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ data: updated });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workspaceId = await getDemoWorkspaceId();
  await contentService.deleteContent(workspaceId, id);
  return new NextResponse(null, { status: 204 });
}
