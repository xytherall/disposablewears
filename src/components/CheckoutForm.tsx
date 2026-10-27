"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { placeOrder } from "@/app/(shop)/checkout/actions";
import { PAYMENT_LABELS, PK_CITIES, deliveryFeeFor, formatPKR, paymentAccountReady } from "@/lib/format";
import type { PaymentMethod, StoreSettings } from "@/lib/types";
import { useCart } from "./CartProvider";
import { CartLineImage } from "./CartLineImage";
import { CashIcon, CheckIcon } from "./Icons";
import { OrderSummary } from "./OrderSummary";

export const LAST_ORDER_KEY = "dw-last-order";

const METHOD_HINTS: Record<PaymentMethod, string> = {
  cod: "Pay in cash when your order arrives",
  bank: "Transfer to our bank account",
  jazzcash: "Send to our JazzCash account",
  easypaisa: "Send to our Easypaisa account",
};

export function CheckoutForm({ settings }: { settings: StoreSettings }) {
  const { items, ready, subtotal, clear } = useCart();
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethod>("cod");
  const [city, setCity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!ready) return <div className="mt-10 h-96 animate-pulse rounded-3xl bg-brand-50" />;

  if (items.length === 0) {
    return (
      <div className="mt-10 rounded-3xl border border-dashed border-line px-6 py-16 text-center">
        <h2 className="text-xl font-bold text-navy-900">Your cart is empty</h2>
        <Link href="/products" className="btn-primary mt-6">Shop products</Link>
      </div>
    );
  }

  const delivery = deliveryFeeFor(subtotal, city, settings);
  const total = subtotal + (delivery ?? 0);
  const deliveryNote =
    delivery !== null
      ? undefined
      : city
        ? `We'll confirm the delivery charge for ${city} on call or WhatsApp before dispatch.`
        : settings.free_delivery_city
          ? `Free in ${settings.free_delivery_city}. Enter your city to see delivery.`
          : undefined;
  const accountReady = paymentAccountReady(method, settings);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    form.set("payment_method", method);
    form.set("items", JSON.stringify(items.map((i) => ({ variant_id: i.variantId, quantity: i.quantity }))));
    const file = form.get("payment_proof");
    if (file instanceof File && file.size > 3 * 1024 * 1024) {
      setError("The payment screenshot must be under 3 MB.");
      return;
    }
    startTransition(async () => {
      const result = await placeOrder(form);
      if (!result.ok) {
        setError(result.error);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      try {
        sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(result));
      } catch {
        // The confirmation page falls back to a generic thank-you.
      }
      clear();
      router.push("/order-confirmed");
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      <div className="min-w-0 space-y-6">
        {error && (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 font-medium text-red-700" role="alert">
            {error}
          </p>
        )}

        <Section step={1} title="Your details">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" name="name" required autoComplete="name" />
            <Field label="Phone / WhatsApp" name="phone" type="tel" required placeholder="03xx xxxxxxx" autoComplete="tel" />
            <Field label="Email" name="email" type="email" optional autoComplete="email" />
            <Field label="Business name" name="business_name" optional autoComplete="organization" />
          </div>
        </Section>

        <Section step={2} title="Delivery address">
          <div className="grid gap-4">
            <div>
              <label className="label" htmlFor="city">City</label>
              <input id="city" name="city" className="field" required list="pk-cities" autoComplete="address-level2" value={city} onChange={(e) => setCity(e.target.value)} />
              <datalist id="pk-cities">
                {PK_CITIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="label" htmlFor="address">Full address</label>
              <textarea id="address" name="address" className="field min-h-24" required placeholder="House / office, street, area" autoComplete="street-address" />
            </div>
            <div>
              <label className="label" htmlFor="notes">Order notes <span className="font-normal text-muted">(optional)</span></label>
              <textarea id="notes" name="notes" className="field min-h-20" placeholder="Delivery timing, landmark, anything else…" />
            </div>
          </div>
        </Section>

        <Section step={3} title="Payment">
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.keys(PAYMENT_LABELS) as PaymentMethod[]).map((m) => {
              const active = m === method;
              return (
                <label
                  key={m}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                    active ? "border-brand-600 bg-brand-50 ring-4 ring-brand-100" : "border-line hover:border-brand-500"
                  }`}
                >
                  <input type="radio" name="payment_method_choice" value={m} checked={active} onChange={() => setMethod(m)} className="sr-only" />
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${active ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-600"}`}>
                    <CashIcon className="h-5 w-5" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-bold text-navy-900">{PAYMENT_LABELS[m]}</span>
                    <span className="block text-sm text-muted">{METHOD_HINTS[m]}</span>
                  </span>
                  {active && <CheckIcon className="h-5 w-5 text-brand-600" />}
                </label>
              );
            })}
          </div>

          {method !== "cod" && (
            <div className="mt-5 rounded-2xl border border-line bg-brand-50/40 p-5">
              {accountReady ? (
                <>
                  <p className="font-semibold text-navy-900">
                    Send {formatPKR(total)}{delivery === null ? " (plus delivery, once confirmed)" : ""} to:
                  </p>
                  <AccountDetails method={method} settings={settings} />
                  <p className="mt-4 text-sm text-muted">Then add the transaction ID or upload a screenshot below. We&apos;ll confirm once we receive it.</p>
                </>
              ) : (
                <p className="text-sm text-ink">
                  We&apos;ll send you our {PAYMENT_LABELS[method]} details on WhatsApp after you place your order. You can share the
                  payment proof there.
                </p>
              )}
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Transaction ID" name="payment_reference" optional={!accountReady} placeholder="e.g. 0123456789" />
                <div>
                  <label className="label" htmlFor="payment_proof">Payment screenshot <span className="font-normal text-muted">(image or PDF)</span></label>
                  <input
                    id="payment_proof"
                    name="payment_proof"
                    type="file"
                    accept="image/*,application/pdf"
                    className="block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-navy-900 file:px-4 file:py-2.5 file:font-semibold file:text-white hover:file:bg-navy-950"
                  />
                </div>
              </div>
            </div>
          )}
        </Section>
      </div>

      <div className="min-w-0 space-y-4 lg:sticky lg:top-28 lg:self-start">
        <OrderSummary subtotal={subtotal} delivery={delivery} deliveryNote={deliveryNote} freeDeliveryMin={settings.free_delivery_min}>
          <ul className="mt-5 max-h-72 space-y-3 overflow-y-auto border-t border-line pt-5">
            {items.map((i) => (
              <li key={i.variantId} className="flex items-center gap-3">
                <span className="relative shrink-0 overflow-hidden rounded-xl border border-line">
                  <CartLineImage item={i} className="block h-14 w-14" />
                  <span className="absolute top-0 right-0 rounded-bl-lg bg-navy-900 px-1.5 text-[11px] font-bold text-white">{i.quantity}</span>
                </span>
                <span className="min-w-0 flex-1 text-sm">
                  <span className="block truncate font-semibold text-ink">{i.productName}</span>
                  <span className="block text-muted">{i.variantName}</span>
                </span>
                <span className="text-sm font-semibold">{formatPKR(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <button type="submit" disabled={pending} className="btn-primary mt-6 w-full py-4 text-base">
            {pending ? "Placing order…" : `Place order · ${formatPKR(total)}`}
          </button>
          <p className="mt-3 text-center text-xs text-muted">
            By placing your order you agree to our <Link href="/policies" className="underline">policies</Link>.
          </p>
        </OrderSummary>
        <Link href="/cart" className="block text-center text-sm font-semibold text-brand-600 hover:underline">
          ← Back to cart
        </Link>
      </div>
    </form>
  );
}

function Section({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-line p-5 sm:p-7">
      <h2 className="mb-5 flex items-center gap-3 text-lg font-bold text-navy-900">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-sm text-white">{step}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({
  label,
  name,
  optional,
  ...props
}: { label: string; name: string; optional?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label} {optional && <span className="font-normal text-muted">(optional)</span>}
      </label>
      <input id={name} name={name} className="field" {...props} />
    </div>
  );
}

function AccountDetails({ method, settings: s }: { method: PaymentMethod; settings: StoreSettings }) {
  const rows =
    method === "bank"
      ? [
          ["Bank", s.bank_name],
          ["Account title", s.bank_account_title],
          ["Account number", s.bank_account_no],
          ["IBAN", s.bank_iban],
        ]
      : method === "jazzcash"
        ? [["JazzCash number", s.jazzcash_no], ["Account name", s.jazzcash_name]]
        : [["Easypaisa number", s.easypaisa_no], ["Account name", s.easypaisa_name]];
  return (
    <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
      {rows
        .filter(([, v]) => v)
        .map(([k, v]) => (
          <div key={k}>
            <dt className="text-muted">{k}</dt>
            <dd className="font-bold break-all text-navy-900 select-all">{v}</dd>
          </div>
        ))}
    </dl>
  );
}
