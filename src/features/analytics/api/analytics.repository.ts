import { db } from "@/lib/core/db";

export interface AnalyticsSnapshotRow {
  capturedAt: Date;
  followers: number;
  totalViews: number;
  totalLikes: number;
  engagementPct: number | null;
}

export interface AnalyticsRepository {
  /** Account-level snapshots (see AnalyticsSnapshot in schema.prisma), summed
   *  across every connected platform, for the last `days` days. */
  getSnapshotSeries(workspaceId: string, days: number): Promise<AnalyticsSnapshotRow[]>;
}

export class PrismaAnalyticsRepository implements AnalyticsRepository {
  async getSnapshotSeries(workspaceId: string, days: number): Promise<AnalyticsSnapshotRow[]> {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const rows = await db.analyticsSnapshot.findMany({
      where: { workspaceId, capturedAt: { gte: cutoff } },
      orderBy: { capturedAt: "asc" },
    });
    return rows.map((r) => ({
      capturedAt: r.capturedAt,
      followers: r.followers,
      totalViews: r.totalViews,
      totalLikes: r.totalLikes,
      engagementPct: r.engagementPct,
    }));
  }
}

export const analyticsRepository: AnalyticsRepository = new PrismaAnalyticsRepository();
