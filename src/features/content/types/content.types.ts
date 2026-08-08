import type { ContentStatus, Platform } from "@/types";

export interface ContentMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  followersGenerated: number;
  watchTimeMinutes: number;
  retentionPct: number;
  profileVisits: number;
  conversionRatePct: number;
}

export interface ContentItemDTO {
  id: string;
  title: string;
  platform: Platform;
  status: ContentStatus;
  pillar: string;
  series: string | null;
  hook: string;
  cta: string;
  script: string;
  durationSecs: number;
  publishedAt: string;
  metrics: ContentMetrics;
}

/** Payload a platform sync job (see src/app/api/integrations) upserts a
 *  ContentItem from — always followed by a new append-only metric snapshot,
 *  never an overwrite of history. */
export interface SyncedContentInput {
  title: string;
  publishedAt: Date;
  durationSecs: number | null;
  thumbnailUrl: string | null;
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
}

export interface ContentFilters {
  search: string;
  platform: Platform | "ALL";
  status: ContentStatus | "ALL";
  pillar: string | "ALL";
}

export const DEFAULT_CONTENT_FILTERS: ContentFilters = {
  search: "",
  platform: "ALL",
  status: "ALL",
  pillar: "ALL",
};
