"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Command } from "cmdk";
import { NAV_ITEMS } from "@/lib/constants";
import { Dialog, DialogContent } from "@/components/ui/dialog";

/**
 * Global ⌘K palette. Kept as a thin router over NAV_ITEMS today; the same
 * shell is where "create content item", "log a metric", "new sprint" style
 * quick-actions get added as the product grows (see ROADMAP.md).
 */
export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const router = useRouter();
  const t = useTranslations("nav");
  const tc = useTranslations("common");

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-md gap-0 overflow-hidden">
        <Command className="bg-transparent">
          <Command.Input
            placeholder={tc("jumpToModule")}
            className="w-full border-b border-border bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <Command.List className="max-h-80 overflow-y-auto scrollbar-thin p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">{tc("noResults")}</Command.Empty>
            {NAV_ITEMS.map((item) => (
              <Command.Item
                key={item.href}
                onSelect={() => {
                  router.push(item.href as never);
                  onOpenChange(false);
                }}
                className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm text-foreground data-[selected=true]:bg-secondary cursor-pointer"
              >
                <item.icon className="h-4 w-4 text-muted-foreground" />
                {t(item.labelKey)}
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
