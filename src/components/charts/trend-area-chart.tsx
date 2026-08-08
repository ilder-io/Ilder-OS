"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CHART_COLORS, CHART_TOOLTIP_STYLE } from "@/components/charts/chart-theme";
import { formatCompactNumber } from "@/lib/utils";
import type { TrendPoint } from "@/types";

export function TrendAreaChart({
  data,
  dataKey = "value",
  height = 260,
  color = CHART_COLORS.primary,
  valueFormatter = formatCompactNumber,
}: {
  data: TrendPoint[];
  dataKey?: string;
  height?: number;
  color?: string;
  valueFormatter?: (v: number) => string;
}) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: CHART_COLORS.axis, fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: CHART_COLORS.grid }}
          />
          <YAxis
            tick={{ fill: CHART_COLORS.axis, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={40}
            tickFormatter={valueFormatter}
          />
          <Tooltip
            contentStyle={CHART_TOOLTIP_STYLE}
            labelStyle={{ color: "#F3F3F6", marginBottom: 4 }}
            formatter={(v: number) => valueFormatter(v)}
          />
          <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill="url(#area-fill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
