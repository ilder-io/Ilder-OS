"use client";

import { useTranslations } from "next-intl";
import { Eye, Heart, MessageCircle, Share2, Bookmark, Users, Clock, TrendingUp, MousePointerClick, Percent } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCompactNumber, formatPercent } from "@/lib/utils";
import type { ContentMetrics } from "@/features/content/types/content.types";

const METRIC_ICONS = {
  views: Eye,
  likes: Heart,
  comments: MessageCircle,
  shares: Share2,
  saves: Bookmark,
  followersGenerated: Users,
  watchTimeMinutes: Clock,
  retentionPct: TrendingUp,
  profileVisits: MousePointerClick,
  conversionRatePct: Percent,
} as const;

const METRIC_FORMAT: Record<keyof typeof METRIC_ICONS, (m: ContentMetrics) => string> = {
  views: (m) => formatCompactNumber(m.views),
  likes: (m) => formatCompactNumber(m.likes),
  comments: (m) => formatCompactNumber(m.comments),
  shares: (m) => formatCompactNumber(m.shares),
  saves: (m) => formatCompactNumber(m.saves),
  followersGenerated: (m) => `+${formatCompactNumber(m.followersGenerated)}`,
  watchTimeMinutes: (m) => formatCompactNumber(m.watchTimeMinutes),
  retentionPct: (m) => formatPercent(m.retentionPct),
  profileVisits: (m) => formatCompactNumber(m.profileVisits),
  conversionRatePct: (m) => formatPercent(m.conversionRatePct),
};

export function PerformanceMetrics({ metrics }: { metrics: ContentMetrics }) {
  const t = useTranslations("content.metrics");
  const keys = Object.keys(METRIC_ICONS) as (keyof typeof METRIC_ICONS)[];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {keys.map((key) => {
        const Icon = METRIC_ICONS[key];
        const value = METRIC_FORMAT[key](metrics);
        return (
          <Card key={key} className="p-3.5 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Icon className="h-3 w-3" />
              <span className="text-2xs">{t(key)}</span>
            </div>
            <span className="text-base font-semibold font-mono">
              {key === "watchTimeMinutes" ? t("watchTimeValue", { value }) : value}
            </span>
          </Card>
        );
      })}
    </div>
  );
}
