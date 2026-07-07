import { z } from "zod";
import { BookingStatus } from "@prisma/client";

export const bookingCreateSchema = z.object({
  hallId: z.string().min(1, "Hall ID is required"),
  customerName: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Invalid email address"),
  eventType: z.string().min(2, "Event type is required"),
  guestCount: z.number().int().positive("Guest count must be positive"),
  eventDate: z.string().min(1, "Event date is required"),
  message: z.string().optional(),
});

export const bookingUpdateSchema = z.object({
  status: z.nativeEnum(BookingStatus),
});

export type BookingCreateInput = z.infer<typeof bookingCreateSchema>;
export type BookingUpdateInput = z.infer<typeof bookingUpdateSchema>;
