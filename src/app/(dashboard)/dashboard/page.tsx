import { getTranslations } from "next-intl/server";
import { Topbar } from "@/components/layout/topbar";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { NewContentButton } from "@/features/content/components/new-content-button";
import { ActiveSprintWidget } from "@/features/dashboard/components/active-sprint-widget";
import { QuarterProgressWidget } from "@/features/dashboard/components/quarter-progress-widget";
import { TopInsightWidget } from "@/features/dashboard/components/top-insight-widget";
import { RecentContentWidget } from "@/features/dashboard/components/recent-content-widget";
import { GrowthCharts } from "@/features/analytics/components/growth-charts";
import { ACTIVE_ENGINE } from "@/features/ai-insights/engine";
import { contentService } from "@/features/content/api/content.service";
import { okrsService } from "@/features/okrs/api/okrs.service";
import { sprintsService } from "@/features/sprints/api/sprints.service";
import { productsService } from "@/features/products/api/products.service";
import { analyticsService } from "@/features/analytics/api/analytics.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";
import { Users, Eye, TrendingUp, DollarSign } from "lucide-react";

export default async function DashboardPage() {
  const workspaceId = await getDemoWorkspaceId();
  const t = await getTranslations("dashboard");
  const [items, insights, quarters, sprints, products, followers, views, engagement, retention, watchTime] =
    await Promise.all([
      contentService.listContent(workspaceId),
      ACTIVE_ENGINE.generate({ workspaceId, windowDays: 90 }),
      okrsService.listQuarters(workspaceId),
      sprintsService.listSprints(workspaceId),
      productsService.listProducts(workspaceId),
      analyticsService.getFollowerGrowth(workspaceId),
      analyticsService.getViewsGrowth(workspaceId),
      analyticsService.getEngagementTrend(workspaceId),
      analyticsService.getRetentionTrend(workspaceId),
      analyticsService.getWatchTimeTrend(workspaceId),
    ]);

  const latestFollowers = followers[followers.length - 1]?.value ?? 0;
  const firstFollowers = followers[0]?.value ?? 1;
  const followerDelta = ((latestFollowers - firstFollowers) / firstFollowers) * 100;
  const totalViews90d = views.reduce((s, p) => s + p.value, 0);
  const avgEngagement = engagement.reduce((s, p) => s + p.value, 0) / engagement.length;
  const totalMRR = products.reduce((s, p) => s + (p.mrr ?? 0), 0);

  const activeSprint = sprints.find((s) => s.status === "ACTIVE");
  const currentQuarter = quarters[0];

  return (
    <>
      <Topbar title={t("pageTitle")} />
      <main className="flex-1 px-6 py-6 pb-20 md:pb-6 space-y-6">
        <PageHeader
          title={t("greeting")}
          description={t("greetingDescription")}
          actions={<NewContentButton />}
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label={t("statFollowers")} value={latestFollowers.toLocaleString()} delta={followerDelta} icon={<Users />} trend={followers.slice(-14)} />
          <StatCard label={t("statViews90d")} value={totalViews90d.toLocaleString()} icon={<Eye />} trend={views.slice(-14)} />
          <StatCard label={t("statAvgEngagement")} value={`${avgEngagement.toFixed(1)}%`} icon={<TrendingUp />} trend={engagement.slice(-14)} />
          <StatCard label={t("statMRR")} value={`$${totalMRR.toLocaleString()}`} icon={<DollarSign />} />
        </div>

        <GrowthCharts followers={followers} views={views} engagement={engagement} retention={retention} watchTime={watchTime} />

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <RecentContentWidget items={items} />
          </div>
          <div className="space-y-4">
            {activeSprint && <ActiveSprintWidget sprint={activeSprint} />}
            {currentQuarter && <QuarterProgressWidget quarter={currentQuarter} />}
          </div>
        </div>

        <TopInsightWidget insights={insights} />
      </main>
    </>
  );
}
