"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/format";
import { WhatsAppIcon } from "./Icons";

type Option = { slug: string; name: string; unit: string };

const BUSINESS_TYPES = ["Hospital", "Clinic", "Salon / Barber", "Spa / Beauty centre", "Restaurant / Food", "Distributor", "Other"];

export function BulkQuoteForm({ whatsapp, products, preselect }: { whatsapp: string; products: Option[]; preselect?: string }) {
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

  function submit(e: React.FormEvent) {
    e.preventDefault();
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
    window.open(whatsappLink(whatsapp, text), "_blank", "noopener,noreferrer");
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

      <button type="submit" className="btn-primary w-full py-3.5 sm:w-auto">
        <WhatsAppIcon className="h-5 w-5" /> Send quote request
      </button>
    </form>
  );
}
