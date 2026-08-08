"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const PRIMARY = NAV_ITEMS.filter((i) => i.section === "core");

export function MobileNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 flex items-center justify-around border-t border-border bg-surface/95 backdrop-blur px-2 py-2">
      {PRIMARY.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-1 text-2xs rounded-md",
              active ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {t(item.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
