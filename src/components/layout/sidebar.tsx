"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { NAV_ITEMS, APP_NAME, type NavItem } from "@/lib/constants";
import { cn } from "@/lib/utils";

const SECTION_ORDER: NavItem["section"][] = ["core", "planning", "growth", "system"];

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <aside className="hidden md:flex h-screen w-60 shrink-0 flex-col border-r border-border bg-surface/60">
      <div className="flex items-center gap-2 px-5 h-14 border-b border-border">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <span className="text-sm font-semibold tracking-tight">{APP_NAME}</span>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-5">
        {SECTION_ORDER.map((section) => (
          <div key={section}>
            <p className="px-2 mb-1.5 text-2xs font-medium uppercase tracking-wider text-muted-foreground/70">
              {t(`sections.${section}`)}
            </p>
            <div className="space-y-0.5">
              {NAV_ITEMS.filter((item) => item.section === section).map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
                      active ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    {active && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-md bg-secondary"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      />
                    )}
                    <item.icon className="relative h-4 w-4 shrink-0" />
                    <span className="relative">{t(item.labelKey)}</span>
                    {item.shortcut && (
                      <kbd className="relative ml-auto text-2xs text-muted-foreground/60 font-mono">
                        {item.shortcut}
                      </kbd>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
