import { NextResponse } from "next/server";
import { ideaSchema } from "@/features/ideas/schemas/idea.schema";
import { ideasService } from "@/features/ideas/api/ideas.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

export async function GET() {
  const workspaceId = await getDemoWorkspaceId();
  const ideas = await ideasService.listIdeas(workspaceId);
  return NextResponse.json({ data: ideas });
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = ideaSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const workspaceId = await getDemoWorkspaceId();
  const idea = await ideasService.createIdea(workspaceId, parsed.data);
  return NextResponse.json({ data: idea }, { status: 201 });
}
