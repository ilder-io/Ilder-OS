import { db } from "@/lib/core/db";
import type { Prisma } from "@prisma/client";
import type { SprintDTO, SprintTaskDTO } from "@/features/sprints/types/sprints.types";
import type { SprintFormValues } from "@/features/sprints/schemas/sprint.schema";
import type { TaskStatus } from "@/types";

export interface TaskReorderUpdate {
  id: string;
  status: TaskStatus;
  order: number;
}

export interface SprintRepository {
  list(workspaceId: string): Promise<SprintDTO[]>;
  getById(workspaceId: string, id: string): Promise<SprintDTO | null>;
  create(workspaceId: string, data: SprintFormValues): Promise<SprintDTO>;
  delete(workspaceId: string, id: string): Promise<void>;
  createTask(workspaceId: string, sprintId: string, title: string): Promise<SprintTaskDTO | null>;
  reorderTasks(workspaceId: string, sprintId: string, updates: TaskReorderUpdate[]): Promise<void>;
  deleteTask(workspaceId: string, taskId: string): Promise<void>;
}

const sprintWithRelations = {
  include: {
    tasks: { orderBy: { order: "asc" as const } },
    metrics: true,
    actionItems: true,
  },
} satisfies Prisma.SprintDefaultArgs;

type SprintWithRelations = Prisma.SprintGetPayload<typeof sprintWithRelations>;

function toSprintDTO(row: SprintWithRelations): SprintDTO {
  return {
    id: row.id,
    name: row.name,
    goal: row.goal,
    hypothesis: row.hypothesis ?? "",
    status: row.status,
    startsAt: row.startsAt.toISOString(),
    endsAt: row.endsAt.toISOString(),
    quarterId: row.quarterId,
    tasks: row.tasks.map((t) => ({ id: t.id, title: t.title, status: t.status, order: t.order })),
    metrics: row.metrics.map((m) => ({ label: m.label, target: m.target, actual: m.actual })),
    results: row.results,
    learnings: row.learnings,
    actionItems: row.actionItems.map((a) => ({ title: a.title, done: a.done })),
  };
}

export class PrismaSprintRepository implements SprintRepository {
  async list(workspaceId: string): Promise<SprintDTO[]> {
    const rows = await db.sprint.findMany({
      where: { workspaceId },
      orderBy: { startsAt: "desc" },
      ...sprintWithRelations,
    });
    return rows.map(toSprintDTO);
  }

  async getById(workspaceId: string, id: string): Promise<SprintDTO | null> {
    const row = await db.sprint.findFirst({
      where: { id, workspaceId },
      ...sprintWithRelations,
    });
    return row ? toSprintDTO(row) : null;
  }

  async create(workspaceId: string, data: SprintFormValues): Promise<SprintDTO> {
    const row = await db.sprint.create({
      data: {
        workspaceId,
        name: data.name,
        goal: data.goal,
        hypothesis: data.hypothesis,
        startsAt: new Date(data.startsAt),
        endsAt: new Date(data.endsAt),
        quarterId: data.quarterId || undefined,
      },
      ...sprintWithRelations,
    });
    return toSprintDTO(row);
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    await db.sprint.deleteMany({ where: { id, workspaceId } });
  }

  async createTask(workspaceId: string, sprintId: string, title: string): Promise<SprintTaskDTO | null> {
    const sprint = await db.sprint.findFirst({ where: { id: sprintId, workspaceId }, select: { id: true } });
    if (!sprint) return null;

    const todoCount = await db.sprintTask.count({ where: { sprintId, status: "TODO" } });
    const task = await db.sprintTask.create({
      data: { sprintId, title, status: "TODO", order: todoCount },
    });
    return { id: task.id, title: task.title, status: task.status, order: task.order };
  }

  /** Persists a drag-and-drop move: every task whose column and/or position
   *  changed gets its `status`/`order` written in one transaction, scoped to
   *  this sprint so a stray id from another sprint can't be smuggled in. */
  async reorderTasks(workspaceId: string, sprintId: string, updates: TaskReorderUpdate[]): Promise<void> {
    const sprint = await db.sprint.findFirst({ where: { id: sprintId, workspaceId }, select: { id: true } });
    if (!sprint) return;

    await db.$transaction(
      updates.map((u) =>
        db.sprintTask.updateMany({
          where: { id: u.id, sprintId },
          data: { status: u.status, order: u.order },
        })
      )
    );
  }

  async deleteTask(workspaceId: string, taskId: string): Promise<void> {
    await db.sprintTask.deleteMany({ where: { id: taskId, sprint: { workspaceId } } });
  }
}

export const sprintRepository: SprintRepository = new PrismaSprintRepository();
