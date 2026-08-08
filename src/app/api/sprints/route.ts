import { NextResponse } from "next/server";
import { sprintSchema } from "@/features/sprints/schemas/sprint.schema";
import { sprintsService } from "@/features/sprints/api/sprints.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

export async function GET() {
  const workspaceId = await getDemoWorkspaceId();
  const sprints = await sprintsService.listSprints(workspaceId);
  return NextResponse.json({ data: sprints });
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = sprintSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const workspaceId = await getDemoWorkspaceId();
  const sprint = await sprintsService.createSprint(workspaceId, parsed.data);
  return NextResponse.json({ data: sprint }, { status: 201 });
}
