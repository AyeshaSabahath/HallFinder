import { createClient } from "@/lib/supabase/server";
import { success, withHandler } from "@/lib/api/response";

export async function POST() {
  return withHandler(async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return success({ message: "Logged out successfully" });
  });
}
