"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/format";
import { WhatsAppIcon } from "./Icons";

export function ContactForm({ whatsapp }: { whatsapp: string }) {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = `Hi Disposable Wears,\n\n${form.message}\n\nName: ${form.name}\nPhone: ${form.phone}`;
    window.open(whatsappLink(whatsapp, text), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="c-name">Your name</label>
          <input id="c-name" className="field" required value={form.name} onChange={update("name")} autoComplete="name" />
        </div>
        <div>
          <label className="label" htmlFor="c-phone">Phone</label>
          <input id="c-phone" className="field" required type="tel" placeholder="03xx xxxxxxx" value={form.phone} onChange={update("phone")} autoComplete="tel" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="c-msg">Message</label>
        <textarea id="c-msg" className="field min-h-32" required value={form.message} onChange={update("message")} />
      </div>
      <button type="submit" className="btn-whatsapp w-full sm:w-auto">
        <WhatsAppIcon className="h-5 w-5" /> Send on WhatsApp
      </button>
    </form>
  );
}
