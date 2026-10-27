import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";
import { LogoMark } from "@/components/Logo";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Log in" };

const ERRORS: Record<string, string> = {
  "not-admin": "This account isn't allowed into the admin panel.",
  "link-expired": "That link has expired. Request a new reset link below.",
};

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { error } = await searchParams;
  const notice = typeof error === "string" ? ERRORS[error] : undefined;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-950 px-4 py-16">
      <div className="bg-grid absolute inset-0" aria-hidden />
      <div className="absolute -top-40 -right-40 h-[480px] w-[480px] rounded-full bg-brand-600/40 blur-3xl" aria-hidden />
      <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
        <div className="flex items-center gap-3">
          <LogoMark className="h-12 w-12" />
          <div>
            <p className="text-lg font-extrabold text-navy-900">Disposable Wears</p>
            <p className="text-sm text-muted">Admin panel</p>
          </div>
        </div>

        {isSupabaseConfigured ? (
          <LoginForm notice={notice} />
        ) : (
          <p className="mt-8 rounded-2xl bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
            The database isn&apos;t connected yet, so the admin panel can&apos;t be used. Follow the Supabase steps in the
            README, then reload this page.
          </p>
        )}

        <Link href="/" className="mt-8 block text-center text-sm font-semibold text-brand-600 hover:underline">
          ← Back to the shop
        </Link>
      </div>
    </div>
  );
}
