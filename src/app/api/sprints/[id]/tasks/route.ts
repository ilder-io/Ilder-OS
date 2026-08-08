import { NextResponse } from "next/server";
import { sprintTaskCreateSchema } from "@/features/sprints/schemas/sprint-task.schema";
import { sprintsService } from "@/features/sprints/api/sprints.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: sprintId } = await params;
  const body = await req.json();
  const parsed = sprintTaskCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const workspaceId = await getDemoWorkspaceId();
  const task = await sprintsService.createTask(workspaceId, sprintId, parsed.data.title);
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ data: task }, { status: 201 });
}
