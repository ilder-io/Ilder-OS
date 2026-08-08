import { z } from "zod";

export const sprintSchema = z.object({
  name: z.string().min(3, "Name needs at least 3 characters").max(140),
  goal: z.string().min(3, "Goal needs at least 3 characters").max(500),
  hypothesis: z.string().max(500).optional(),
  startsAt: z.string().min(1, "Pick a start date"),
  endsAt: z.string().min(1, "Pick an end date"),
  quarterId: z.string().optional(),
});

export type SprintFormValues = z.infer<typeof sprintSchema>;
