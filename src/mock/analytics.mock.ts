import { seededRandom } from "@/lib/utils";
import { MOCK_CONTENT_ITEMS } from "@/mock/content.mock";
import type { TrendPoint } from "@/types";

const DAY = 24 * 60 * 60 * 1000;
const NOW = new Date("2026-08-07T00:00:00Z").getTime();

function dateLabel(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** 90-day follower growth series, gently trending up with weekend dips. */
export function getFollowerGrowth(days = 90): TrendPoint[] {
  const rand = seededRandom("followers-growth");
  let followers = 8400;
  const points: TrendPoint[] = [];
  for (let i = days; i >= 0; i--) {
    const ts = NOW - i * DAY;
    const dow = new Date(ts).getDay();
    const weekendDip = dow === 0 || dow === 6 ? 0.6 : 1;
    followers += Math.floor((6 + rand() * 34) * weekendDip);
    points.push({ date: dateLabel(ts), value: followers });
  }
  return points;
}

export function getViewsGrowth(days = 90): TrendPoint[] {
  const rand = seededRandom("views-growth");
  const points: TrendPoint[] = [];
  for (let i = days; i >= 0; i--) {
    const ts = NOW - i * DAY;
    const base = 4200 + Math.sin(i / 9) * 1400;
    points.push({ date: dateLabel(ts), value: Math.max(300, Math.floor(base + rand() * 2600)) });
  }
  return points;
}

export function getEngagementTrend(days = 90): TrendPoint[] {
  const rand = seededRandom("engagement-trend");
  const points: TrendPoint[] = [];
  for (let i = days; i >= 0; i--) {
    const ts = NOW - i * DAY;
    points.push({ date: dateLabel(ts), value: Number((4.2 + Math.sin(i / 14) * 1.1 + rand() * 1.4).toFixed(2)) });
  }
  return points;
}

export function getRetentionTrend(days = 90): TrendPoint[] {
  const rand = seededRandom("retention-trend");
  const points: TrendPoint[] = [];
  for (let i = days; i >= 0; i--) {
    const ts = NOW - i * DAY;
    points.push({ date: dateLabel(ts), value: Number((48 + Math.sin(i / 20) * 8 + rand() * 6).toFixed(1)) });
  }
  return points;
}

export function getWatchTimeTrend(days = 90): TrendPoint[] {
  const rand = seededRandom("watchtime-trend");
  const points: TrendPoint[] = [];
  for (let i = days; i >= 0; i--) {
    const ts = NOW - i * DAY;
    points.push({ date: dateLabel(ts), value: Math.floor(320 + Math.sin(i / 11) * 90 + rand() * 140) });
  }
  return points;
}

/** Best publishing time — hour-of-day x avg engagement heatmap data. */
export function getBestPublishingTime() {
  const rand = seededRandom("best-publish-time");
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = [6, 9, 12, 15, 18, 21];
  return days.flatMap((day, dIdx) =>
    hours.map((hour) => {
      const eveningBoost = hour === 18 || hour === 21 ? 1.4 : 1;
      const weekdayBoost = dIdx < 5 ? 1.15 : 0.9;
      return {
        day,
        hour: `${hour}:00`,
        score: Math.round(clamp(40 + rand() * 40 * eveningBoost * weekdayBoost, 0, 100)),
      };
    })
  );
}
function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

/** Aggregate rankings derived straight from the content mock — one source
 *  of truth for "Top X" lists everywhere in Analytics. */
export function getTopByMetric(metric: "views" | "followersGenerated" | "saves" | "retentionPct", limit = 5) {
  return [...MOCK_CONTENT_ITEMS]
    .filter((c) => c.status === "PUBLISHED")
    .sort((a, b) => b.metrics[metric] - a.metrics[metric])
    .slice(0, limit);
}

export function getWorstVideos(limit = 5) {
  return [...MOCK_CONTENT_ITEMS]
    .filter((c) => c.status === "PUBLISHED")
    .sort((a, b) => a.metrics.retentionPct - b.metrics.retentionPct)
    .slice(0, limit);
}

export function getBestVideos(limit = 5) {
  return [...MOCK_CONTENT_ITEMS]
    .filter((c) => c.status === "PUBLISHED")
    .sort((a, b) => b.metrics.retentionPct - a.metrics.retentionPct)
    .slice(0, limit);
}

export function getPillarPerformance() {
  const byPillar = new Map<string, { views: number; count: number; retention: number }>();
  for (const c of MOCK_CONTENT_ITEMS) {
    if (c.status !== "PUBLISHED") continue;
    const cur = byPillar.get(c.pillar) ?? { views: 0, count: 0, retention: 0 };
    cur.views += c.metrics.views;
    cur.retention += c.metrics.retentionPct;
    cur.count += 1;
    byPillar.set(c.pillar, cur);
  }
  return Array.from(byPillar.entries()).map(([label, v]) => ({
    label,
    value: Math.round(v.views / v.count),
  }));
}

export function getTopSeries(limit = 5) {
  const bySeries = new Map<string, { views: number; followers: number; count: number }>();
  for (const c of MOCK_CONTENT_ITEMS) {
    if (c.status !== "PUBLISHED" || !c.series) continue;
    const cur = bySeries.get(c.series) ?? { views: 0, followers: 0, count: 0 };
    cur.views += c.metrics.views;
    cur.followers += c.metrics.followersGenerated;
    cur.count += 1;
    bySeries.set(c.series, cur);
  }
  return Array.from(bySeries.entries())
    .map(([label, v]) => ({ label, value: v.views, followers: v.followers, count: v.count }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export function getDurationBuckets() {
  const buckets = [
    { label: "<30s", min: 0, max: 30 },
    { label: "30-60s", min: 30, max: 60 },
    { label: "1-3m", min: 60, max: 180 },
    { label: "3-8m", min: 180, max: 480 },
    { label: "8m+", min: 480, max: Infinity },
  ];
  return buckets.map((b) => {
    const inBucket = MOCK_CONTENT_ITEMS.filter(
      (c) => c.status === "PUBLISHED" && c.durationSecs >= b.min && c.durationSecs < b.max
    );
    const avgRetention = inBucket.length
      ? inBucket.reduce((s, c) => s + c.metrics.retentionPct, 0) / inBucket.length
      : 0;
    return { label: b.label, value: Math.round(avgRetention) };
  });
}
