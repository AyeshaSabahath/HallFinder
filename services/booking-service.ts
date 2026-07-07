import { prisma } from "@/lib/prisma";
import { NotFoundError, ForbiddenError } from "@/lib/api/errors";
import type { BookingWithDetails } from "@/types";
import type { BookingCreateInput } from "@/lib/validations/booking";
import { Role, BookingStatus, AvailabilityStatus } from "@prisma/client";

const bookingInclude = {
  hall: { select: { id: true, name: true, area: true } },
  customer: { select: { id: true, fullName: true, email: true } },
};

export async function createBooking(
  customerId: string,
  customerName: string,
  email: string,
  data: BookingCreateInput
) {
  const hall = await prisma.hall.findUnique({
    where: { id: data.hallId, approved: true },
  });
  if (!hall) throw new NotFoundError("Hall not found or not approved");

  const eventDate = new Date(data.eventDate);
  const blocked = await prisma.availability.findUnique({
    where: {
      hallId_date: { hallId: data.hallId, date: eventDate },
    },
  });

  if (
    blocked &&
    (blocked.status === AvailabilityStatus.BOOKED ||
      blocked.status === AvailabilityStatus.MAINTENANCE)
  ) {
    throw new ForbiddenError("Hall is not available on the selected date");
  }

  return prisma.bookingRequest.create({
    data: {
      hallId: data.hallId,
      customerId,
      customerName: data.customerName || customerName,
      phone: data.phone,
      email: data.email || email,
      eventType: data.eventType,
      guestCount: data.guestCount,
      eventDate,
      message: data.message,
    },
    include: bookingInclude,
  });
}

export async function getBookingsForUser(
  userId: string,
  role: Role
): Promise<BookingWithDetails[]> {
  const where =
    role === Role.ADMIN
      ? {}
      : role === Role.OWNER
        ? { hall: { ownerId: userId } }
        : { customerId: userId };

  const bookings = await prisma.bookingRequest.findMany({
    where,
    include: bookingInclude,
    orderBy: { createdAt: "desc" },
  });

  return bookings as BookingWithDetails[];
}

export async function getBookingById(id: string) {
  const booking = await prisma.bookingRequest.findUnique({
    where: { id },
    include: {
      ...bookingInclude,
      hall: { select: { id: true, name: true, area: true, ownerId: true } },
    },
  });
  if (!booking) throw new NotFoundError("Booking not found");
  return booking;
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
  userId: string,
  role: Role
) {
  const booking = await getBookingById(id);

  if (role === Role.CUSTOMER && booking.customerId !== userId) {
    throw new ForbiddenError();
  }
  if (role === Role.OWNER && booking.hall.ownerId !== userId) {
    throw new ForbiddenError();
  }

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.bookingRequest.update({
      where: { id },
      data: { status },
      include: bookingInclude,
    });

    if (status === BookingStatus.APPROVED) {
      await tx.availability.upsert({
        where: {
          hallId_date: {
            hallId: booking.hallId,
            date: booking.eventDate,
          },
        },
        update: { status: AvailabilityStatus.BOOKED },
        create: {
          hallId: booking.hallId,
          date: booking.eventDate,
          status: AvailabilityStatus.BOOKED,
        },
      });
    }

    if (status === BookingStatus.REJECTED || status === BookingStatus.COMPLETED) {
      const avail = await tx.availability.findUnique({
        where: {
          hallId_date: {
            hallId: booking.hallId,
            date: booking.eventDate,
          },
        },
      });
      if (avail?.status === AvailabilityStatus.BOOKED) {
        await tx.availability.update({
          where: { id: avail.id },
          data: { status: AvailabilityStatus.AVAILABLE },
        });
      }
    }

    return result;
  });

  return updated as BookingWithDetails;
}

export async function deleteBooking(
  id: string,
  userId: string,
  role: Role
) {
  const booking = await getBookingById(id);

  if (role === Role.CUSTOMER && booking.customerId !== userId) {
    throw new ForbiddenError();
  }
  if (role === Role.OWNER && booking.hall.ownerId !== userId) {
    throw new ForbiddenError();
  }

  await prisma.bookingRequest.delete({ where: { id } });
}
