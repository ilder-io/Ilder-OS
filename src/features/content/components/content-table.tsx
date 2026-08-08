"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { useContentColumns } from "@/features/content/components/content-columns";
import type { ContentItemDTO } from "@/features/content/types/content.types";

export function ContentTable({ data }: { data: ContentItemDTO[] }) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "publishedAt", desc: true }]);
  const t = useTranslations("content");
  const columns = useContentColumns();

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  if (data.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title={t("emptyTitle")}
        description={t("emptyDescriptionLong")}
      />
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-secondary/40 border-b border-border">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id} className="text-left px-4 py-2 font-normal">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b border-border last:border-0 hover:bg-secondary/25 transition-colors">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2.5">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
        <span className="text-2xs text-muted-foreground">
          {t("pagination", {
            page: table.getState().pagination.pageIndex + 1,
            pageCount: table.getPageCount() || 1,
            count: data.length,
          })}
        </span>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
