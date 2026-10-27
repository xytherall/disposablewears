"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { CartIcon, CloseIcon, MenuIcon } from "./Icons";
import { Logo } from "./Logo";

const NAV = [
  { href: "/products", label: "Products" },
  { href: "/bulk-orders", label: "Bulk Orders" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQs" },
  { href: "/contact", label: "Contact" },
];

export function Header({ announcement }: { announcement: string }) {
  const { count, ready } = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {announcement && (
        <div className="overflow-hidden bg-night px-4 py-2 text-center text-white">
          <p className="tag leading-relaxed text-[10px] text-white/80 sm:text-[11px]">{announcement}</p>
        </div>
      )}
      <header className="sticky top-0 z-30 px-3 pt-3 sm:px-5">
        <div className="glass mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 rounded-full pr-2 pl-4 sm:h-16 sm:pl-5">
          <Link href="/" aria-label="Disposable Wears home" onClick={() => setOpen(false)}>
            <Logo />
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3.5 py-2 text-[15px] font-semibold transition ${
                    active ? "bg-night text-white" : "text-night hover:bg-white/80"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <Link href="/bulk-orders" className="btn-volt hidden py-2.5 text-sm lg:inline-flex">
              Bulk quote
            </Link>
            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-night text-white transition hover:bg-volt sm:h-11 sm:w-11"
              aria-label={`Cart, ${count} items`}
            >
              <CartIcon className="h-5 w-5" />
              {ready && count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-volt px-1 text-[11px] font-bold text-white ring-2 ring-white">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full text-night hover:bg-white/80 md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="glass mx-auto mt-2 max-w-6xl rounded-3xl p-2 md:hidden">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-display block rounded-2xl px-4 py-3 text-xl font-bold tracking-tight text-night hover:bg-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
