import { sprintRepository, type TaskReorderUpdate } from "@/features/sprints/api/sprints.repository";
import type { SprintDTO, SprintTaskDTO } from "@/features/sprints/types/sprints.types";
import type { SprintFormValues } from "@/features/sprints/schemas/sprint.schema";

export const sprintsService = {
  async listSprints(workspaceId: string): Promise<SprintDTO[]> {
    return sprintRepository.list(workspaceId);
  },

  async getSprintById(workspaceId: string, id: string): Promise<SprintDTO | null> {
    return sprintRepository.getById(workspaceId, id);
  },

  async getActiveSprint(workspaceId: string): Promise<SprintDTO | undefined> {
    const sprints = await sprintRepository.list(workspaceId);
    return sprints.find((s) => s.status === "ACTIVE");
  },

  async createSprint(workspaceId: string, data: SprintFormValues): Promise<SprintDTO> {
    return sprintRepository.create(workspaceId, data);
  },

  async deleteSprint(workspaceId: string, id: string): Promise<void> {
    return sprintRepository.delete(workspaceId, id);
  },

  async createTask(workspaceId: string, sprintId: string, title: string): Promise<SprintTaskDTO | null> {
    return sprintRepository.createTask(workspaceId, sprintId, title);
  },

  async reorderTasks(workspaceId: string, sprintId: string, updates: TaskReorderUpdate[]): Promise<void> {
    return sprintRepository.reorderTasks(workspaceId, sprintId, updates);
  },

  async deleteTask(workspaceId: string, taskId: string): Promise<void> {
    return sprintRepository.deleteTask(workspaceId, taskId);
  },
};
