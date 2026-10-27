import { SettingsForm } from "@/components/admin/SettingsForm";
import { PageTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";
import { DEFAULT_SETTINGS } from "@/lib/catalog";
import type { StoreSettings } from "@/lib/types";

export const metadata = { title: "Store settings" };

export default async function AdminSettingsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("store_settings").select("*").eq("id", 1).maybeSingle();
  const settings = { ...DEFAULT_SETTINGS, ...(data ?? {}) } as StoreSettings;

  return (
    <>
      <PageTitle title="Store settings" text="Contact details, delivery charges and payment accounts shown on the website." />
      <SettingsForm settings={settings} />
    </>
  );
}
