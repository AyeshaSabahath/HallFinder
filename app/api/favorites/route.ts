import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/api/auth";
import { favoriteSchema } from "@/lib/validations/favorite";
import {
  getUserFavorites,
  addFavorite,
  removeFavorite,
} from "@/services/favorite-service";
import { success, withHandler } from "@/lib/api/response";
import { ValidationError } from "@/lib/api/errors";

export async function GET() {
  return withHandler(async () => {
    const user = await requireAuth();
    const favorites = await getUserFavorites(user.id);
    return success(favorites);
  });
}

export async function POST(request: NextRequest) {
  return withHandler(async () => {
    const user = await requireAuth();
    const body = await request.json();
    const parsed = favoriteSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Validation failed", parsed.error.errors);
    }

    await addFavorite(user.id, parsed.data.hallId);
    return success({ message: "Added to favorites" }, 201);
  });
}

export async function DELETE(request: NextRequest) {
  return withHandler(async () => {
    const user = await requireAuth();
    const body = await request.json();
    const parsed = favoriteSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Validation failed", parsed.error.errors);
    }

    await removeFavorite(user.id, parsed.data.hallId);
    return success({ message: "Removed from favorites" });
  });
}
