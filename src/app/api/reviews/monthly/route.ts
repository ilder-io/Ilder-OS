import { NextResponse } from "next/server";
import { monthlyReviewSchema } from "@/features/reviews/schemas/review.schema";
import { reviewsService } from "@/features/reviews/api/reviews.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = monthlyReviewSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const workspaceId = await getDemoWorkspaceId();
  const review = await reviewsService.createMonthlyReview(workspaceId, parsed.data);
  return NextResponse.json({ data: review }, { status: 201 });
}
