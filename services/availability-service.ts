import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/api/errors";
import { verifyHallOwnership } from "@/services/hall-service";
import type { AvailabilityCreateInput, AvailabilityUpdateInput } from "@/lib/validations/availability";
import { Role } from "@prisma/client";

export async function getAvailability(
  hallId: string,
  from?: string,
  to?: string
) {
  const hall = await prisma.hall.findUnique({ where: { id: hallId } });
  if (!hall) throw new NotFoundError("Hall not found");

  const where: { hallId: string; date?: { gte?: Date; lte?: Date } } = {
    hallId,
  };

  if (from || to) {
    where.date = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(to) } : {}),
    };
  }

  return prisma.availability.findMany({
    where,
    orderBy: { date: "asc" },
  });
}

export async function createAvailability(
  data: AvailabilityCreateInput,
  userId: string,
  userRole: Role
) {
  await verifyHallOwnership(data.hallId, userId, userRole);

  return prisma.availability.upsert({
    where: {
      hallId_date: {
        hallId: data.hallId,
        date: new Date(data.date),
      },
    },
    update: { status: data.status },
    create: {
      hallId: data.hallId,
      date: new Date(data.date),
      status: data.status,
    },
  });
}

export async function updateAvailability(
  data: AvailabilityUpdateInput,
  userId: string,
  userRole: Role
) {
  const existing = await prisma.availability.findUnique({
    where: { id: data.id },
    include: { hall: true },
  });
  if (!existing) throw new NotFoundError("Availability record not found");

  await verifyHallOwnership(existing.hallId, userId, userRole);

  return prisma.availability.update({
    where: { id: data.id },
    data: { status: data.status },
  });
}

export async function deleteAvailability(
  id: string,
  userId: string,
  userRole: Role
) {
  const existing = await prisma.availability.findUnique({
    where: { id },
  });
  if (!existing) throw new NotFoundError("Availability record not found");

  await verifyHallOwnership(existing.hallId, userId, userRole);

  await prisma.availability.delete({ where: { id } });
}
