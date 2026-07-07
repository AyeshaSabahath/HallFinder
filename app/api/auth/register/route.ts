import { NextRequest } from "next/server";
import { Role } from "@prisma/client";
import { createClient } from "@/lib/supabase/server";
import { syncUserFromSupabase } from "@/lib/api/auth";
import { registerSchema } from "@/lib/validations/auth";
import { success, withHandler } from "@/lib/api/response";
import { ValidationError } from "@/lib/api/errors";

export async function POST(request: NextRequest) {
  return withHandler(async () => {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Validation failed", parsed.error.errors);
    }

    const { fullName, email, password, phone, role } = parsed.data;
    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { fullName, role, phone },
      },
    });

    if (authError) {
      throw new ValidationError(authError.message);
    }

    if (authData.user) {
      const user = await syncUserFromSupabase(
        authData.user.id,
        email,
        fullName,
        role as Role,
        phone
      );

      return success(
        {
          message: "Registration successful. Please check your email to verify.",
          user: { id: user.id, email: user.email, role: user.role },
        },
        201
      );
    }

    throw new ValidationError("Registration failed");
  });
}
