import { prisma } from "@/lib/prisma";
import { NotFoundError, ConflictError } from "@/lib/api/errors";
import type { ReviewWithDetails } from "@/types";
import type { ReviewCreateInput } from "@/lib/validations/review";

export async function createReview(
  customerId: string,
  data: ReviewCreateInput
) {
  const hall = await prisma.hall.findUnique({ where: { id: data.hallId } });
  if (!hall) throw new NotFoundError("Hall not found");

  const existing = await prisma.review.findUnique({
    where: {
      hallId_customerId: { hallId: data.hallId, customerId },
    },
  });
  if (existing) throw new ConflictError("You have already reviewed this hall");

  const review = await prisma.$transaction(async (tx) => {
    const created = await tx.review.create({
      data: {
        hallId: data.hallId,
        customerId,
        rating: data.rating,
        comment: data.comment,
      },
      include: {
        customer: { select: { id: true, fullName: true } },
      },
    });

    const stats = await tx.review.aggregate({
      where: { hallId: data.hallId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await tx.hall.update({
      where: { id: data.hallId },
      data: {
        rating: stats._avg.rating ?? hall.rating,
        totalReviews: stats._count.rating,
      },
    });

    return created;
  });

  return review as ReviewWithDetails;
}

export async function getReviews(
  hallId?: string,
  page = 1,
  limit = 10
): Promise<{ data: ReviewWithDetails[]; total: number }> {
  const where = hallId ? { hallId } : {};

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        customer: { select: { id: true, fullName: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.review.count({ where }),
  ]);

  return { data: reviews as ReviewWithDetails[], total };
}
