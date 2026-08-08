"use client";

import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { CHART_COLORS } from "@/components/charts/chart-theme";
import type { TrendPoint } from "@/types";

/** Tiny inline trend indicator used inside StatCard — no axes, no grid. */
export function MiniSparkline({ data, positive = true }: { data: TrendPoint[]; positive?: boolean }) {
  const color = positive ? CHART_COLORS.success : CHART_COLORS.destructive;
  return (
    <div className="h-8 w-20">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`spark-${positive}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#spark-${positive})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
