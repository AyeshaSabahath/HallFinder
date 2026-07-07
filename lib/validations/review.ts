import { z } from "zod";

export const reviewCreateSchema = z.object({
  hallId: z.string().min(1, "Hall ID is required"),
  rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().max(1000).optional(),
});

export const reviewQuerySchema = z.object({
  hallId: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});

export type ReviewCreateInput = z.infer<typeof reviewCreateSchema>;
