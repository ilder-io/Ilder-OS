import { NextResponse } from "next/server";
import { knowledgeDocSchema } from "@/features/knowledge-base/schemas/knowledge-doc.schema";
import { knowledgeBaseService } from "@/features/knowledge-base/api/knowledge-base.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = knowledgeDocSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const workspaceId = await getDemoWorkspaceId();
  const doc = await knowledgeBaseService.createDoc(workspaceId, parsed.data);
  return NextResponse.json({ data: doc }, { status: 201 });
}
