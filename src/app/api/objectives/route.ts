import { NextResponse } from "next/server";
import { objectiveSchema } from "@/features/okrs/schemas/objective.schema";
import { okrsService } from "@/features/okrs/api/okrs.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = objectiveSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const workspaceId = await getDemoWorkspaceId();
  const objective = await okrsService.createObjective(workspaceId, parsed.data);
  return NextResponse.json({ data: objective }, { status: 201 });
}
