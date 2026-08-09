import { okrRepository } from "@/features/okrs/api/okrs.repository";
import type { QuarterDTO, ObjectiveDTO, KeyResultDTO } from "@/features/okrs/types/okrs.types";
import type { ObjectiveFormValues, KeyResultProgressValues } from "@/features/okrs/schemas/objective.schema";
import type { QuarterFormValues } from "@/features/okrs/schemas/quarter.schema";

export const okrsService = {
  async listQuarters(workspaceId: string): Promise<QuarterDTO[]> {
    return okrRepository.listQuarters(workspaceId);
  },

  async createObjective(workspaceId: string, data: ObjectiveFormValues): Promise<ObjectiveDTO> {
    return okrRepository.createObjective(workspaceId, data);
  },

  async deleteObjective(workspaceId: string, id: string): Promise<void> {
    return okrRepository.deleteObjective(workspaceId, id);
  },

  async updateKeyResultProgress(
    workspaceId: string,
    keyResultId: string,
    data: KeyResultProgressValues
  ): Promise<KeyResultDTO | null> {
    return okrRepository.updateKeyResultProgress(workspaceId, keyResultId, data);
  },

  async deleteKeyResult(workspaceId: string, keyResultId: string): Promise<void> {
    return okrRepository.deleteKeyResult(workspaceId, keyResultId);
  },

  async createQuarter(workspaceId: string, data: QuarterFormValues): Promise<QuarterDTO> {
    return okrRepository.createQuarter(workspaceId, data);
  },

  async deleteQuarter(workspaceId: string, id: string): Promise<void> {
    return okrRepository.deleteQuarter(workspaceId, id);
  },
};
