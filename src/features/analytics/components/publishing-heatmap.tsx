"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface HeatCell { day: string; hour: string; score: number }

function heatColor(score: number) {
  if (score > 80) return "bg-primary";
  if (score > 65) return "bg-primary/70";
  if (score > 50) return "bg-primary/45";
  if (score > 35) return "bg-primary/25";
  return "bg-secondary";
}

export function PublishingHeatmap({ data }: { data: HeatCell[] }) {
  const t = useTranslations("analytics.heatmap");
  const days = Array.from(new Set(data.map((d) => d.day)));
  const hours = Array.from(new Set(data.map((d) => d.hour)));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto scrollbar-thin">
          <div className="grid gap-1 min-w-[420px]" style={{ gridTemplateColumns: `48px repeat(${hours.length}, 1fr)` }}>
            <div />
            {hours.map((h) => (
              <div key={h} className="text-2xs text-muted-foreground text-center pb-1 font-mono">{h}</div>
            ))}
            {days.map((day) => (
              <div key={day} className="contents">
                <div className="text-2xs text-muted-foreground flex items-center">{day}</div>
                {hours.map((hour) => {
                  const cell = data.find((d) => d.day === day && d.hour === hour);
                  return (
                    <div
                      key={`${day}-${hour}`}
                      className={cn("h-7 rounded-sm", heatColor(cell?.score ?? 0))}
                      title={`${day} ${hour} — score ${cell?.score ?? 0}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
