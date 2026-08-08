"use client";

import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";
import { CHART_COLORS } from "@/components/charts/chart-theme";

export function RadialProgress({ value, size = 72, color = CHART_COLORS.primary }: { value: number; size?: number; color?: string }) {
  const data = [{ value }];
  return (
    <div style={{ width: size, height: size }} className="relative shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="72%"
          outerRadius="100%"
          data={data}
          startAngle={90}
          endAngle={-270}
          barSize={6}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar dataKey="value" cornerRadius={6} fill={color} background={{ fill: "#232329" }} isAnimationActive />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-mono font-medium">
        {Math.round(value)}%
      </div>
    </div>
  );
}
