"use server";

import { createServiceClient, isServiceConfigured } from "@/lib/supabase/service";

export type QuoteInput = {
  name: string;
  business: string;
  type: string;
  phone: string;
  city: string;
  products: string;
  message: string;
};

const clean = (s: unknown, max: number) => String(s ?? "").trim().slice(0, max);

// Saves a bulk quote request so it shows up in the admin panel.
export async function saveQuote(input: QuoteInput): Promise<{ ok: boolean; error?: string }> {
  if (!isServiceConfigured) return { ok: false, error: "Quotes can't be saved right now. Please send it on WhatsApp." };

  const row = {
    name: clean(input.name, 120),
    business_name: clean(input.business, 160) || null,
    business_type: clean(input.type, 60) || null,
    phone: clean(input.phone, 30),
    city: clean(input.city, 80) || null,
    products: clean(input.products, 4000),
    message: clean(input.message, 2000) || null,
  };
  if (!row.name || !row.phone) return { ok: false, error: "Please enter your name and phone number." };
  const digits = row.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13) return { ok: false, error: "Please enter a valid phone number, e.g. 0300 1234567." };
  if (!row.products) return { ok: false, error: "Please tick at least one product." };

  const { error } = await createServiceClient().from("quote_requests").insert(row);
  if (error) return { ok: false, error: "Something went wrong. Please send your request on WhatsApp instead." };
  return { ok: true };
}
