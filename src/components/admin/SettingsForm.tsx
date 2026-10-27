"use client";

import { useActionState } from "react";
import { saveSettings, type ActionState } from "@/app/admin/actions";
import type { StoreSettings } from "@/lib/types";
import { Card, Notice } from "./ui";

type Field = { key: keyof StoreSettings; label: string; hint?: string; placeholder?: string; wide?: boolean; numeric?: boolean };

const SECTIONS: { title: string; text?: string; fields: Field[] }[] = [
  {
    title: "Contact",
    fields: [
      { key: "whatsapp", label: "WhatsApp number", hint: "Orders and the green chat button go here.", placeholder: "923001455129" },
      { key: "phone", label: "Phone number shown on the site", placeholder: "+92 300 1455129" },
      { key: "email", label: "Email" },
      { key: "address", label: "Address", wide: true },
    ],
  },
  {
    title: "Delivery",
    text: "Delivery in the free city is always free. For other cities, set a flat charge, or leave it at 0 and confirm the charge with the customer after the order.",
    fields: [
      { key: "free_delivery_city", label: "Free delivery city", placeholder: "Lahore" },
      { key: "delivery_fee", label: "Charge for other cities (Rs)", hint: "0 = confirm per order", numeric: true },
      { key: "free_delivery_min", label: "Free delivery everywhere above (Rs)", hint: "0 = off", numeric: true },
    ],
  },
  {
    title: "Bank transfer",
    text: "Shown to customers who pick bank transfer. If empty, they are told you will send the details on WhatsApp.",
    fields: [
      { key: "bank_name", label: "Bank name", placeholder: "e.g. Meezan Bank" },
      { key: "bank_account_title", label: "Account title" },
      { key: "bank_account_no", label: "Account number" },
      { key: "bank_iban", label: "IBAN" },
    ],
  },
  {
    title: "JazzCash & Easypaisa",
    text: "Same here: if a number is empty, customers are told you will send it on WhatsApp.",
    fields: [
      { key: "jazzcash_no", label: "JazzCash number" },
      { key: "jazzcash_name", label: "JazzCash account name" },
      { key: "easypaisa_no", label: "Easypaisa number" },
      { key: "easypaisa_name", label: "Easypaisa account name" },
    ],
  },
  {
    title: "Social media & banner",
    fields: [
      { key: "facebook_url", label: "Facebook page link", placeholder: "facebook.com/…" },
      { key: "instagram_url", label: "Instagram link", placeholder: "instagram.com/…" },
      { key: "announcement", label: "Top banner text", hint: "The thin strip at the very top of every page. Empty hides it.", wide: true },
    ],
  },
];

export function SettingsForm({ settings }: { settings: StoreSettings }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveSettings, {});

  return (
    <form action={action} className="max-w-3xl space-y-6">
      {SECTIONS.map((s) => (
        <Card key={s.title}>
          <h2 className="text-lg font-bold text-navy-900">{s.title}</h2>
          {s.text && <p className="mt-1 text-sm text-muted">{s.text}</p>}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {s.fields.map((f) => (
              <div key={f.key} className={f.wide ? "sm:col-span-2" : ""}>
                <label className="label" htmlFor={f.key}>{f.label}</label>
                <input
                  id={f.key}
                  name={f.key}
                  className="field"
                  inputMode={f.numeric ? "numeric" : undefined}
                  defaultValue={String(settings[f.key] ?? "")}
                  placeholder={f.placeholder}
                  required={f.key === "whatsapp"}
                />
                {f.hint && <p className="mt-1 text-xs text-muted">{f.hint}</p>}
              </div>
            ))}
          </div>
        </Card>
      ))}

      <div className="sticky bottom-0 -mx-1 space-y-3 bg-slate-50/95 px-1 py-4 backdrop-blur">
        {state.error && <Notice tone="red">{state.error}</Notice>}
        {state.message && <Notice>{state.message}</Notice>}
        <button type="submit" disabled={pending} className="btn-primary w-full py-3.5 sm:w-auto sm:px-10">
          {pending ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}
