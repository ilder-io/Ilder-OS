import { okrRepository } from "@/features/okrs/api/okrs.repository";
import type { QuarterDTO, ObjectiveDTO } from "@/features/okrs/types/okrs.types";
import type { ObjectiveFormValues } from "@/features/okrs/schemas/objective.schema";
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
