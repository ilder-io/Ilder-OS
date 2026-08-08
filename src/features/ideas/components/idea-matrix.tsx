"use client";

import { useTranslations } from "next-intl";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CHART_COLORS, CHART_TOOLTIP_STYLE } from "@/components/charts/chart-theme";
import type { IdeaDTO } from "@/features/ideas/types/ideas.types";

/** Impact vs. effort quadrant — the fastest way to see what to shortlist
 *  next: top-left (high impact, low effort) is the obvious queue. */
export function IdeaMatrix({ ideas }: { ideas: IdeaDTO[] }) {
  const t = useTranslations("ideas.matrix");
  const data = ideas.map((i) => ({ ...i, x: i.effort, y: i.impact }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
              <CartesianGrid stroke={CHART_COLORS.grid} />
              <XAxis type="number" dataKey="x" name={t("effort")} domain={[0, 6]} tick={{ fill: CHART_COLORS.axis, fontSize: 11 }} axisLine={{ stroke: CHART_COLORS.grid }} tickLine={false} label={{ value: t("effortAxis"), position: "insideBottomRight", fill: CHART_COLORS.axis, fontSize: 11, offset: -4 }} />
              <YAxis type="number" dataKey="y" name={t("impact")} domain={[0, 6]} tick={{ fill: CHART_COLORS.axis, fontSize: 11 }} axisLine={false} tickLine={false} label={{ value: t("impactAxis"), angle: -90, position: "insideLeft", fill: CHART_COLORS.axis, fontSize: 11 }} />
              <ReferenceLine x={3} stroke={CHART_COLORS.grid} />
              <ReferenceLine y={3} stroke={CHART_COLORS.grid} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={CHART_TOOLTIP_STYLE}
                formatter={(_v, _n, item) => [item.payload.title, ""]}
              />
              <Scatter data={data} fill={CHART_COLORS.primary}>
                {data.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS.series[i % CHART_COLORS.series.length]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
