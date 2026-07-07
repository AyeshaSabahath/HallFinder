import { z } from "zod";

export const hallCreateSchema = z.object({
  name: z.string().min(2, "Hall name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(5, "Address is required"),
  area: z.string().min(2, "Area is required"),
  city: z.string().default("Bidar"),
  state: z.string().default("Karnataka"),
  pincode: z.string().min(6).max(6).default("585401"),
  latitude: z.number(),
  longitude: z.number(),
  pricePerDay: z.number().int().positive("Price must be positive"),
  maxCapacity: z.number().int().positive("Capacity must be positive"),
  minCapacity: z.number().int().positive().default(50),
  parking: z.boolean().default(false),
  ac: z.boolean().default(false),
  diningHall: z.boolean().default(false),
  rooms: z.number().int().min(0).default(0),
  kitchen: z.boolean().default(false),
  generator: z.boolean().default(false),
  contactPhone: z.string().min(10, "Valid phone number required"),
  featured: z.boolean().optional(),
  approved: z.boolean().optional(),
  images: z.array(z.string().url()).optional(),
});

export const hallUpdateSchema = hallCreateSchema.partial();

export const hallSearchSchema = z.object({
  date: z.string().optional(),
  area: z.string().optional(),
  guests: z.coerce.number().int().positive().optional(),
  minPrice: z.coerce.number().int().positive().optional(),
  maxPrice: z.coerce.number().int().positive().optional(),
  minCapacity: z.coerce.number().int().positive().optional(),
  ac: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
  parking: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
});

export type HallCreateInput = z.infer<typeof hallCreateSchema>;
export type HallUpdateInput = z.infer<typeof hallUpdateSchema>;
export type HallSearchInput = z.infer<typeof hallSearchSchema>;
