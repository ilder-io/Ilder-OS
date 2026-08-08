import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  FileVideo,
  LineChart,
  Target,
  CalendarRange,
  Rocket,
  CalendarCheck2,
  CalendarDays,
  Package,
  Lightbulb,
  Sparkles,
  Settings,
  BookOpen,
} from "lucide-react";

export const APP_NAME = "Ilder OS";
// Mirrors messages/{locale}.json's `common.appTagline` — kept as a plain
// constant too since it's needed in the root layout's <metadata>, which
// runs before request-scoped i18n context exists.
export const APP_TAGLINE = "The operating system for your personal brand.";

/**
 * `labelKey`/`sectionKey` index into the `nav` namespace in
 * messages/{locale}.json (see src/components/layout/sidebar.tsx for the
 * `useTranslations("nav")` call site) — kept as keys, not literal strings,
 * so every consumer (Sidebar, MobileNav, CommandPalette) renders the
 * translated label instead of English.
 */
export interface NavItem {
  labelKey: string;
  href: string;
  icon: LucideIcon;
  section: "core" | "planning" | "growth" | "system";
  shortcut?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { labelKey: "dashboard", href: "/dashboard", icon: LayoutDashboard, section: "core", shortcut: "D" },
  { labelKey: "content", href: "/content", icon: FileVideo, section: "core", shortcut: "C" },
  { labelKey: "analytics", href: "/analytics", icon: LineChart, section: "core", shortcut: "A" },
  { labelKey: "aiInsights", href: "/ai-insights", icon: Sparkles, section: "core", shortcut: "I" },

  { labelKey: "okrs", href: "/okrs", icon: Target, section: "planning" },
  { labelKey: "quarterPlanning", href: "/quarter-planning", icon: CalendarRange, section: "planning" },
  { labelKey: "sprints", href: "/sprints", icon: Rocket, section: "planning" },
  { labelKey: "weeklyReview", href: "/weekly-review", icon: CalendarCheck2, section: "planning" },
  { labelKey: "monthlyReview", href: "/monthly-review", icon: CalendarDays, section: "planning" },

  { labelKey: "products", href: "/products", icon: Package, section: "growth" },
  { labelKey: "ideasBacklog", href: "/ideas", icon: Lightbulb, section: "growth" },
  { labelKey: "knowledgeBase", href: "/knowledge-base", icon: BookOpen, section: "growth" },

  { labelKey: "settings", href: "/settings", icon: Settings, section: "system" },
];
