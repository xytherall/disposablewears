import { PasswordForm } from "@/components/admin/PasswordForm";
import { Card, PageTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin";

export const metadata = { title: "My account" };

export default async function AdminAccountPage() {
  const { user } = await requireAdmin();
  return (
    <>
      <PageTitle title="My account" />
      <div className="grid max-w-xl gap-6">
        <Card>
          <p className="text-sm text-muted">Signed in as</p>
          <p className="mt-1 font-semibold break-all text-navy-900">{user.email}</p>
        </Card>
        <PasswordForm />
      </div>
    </>
  );
}
