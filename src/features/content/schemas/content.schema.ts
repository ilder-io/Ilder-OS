import { z } from "zod";

/**
 * Validates both the create/edit form (react-hook-form resolver) and the
 * API route body. One schema, two consumers — keeps client and server
 * validation from drifting apart.
 */
export const contentItemSchema = z.object({
  title: z.string().min(3, "Title needs at least 3 characters").max(140),
  platform: z.enum([
    "YOUTUBE",
    "YOUTUBE_SHORTS",
    "TIKTOK",
    "INSTAGRAM_REEL",
    "INSTAGRAM_POST",
    "X",
    "LINKEDIN",
    "NEWSLETTER",
    "PODCAST",
    "BLOG",
  ]),
  status: z.enum(["IDEA", "SCRIPTING", "FILMING", "EDITING", "SCHEDULED", "PUBLISHED", "ARCHIVED"]),
  pillar: z.string().min(1, "Pick a pillar"),
  series: z.string().optional(),
  hook: z.string().max(280).optional(),
  cta: z.string().max(140).optional(),
  script: z.string().max(20000).optional(),
  durationSecs: z.coerce.number().int().min(0).max(14400).optional(),
  scheduledAt: z.string().optional(),
});

export type ContentItemFormValues = z.infer<typeof contentItemSchema>;
