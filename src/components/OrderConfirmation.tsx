"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import type { PlaceOrderResult } from "@/app/(shop)/checkout/actions";
import { PAYMENT_LABELS, deliveryLabel, formatPKR, orderLabel, whatsappLink } from "@/lib/format";
import { LAST_ORDER_KEY } from "./CheckoutForm";
import { CheckIcon, WhatsAppIcon } from "./Icons";

type Placed = Extract<PlaceOrderResult, { ok: true }>;

function readOrder(): string | null {
  try {
    return sessionStorage.getItem(LAST_ORDER_KEY);
  } catch {
    return null;
  }
}

export function OrderConfirmation({ whatsapp }: { whatsapp: string }) {
  const raw = useSyncExternalStore(
    () => () => {},
    readOrder,
    () => undefined,
  );
  if (raw === undefined) return <div className="h-96 animate-pulse rounded-3xl bg-brand-50" />;

  let order: Placed | null = null;
  try {
    order = raw ? (JSON.parse(raw) as Placed) : null;
  } catch {
    order = null;
  }

  if (!order) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-navy-900">Thank you!</h1>
        <p className="mt-3 text-muted">If you just placed an order, we&apos;ll be in touch soon to confirm it.</p>
        <Link href="/products" className="btn-primary mt-8">Continue shopping</Link>
      </div>
    );
  }

  const label = order.orderNo ? orderLabel(order.orderNo) : null;
  const message =
    `Hi Disposable Wears, ${label ? `I just placed order ${label}` : "I'd like to place this order"}:\n\n` +
    order.lines.map((l) => `• ${l.product} (${l.variant}) × ${l.quantity} = ${formatPKR(l.price * l.quantity)}`).join("\n") +
    `\n\nDelivery: ${deliveryLabel(order.delivery)}` +
    `\nTotal: ${formatPKR(order.total)}${order.delivery === null ? " + delivery" : ""}` +
    `\nPayment: ${PAYMENT_LABELS[order.paymentMethod]}` +
    `\n\nName: ${order.customer.name}\nPhone: ${order.customer.phone}\nAddress: ${order.customer.address}, ${order.customer.city}`;

  return (
    <div>
      <div className="text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50">
          <CheckIcon className="h-10 w-10" />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
          {label ? "Thank you, your order is placed!" : "Almost done!"}
        </h1>
        {label ? (
          <p className="mt-3 text-lg text-muted">
            Your order number is <span className="font-bold text-navy-900">{label}</span>. We&apos;ll call or WhatsApp you on{" "}
            {order.customer.phone} to confirm.
          </p>
        ) : (
          <p className="mt-3 text-lg text-muted">Send your order to us on WhatsApp to confirm it. Everything is already filled in.</p>
        )}
      </div>

      <div className="mt-10 rounded-3xl border border-line p-6 sm:p-8">
        <h2 className="text-lg font-bold text-navy-900">Order details</h2>
        <ul className="mt-4 divide-y divide-line">
          {order.lines.map((l, i) => (
            <li key={i} className="flex justify-between gap-4 py-3 text-[15px]">
              <span>
                <span className="font-semibold text-ink">{l.product}</span>
                <span className="text-muted"> · {l.variant} × {l.quantity}</span>
              </span>
              <span className="font-semibold whitespace-nowrap">{formatPKR(l.price * l.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-2 space-y-2 border-t border-line pt-4 text-[15px]">
          <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>{deliveryLabel(order.delivery)}</dd></div>
          <div className="flex justify-between text-lg font-extrabold text-navy-900"><dt>Total</dt><dd>{formatPKR(order.total)}{order.delivery === null && <span className="text-sm font-medium text-muted"> + delivery</span>}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Payment</dt><dd className="font-semibold">{PAYMENT_LABELS[order.paymentMethod]}</dd></div>
          <div className="flex justify-between gap-6"><dt className="text-muted">Deliver to</dt><dd className="text-right">{order.customer.address}, {order.customer.city}</dd></div>
        </dl>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a href={whatsappLink(whatsapp, message)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp flex-1 py-3.5">
          <WhatsAppIcon className="h-5 w-5" /> {label ? "Send order details on WhatsApp" : "Send order on WhatsApp"}
        </a>
        <Link href="/products" className="btn-outline flex-1 py-3.5">Continue shopping</Link>
      </div>
    </div>
  );
}
