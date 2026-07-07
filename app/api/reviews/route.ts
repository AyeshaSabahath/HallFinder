import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/api/auth";
import {
  reviewCreateSchema,
  reviewQuerySchema,
} from "@/lib/validations/review";
import { createReview, getReviews } from "@/services/review-service";
import { paginated, success, withHandler } from "@/lib/api/response";
import { ValidationError } from "@/lib/api/errors";

export async function GET(request: NextRequest) {
  return withHandler(async () => {
    const params = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = reviewQuerySchema.safeParse(params);
    if (!parsed.success) {
      throw new ValidationError("Invalid query parameters", parsed.error.errors);
    }

    const { data, total } = await getReviews(
      parsed.data.hallId,
      parsed.data.page,
      parsed.data.limit
    );

    return paginated(data, total, parsed.data.page, parsed.data.limit);
  });
}

export async function POST(request: NextRequest) {
  return withHandler(async () => {
    const user = await requireAuth();
    const body = await request.json();
    const parsed = reviewCreateSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Validation failed", parsed.error.errors);
    }

    const review = await createReview(user.id, parsed.data);
    return success(review, 201);
  });
}
