import { prisma } from "@/lib/prisma";
import { NotFoundError, ConflictError } from "@/lib/api/errors";
import type { HallWithDetails } from "@/types";

export async function getUserFavorites(userId: string): Promise<HallWithDetails[]> {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: {
      hall: {
        include: {
          images: { orderBy: { displayOrder: "asc" } },
          owner: {
            select: { id: true, fullName: true, email: true, phone: true },
          },
        },
      },
    },
  });

  return favorites.map((f) => f.hall);
}

export async function addFavorite(userId: string, hallId: string) {
  const hall = await prisma.hall.findUnique({ where: { id: hallId } });
  if (!hall) throw new NotFoundError("Hall not found");

  const existing = await prisma.favorite.findUnique({
    where: { userId_hallId: { userId, hallId } },
  });
  if (existing) throw new ConflictError("Hall is already in favorites");

  return prisma.favorite.create({
    data: { userId, hallId },
  });
}

export async function removeFavorite(userId: string, hallId: string) {
  const existing = await prisma.favorite.findUnique({
    where: { userId_hallId: { userId, hallId } },
  });
  if (!existing) throw new NotFoundError("Favorite not found");

  await prisma.favorite.delete({
    where: { userId_hallId: { userId, hallId } },
  });
}

export async function isFavorited(
  userId: string,
  hallId: string
): Promise<boolean> {
  const fav = await prisma.favorite.findUnique({
    where: { userId_hallId: { userId, hallId } },
  });
  return !!fav;
}
