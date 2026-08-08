import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { quarterSchema } from "@/features/okrs/schemas/quarter.schema";
import { okrsService } from "@/features/okrs/api/okrs.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = quarterSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const workspaceId = await getDemoWorkspaceId();
  try {
    const quarter = await okrsService.createQuarter(workspaceId, parsed.data);
    return NextResponse.json({ data: quarter }, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ error: "That quarter already exists." }, { status: 409 });
    }
    throw e;
  }
}
