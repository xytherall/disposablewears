"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/app/admin/login/actions";
import { CloseIcon, MenuIcon } from "../Icons";
import { LogoMark } from "../Logo";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/quotes", label: "Bulk quotes" },
  { href: "/admin/settings", label: "Store settings" },
  { href: "/admin/account", label: "My account" },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`rounded-xl px-4 py-2.5 text-[15px] font-semibold transition ${
              active ? "bg-white/10 text-white" : "text-blue-100/75 hover:bg-white/5 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="space-y-3 border-t border-white/10 pt-4">
      <Link href="/" target="_blank" className="block px-4 text-sm font-semibold text-blue-200 hover:text-white">
        View shop ↗
      </Link>
      <p className="truncate px-4 text-xs text-blue-200/60">{email}</p>
      <form action={signOut}>
        <button type="submit" className="w-full rounded-xl px-4 py-2 text-left text-sm font-semibold text-blue-100/75 hover:bg-white/5 hover:text-white">
          Log out
        </button>
      </form>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-navy-950 px-4 py-3 text-white lg:hidden">
        <Link href="/admin" className="flex items-center gap-2 font-bold">
          <span className="rounded-lg bg-white p-0.5"><LogoMark className="h-8 w-8" /></span> Admin
        </Link>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-label={open ? "Close menu" : "Open menu"} className="rounded-lg p-2 hover:bg-white/10">
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
      {open && (
        <div className="space-y-4 bg-navy-950 px-3 pb-4 lg:hidden">
          {links}
          {footer}
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between bg-navy-950 p-4 lg:flex">
        <div>
          <Link href="/admin" className="mb-8 flex items-center gap-3 px-2 pt-2 text-white">
            <span className="rounded-xl bg-white p-1"><LogoMark className="h-9 w-9" /></span>
            <span className="leading-tight">
              <span className="block font-extrabold">Disposable Wears</span>
              <span className="block text-xs text-blue-200/70">Admin panel</span>
            </span>
          </Link>
          {links}
        </div>
        {footer}
      </aside>
    </>
  );
}
