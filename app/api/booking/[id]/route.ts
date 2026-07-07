import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/api/auth";
import { bookingUpdateSchema } from "@/lib/validations/booking";
import {
  updateBookingStatus,
  deleteBooking,
} from "@/services/booking-service";
import { success, withHandler } from "@/lib/api/response";
import { ValidationError } from "@/lib/api/errors";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  return withHandler(async () => {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const parsed = bookingUpdateSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Validation failed", parsed.error.errors);
    }

    const booking = await updateBookingStatus(
      id,
      parsed.data.status,
      user.id,
      user.role
    );
    return success(booking);
  });
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  return withHandler(async () => {
    const user = await requireAuth();
    const { id } = await params;
    await deleteBooking(id, user.id, user.role);
    return success({ message: "Booking deleted successfully" });
  });
}
