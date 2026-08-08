import { reviewsRepository } from "@/features/reviews/api/reviews.repository";
import type { WeeklyReviewDTO, MonthlyReviewDTO } from "@/features/reviews/types/reviews.types";

export const reviewsService = {
  async listWeeklyReviews(workspaceId: string): Promise<WeeklyReviewDTO[]> {
    return reviewsRepository.listWeekly(workspaceId);
  },

  async listMonthlyReviews(workspaceId: string): Promise<MonthlyReviewDTO[]> {
    return reviewsRepository.listMonthly(workspaceId);
  },
};
