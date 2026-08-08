import { getTranslations } from "next-intl/server";
import { Topbar } from "@/components/layout/topbar";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { GrowthCharts } from "@/features/analytics/components/growth-charts";
import { PublishingHeatmap } from "@/features/analytics/components/publishing-heatmap";
import { RankedContentList, RankedAggregateList } from "@/features/analytics/components/ranked-content-list";
import { DistributionCharts } from "@/features/analytics/components/distribution-charts";
import { analyticsService } from "@/features/analytics/api/analytics.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";
import { Users, Eye, TrendingUp, Clock } from "lucide-react";

export default async function AnalyticsPage() {
  const workspaceId = await getDemoWorkspaceId();
  const t = await getTranslations("analytics");
  const [
    followers,
    views,
    engagement,
    retention,
    watchTime,
    heatmap,
    bestVideos,
    worstVideos,
    topHooks,
    topCtas,
    topSeries,
    pillarPerformance,
    durationBuckets,
  ] = await Promise.all([
    analyticsService.getFollowerGrowth(workspaceId),
    analyticsService.getViewsGrowth(workspaceId),
    analyticsService.getEngagementTrend(workspaceId),
    analyticsService.getRetentionTrend(workspaceId),
    analyticsService.getWatchTimeTrend(workspaceId),
    analyticsService.getBestPublishingTime(workspaceId),
    analyticsService.getBestVideos(workspaceId),
    analyticsService.getWorstVideos(workspaceId),
    analyticsService.getTopByMetric(workspaceId, "followersGenerated"),
    analyticsService.getTopByMetric(workspaceId, "views"),
    analyticsService.getTopSeries(workspaceId),
    analyticsService.getPillarPerformance(workspaceId),
    analyticsService.getDurationBuckets(workspaceId),
  ]);

  const latestFollowers = followers[followers.length - 1]?.value ?? 0;
  const firstFollowers = followers[0]?.value ?? 1;
  const followerDelta = ((latestFollowers - firstFollowers) / firstFollowers) * 100;

  const totalViews90d = views.reduce((s, p) => s + p.value, 0);
  const avgEngagement = engagement.reduce((s, p) => s + p.value, 0) / engagement.length;
  const avgRetention = retention.reduce((s, p) => s + p.value, 0) / retention.length;

  return (
    <>
      <Topbar title={t("pageTitle")} />
      <main className="flex-1 px-6 py-6 pb-20 md:pb-6 space-y-6">
        <PageHeader title={t("pageTitle")} description={t("pageDescription")} />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label={t("statFollowers")} value={latestFollowers.toLocaleString()} delta={followerDelta} icon={<Users />} trend={followers.slice(-14)} />
          <StatCard label={t("statViews90d")} value={totalViews90d.toLocaleString()} icon={<Eye />} trend={views.slice(-14)} />
          <StatCard label={t("statAvgEngagement")} value={`${avgEngagement.toFixed(1)}%`} icon={<TrendingUp />} trend={engagement.slice(-14)} />
          <StatCard label={t("statAvgRetention")} value={`${avgRetention.toFixed(0)}%`} icon={<Clock />} trend={retention.slice(-14)} />
        </div>

        <GrowthCharts followers={followers} views={views} engagement={engagement} retention={retention} watchTime={watchTime} />

        <DistributionCharts pillarPerformance={pillarPerformance} durationBuckets={durationBuckets} />

        <PublishingHeatmap data={heatmap} />

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          <RankedContentList
            title={t("bestVideos.title")}
            description={t("bestVideos.description")}
            items={bestVideos}
            metric={(i) => i.metrics.retentionPct}
            format="percent"
          />
          <RankedContentList
            title={t("worstVideos.title")}
            description={t("worstVideos.description")}
            items={worstVideos}
            metric={(i) => i.metrics.retentionPct}
            format="percent"
          />
          <RankedContentList
            title={t("topHooks.title")}
            description={t("topHooks.description")}
            items={topHooks}
            metric={(i) => i.metrics.followersGenerated}
            subtitle={(i) => i.hook}
          />
          <RankedContentList
            title={t("topCtas.title")}
            description={t("topCtas.description")}
            items={topCtas}
            metric={(i) => i.metrics.profileVisits}
            subtitle={(i) => i.cta}
          />
          <RankedAggregateList
            title={t("topSeries.title")}
            description={t("topSeries.description")}
            items={topSeries.map((s) => ({
              label: s.label,
              value: s.value,
              meta: t("topSeries.meta", { count: s.count, followers: s.followers.toLocaleString() }),
            }))}
          />
        </div>
      </main>
    </>
  );
}
