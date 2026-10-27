"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CloseIcon, MenuIcon } from "./Icons";
import { Logo } from "./Logo";

const NAV = [
  { href: "/products", label: "Products" },
  { href: "/bulk-orders", label: "Bulk Orders" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQs" },
  { href: "/contact", label: "Contact" },
];

export function Header({ announcement }: { announcement: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      {announcement && (
        <div className="bg-navy-900 px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">{announcement}</div>
      )}
      <div className="container-page flex h-16 items-center justify-between gap-4 sm:h-18">
        <Link href="/" aria-label="Disposable Wears home" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3.5 py-2 text-[15px] font-semibold transition ${
                  active ? "bg-brand-50 text-brand-700" : "text-ink hover:text-brand-700"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/bulk-orders" className="btn-dark hidden px-4 py-2.5 text-sm lg:inline-flex">
            Get a bulk quote
          </Link>
          <button
            type="button"
            className="rounded-xl p-2.5 text-navy-900 hover:bg-brand-50 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-white md:hidden">
          <div className="container-page flex flex-col py-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-base font-semibold text-ink hover:text-brand-700"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
