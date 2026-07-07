import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/api/errors";
import type { DashboardStats } from "@/types";
import { Role } from "@prisma/client";

export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    totalHalls,
    totalUsers,
    pendingHalls,
    pendingBookings,
    totalBookings,
    totalOwners,
  ] = await Promise.all([
    prisma.hall.count(),
    prisma.user.count(),
    prisma.hall.count({ where: { approved: false } }),
    prisma.bookingRequest.count({ where: { status: "PENDING" } }),
    prisma.bookingRequest.count(),
    prisma.user.count({ where: { role: Role.OWNER } }),
  ]);

  return {
    totalHalls,
    totalUsers,
    pendingHalls,
    pendingBookings,
    totalBookings,
    totalOwners,
  };
}

export async function getAllUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      _count: { select: { halls: true } },
    },
  });
}

export async function updateUserRole(id: string, role: Role) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundError("User not found");

  return prisma.user.update({
    where: { id },
    data: { role },
  });
}

export async function approveHall(id: string, approved: boolean) {
  const hall = await prisma.hall.findUnique({ where: { id } });
  if (!hall) throw new NotFoundError("Hall not found");

  return prisma.hall.update({
    where: { id },
    data: { approved },
  });
}
