import { NextResponse } from "next/server";
import { analyticsService } from "@/features/analytics/api/analytics.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

/** GET /api/analytics/summary — the same aggregates the Dashboard and
 *  Analytics pages render, exposed as JSON for external tooling (e.g. a
 *  scheduled report, a Slack digest bot) without duplicating the query. */
export async function GET() {
  const workspaceId = await getDemoWorkspaceId();
  const [followers, views, engagement, retention] = await Promise.all([
    analyticsService.getFollowerGrowth(workspaceId, 30),
    analyticsService.getViewsGrowth(workspaceId, 30),
    analyticsService.getEngagementTrend(workspaceId, 30),
    analyticsService.getRetentionTrend(workspaceId, 30),
  ]);

  return NextResponse.json({
    data: {
      followers: followers[followers.length - 1]?.value ?? 0,
      views30d: views.reduce((s, p) => s + p.value, 0),
      avgEngagementPct: Number((engagement.reduce((s, p) => s + p.value, 0) / engagement.length).toFixed(2)),
      avgRetentionPct: Number((retention.reduce((s, p) => s + p.value, 0) / retention.length).toFixed(1)),
    },
  });
}
