import { db } from "@/lib/core/db";
import type { KnowledgeDoc } from "@prisma/client";
import type { KnowledgeDocDTO } from "@/features/knowledge-base/types/knowledge-base.types";

export interface KnowledgeBaseRepository {
  list(workspaceId: string): Promise<KnowledgeDocDTO[]>;
}

const EXCERPT_LENGTH = 140;

function toExcerpt(content: string): string {
  return content.length > EXCERPT_LENGTH ? `${content.slice(0, EXCERPT_LENGTH).trimEnd()}…` : content;
}

function toKnowledgeDocDTO(row: KnowledgeDoc): KnowledgeDocDTO {
  return {
    id: row.id,
    title: row.title,
    tags: row.tags,
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
}

export const knowledgeBaseRepository: KnowledgeBaseRepository = new PrismaKnowledgeBaseRepository();
