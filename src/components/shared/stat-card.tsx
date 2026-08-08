"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MiniSparkline } from "@/components/charts/mini-sparkline";
import type { TrendPoint } from "@/types";

export function StatCard({
  label,
  value,
  delta,
  icon,
  trend,
  suffix,
}: {
  label: string;
  value: string;
  delta?: number;
  icon?: ReactNode;
  trend?: TrendPoint[];
  suffix?: string;
}) {
  const positive = (delta ?? 0) >= 0;
  const t = useTranslations("common");

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="p-5 flex flex-col gap-3 h-full">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          {icon && <span className="h-3.5 w-3.5 text-muted-foreground/60 [&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>}
        </div>

        <div className="flex items-end justify-between gap-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-semibold font-mono tracking-tight text-foreground">{value}</span>
            {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
          </div>
          {trend && trend.length > 1 && <MiniSparkline data={trend} positive={positive} />}
        </div>

        {typeof delta === "number" && (
          <div
            className={cn(
              "inline-flex w-fit items-center gap-0.5 text-2xs font-medium font-mono",
              positive ? "text-success" : "text-destructive"
            )}
          >
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta).toFixed(1)}%
            <span className="text-muted-foreground font-sans ml-1">{t("vsLastPeriod")}</span>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
