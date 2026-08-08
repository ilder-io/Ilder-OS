import { z } from "zod";

export const keyResultInputSchema = z.object({
  title: z.string().min(3, "Title needs at least 3 characters").max(140),
  targetValue: z.coerce.number().positive("Must be greater than 0"),
  unit: z.string().min(1).max(20).default("%"),
});

export const objectiveSchema = z.object({
  quarterId: z.string().min(1),
  title: z.string().min(3, "Title needs at least 3 characters").max(140),
  description: z.string().max(500).optional(),
  keyResults: z.array(keyResultInputSchema).min(1, "Add at least one key result").max(6),
});

export type ObjectiveFormValues = z.infer<typeof objectiveSchema>;
export type KeyResultInput = z.infer<typeof keyResultInputSchema>;
