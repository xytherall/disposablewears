import Link from "next/link";
import { CATEGORIES } from "@/lib/catalog";
import { whatsappLink } from "@/lib/format";
import type { StoreSettings } from "@/lib/types";
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./Icons";
import { Logo } from "./Logo";

export function Footer({ settings }: { settings: StoreSettings }) {
  return (
    <footer className="mt-24 overflow-hidden rounded-t-[2.5rem] bg-night text-white/70 sm:mt-32">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Disposable hygiene products for hospitals, clinics, salons and spas. Because your safety matters.
          </p>
          {(settings.facebook_url || settings.instagram_url) && (
            <div className="mt-5 flex gap-3">
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-volt">
                  <FacebookIcon />
                </a>
              )}
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-volt">
                  <InstagramIcon />
                </a>
              )}
            </div>
          )}
        </div>

        <div>
          <h3 className="tag text-white/40">Shop</h3>
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
          <h3 className="tag text-white/40">Help</h3>
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
          <h3 className="tag text-white/40">Contact</h3>
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
      <div className="container-page" aria-hidden>
        <p className="font-display text-[15.5vw] leading-[0.8] font-extrabold tracking-[-0.06em] text-white/[0.06] select-none lg:text-[10.6rem]">
          Disposable<span className="text-volt/60">.</span>
        </p>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page tag flex flex-col gap-2 py-5 text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Disposable Wears. All rights reserved.</p>
          <p>Delivering across Pakistan</p>
        </div>
      </div>
    </footer>
  );
}
