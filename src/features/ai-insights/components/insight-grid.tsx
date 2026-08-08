import { getTranslations } from "next-intl/server";
import { Sparkles } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { InsightCard } from "@/features/ai-insights/components/insight-card";
import type { Insight } from "@/features/ai-insights/types/insight.types";

export async function InsightGrid({ insights }: { insights: Insight[] }) {
  if (insights.length === 0) {
    const t = await getTranslations("aiInsights");
    return (
      <EmptyState
        icon={Sparkles}
        title={t("emptyTitle")}
        description={t("emptyDescription")}
      />
    );
  }

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      {insights.map((insight, i) => (
        <InsightCard key={insight.id} insight={insight} index={i} />
      ))}
    </div>
  );
}
