"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useContentStore } from "@/features/content/store/content.store";
import { ContentFilters } from "@/features/content/components/content-filters";
import { ContentTable } from "@/features/content/components/content-table";
import { ContentCard } from "@/features/content/components/content-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Inbox } from "lucide-react";
import type { ContentItemDTO } from "@/features/content/types/content.types";

/** Client-side filter + view-mode orchestration over a server-fetched list.
 *  Filtering happens here (not on the server) because the full dataset for
 *  a single creator workspace is small (hundreds, not millions, of rows) —
 *  see ARCHITECTURE.md "When to move filtering server-side" for the
 *  threshold where this should change to server-paginated queries. */
export function ContentWorkspace({ items, pillars }: { items: ContentItemDTO[]; pillars: string[] }) {
  const { filters, view } = useContentStore();
  const t = useTranslations("content");

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (filters.search && !item.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.platform !== "ALL" && item.platform !== filters.platform) return false;
      if (filters.status !== "ALL" && item.status !== filters.status) return false;
      if (filters.pillar !== "ALL" && item.pillar !== filters.pillar) return false;
      return true;
    });
  }, [items, filters]);

  return (
    <div className="space-y-4">
      <ContentFilters pillars={pillars} />

      {view === "table" ? (
        <ContentTable data={filtered} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Inbox} title={t("emptyTitle")} description={t("emptyDescriptionShort")} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item, i) => (
            <ContentCard key={item.id} item={item} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
