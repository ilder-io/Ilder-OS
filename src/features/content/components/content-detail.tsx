import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContentStatusBadge } from "@/components/shared/status-badge";
import { PillarDot } from "@/components/shared/pillar-dot";
import { PerformanceMetrics } from "@/features/content/components/performance-metrics";
import { formatDate, formatDuration } from "@/lib/utils";
import type { ContentItemDTO } from "@/features/content/types/content.types";

export async function ContentDetail({ item }: { item: ContentItemDTO }) {
  const t = await getTranslations("content");
  const platformT = await getTranslations("status.platform");
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{platformT(item.platform)}</Badge>
        <ContentStatusBadge status={item.status} />
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <PillarDot name={item.pillar} />
          {item.pillar}
        </span>
        {item.series && <span className="text-xs text-muted-foreground">· {item.series}</span>}
        <span className="text-xs text-muted-foreground ml-auto font-mono">
          {formatDate(item.publishedAt, { year: "numeric" })} · {formatDuration(item.durationSecs)}
        </span>
      </div>

      <PerformanceMetrics metrics={item.metrics} />

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("hook")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/90">{item.hook}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("cta")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/90">{item.cta}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
