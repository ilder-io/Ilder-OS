import { db } from "@/lib/core/db";
import type { WeeklyReview, MonthlyReview } from "@prisma/client";
import type { WeeklyReviewDTO, MonthlyReviewDTO } from "@/features/reviews/types/reviews.types";

export interface ReviewsRepository {
  listWeekly(workspaceId: string): Promise<WeeklyReviewDTO[]>;
  listMonthly(workspaceId: string): Promise<MonthlyReviewDTO[]>;
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
}

export const reviewsRepository: ReviewsRepository = new PrismaReviewsRepository();
