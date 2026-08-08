import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentStatusBadge } from "@/components/shared/status-badge";
import { formatCompactNumber, formatDate } from "@/lib/utils";
import type { ContentItemDTO } from "@/features/content/types/content.types";

export async function RecentContentWidget({ items }: { items: ContentItemDTO[] }) {
  const t = await getTranslations("dashboard");
  const platformT = await getTranslations("status.platform");
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>{t("recentContent")}</CardTitle>
        <Link href="/content" className="flex items-center gap-1 text-2xs text-primary hover:underline">
          {t("viewAll")} <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-1">
        {items.slice(0, 6).map((item) => (
          <Link
            key={item.id}
            href={`/content/${item.id}`}
            className="flex items-center gap-3 rounded-md px-2 py-2 -mx-2 hover:bg-secondary/40 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground line-clamp-1">{item.title}</p>
              <p className="text-2xs text-muted-foreground">{platformT(item.platform)} · {formatDate(item.publishedAt)}</p>
            </div>
            <ContentStatusBadge status={item.status} />
            <span className="text-xs font-mono text-muted-foreground w-14 text-right shrink-0">
              {formatCompactNumber(item.metrics.views)}
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
