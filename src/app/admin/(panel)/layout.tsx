import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin";

// Admin pages always show live data for the signed-in owner.
export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();
  return (
    <div className="min-h-screen lg:flex">
      <AdminNav email={user.email ?? ""} />
      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-10">{children}</div>
      </div>
    </div>
  );
}
