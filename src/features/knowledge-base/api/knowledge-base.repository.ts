import { db } from "@/lib/core/db";
import type { KnowledgeDoc } from "@prisma/client";
import type { KnowledgeDocDTO } from "@/features/knowledge-base/types/knowledge-base.types";
import type { KnowledgeDocFormValues } from "@/features/knowledge-base/schemas/knowledge-doc.schema";

export interface KnowledgeBaseRepository {
  list(workspaceId: string): Promise<KnowledgeDocDTO[]>;
  create(workspaceId: string, data: KnowledgeDocFormValues): Promise<KnowledgeDocDTO>;
  update(workspaceId: string, id: string, data: KnowledgeDocFormValues): Promise<KnowledgeDocDTO | null>;
  delete(workspaceId: string, id: string): Promise<void>;
}

const EXCERPT_LENGTH = 140;

function toExcerpt(content: string): string {
  return content.length > EXCERPT_LENGTH ? `${content.slice(0, EXCERPT_LENGTH).trimEnd()}…` : content;
}

function parseTags(tags: string): string[] {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function toKnowledgeDocDTO(row: KnowledgeDoc): KnowledgeDocDTO {
  return {
    id: row.id,
    title: row.title,
    tags: row.tags,
    content: row.content,
    excerpt: toExcerpt(row.content),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export class PrismaKnowledgeBaseRepository implements KnowledgeBaseRepository {
  async list(workspaceId: string): Promise<KnowledgeDocDTO[]> {
    const rows = await db.knowledgeDoc.findMany({
      where: { workspaceId },
      orderBy: { updatedAt: "desc" },
    });
    return rows.map(toKnowledgeDocDTO);
  }

  async create(workspaceId: string, data: KnowledgeDocFormValues): Promise<KnowledgeDocDTO> {
    const row = await db.knowledgeDoc.create({
      data: { workspaceId, title: data.title, content: data.content, tags: parseTags(data.tags ?? "") },
    });
    return toKnowledgeDocDTO(row);
  }

  async update(workspaceId: string, id: string, data: KnowledgeDocFormValues): Promise<KnowledgeDocDTO | null> {
    const { count } = await db.knowledgeDoc.updateMany({
      where: { id, workspaceId },
      data: { title: data.title, content: data.content, tags: parseTags(data.tags ?? "") },
    });
    if (count === 0) return null;
    const row = await db.knowledgeDoc.findFirst({ where: { id, workspaceId } });
    return row ? toKnowledgeDocDTO(row) : null;
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    await db.knowledgeDoc.deleteMany({ where: { id, workspaceId } });
  }
}

export const knowledgeBaseRepository: KnowledgeBaseRepository = new PrismaKnowledgeBaseRepository();
