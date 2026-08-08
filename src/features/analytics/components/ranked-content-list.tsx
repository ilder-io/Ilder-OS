import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCompactNumber, formatPercent } from "@/lib/utils";
import type { ContentItemDTO } from "@/features/content/types/content.types";

/** Aggregate ranking (e.g. Top Series) — no single content item to link to. */
export function RankedAggregateList({
  title,
  description,
  items,
}: {
  title: string;
  description?: string;
  items: { label: string; value: number; meta?: string }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-1">
        {items.map((item, i) => (
          <div key={item.label} className="flex items-center gap-3 rounded-md px-2 py-2 -mx-2">
            <span className="text-2xs font-mono text-muted-foreground w-4 shrink-0">{i + 1}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground line-clamp-1">{item.label}</p>
              {item.meta && <p className="text-2xs text-muted-foreground line-clamp-1">{item.meta}</p>}
            </div>
            <span className="text-xs font-mono text-foreground shrink-0">{formatCompactNumber(item.value)}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function RankedContentList({
  title,
  description,
  items,
  metric,
  format = "compact",
  subtitle,
}: {
  title: string;
  description?: string;
  items: ContentItemDTO[];
  metric: (item: ContentItemDTO) => number;
  format?: "compact" | "percent";
  subtitle?: (item: ContentItemDTO) => string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-1">
        {items.map((item, i) => (
          <Link
            key={item.id}
            href={`/content/${item.id}`}
            className="flex items-center gap-3 rounded-md px-2 py-2 -mx-2 hover:bg-secondary/40 transition-colors"
          >
            <span className="text-2xs font-mono text-muted-foreground w-4 shrink-0">{i + 1}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground line-clamp-1">{item.title}</p>
              {subtitle && <p className="text-2xs text-muted-foreground line-clamp-1">{subtitle(item)}</p>}
            </div>
            <span className="text-xs font-mono text-foreground shrink-0">
              {format === "percent" ? formatPercent(metric(item)) : formatCompactNumber(metric(item))}
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
