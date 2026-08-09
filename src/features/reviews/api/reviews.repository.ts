import { db } from "@/lib/core/db";
import type { WeeklyReview, MonthlyReview } from "@prisma/client";
import type { WeeklyReviewDTO, MonthlyReviewDTO } from "@/features/reviews/types/reviews.types";
import type { WeeklyReviewFormValues, MonthlyReviewFormValues } from "@/features/reviews/schemas/review.schema";

export interface ReviewsRepository {
  listWeekly(workspaceId: string): Promise<WeeklyReviewDTO[]>;
  listMonthly(workspaceId: string): Promise<MonthlyReviewDTO[]>;
  createWeekly(workspaceId: string, data: WeeklyReviewFormValues): Promise<WeeklyReviewDTO>;
  createMonthly(workspaceId: string, data: MonthlyReviewFormValues): Promise<MonthlyReviewDTO>;
  deleteWeekly(workspaceId: string, id: string): Promise<void>;
  deleteMonthly(workspaceId: string, id: string): Promise<void>;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function toLines(value: string | null): string[] {
  return value ? value.split("\n").filter(Boolean) : [];
}

// `weekStart`/`monthStart` are UTC-midnight calendar dates — formatting
// without `timeZone: "UTC"` rolls back a day for any viewer/build machine
// west of UTC (e.g. "2026-07-01" reading as "June 2026").
function formatWeekLabel(weekStart: Date): string {
  const weekEnd = new Date(weekStart.getTime() + 6 * DAY_MS);
  const start = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  const end = weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
  return `${start} – ${end}`;
}

function formatMonthLabel(monthStart: Date): string {
  return monthStart.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

function toWeeklyReviewDTO(row: WeeklyReview): WeeklyReviewDTO {
  return {
    id: row.id,
    weekLabel: formatWeekLabel(row.weekStart),
    wins: toLines(row.wins),
    challenges: toLines(row.challenges),
    focusNext: toLines(row.focusNext),
  };
}

function toMonthlyReviewDTO(row: MonthlyReview): MonthlyReviewDTO {
  return {
    id: row.id,
    monthLabel: formatMonthLabel(row.monthStart),
    summary: row.summary ?? "",
    highlights: toLines(row.highlights),
    lowlights: toLines(row.lowlights),
    nextFocus: toLines(row.nextFocus),
  };
}

export class PrismaReviewsRepository implements ReviewsRepository {
  async listWeekly(workspaceId: string): Promise<WeeklyReviewDTO[]> {
    const rows = await db.weeklyReview.findMany({
      where: { workspaceId },
      orderBy: { weekStart: "desc" },
    });
    return rows.map(toWeeklyReviewDTO);
  }

  async listMonthly(workspaceId: string): Promise<MonthlyReviewDTO[]> {
    const rows = await db.monthlyReview.findMany({
      where: { workspaceId },
      orderBy: { monthStart: "desc" },
    });
    return rows.map(toMonthlyReviewDTO);
  }

  /** Upserted by (workspaceId, weekStart) — resubmitting the form for a
   *  week that already has an entry edits it in place instead of erroring
   *  on the unique constraint. */
  async createWeekly(workspaceId: string, data: WeeklyReviewFormValues): Promise<WeeklyReviewDTO> {
    const weekStart = new Date(`${data.weekStart}T00:00:00.000Z`);
    const row = await db.weeklyReview.upsert({
      where: { workspaceId_weekStart: { workspaceId, weekStart } },
      update: { wins: data.wins || null, challenges: data.challenges || null, focusNext: data.focusNext || null },
      create: {
        workspaceId,
        weekStart,
        wins: data.wins || null,
        challenges: data.challenges || null,
        focusNext: data.focusNext || null,
      },
    });
    return toWeeklyReviewDTO(row);
  }

  async createMonthly(workspaceId: string, data: MonthlyReviewFormValues): Promise<MonthlyReviewDTO> {
    const monthStart = new Date(`${data.monthStart}-01T00:00:00.000Z`);
    const row = await db.monthlyReview.upsert({
      where: { workspaceId_monthStart: { workspaceId, monthStart } },
      update: {
        summary: data.summary || null,
        highlights: data.highlights || null,
        lowlights: data.lowlights || null,
        nextFocus: data.nextFocus || null,
      },
      create: {
        workspaceId,
        monthStart,
        summary: data.summary || null,
        highlights: data.highlights || null,
        lowlights: data.lowlights || null,
        nextFocus: data.nextFocus || null,
      },
    });
    return toMonthlyReviewDTO(row);
  }

  async deleteWeekly(workspaceId: string, id: string): Promise<void> {
    await db.weeklyReview.deleteMany({ where: { id, workspaceId } });
  }

  async deleteMonthly(workspaceId: string, id: string): Promise<void> {
    await db.monthlyReview.deleteMany({ where: { id, workspaceId } });
  }
}

export const reviewsRepository: ReviewsRepository = new PrismaReviewsRepository();
