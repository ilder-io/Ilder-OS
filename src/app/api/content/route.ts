import { NextResponse } from "next/server";
import { contentItemSchema } from "@/features/content/schemas/content.schema";
import { contentService } from "@/features/content/api/content.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

/**
 * GET  /api/content        — list content for the caller's workspace
 * POST /api/content        — create a content item
 *
 * Route handlers stay thin on purpose: parse/validate the request, call the
 * service layer, shape the response. No Prisma import here — see
 * ARCHITECTURE.md "Clean Architecture layers".
 */
export async function GET() {
  const workspaceId = await getDemoWorkspaceId();
  const items = await contentService.listContent(workspaceId);
  return NextResponse.json({ data: items });
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = contentItemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const workspaceId = await getDemoWorkspaceId();
  const item = await contentService.createContent(workspaceId, parsed.data);
  return NextResponse.json({ data: item }, { status: 201 });
}
