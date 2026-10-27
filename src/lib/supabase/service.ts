import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./config";

const SECRET_KEY = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const isServiceConfigured = Boolean(SUPABASE_URL && SECRET_KEY);

// Full-access client used only on the server, to save orders and quote
// requests. Never import this into a client component.
export function createServiceClient() {
  return createClient(SUPABASE_URL, SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
