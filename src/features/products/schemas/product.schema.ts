import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name needs at least 2 characters").max(140),
  description: z.string().max(500).optional(),
  status: z.enum(["CONCEPT", "BUILDING", "LIVE", "SUNSET"]),
  priceDollars: z.coerce.number().min(0).optional(),
  mrr: z.coerce.number().int().min(0).optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
