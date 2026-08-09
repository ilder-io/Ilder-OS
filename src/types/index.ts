/**
 * Shared domain enums, hand-mirrored from prisma/schema.prisma.
 *
 * Why not just import Prisma's generated enums everywhere? Two reasons:
 * 1. Client components can't import `@prisma/client` (server-only, and
 *    heavy). Keeping plain string-literal unions here means UI code has
 *    zero-cost, tree-shakeable types.
 * 2. It keeps `src/features/**` importable by the mock-data layer without
 *    a generated client / live database — useful for Storybook-style
 *    isolated development and for this v1 build, which ships fully wired
 *    to mock data so every screen is inspectable before Postgres exists.
 *
 * Contract: any enum change in schema.prisma must be mirrored here in the
 * same PR. This is checked nowhere automatically yet — see ROADMAP.md.
 */

export const PLATFORM_VALUES = [
  "YOUTUBE",
  "YOUTUBE_SHORTS",
  "TIKTOK",
  "INSTAGRAM_REEL",
  "INSTAGRAM_POST",
  "X",
  "LINKEDIN",
  "NEWSLETTER",
  "PODCAST",
  "BLOG",
] as const;
export type Platform = (typeof PLATFORM_VALUES)[number];

/** Which *connected account* — distinct from Platform above, which
 *  classifies individual content items. See ConnectionPlatform in
 *  schema.prisma for why these can't share one enum. */
export const CONNECTION_PLATFORM_VALUES = ["TIKTOK", "INSTAGRAM", "YOUTUBE", "X", "LINKEDIN"] as const;
export type ConnectionPlatform = (typeof CONNECTION_PLATFORM_VALUES)[number];

export const CONTENT_STATUS_VALUES = [
  "IDEA",
  "SCRIPTING",
  "FILMING",
  "EDITING",
  "SCHEDULED",
  "PUBLISHED",
  "ARCHIVED",
] as const;
export type ContentStatus = (typeof CONTENT_STATUS_VALUES)[number];

export const OKR_STATUS_VALUES = ["NOT_STARTED", "ON_TRACK", "AT_RISK", "OFF_TRACK", "COMPLETED"] as const;
export type OKRStatus = (typeof OKR_STATUS_VALUES)[number];

export const SPRINT_STATUS_VALUES = ["PLANNED", "ACTIVE", "COMPLETED"] as const;
export type SprintStatus = (typeof SPRINT_STATUS_VALUES)[number];

export const TASK_STATUS_VALUES = ["TODO", "IN_PROGRESS", "DONE", "BLOCKED"] as const;
export type TaskStatus = (typeof TASK_STATUS_VALUES)[number];

export const PRODUCT_STATUS_VALUES = ["CONCEPT", "BUILDING", "LIVE", "SUNSET"] as const;
export type ProductStatus = (typeof PRODUCT_STATUS_VALUES)[number];

export const IDEA_STATUS_VALUES = ["INBOX", "SHORTLISTED", "IN_PROGRESS", "SHIPPED", "DISCARDED"] as const;
export type IdeaStatus = (typeof IDEA_STATUS_VALUES)[number];

export const INSIGHT_CATEGORY_VALUES = ["CONTENT", "AUDIENCE", "GROWTH", "CONVERSION", "TIMING", "RISK"] as const;
export type InsightCategory = (typeof INSIGHT_CATEGORY_VALUES)[number];

/** Generic trend payload used by every chart component in src/components/charts. */
export interface TrendPoint {
  date: string;
  value: number;
  [key: string]: string | number;
}

export interface StatDelta {
  label: string;
  value: string;
  delta?: number; // signed percentage vs previous period
  trend?: TrendPoint[];
}
