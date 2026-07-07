import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/api/auth";
import { loginSchema } from "@/lib/validations/auth";
import { success, withHandler } from "@/lib/api/response";
import { ValidationError, UnauthorizedError } from "@/lib/api/errors";

export async function POST(request: NextRequest) {
  return withHandler(async () => {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Validation failed", parsed.error.errors);
    }

    const { email, password } = parsed.data;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedError(error.message);
    }

    const user = await getAuthenticatedUser();
    if (!user) {
      throw new UnauthorizedError("Failed to establish session");
    }

    return success({
      message: "Login successful",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  });
}
