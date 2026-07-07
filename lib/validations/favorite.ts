import { z } from "zod";

export const favoriteSchema = z.object({
  hallId: z.string().min(1, "Hall ID is required"),
});

export type FavoriteInput = z.infer<typeof favoriteSchema>;
