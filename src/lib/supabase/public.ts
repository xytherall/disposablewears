import { createClient } from "@supabase/supabase-js";
import { SUPABASE_PUBLIC_KEY, SUPABASE_URL } from "./config";

// Read-only client for public shop data. It carries no user session, so
// pages that use it can still be cached.
export function createPublicClient() {
  return createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
