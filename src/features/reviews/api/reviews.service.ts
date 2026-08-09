import { reviewsRepository } from "@/features/reviews/api/reviews.repository";
import type { WeeklyReviewDTO, MonthlyReviewDTO } from "@/features/reviews/types/reviews.types";
import type { WeeklyReviewFormValues, MonthlyReviewFormValues } from "@/features/reviews/schemas/review.schema";

export const reviewsService = {
  async listWeeklyReviews(workspaceId: string): Promise<WeeklyReviewDTO[]> {
    return reviewsRepository.listWeekly(workspaceId);
  },

  async listMonthlyReviews(workspaceId: string): Promise<MonthlyReviewDTO[]> {
    return reviewsRepository.listMonthly(workspaceId);
  },

  async createWeeklyReview(workspaceId: string, data: WeeklyReviewFormValues): Promise<WeeklyReviewDTO> {
    return reviewsRepository.createWeekly(workspaceId, data);
  },

  async createMonthlyReview(workspaceId: string, data: MonthlyReviewFormValues): Promise<MonthlyReviewDTO> {
    return reviewsRepository.createMonthly(workspaceId, data);
  },

  async deleteWeeklyReview(workspaceId: string, id: string): Promise<void> {
    return reviewsRepository.deleteWeekly(workspaceId, id);
  },

  async deleteMonthlyReview(workspaceId: string, id: string): Promise<void> {
    return reviewsRepository.deleteMonthly(workspaceId, id);
  },
};
