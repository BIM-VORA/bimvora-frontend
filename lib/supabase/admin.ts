import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/configured";

/** Server-only. Never import this into a Client Component. */
export function createAdminClient() {
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRole) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }

  return createClient(getSupabaseUrl(), serviceRole, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
