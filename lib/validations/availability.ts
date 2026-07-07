import { z } from "zod";
import { AvailabilityStatus } from "@prisma/client";

export const availabilityCreateSchema = z.object({
  hallId: z.string().min(1, "Hall ID is required"),
  date: z.string().min(1, "Date is required"),
  status: z.nativeEnum(AvailabilityStatus),
});

export const availabilityUpdateSchema = z.object({
  id: z.string().min(1, "Availability ID is required"),
  status: z.nativeEnum(AvailabilityStatus),
});

export const availabilityQuerySchema = z.object({
  hallId: z.string().min(1, "Hall ID is required"),
  from: z.string().optional(),
  to: z.string().optional(),
});

export type AvailabilityCreateInput = z.infer<typeof availabilityCreateSchema>;
export type AvailabilityUpdateInput = z.infer<typeof availabilityUpdateSchema>;
