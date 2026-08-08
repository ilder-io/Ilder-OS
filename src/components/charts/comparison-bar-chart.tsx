"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { CHART_COLORS, CHART_TOOLTIP_STYLE } from "@/components/charts/chart-theme";
import { formatCompactNumber } from "@/lib/utils";

export interface BarDatum {
  label: string;
  value: number;
}

export function ComparisonBarChart({
  data,
  height = 260,
  horizontal = false,
  valueFormatter = formatCompactNumber,
}: {
  data: BarDatum[];
  height?: number;
  horizontal?: boolean;
  valueFormatter?: (v: number) => string;
}) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout={horizontal ? "vertical" : "horizontal"}
          margin={{ top: 8, right: 8, bottom: 0, left: horizontal ? 8 : 0 }}
        >
          <CartesianGrid stroke={CHART_COLORS.grid} horizontal={!horizontal} vertical={horizontal} />
          {horizontal ? (
            <>
              <XAxis type="number" tick={{ fill: CHART_COLORS.axis, fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={valueFormatter} />
              <YAxis type="category" dataKey="label" tick={{ fill: CHART_COLORS.axis, fontSize: 11 }} tickLine={false} axisLine={false} width={110} />
            </>
          ) : (
            <>
              <XAxis dataKey="label" tick={{ fill: CHART_COLORS.axis, fontSize: 11 }} tickLine={false} axisLine={{ stroke: CHART_COLORS.grid }} />
              <YAxis tick={{ fill: CHART_COLORS.axis, fontSize: 11 }} tickLine={false} axisLine={false} width={40} tickFormatter={valueFormatter} />
            </>
          )}
          <Tooltip contentStyle={CHART_TOOLTIP_STYLE} formatter={(v: number) => valueFormatter(v)} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="value" radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]} maxBarSize={horizontal ? 18 : 32}>
            {data.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS.series[i % CHART_COLORS.series.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
