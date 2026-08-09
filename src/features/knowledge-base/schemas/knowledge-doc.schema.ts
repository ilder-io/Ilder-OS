import { z } from "zod";

export const knowledgeDocSchema = z.object({
  title: z.string().min(3, "Title needs at least 3 characters").max(140),
  content: z.string().min(1, "Content is required").max(20000),
  tags: z.string().max(500).optional().default(""),
});

export type KnowledgeDocFormValues = z.infer<typeof knowledgeDocSchema>;
