import { NextResponse } from "next/server";
import { reviewsService } from "@/features/reviews/api/reviews.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workspaceId = await getDemoWorkspaceId();
  await reviewsService.deleteMonthlyReview(workspaceId, id);
  return new NextResponse(null, { status: 204 });
}
