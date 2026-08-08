import { ideaRepository } from "@/features/ideas/api/ideas.repository";
import type { IdeaDTO } from "@/features/ideas/types/ideas.types";
import type { IdeaFormValues } from "@/features/ideas/schemas/idea.schema";

export const ideasService = {
  async listIdeas(workspaceId: string): Promise<IdeaDTO[]> {
    return ideaRepository.list(workspaceId);
  },

  async createIdea(workspaceId: string, data: IdeaFormValues): Promise<IdeaDTO> {
    return ideaRepository.create(workspaceId, data);
  },

  async deleteIdea(workspaceId: string, id: string): Promise<void> {
    return ideaRepository.delete(workspaceId, id);
  },
};
