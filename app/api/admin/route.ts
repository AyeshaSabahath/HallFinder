import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/api/auth";
import { getDashboardStats, getAllUsers, updateUserRole, approveHall } from "@/services/admin-service";
import { getAllHalls } from "@/services/hall-service";
import { success, withHandler } from "@/lib/api/response";
import { Role } from "@prisma/client";
import { ValidationError } from "@/lib/api/errors";

export async function GET(request: NextRequest) {
  return withHandler(async () => {
    await requireAdmin();
    const { searchParams } = request.nextUrl;
    const type = searchParams.get("type");

    if (type === "users") {
      const users = await getAllUsers();
      return success(users);
    }

    if (type === "halls") {
      const halls = await getAllHalls();
      return success(halls);
    }

    const stats = await getDashboardStats();
    return success(stats);
  });
}

export async function PATCH(request: NextRequest) {
  return withHandler(async () => {
    await requireAdmin();
    const body = await request.json();

    if (body.userId && body.role) {
      const user = await updateUserRole(body.userId, body.role as Role);
      return success(user);
    }

    if (body.hallId !== undefined && body.approved !== undefined) {
      const hall = await approveHall(body.hallId, body.approved);
      return success(hall);
    }

    throw new ValidationError("Invalid update payload");
  });
}
