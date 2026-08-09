import { z } from "zod";

export const weeklyReviewSchema = z.object({
  weekStart: z.string().min(1, "Pick a week"),
  wins: z.string().max(4000).optional().default(""),
  challenges: z.string().max(4000).optional().default(""),
  focusNext: z.string().max(4000).optional().default(""),
});

export type WeeklyReviewFormValues = z.infer<typeof weeklyReviewSchema>;

export const monthlyReviewSchema = z.object({
  monthStart: z.string().min(1, "Pick a month"),
  summary: z.string().max(2000).optional().default(""),
  highlights: z.string().max(4000).optional().default(""),
  lowlights: z.string().max(4000).optional().default(""),
  nextFocus: z.string().max(4000).optional().default(""),
});

export type MonthlyReviewFormValues = z.infer<typeof monthlyReviewSchema>;
