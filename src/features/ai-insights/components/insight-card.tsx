"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, TrendingDown, Pin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useInsightCategoryLabel } from "@/hooks/use-enum-labels";
import type { Insight } from "@/features/ai-insights/types/insight.types";

const CATEGORY_VARIANT: Record<Insight["category"], "default" | "success" | "warning" | "destructive" | "secondary"> = {
  CONTENT: "default",
  AUDIENCE: "secondary",
  GROWTH: "success",
  CONVERSION: "success",
  TIMING: "secondary",
  RISK: "destructive",
};

export function InsightCard({ insight, index = 0 }: { insight: Insight; index?: number }) {
  const t = useTranslations("aiInsights");
  const categoryLabel = useInsightCategoryLabel();
  const positive = (insight.metricDelta ?? 0) >= 0;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.04 }}>
      <Card className={cn("p-5 space-y-3", insight.category === "RISK" && "border-destructive/30")}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-primary shrink-0">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <Badge variant={CATEGORY_VARIANT[insight.category]}>{categoryLabel(insight.category)}</Badge>
          </div>
          {insight.pinned && <Pin className="h-3.5 w-3.5 text-muted-foreground" />}
        </div>

        <p className="text-sm font-medium text-foreground leading-snug">{insight.headline}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{insight.detail}</p>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-2xs text-muted-foreground font-mono">
            {t("confidence", { pct: Math.round(insight.confidence * 100), source: insight.sourceModel })}
          </span>
          {typeof insight.metricDelta === "number" && (
            <span className={cn("flex items-center gap-1 text-2xs font-mono", positive ? "text-success" : "text-destructive")}>
              {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(Math.round(insight.metricDelta * 100))}%
            </span>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
