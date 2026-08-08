"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentStatusBadge } from "@/components/shared/status-badge";
import { PillarDot } from "@/components/shared/pillar-dot";
import { usePlatformLabel } from "@/hooks/use-enum-labels";
import { formatCompactNumber, formatDate, formatPercent } from "@/lib/utils";
import type { ContentItemDTO } from "@/features/content/types/content.types";

function sortableHeader(label: string) {
  return function Header({ column }: { column: { toggleSorting: (desc?: boolean) => void; getIsSorted: () => false | "asc" | "desc" } }) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-7 px-2 text-2xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {label}
        <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    );
  };
}

/** Column defs depend on the active locale (headers, platform label), so
 *  they're built inside a hook rather than exported as a static array. */
export function useContentColumns(): ColumnDef<ContentItemDTO>[] {
  const t = useTranslations("content.columns");
  const platformLabel = usePlatformLabel();

  return useMemo<ColumnDef<ContentItemDTO>[]>(
    () => [
      {
        accessorKey: "title",
        header: sortableHeader(t("title")),
        cell: ({ row }) => (
          <Link href={`/content/${row.original.id}`} className="flex flex-col gap-0.5 max-w-xs group">
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {row.original.title}
            </span>
            <span className="flex items-center gap-1.5 text-2xs text-muted-foreground">
              <PillarDot name={row.original.pillar} />
              {row.original.pillar}
              {row.original.series && <span className="text-muted-foreground/60">· {row.original.series}</span>}
            </span>
          </Link>
        ),
      },
      {
        accessorKey: "platform",
        header: t("platform"),
        cell: ({ row }) => <span className="text-xs text-muted-foreground">{platformLabel(row.original.platform)}</span>,
      },
      {
        accessorKey: "status",
        header: t("status"),
        cell: ({ row }) => <ContentStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "publishedAt",
        header: sortableHeader(t("published")),
        cell: ({ row }) => <span className="text-xs text-muted-foreground font-mono">{formatDate(row.original.publishedAt)}</span>,
      },
      {
        accessorKey: "metrics.views",
        header: sortableHeader(t("views")),
        cell: ({ row }) => <span className="text-xs font-mono">{formatCompactNumber(row.original.metrics.views)}</span>,
      },
      {
        accessorKey: "metrics.retentionPct",
        header: sortableHeader(t("retention")),
        cell: ({ row }) => <span className="text-xs font-mono">{formatPercent(row.original.metrics.retentionPct)}</span>,
      },
      {
        accessorKey: "metrics.followersGenerated",
        header: sortableHeader(t("followers")),
        cell: ({ row }) => (
          <span className="text-xs font-mono text-success">+{formatCompactNumber(row.original.metrics.followersGenerated)}</span>
        ),
      },
    ],
    [t, platformLabel]
  );
}
