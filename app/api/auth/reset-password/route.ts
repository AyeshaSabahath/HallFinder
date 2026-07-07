import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { success, withHandler } from "@/lib/api/response";
import { ValidationError } from "@/lib/api/errors";

export async function POST(request: NextRequest) {
  return withHandler(async () => {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Validation failed", parsed.error.errors);
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
      password: parsed.data.password,
    });

    if (error) {
      throw new ValidationError(error.message);
    }

    return success({ message: "Password updated successfully" });
  });
}
