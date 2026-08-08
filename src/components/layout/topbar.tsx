"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Bell } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/layout/command-palette";

export function Topbar({ title }: { title: string }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const t = useTranslations("common");

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-border bg-background/80 px-6 backdrop-blur">
      <h1 className="text-sm font-medium text-foreground">{title}</h1>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPaletteOpen(true)}
          className="gap-2 text-muted-foreground w-56 justify-start"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="text-xs">{t("searchPlaceholder")}</span>
          <kbd className="ml-auto text-2xs font-mono border border-border rounded px-1">⌘K</kbd>
        </Button>
        <Button variant="ghost" size="icon" aria-label={t("notifications")}>
          <Bell className="h-4 w-4" />
        </Button>
        <UserButton afterSignOutUrl="/sign-in" />
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </header>
  );
}
