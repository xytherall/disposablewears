"use client";

import Link from "next/link";
import { deliveryFeeFor, formatPKR, whatsappLink } from "@/lib/format";
import type { StoreSettings } from "@/lib/types";
import { useCart } from "./CartProvider";
import { CartLineImage } from "./CartLineImage";
import { ArrowRightIcon, CartIcon, TrashIcon, WhatsAppIcon } from "./Icons";
import { OrderSummary } from "./OrderSummary";
import { QuantityStepper } from "./QuantityStepper";

export function CartView({ settings }: { settings: StoreSettings }) {
  const { items, ready, subtotal, setQuantity, remove } = useCart();

  if (!ready) return <div className="mt-10 h-64 animate-pulse rounded-3xl bg-brand-50" />;

  if (items.length === 0) {
    return (
      <div className="mt-10 rounded-3xl border border-dashed border-line px-6 py-20 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <CartIcon className="h-8 w-8" />
        </span>
        <h2 className="mt-5 text-xl font-bold text-navy-900">Your cart is empty</h2>
        <p className="mt-2 text-muted">Browse our products and add what you need.</p>
        <Link href="/products" className="btn-primary mt-6">
          Shop products <ArrowRightIcon />
        </Link>
      </div>
    );
  }

  // The city isn't known yet in the cart; free delivery by amount can still apply.
  const delivery = deliveryFeeFor(subtotal, "", settings);
  const deliveryNote =
    delivery === 0
      ? undefined
      : [settings.free_delivery_city && `Free in ${settings.free_delivery_city}.`, "Calculated at checkout for your city."].filter(Boolean).join(" ");
  const waText =
    "Hi Disposable Wears, I'd like to order:\n" +
    items.map((i) => `• ${i.productName} (${i.variantName}) × ${i.quantity} = ${formatPKR(i.price * i.quantity)}`).join("\n") +
    `\n\nSubtotal: ${formatPKR(subtotal)}`;

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1.7fr_1fr]">
      <ul className="min-w-0 divide-y divide-line rounded-3xl border border-line">
        {items.map((item) => (
          <li key={item.variantId} className="flex items-start gap-3 p-4 sm:gap-5 sm:p-5">
            <Link href={`/products/${item.slug}`} className="bg-lab shrink-0 overflow-hidden rounded-2xl border border-night/[0.06] p-1.5">
              <CartLineImage item={item} className="block h-16 w-16 sm:h-24 sm:w-24" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <Link href={`/products/${item.slug}`} className="font-bold text-navy-900 hover:text-brand-700">
                  {item.productName}
                </Link>
                <p className="mt-0.5 text-sm text-muted">
                  {item.variantName} · {item.unit}
                </p>
                <p className="mt-1 text-sm font-semibold text-ink">{formatPKR(item.price)} each</p>
              </div>
              <div className="flex items-center justify-between gap-2 sm:justify-end sm:gap-4">
                <QuantityStepper value={item.quantity} onChange={(q) => setQuantity(item.variantId, q)} small />
                <p className="text-right font-extrabold whitespace-nowrap text-navy-900 sm:w-24">{formatPKR(item.price * item.quantity)}</p>
                <button
                  type="button"
                  onClick={() => remove(item.variantId)}
                  className="rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-600"
                  aria-label={`Remove ${item.productName}`}
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
        <OrderSummary subtotal={subtotal} delivery={delivery} deliveryNote={deliveryNote} freeDeliveryMin={settings.free_delivery_min}>
          <Link href="/checkout" className="btn-primary mt-6 w-full py-3.5">
            Proceed to checkout <ArrowRightIcon />
          </Link>
          <a href={whatsappLink(settings.whatsapp, waText)} target="_blank" rel="noopener noreferrer" className="btn-outline mt-3 w-full">
            <WhatsAppIcon className="h-5 w-5 text-whatsapp" /> Or order on WhatsApp
          </a>
        </OrderSummary>
        <Link href="/products" className="block text-center text-sm font-semibold text-brand-600 hover:underline">
          ← Continue shopping
        </Link>
      </div>
    </div>
  );
}
