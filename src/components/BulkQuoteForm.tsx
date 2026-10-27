"use client";

import { useState, useTransition } from "react";
import { saveQuote } from "@/app/(shop)/bulk-orders/actions";
import { whatsappLink } from "@/lib/format";
import { CheckIcon, WhatsAppIcon } from "./Icons";

type Option = { slug: string; name: string; unit: string };

const BUSINESS_TYPES = ["Hospital", "Clinic", "Salon / Barber", "Spa / Beauty centre", "Restaurant / Food", "Distributor", "Other"];

export function BulkQuoteForm({
  whatsapp,
  products,
  preselect,
  saves,
}: {
  whatsapp: string;
  products: Option[];
  preselect?: string;
  saves: boolean; // true when the store database is connected
}) {
  const [qty, setQty] = useState<Record<string, string>>(() => (preselect ? { [preselect]: "" } : {}));
  const [form, setForm] = useState({ name: "", business: "", type: "", phone: "", city: "", message: "" });
  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const toggle = (slug: string) =>
    setQty((q) => {
      const next = { ...q };
      if (slug in next) delete next[slug];
      else next[slug] = "";
      return next;
    });

  const [sent, setSent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const lines = products
      .filter((p) => p.slug in qty)
      .map((p) => `• ${p.name}: ${qty[p.slug] || "?"} (${p.unit})`)
      .join("\n");
    const text =
      `Bulk quote request\n\n` +
      `Name: ${form.name}\n` +
      (form.business ? `Business: ${form.business}${form.type ? ` (${form.type})` : ""}\n` : "") +
      `Phone: ${form.phone}\nCity: ${form.city}\n\n` +
      `Products:\n${lines || "Not selected"}\n` +
      (form.message ? `\nNotes: ${form.message}` : "");

    if (!saves) {
      window.open(whatsappLink(whatsapp, text), "_blank", "noopener,noreferrer");
      return;
    }
    if (!lines) {
      setError("Please tick at least one product.");
      return;
    }
    startTransition(async () => {
      const res = await saveQuote({ ...form, products: lines });
      if (res.ok) setSent(text);
      else setError(res.error ?? "Something went wrong.");
    });
  }

  if (sent) {
    return (
      <div className="py-6 text-center" role="status">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckIcon className="h-7 w-7" />
        </span>
        <h2 className="mt-4 text-2xl font-bold text-navy-900">Request received</h2>
        <p className="mx-auto mt-2 max-w-md text-muted">
          Thank you, {form.name.split(" ")[0]}. We&apos;ll call or WhatsApp you on {form.phone} with prices soon.
        </p>
        <a href={whatsappLink(whatsapp, sent)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp mt-6 px-6 py-3">
          <WhatsAppIcon className="h-5 w-5" /> Need it fast? Send on WhatsApp too
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <fieldset>
        <legend className="text-lg font-bold text-navy-900">1. What do you need?</legend>
        <p className="mt-1 text-sm text-muted">Tick the products and add a rough quantity for each.</p>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {products.map((p) => {
            const on = p.slug in qty;
            return (
              <div
                key={p.slug}
                className={`rounded-2xl border p-3.5 transition ${on ? "border-brand-500 bg-brand-50/60" : "border-line"}`}
              >
                <label className="flex cursor-pointer items-start gap-3">
                  <input type="checkbox" checked={on} onChange={() => toggle(p.slug)} className="mt-1 h-4 w-4 accent-brand-600" />
                  <span>
                    <span className="block text-sm font-semibold text-ink">{p.name}</span>
                    <span className="block text-xs text-muted">{p.unit}</span>
                  </span>
                </label>
                {on && (
                  <input
                    className="field mt-3 py-2 text-sm"
                    placeholder="Quantity, e.g. 50 packs"
                    value={qty[p.slug]}
                    onChange={(e) => setQty((q) => ({ ...q, [p.slug]: e.target.value }))}
                    aria-label={`Quantity for ${p.name}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-lg font-bold text-navy-900">2. Your details</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="q-name">Your name</label>
            <input id="q-name" className="field" required value={form.name} onChange={update("name")} autoComplete="name" />
          </div>
          <div>
            <label className="label" htmlFor="q-phone">Phone / WhatsApp</label>
            <input id="q-phone" className="field" required type="tel" placeholder="03xx xxxxxxx" value={form.phone} onChange={update("phone")} autoComplete="tel" />
          </div>
          <div>
            <label className="label" htmlFor="q-business">Business name <span className="font-normal text-muted">(optional)</span></label>
            <input id="q-business" className="field" value={form.business} onChange={update("business")} autoComplete="organization" />
          </div>
          <div>
            <label className="label" htmlFor="q-type">Type of business</label>
            <select id="q-type" className="field" value={form.type} onChange={update("type")}>
              <option value="">Select…</option>
              {BUSINESS_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="q-city">City</label>
            <input id="q-city" className="field" required value={form.city} onChange={update("city")} autoComplete="address-level2" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="q-msg">Anything else? <span className="font-normal text-muted">(optional)</span></label>
          <textarea id="q-msg" className="field min-h-28" placeholder="Delivery timing, monthly supply, colours…" value={form.message} onChange={update("message")} />
        </div>
      </fieldset>

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-primary w-full py-3.5 sm:w-auto">
        {saves ? null : <WhatsAppIcon className="h-5 w-5" />}
        {pending ? "Sending…" : "Send quote request"}
      </button>
    </form>
  );
}
