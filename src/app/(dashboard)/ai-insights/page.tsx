import { getTranslations } from "next-intl/server";
import { Topbar } from "@/components/layout/topbar";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { InsightGrid } from "@/features/ai-insights/components/insight-grid";
import { ACTIVE_ENGINE } from "@/features/ai-insights/engine";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

export default async function AIInsightsPage() {
  const workspaceId = await getDemoWorkspaceId();
  const insights = await ACTIVE_ENGINE.generate({ workspaceId, windowDays: 90 });
  const t = await getTranslations("aiInsights");

  return (
    <>
      <Topbar title={t("pageTitle")} />
      <main className="flex-1 px-6 py-6 pb-20 md:pb-6 space-y-6">
        <PageHeader
          title={t("pageTitle")}
          description={t("pageDescription")}
          actions={<Badge variant="outline" className="font-mono">{ACTIVE_ENGINE.id}</Badge>}
        />
        <InsightGrid insights={insights} />
      </main>
    </>
  );
}
