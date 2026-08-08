import { db } from "@/lib/core/db";
import type { Prisma, Platform as PrismaPlatform } from "@prisma/client";
import type { ContentItemDTO, SyncedContentInput } from "@/features/content/types/content.types";
import type { ContentItemFormValues } from "@/features/content/schemas/content.schema";

export interface ContentRepository {
  list(workspaceId: string): Promise<ContentItemDTO[]>;
  getById(workspaceId: string, id: string): Promise<ContentItemDTO | null>;
  create(workspaceId: string, data: ContentItemFormValues): Promise<ContentItemDTO>;
  update(workspaceId: string, id: string, data: Partial<ContentItemFormValues>): Promise<ContentItemDTO | null>;
  delete(workspaceId: string, id: string): Promise<void>;
  upsertFromSync(
    workspaceId: string,
    platform: PrismaPlatform,
    externalId: string,
    data: SyncedContentInput
  ): Promise<{ created: boolean }>;
}

const contentItemWithRelations = {
  include: {
    pillar: true,
    series: true,
    metrics: { orderBy: { capturedAt: "desc" as const }, take: 1 },
  },
} satisfies Prisma.ContentItemDefaultArgs;

type ContentItemWithRelations = Prisma.ContentItemGetPayload<typeof contentItemWithRelations>;

function toContentItemDTO(row: ContentItemWithRelations): ContentItemDTO {
  const latest = row.metrics[0];
  return {
    id: row.id,
    title: row.title,
    platform: row.platform,
    status: row.status,
    pillar: row.pillar?.name ?? "Uncategorized",
    series: row.series?.name ?? null,
    hook: row.hook ?? "",
    cta: row.cta ?? "",
    script: row.script ?? "",
    durationSecs: row.durationSecs ?? 0,
    publishedAt: (row.publishedAt ?? row.createdAt).toISOString(),
    metrics: {
      views: latest?.views ?? 0,
      likes: latest?.likes ?? 0,
      comments: latest?.comments ?? 0,
      shares: latest?.shares ?? 0,
      saves: latest?.saves ?? 0,
      followersGenerated: latest?.followersGenerated ?? 0,
      watchTimeMinutes: latest?.watchTimeMinutes ?? 0,
      retentionPct: latest?.retentionPct ?? 0,
      profileVisits: latest?.profileVisits ?? 0,
      conversionRatePct: latest?.conversionRatePct ?? 0,
    },
  };
}

/** Content is organized by Pillar/Series *records*, not free strings — the
 *  form only ever asks for a name, so every write upserts-by-name within
 *  the workspace rather than requiring the caller to know an id. */
async function resolvePillarId(workspaceId: string, name: string): Promise<string> {
  const pillar = await db.pillar.upsert({
    where: { workspaceId_name: { workspaceId, name } },
    update: {},
    create: { workspaceId, name },
  });
  return pillar.id;
}

async function resolveSeriesId(workspaceId: string, name: string | undefined): Promise<string | null> {
  if (!name) return null;
  const series = await db.series.upsert({
    where: { workspaceId_name: { workspaceId, name } },
    update: {},
    create: { workspaceId, name },
  });
  return series.id;
}

/**
 * `ContentItem` + latest `ContentMetricSnapshot` (append-only, see
 * schema.prisma), mapped to the flat `ContentItemDTO` every component in
 * this feature already codes against. Nothing above the repository layer
 * changed when this replaced `MockContentRepository`.
 */
export class PrismaContentRepository implements ContentRepository {
  async list(workspaceId: string): Promise<ContentItemDTO[]> {
    const rows = await db.contentItem.findMany({
      where: { workspaceId },
      orderBy: { publishedAt: "desc" },
      ...contentItemWithRelations,
    });
    return rows.map(toContentItemDTO);
  }

  async getById(workspaceId: string, id: string): Promise<ContentItemDTO | null> {
    const row = await db.contentItem.findFirst({
      where: { id, workspaceId },
      ...contentItemWithRelations,
    });
    return row ? toContentItemDTO(row) : null;
  }

  async create(workspaceId: string, data: ContentItemFormValues): Promise<ContentItemDTO> {
    const [pillarId, seriesId] = await Promise.all([
      resolvePillarId(workspaceId, data.pillar),
      resolveSeriesId(workspaceId, data.series),
    ]);

    const row = await db.contentItem.create({
      data: {
        workspaceId,
        title: data.title,
        platform: data.platform,
        status: data.status,
        pillarId,
        seriesId,
        hook: data.hook,
        cta: data.cta,
        script: data.script,
        durationSecs: data.durationSecs,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      },
      ...contentItemWithRelations,
    });
    return toContentItemDTO(row);
  }

  async update(workspaceId: string, id: string, data: Partial<ContentItemFormValues>): Promise<ContentItemDTO | null> {
    const [pillarId, seriesId] = await Promise.all([
      data.pillar !== undefined ? resolvePillarId(workspaceId, data.pillar) : undefined,
      data.series !== undefined ? resolveSeriesId(workspaceId, data.series) : undefined,
    ]);

    const { count } = await db.contentItem.updateMany({
      where: { id, workspaceId },
      data: {
        title: data.title,
        platform: data.platform,
        status: data.status,
        pillarId,
        seriesId,
        hook: data.hook,
        cta: data.cta,
        script: data.script,
        durationSecs: data.durationSecs,
        ...(data.status === "PUBLISHED" ? { publishedAt: new Date() } : {}),
      },
    });
    if (count === 0) return null;
    return this.getById(workspaceId, id);
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    await db.contentItem.deleteMany({ where: { id, workspaceId } });
  }

  /** Idempotent per (workspaceId, platform, externalId) — re-syncing the
   *  same video updates its title/thumbnail and appends a fresh metric
   *  snapshot rather than creating a duplicate ContentItem. */
  async upsertFromSync(
    workspaceId: string,
    platform: PrismaPlatform,
    externalId: string,
    data: SyncedContentInput
  ): Promise<{ created: boolean }> {
    const existing = await db.contentItem.findUnique({
      where: { workspaceId_platform_externalId: { workspaceId, platform, externalId } },
    });

    let contentItemId: string;
    let created: boolean;

    if (existing) {
      await db.contentItem.update({
        where: { id: existing.id },
        data: { title: data.title, thumbnailUrl: data.thumbnailUrl },
      });
      contentItemId = existing.id;
      created = false;
    } else {
      const row = await db.contentItem.create({
        data: {
          workspaceId,
          platform,
          externalId,
          title: data.title,
          status: "PUBLISHED",
          publishedAt: data.publishedAt,
          durationSecs: data.durationSecs,
          thumbnailUrl: data.thumbnailUrl,
        },
      });
      contentItemId = row.id;
      created = true;
    }

    await db.contentMetricSnapshot.create({
      data: {
        contentItemId,
        views: data.metrics.views,
        likes: data.metrics.likes,
        comments: data.metrics.comments,
        shares: data.metrics.shares,
      },
    });

    return { created };
  }
}

export const contentRepository: ContentRepository = new PrismaContentRepository();
