import Link from "next/link";
import { CATEGORIES } from "@/lib/catalog";
import { whatsappLink } from "@/lib/format";
import type { StoreSettings } from "@/lib/types";
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./Icons";
import { Logo } from "./Logo";

export function Footer({ settings }: { settings: StoreSettings }) {
  return (
    <footer className="mt-20 bg-navy-950 text-blue-100">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 text-sm leading-relaxed text-blue-200/80">
            Disposable hygiene products for hospitals, clinics, salons and spas. Because your safety matters.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wide text-white uppercase">Shop</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/products?category=${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wide text-white uppercase">Help</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/bulk-orders" className="hover:text-white">Bulk orders & quotes</Link></li>
            <li><Link href="/faq" className="hover:text-white">FAQs</Link></li>
            <li><Link href="/policies#delivery" className="hover:text-white">Delivery</Link></li>
            <li><Link href="/policies#returns" className="hover:text-white">Returns</Link></li>
            <li><Link href="/policies#privacy" className="hover:text-white">Privacy</Link></li>
            <li><Link href="/policies#terms" className="hover:text-white">Terms</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wide text-white uppercase">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="flex items-center gap-2.5 hover:text-white">
                <PhoneIcon className="h-4 w-4 shrink-0" /> {settings.phone}
              </a>
            </li>
            <li>
              <a href={whatsappLink(settings.whatsapp)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-white">
                <WhatsAppIcon className="h-4 w-4 shrink-0" /> WhatsApp us
              </a>
            </li>
            <li>
              <a href={`mailto:${settings.email}`} className="flex items-center gap-2.5 break-all hover:text-white">
                <MailIcon className="h-4 w-4 shrink-0" /> {settings.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <PinIcon className="mt-0.5 h-4 w-4 shrink-0" /> {settings.address}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-blue-200/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Disposable Wears. All rights reserved.</p>
          <p>Delivering across Pakistan</p>
        </div>
      </div>
    </footer>
  );
}
