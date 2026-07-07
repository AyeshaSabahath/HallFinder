import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/api/auth";
import { hallUpdateSchema } from "@/lib/validations/hall";
import {
  getHallById,
  updateHall,
  deleteHall,
} from "@/services/hall-service";
import { success, withHandler } from "@/lib/api/response";
import { ValidationError, NotFoundError } from "@/lib/api/errors";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  return withHandler(async () => {
    const { id } = await params;
    const hall = await getHallById(id);
    if (!hall) throw new NotFoundError("Hall not found");
    return success(hall);
  });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  return withHandler(async () => {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const parsed = hallUpdateSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Validation failed", parsed.error.errors);
    }

    const hall = await updateHall(id, user.id, user.role, parsed.data);
    return success(hall);
  });
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  return withHandler(async () => {
    const user = await requireAuth();
    const { id } = await params;
    await deleteHall(id, user.id, user.role);
    return success({ message: "Hall deleted successfully" });
  });
}
