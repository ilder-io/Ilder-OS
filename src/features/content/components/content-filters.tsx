"use client";

import { useTranslations } from "next-intl";
import { Search, LayoutGrid, Table2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useContentStore } from "@/features/content/store/content.store";
import { usePlatformLabel, useContentStatusLabel } from "@/hooks/use-enum-labels";
import { PLATFORM_VALUES, CONTENT_STATUS_VALUES } from "@/types";
import { cn } from "@/lib/utils";

export function ContentFilters({ pillars }: { pillars: string[] }) {
  const { filters, setFilter, view, setView } = useContentStore();
  const t = useTranslations("content");
  const platformLabel = usePlatformLabel();
  const statusLabel = useContentStatusLabel();

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
      <div className="flex flex-1 gap-2 flex-wrap">
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            className="pl-8"
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
          />
        </div>

        <Select value={filters.platform} onValueChange={(v) => setFilter("platform", v as typeof filters.platform)}>
          <SelectTrigger className="w-40"><SelectValue placeholder={t("platformPlaceholder")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t("allPlatforms")}</SelectItem>
            {PLATFORM_VALUES.map((value) => (
              <SelectItem key={value} value={value}>{platformLabel(value)}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={(v) => setFilter("status", v as typeof filters.status)}>
          <SelectTrigger className="w-36"><SelectValue placeholder={t("statusPlaceholder")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t("allStatuses")}</SelectItem>
            {CONTENT_STATUS_VALUES.map((value) => (
              <SelectItem key={value} value={value}>{statusLabel(value)}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.pillar} onValueChange={(v) => setFilter("pillar", v)}>
          <SelectTrigger className="w-44"><SelectValue placeholder={t("pillarPlaceholder")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t("allPillars")}</SelectItem>
            {pillars.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-0.5 rounded-md border border-border p-0.5 w-fit">
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-7 w-7", view === "table" && "bg-secondary text-foreground")}
          onClick={() => setView("table")}
          aria-label={t("tableView")}
        >
          <Table2 className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-7 w-7", view === "grid" && "bg-secondary text-foreground")}
          onClick={() => setView("grid")}
          aria-label={t("gridView")}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
