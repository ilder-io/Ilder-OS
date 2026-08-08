import { db } from "@/lib/core/db";
import type { Prisma } from "@prisma/client";
import type { QuarterDTO, ObjectiveDTO } from "@/features/okrs/types/okrs.types";
import type { ObjectiveFormValues } from "@/features/okrs/schemas/objective.schema";
import type { QuarterFormValues } from "@/features/okrs/schemas/quarter.schema";

export interface OKRRepository {
  listQuarters(workspaceId: string): Promise<QuarterDTO[]>;
  createObjective(workspaceId: string, data: ObjectiveFormValues): Promise<ObjectiveDTO>;
  deleteObjective(workspaceId: string, id: string): Promise<void>;
  deleteKeyResult(workspaceId: string, keyResultId: string): Promise<void>;
  createQuarter(workspaceId: string, data: QuarterFormValues): Promise<QuarterDTO>;
  deleteQuarter(workspaceId: string, id: string): Promise<void>;
}

/** Standard calendar quarters (Q1 = Jan-Mar, ...) — computed server-side so
 *  every quarter's date range is consistent instead of hand-entered. */
function quarterDateRange(year: number, quarter: number): { startsAt: Date; endsAt: Date } {
  const startMonth = (quarter - 1) * 3;
  return {
    startsAt: new Date(Date.UTC(year, startMonth, 1)),
    endsAt: new Date(Date.UTC(year, startMonth + 3, 0, 23, 59, 59)),
  };
}

const objectiveWithKeyResults = {
  include: { keyResults: true },
} satisfies Prisma.ObjectiveDefaultArgs;

type ObjectiveWithKeyResults = Prisma.ObjectiveGetPayload<typeof objectiveWithKeyResults>;

function toObjectiveDTO(row: ObjectiveWithKeyResults): ObjectiveDTO {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    status: row.status,
    keyResults: row.keyResults.map((kr) => ({
      id: kr.id,
      title: kr.title,
      targetValue: kr.targetValue,
      currentValue: kr.currentValue,
      unit: kr.unit,
      status: kr.status,
    })),
  };
}

const quarterWithObjectives = {
  include: {
    objectives: {
      include: { keyResults: true },
      orderBy: { createdAt: "asc" as const },
    },
  },
} satisfies Prisma.QuarterDefaultArgs;

type QuarterWithObjectives = Prisma.QuarterGetPayload<typeof quarterWithObjectives>;

function toQuarterDTO(row: QuarterWithObjectives): QuarterDTO {
  return {
    id: row.id,
    label: `Q${row.quarter} ${row.year}`,
    theme: row.theme ?? "",
    objectives: row.objectives.map(toObjectiveDTO),
  };
}

export class PrismaOKRRepository implements OKRRepository {
  async listQuarters(workspaceId: string): Promise<QuarterDTO[]> {
    const rows = await db.quarter.findMany({
      where: { workspaceId },
      orderBy: [{ year: "desc" }, { quarter: "desc" }],
      ...quarterWithObjectives,
    });
    return rows.map(toQuarterDTO);
  }

  async createObjective(workspaceId: string, data: ObjectiveFormValues): Promise<ObjectiveDTO> {
    const row = await db.objective.create({
      data: {
        workspaceId,
        quarterId: data.quarterId,
        title: data.title,
        description: data.description,
        keyResults: {
          create: data.keyResults.map((kr) => ({ title: kr.title, targetValue: kr.targetValue, unit: kr.unit })),
        },
      },
      ...objectiveWithKeyResults,
    });
    return toObjectiveDTO(row);
  }

  async deleteObjective(workspaceId: string, id: string): Promise<void> {
    await db.objective.deleteMany({ where: { id, workspaceId } });
  }

  async deleteKeyResult(workspaceId: string, keyResultId: string): Promise<void> {
    await db.keyResult.deleteMany({ where: { id: keyResultId, objective: { workspaceId } } });
  }

  async createQuarter(workspaceId: string, data: QuarterFormValues): Promise<QuarterDTO> {
    const { startsAt, endsAt } = quarterDateRange(data.year, data.quarter);
    const row = await db.quarter.create({
      data: { workspaceId, year: data.year, quarter: data.quarter, theme: data.theme, startsAt, endsAt },
      ...quarterWithObjectives,
    });
    return toQuarterDTO(row);
  }

  async deleteQuarter(workspaceId: string, id: string): Promise<void> {
    // Sprint.quarterId -> Quarter is ON DELETE SET NULL and Objective/KeyResult
    // cascade (see schema.prisma) — the DB handles detaching/cascading itself.
    await db.quarter.deleteMany({ where: { id, workspaceId } });
  }
}

export const okrRepository: OKRRepository = new PrismaOKRRepository();
