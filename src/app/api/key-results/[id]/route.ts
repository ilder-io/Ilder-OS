import { NextResponse } from "next/server";
import { keyResultProgressSchema } from "@/features/okrs/schemas/objective.schema";
import { okrsService } from "@/features/okrs/api/okrs.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const parsed = keyResultProgressSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const workspaceId = await getDemoWorkspaceId();
  const keyResult = await okrsService.updateKeyResultProgress(workspaceId, id, parsed.data);
  if (!keyResult) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: keyResult });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workspaceId = await getDemoWorkspaceId();
  await okrsService.deleteKeyResult(workspaceId, id);
  return new NextResponse(null, { status: 204 });
}
