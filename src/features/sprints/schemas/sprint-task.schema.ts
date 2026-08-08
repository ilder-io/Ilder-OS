import { z } from "zod";

export const sprintTaskCreateSchema = z.object({
  title: z.string().min(2, "Title needs at least 2 characters").max(200),
});

export const sprintTaskReorderSchema = z.object({
  updates: z
    .array(
      z.object({
        id: z.string().min(1),
        status: z.enum(["TODO", "IN_PROGRESS", "DONE", "BLOCKED"]),
        order: z.number().int().min(0),
      })
    )
    .min(1),
});

export type SprintTaskCreateValues = z.infer<typeof sprintTaskCreateSchema>;
export type SprintTaskReorderValues = z.infer<typeof sprintTaskReorderSchema>;
