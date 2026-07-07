import { NextRequest } from "next/server";
import { requireAuth, requireOwnerOrAdmin } from "@/lib/api/auth";
import {
  availabilityCreateSchema,
  availabilityUpdateSchema,
  availabilityQuerySchema,
} from "@/lib/validations/availability";
import {
  getAvailability,
  createAvailability,
  updateAvailability,
  deleteAvailability,
} from "@/services/availability-service";
import { success, withHandler } from "@/lib/api/response";
import { ValidationError } from "@/lib/api/errors";

export async function GET(request: NextRequest) {
  return withHandler(async () => {
    const params = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = availabilityQuerySchema.safeParse(params);
    if (!parsed.success) {
      throw new ValidationError("Invalid query parameters", parsed.error.errors);
    }

    const data = await getAvailability(
      parsed.data.hallId,
      parsed.data.from,
      parsed.data.to
    );
    return success(data);
  });
}

export async function POST(request: NextRequest) {
  return withHandler(async () => {
    const user = await requireOwnerOrAdmin();
    const body = await request.json();
    const parsed = availabilityCreateSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Validation failed", parsed.error.errors);
    }

    const data = await createAvailability(parsed.data, user.id, user.role);
    return success(data, 201);
  });
}

export async function PUT(request: NextRequest) {
  return withHandler(async () => {
    const user = await requireOwnerOrAdmin();
    const body = await request.json();
    const parsed = availabilityUpdateSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Validation failed", parsed.error.errors);
    }

    const data = await updateAvailability(parsed.data, user.id, user.role);
    return success(data);
  });
}

export async function DELETE(request: NextRequest) {
  return withHandler(async () => {
    const user = await requireOwnerOrAdmin();
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");

    if (!id) {
      throw new ValidationError("Availability ID is required");
    }

    await deleteAvailability(id, user.id, user.role);
    return success({ message: "Availability deleted successfully" });
  });
}
