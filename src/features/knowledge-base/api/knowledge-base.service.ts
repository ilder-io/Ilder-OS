import { knowledgeBaseRepository } from "@/features/knowledge-base/api/knowledge-base.repository";
import type { KnowledgeDocDTO } from "@/features/knowledge-base/types/knowledge-base.types";
import type { KnowledgeDocFormValues } from "@/features/knowledge-base/schemas/knowledge-doc.schema";

export const knowledgeBaseService = {
  async listDocs(workspaceId: string): Promise<KnowledgeDocDTO[]> {
    return knowledgeBaseRepository.list(workspaceId);
  },

  async createDoc(workspaceId: string, data: KnowledgeDocFormValues): Promise<KnowledgeDocDTO> {
    return knowledgeBaseRepository.create(workspaceId, data);
  },

  async updateDoc(workspaceId: string, id: string, data: KnowledgeDocFormValues): Promise<KnowledgeDocDTO | null> {
    return knowledgeBaseRepository.update(workspaceId, id, data);
  },

  async deleteDoc(workspaceId: string, id: string): Promise<void> {
    return knowledgeBaseRepository.delete(workspaceId, id);
  },
};
