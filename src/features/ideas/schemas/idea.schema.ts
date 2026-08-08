import { z } from "zod";

export const ideaSchema = z.object({
  title: z.string().min(3, "Title needs at least 3 characters").max(140),
  notes: z.string().max(2000).optional(),
  impact: z.coerce.number().int().min(1).max(5),
  effort: z.coerce.number().int().min(1).max(5),
});

export type IdeaFormValues = z.infer<typeof ideaSchema>;
