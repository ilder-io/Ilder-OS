import { db } from "@/lib/core/db";
import type { Idea } from "@prisma/client";
import type { IdeaDTO } from "@/features/ideas/types/ideas.types";
import type { IdeaFormValues } from "@/features/ideas/schemas/idea.schema";

export interface IdeaRepository {
  list(workspaceId: string): Promise<IdeaDTO[]>;
  create(workspaceId: string, data: IdeaFormValues): Promise<IdeaDTO>;
  delete(workspaceId: string, id: string): Promise<void>;
}

function toIdeaDTO(row: Idea): IdeaDTO {
  return {
    id: row.id,
    title: row.title,
    notes: row.notes ?? "",
    status: row.status,
    impact: row.impact,
    effort: row.effort,
  };
}

export class PrismaIdeaRepository implements IdeaRepository {
  async list(workspaceId: string): Promise<IdeaDTO[]> {
    const rows = await db.idea.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toIdeaDTO);
  }

  async create(workspaceId: string, data: IdeaFormValues): Promise<IdeaDTO> {
    const row = await db.idea.create({
      data: { workspaceId, title: data.title, notes: data.notes, impact: data.impact, effort: data.effort },
    });
    return toIdeaDTO(row);
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    await db.idea.deleteMany({ where: { id, workspaceId } });
  }
}

export const ideaRepository: IdeaRepository = new PrismaIdeaRepository();
