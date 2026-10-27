import "server-only";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "./supabase/config";
import { createSessionClient } from "./supabase/server";

// Every admin page and admin action calls this first. The database's own
// security rules (is_admin) check the same thing again.
export async function requireAdmin() {
  if (!isSupabaseConfigured) redirect("/admin/login");
  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) redirect("/admin/login");

  const { data } = await supabase.from("admins").select("email").ilike("email", user.email).maybeSingle();
  if (!data) redirect("/admin/login?error=not-admin");

  return { supabase, user };
}
