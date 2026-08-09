import { db } from "@/lib/core/db";
import type { ConnectionPlatform } from "@/types";

export interface AnalyticsSnapshotRow {
  capturedAt: Date;
  followers: number;
  totalViews: number;
  totalLikes: number;
  engagementPct: number | null;
}

export interface RecordSnapshotInput {
  followers: number;
  totalViews: number;
  totalLikes: number;
  engagementPct: number | null;
}

export interface AnalyticsRepository {
  /** Account-level snapshots (see AnalyticsSnapshot in schema.prisma),
   *  summed across every connected platform, one point per calendar day,
   *  for the last `days` days. */
  getSnapshotSeries(workspaceId: string, days: number): Promise<AnalyticsSnapshotRow[]>;
  /** Upserted by (workspaceId, platform, day) — a sync job can run more
   *  than once a day without piling up duplicate points. */
  recordSnapshot(workspaceId: string, platform: ConnectionPlatform, data: RecordSnapshotInput): Promise<void>;
}

function todayUtcMidnight(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export class PrismaAnalyticsRepository implements AnalyticsRepository {
  async getSnapshotSeries(workspaceId: string, days: number): Promise<AnalyticsSnapshotRow[]> {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const rows = await db.analyticsSnapshot.groupBy({
      by: ["capturedAt"],
      where: { workspaceId, capturedAt: { gte: cutoff } },
      _sum: { followers: true, totalViews: true, totalLikes: true },
      _avg: { engagementPct: true },
      orderBy: { capturedAt: "asc" },
    });
    return rows.map((r) => ({
      capturedAt: r.capturedAt,
      followers: r._sum.followers ?? 0,
      totalViews: r._sum.totalViews ?? 0,
      totalLikes: r._sum.totalLikes ?? 0,
      engagementPct: r._avg.engagementPct,
    }));
  }

  async recordSnapshot(workspaceId: string, platform: ConnectionPlatform, data: RecordSnapshotInput): Promise<void> {
    const capturedAt = todayUtcMidnight();
    await db.analyticsSnapshot.upsert({
      where: { workspaceId_platform_capturedAt: { workspaceId, platform, capturedAt } },
      update: data,
      create: { workspaceId, platform, capturedAt, ...data },
    });
  }
}

export const analyticsRepository: AnalyticsRepository = new PrismaAnalyticsRepository();
