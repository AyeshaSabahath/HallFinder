import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/api/auth";
import { bookingCreateSchema } from "@/lib/validations/booking";
import {
  createBooking,
  getBookingsForUser,
} from "@/services/booking-service";
import { success, withHandler } from "@/lib/api/response";
import { ValidationError } from "@/lib/api/errors";

export async function GET() {
  return withHandler(async () => {
    const user = await requireAuth();
    const bookings = await getBookingsForUser(user.id, user.role);
    return success(bookings);
  });
}

export async function POST(request: NextRequest) {
  return withHandler(async () => {
    const user = await requireAuth();
    const body = await request.json();
    const parsed = bookingCreateSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Validation failed", parsed.error.errors);
    }

    const booking = await createBooking(
      user.id,
      user.fullName,
      user.email,
      parsed.data
    );

    return success(booking, 201);
  });
}
