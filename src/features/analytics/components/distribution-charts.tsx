"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ComparisonBarChart, type BarDatum } from "@/components/charts/comparison-bar-chart";

export function DistributionCharts({
  pillarPerformance,
  durationBuckets,
}: {
  pillarPerformance: BarDatum[];
  durationBuckets: BarDatum[];
}) {
  const t = useTranslations("analytics.distribution");
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("pillarTitle")}</CardTitle>
          <CardDescription>{t("pillarDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ComparisonBarChart data={pillarPerformance} horizontal height={220} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("durationTitle")}</CardTitle>
          <CardDescription>{t("durationDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ComparisonBarChart data={durationBuckets} height={220} valueFormatter={(v) => `${v}%`} />
        </CardContent>
      </Card>
    </div>
  );
}
