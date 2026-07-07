import { NextRequest } from "next/server";
import { Role } from "@prisma/client";
import {
  requireAuth,
  requireOwnerOrAdmin,
} from "@/lib/api/auth";
import { hallSearchSchema, hallCreateSchema } from "@/lib/validations/hall";
import { searchHalls, createHall } from "@/services/hall-service";
import { paginated, success, withHandler } from "@/lib/api/response";
import { ValidationError } from "@/lib/api/errors";

export async function GET(request: NextRequest) {
  return withHandler(async () => {
    const params = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = hallSearchSchema.safeParse(params);
    if (!parsed.success) {
      throw new ValidationError("Invalid search parameters", parsed.error.errors);
    }

    const { page, limit, ...filters } = parsed.data;
    const result = await searchHalls({ ...filters, page, limit });

    return paginated(result.data, result.total, result.page, limit);
  });
}

export async function POST(request: NextRequest) {
  return withHandler(async () => {
    const user = await requireOwnerOrAdmin();
    const body = await request.json();
    const parsed = hallCreateSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Validation failed", parsed.error.errors);
    }

    const hall = await createHall(
      user.id,
      parsed.data,
      user.role === Role.ADMIN
    );

    return success(hall, 201);
  });
}
