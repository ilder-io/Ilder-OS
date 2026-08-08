import { analyticsRepository } from "@/features/analytics/api/analytics.repository";
import { contentService } from "@/features/content/api/content.service";
import { clamp } from "@/lib/utils";
import type { TrendPoint } from "@/types";
import type { BarDatum } from "@/components/charts/comparison-bar-chart";
import type { HeatmapPoint, SeriesAggregate } from "@/features/analytics/types/analytics.types";
import type { ContentItemDTO } from "@/features/content/types/content.types";

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_SLOTS = [6, 9, 12, 15, 18, 21];
const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // Date#getUTCDay() index

// `capturedAt`/`publishedAt` are UTC-midnight calendar dates (see seed.ts and
// ContentItem.publishedAt) — formatting without `timeZone: "UTC"` rolls back
// a day for any viewer/build machine west of UTC.
function dateLabel(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

/** Buckets arbitrary rows by calendar day (UTC) and averages a picked field —
 *  shared by the account-level (AnalyticsSnapshot) and content-level
 *  (ContentMetricSnapshot, via ContentItemDTO) trend charts. */
function bucketByDate<T>(rows: T[], getDate: (r: T) => Date, pick: (r: T) => number): TrendPoint[] {
  const byDay = new Map<string, { sum: number; count: number; ts: number }>();
  for (const row of rows) {
    const d = getDate(row);
    const key = d.toISOString().slice(0, 10);
    const cur = byDay.get(key) ?? { sum: 0, count: 0, ts: d.getTime() };
    cur.sum += pick(row);
    cur.count += 1;
    byDay.set(key, cur);
  }
  return Array.from(byDay.values())
    .sort((a, b) => a.ts - b.ts)
    .map((v) => ({ date: dateLabel(new Date(v.ts)), value: Number((v.sum / v.count).toFixed(2)) }));
}

async function getPublishedItems(workspaceId: string, days?: number): Promise<ContentItemDTO[]> {
  const items = await contentService.listContent(workspaceId);
  const published = items.filter((i) => i.status === "PUBLISHED");
  if (!days) return published;
  const cutoff = Date.now() - days * DAY_MS;
  return published.filter((i) => new Date(i.publishedAt).getTime() >= cutoff);
}

export const analyticsService = {
  async getFollowerGrowth(workspaceId: string, days = 90): Promise<TrendPoint[]> {
    const rows = await analyticsRepository.getSnapshotSeries(workspaceId, days);
    return bucketByDate(rows, (r) => r.capturedAt, (r) => r.followers);
  },

  async getViewsGrowth(workspaceId: string, days = 90): Promise<TrendPoint[]> {
    const rows = await analyticsRepository.getSnapshotSeries(workspaceId, days);
    return bucketByDate(rows, (r) => r.capturedAt, (r) => r.totalViews);
  },

  async getEngagementTrend(workspaceId: string, days = 90): Promise<TrendPoint[]> {
    const rows = await analyticsRepository.getSnapshotSeries(workspaceId, days);
    return bucketByDate(rows, (r) => r.capturedAt, (r) => r.engagementPct ?? 0);
  },

  async getRetentionTrend(workspaceId: string, days = 90): Promise<TrendPoint[]> {
    const items = await getPublishedItems(workspaceId, days);
    return bucketByDate(items, (i) => new Date(i.publishedAt), (i) => i.metrics.retentionPct);
  },

  async getWatchTimeTrend(workspaceId: string, days = 90): Promise<TrendPoint[]> {
    const items = await getPublishedItems(workspaceId, days);
    return bucketByDate(items, (i) => new Date(i.publishedAt), (i) => i.metrics.watchTimeMinutes);
  },

  /** Relative engagement score by day-of-week x nearest publishing hour,
   *  computed straight from published content (no separate table needed). */
  async getBestPublishingTime(workspaceId: string): Promise<HeatmapPoint[]> {
    const items = await getPublishedItems(workspaceId);
    const buckets = new Map<string, { sum: number; count: number }>();

    for (const item of items) {
      const d = new Date(item.publishedAt);
      const day = DAY_LABELS[d.getUTCDay()];
      const hour = HOUR_SLOTS.reduce((a, b) => (Math.abs(b - d.getUTCHours()) < Math.abs(a - d.getUTCHours()) ? b : a));
      const engagementPct =
        item.metrics.views > 0
          ? ((item.metrics.likes + item.metrics.comments + item.metrics.shares + item.metrics.saves) / item.metrics.views) * 100
          : 0;
      const key = `${day}|${hour}`;
      const cur = buckets.get(key) ?? { sum: 0, count: 0 };
      cur.sum += engagementPct;
      cur.count += 1;
      buckets.set(key, cur);
    }

    const result: HeatmapPoint[] = [];
    for (const day of DAY_ORDER) {
      for (const hour of HOUR_SLOTS) {
        const cur = buckets.get(`${day}|${hour}`);
        const score = cur ? Math.round(clamp((cur.sum / cur.count) * 10, 0, 100)) : 0;
        result.push({ day, hour: `${hour}:00`, score });
      }
    }
    return result;
  },

  async getTopByMetric(
    workspaceId: string,
    metric: "views" | "followersGenerated" | "saves" | "retentionPct",
    limit = 5
  ): Promise<ContentItemDTO[]> {
    const items = await getPublishedItems(workspaceId);
    return [...items].sort((a, b) => b.metrics[metric] - a.metrics[metric]).slice(0, limit);
  },

  async getWorstVideos(workspaceId: string, limit = 5): Promise<ContentItemDTO[]> {
    const items = await getPublishedItems(workspaceId);
    return [...items].sort((a, b) => a.metrics.retentionPct - b.metrics.retentionPct).slice(0, limit);
  },

  async getBestVideos(workspaceId: string, limit = 5): Promise<ContentItemDTO[]> {
    const items = await getPublishedItems(workspaceId);
    return [...items].sort((a, b) => b.metrics.retentionPct - a.metrics.retentionPct).slice(0, limit);
  },

  async getPillarPerformance(workspaceId: string): Promise<BarDatum[]> {
    const items = await getPublishedItems(workspaceId);
    const byPillar = new Map<string, { views: number; count: number }>();
    for (const i of items) {
      const cur = byPillar.get(i.pillar) ?? { views: 0, count: 0 };
      cur.views += i.metrics.views;
      cur.count += 1;
      byPillar.set(i.pillar, cur);
    }
    return Array.from(byPillar.entries()).map(([label, v]) => ({ label, value: Math.round(v.views / v.count) }));
  },

  async getTopSeries(workspaceId: string, limit = 5): Promise<SeriesAggregate[]> {
    const items = await getPublishedItems(workspaceId);
    const bySeries = new Map<string, { views: number; followers: number; count: number }>();
    for (const i of items) {
      if (!i.series) continue;
      const cur = bySeries.get(i.series) ?? { views: 0, followers: 0, count: 0 };
      cur.views += i.metrics.views;
      cur.followers += i.metrics.followersGenerated;
      cur.count += 1;
      bySeries.set(i.series, cur);
    }
    return Array.from(bySeries.entries())
      .map(([label, v]) => ({ label, value: v.views, followers: v.followers, count: v.count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  },

  async getDurationBuckets(workspaceId: string): Promise<BarDatum[]> {
    const items = await getPublishedItems(workspaceId);
    const buckets = [
      { label: "<30s", min: 0, max: 30 },
      { label: "30-60s", min: 30, max: 60 },
      { label: "1-3m", min: 60, max: 180 },
      { label: "3-8m", min: 180, max: 480 },
      { label: "8m+", min: 480, max: Infinity },
    ];
    return buckets.map((b) => {
      const inBucket = items.filter((i) => i.durationSecs >= b.min && i.durationSecs < b.max);
      const avgRetention = inBucket.length
        ? inBucket.reduce((s, i) => s + i.metrics.retentionPct, 0) / inBucket.length
        : 0;
      return { label: b.label, value: Math.round(avgRetention) };
    });
  },
};
