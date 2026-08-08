"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TrendAreaChart } from "@/components/charts/trend-area-chart";
import { CHART_COLORS } from "@/components/charts/chart-theme";
import type { TrendPoint } from "@/types";

export function GrowthCharts({
  followers,
  views,
  engagement,
  retention,
  watchTime,
}: {
  followers: TrendPoint[];
  views: TrendPoint[];
  engagement: TrendPoint[];
  retention: TrendPoint[];
  watchTime: TrendPoint[];
}) {
  const t = useTranslations("analytics.growth");
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="followers">
          <TabsList>
            <TabsTrigger value="followers">{t("tabs.followers")}</TabsTrigger>
            <TabsTrigger value="views">{t("tabs.views")}</TabsTrigger>
            <TabsTrigger value="engagement">{t("tabs.engagement")}</TabsTrigger>
            <TabsTrigger value="retention">{t("tabs.retention")}</TabsTrigger>
            <TabsTrigger value="watchtime">{t("tabs.watchtime")}</TabsTrigger>
          </TabsList>
          <TabsContent value="followers">
            <TrendAreaChart data={followers} color={CHART_COLORS.primary} />
          </TabsContent>
          <TabsContent value="views">
            <TrendAreaChart data={views} color={CHART_COLORS.series[4]} />
          </TabsContent>
          <TabsContent value="engagement">
            <TrendAreaChart data={engagement} color={CHART_COLORS.series[1]} valueFormatter={(v) => `${v.toFixed(1)}%`} />
          </TabsContent>
          <TabsContent value="retention">
            <TrendAreaChart data={retention} color={CHART_COLORS.warning} valueFormatter={(v) => `${v.toFixed(0)}%`} />
          </TabsContent>
          <TabsContent value="watchtime">
            <TrendAreaChart data={watchTime} color={CHART_COLORS.series[3]} valueFormatter={(v) => `${v.toFixed(0)}m`} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
