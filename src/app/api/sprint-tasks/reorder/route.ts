import { NextResponse } from "next/server";
import { sprintTaskReorderSchema } from "@/features/sprints/schemas/sprint-task.schema";
import { sprintsService } from "@/features/sprints/api/sprints.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

/** Body: `{ sprintId, updates: { id, status, order }[] }` — every task
 *  whose column or position changed after a drag-and-drop move. */
export async function PATCH(req: Request) {
  const body = await req.json();
  const sprintId = typeof body?.sprintId === "string" ? body.sprintId : undefined;
  if (!sprintId) return NextResponse.json({ error: "sprintId is required" }, { status: 422 });

  const parsed = sprintTaskReorderSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const workspaceId = await getDemoWorkspaceId();
  await sprintsService.reorderTasks(workspaceId, sprintId, parsed.data.updates);
  return NextResponse.json({ data: { ok: true } });
}
