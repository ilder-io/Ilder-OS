import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Insight } from "@/features/ai-insights/types/insight.types";

export async function TopInsightWidget({ insights }: { insights: Insight[] }) {
  const top = insights.slice(0, 2);
  if (top.length === 0) return null;
  const t = await getTranslations("dashboard");

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <Sparkles className="h-4 w-4 text-primary" />
        <CardTitle>{t("topAiInsights")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {top.map((insight) => (
          <div key={insight.id} className="rounded-lg border border-border p-3">
            <p className="text-xs font-medium text-foreground leading-snug">{insight.headline}</p>
          </div>
        ))}
        <Link href="/ai-insights" className="flex items-center gap-1 text-2xs text-primary hover:underline w-fit">
          {t("viewAllInsights")} <ArrowRight className="h-3 w-3" />
        </Link>
      </CardContent>
    </Card>
  );
}
