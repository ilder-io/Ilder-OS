import { knowledgeBaseRepository } from "@/features/knowledge-base/api/knowledge-base.repository";
import type { KnowledgeDocDTO } from "@/features/knowledge-base/types/knowledge-base.types";

export const knowledgeBaseService = {
  async listDocs(workspaceId: string): Promise<KnowledgeDocDTO[]> {
    return knowledgeBaseRepository.list(workspaceId);
  },
};
