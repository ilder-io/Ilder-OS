import { z } from "zod";

export const quarterSchema = z.object({
  year: z.coerce.number().int().min(2020).max(2100),
  quarter: z.coerce.number().int().min(1).max(4),
  theme: z.string().max(280).optional(),
});

export type QuarterFormValues = z.infer<typeof quarterSchema>;
