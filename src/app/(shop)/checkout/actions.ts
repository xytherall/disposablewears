"use server";

import { randomUUID } from "node:crypto";
import { SEED_PRODUCTS } from "@/lib/catalog";
import { getSettings } from "@/lib/data";
import { deliveryFeeFor, paymentAccountReady } from "@/lib/format";
import { sendOrderAlert } from "@/lib/notify";
import { createServiceClient, isServiceConfigured } from "@/lib/supabase/service";
import type { PaymentMethod } from "@/lib/types";

export type PlacedLine = { product: string; variant: string; unit: string; price: number; quantity: number };

export type PlaceOrderResult =
  | { ok: false; error: string }
  | {
      ok: true;
      orderNo: number | null; // null while the database isn't connected yet
      lines: PlacedLine[];
      subtotal: number;
      delivery: number | null;
      total: number;
      paymentMethod: PaymentMethod;
      customer: { name: string; phone: string; city: string; address: string };
    };

const METHODS: PaymentMethod[] = ["cod", "bank", "jazzcash", "easypaisa"];
const MAX_PROOF_BYTES = 3 * 1024 * 1024;
const PROOF_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "application/pdf": "pdf",
};
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function text(form: FormData, key: string, max = 300) {
  return String(form.get(key) ?? "").trim().slice(0, max);
}

export async function placeOrder(form: FormData): Promise<PlaceOrderResult> {
  const customer = {
    name: text(form, "name", 120),
    phone: text(form, "phone", 30),
    email: text(form, "email", 160),
    business_name: text(form, "business_name", 160),
    city: text(form, "city", 80),
    address: text(form, "address", 500),
    notes: text(form, "notes", 1000),
  };
  const method = text(form, "payment_method") as PaymentMethod;
  const reference = text(form, "payment_reference", 120);
  const proof = form.get("payment_proof");

  if (!customer.name || !customer.city || !customer.address) {
    return { ok: false, error: "Please fill in your name, city and full address." };
  }
  const digits = customer.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13) {
    return { ok: false, error: "Please enter a valid phone number, e.g. 0300 1234567." };
  }
  if (customer.email && !/^\S+@\S+\.\S+$/.test(customer.email)) {
    return { ok: false, error: "Please check your email address." };
  }
  if (!METHODS.includes(method)) {
    return { ok: false, error: "Please choose a payment method." };
  }

  const settings = await getSettings();
  const hasProof = proof instanceof File && proof.size > 0;
  // Proof is only required once the owner has put the account details on the site.
  if (method !== "cod" && paymentAccountReady(method, settings) && !reference && !hasProof) {
    return { ok: false, error: "Please add the transaction ID or upload a screenshot of your payment." };
  }
  if (hasProof && (proof.size > MAX_PROOF_BYTES || !PROOF_TYPES[proof.type])) {
    return { ok: false, error: "The payment screenshot must be an image or PDF under 3 MB." };
  }

  let items: { variant_id: string; quantity: number }[];
  try {
    items = (JSON.parse(text(form, "items", 20000)) as { variant_id: string; quantity: number }[])
      .map((i) => ({ variant_id: String(i.variant_id), quantity: Math.floor(Number(i.quantity)) }))
      .filter((i) => i.quantity > 0);
  } catch {
    items = [];
  }
  if (items.length === 0) return { ok: false, error: "Your cart is empty." };

  // Before the database is connected: price the order from the built-in list
  // so the customer can still send it to us on WhatsApp.
  if (!isServiceConfigured) {
    const lines: PlacedLine[] = [];
    for (const item of items) {
      const product = SEED_PRODUCTS.find((p) => p.variants.some((v) => v.id === item.variant_id));
      const variant = product?.variants.find((v) => v.id === item.variant_id);
      if (!product || !variant) return { ok: false, error: "A product in your cart is no longer available. Please remove it." };
      lines.push({ product: product.name, variant: variant.name, unit: product.unit, price: variant.price, quantity: item.quantity });
    }
    const subtotal = lines.reduce((n, l) => n + l.price * l.quantity, 0);
    const delivery = deliveryFeeFor(subtotal, customer.city, settings);
    return { ok: true, orderNo: null, lines, subtotal, delivery, total: subtotal + (delivery ?? 0), paymentMethod: method, customer };
  }

  if (items.some((i) => !UUID.test(i.variant_id))) {
    return { ok: false, error: "Your cart has items from an older version of the shop. Please empty your cart and add them again." };
  }

  const supabase = createServiceClient();

  let proofPath: string | null = null;
  if (hasProof) {
    const month = new Date().toISOString().slice(0, 7);
    proofPath = `${month}/${randomUUID()}.${PROOF_TYPES[proof.type]}`;
    const { error } = await supabase.storage.from("payment-proofs").upload(proofPath, proof, { contentType: proof.type });
    if (error) {
      console.error("proof upload", error.message);
      return { ok: false, error: "We couldn't upload your screenshot. Please try again, or add the transaction ID instead." };
    }
  }

  const { data, error } = await supabase.rpc("place_order", {
    p_customer: customer,
    p_items: items,
    p_payment: { method, reference, proof_path: proofPath },
  });

  if (error || !data?.[0]) {
    if (proofPath) await supabase.storage.from("payment-proofs").remove([proofPath]);
    console.error("place_order", error?.message);
    // Messages raised inside place_order (stock, availability) are written for customers.
    const friendly = error?.message && /left of|no longer available|cart is empty|Invalid quantity/.test(error.message);
    return { ok: false, error: friendly ? error!.message : "Something went wrong placing your order. Please try again or order on WhatsApp." };
  }

  const { order_id } = data[0] as { order_id: string; order_number: number };
  const { data: order } = await supabase
    .from("orders")
    .select("order_no, items, subtotal, delivery_fee, total")
    .eq("id", order_id)
    .single();

  const lines = (order!.items as PlacedLine[]).map(({ product, variant, unit, price, quantity }) => ({ product, variant, unit, price, quantity }));

  await sendOrderAlert({
    orderId: order_id,
    orderNo: order!.order_no,
    to: settings.email,
    customer,
    lines,
    subtotal: order!.subtotal,
    delivery: order!.delivery_fee,
    total: order!.total,
    paymentMethod: method,
    reference,
    hasProof,
  });

  return {
    ok: true,
    orderNo: order!.order_no,
    lines,
    subtotal: order!.subtotal,
    delivery: order!.delivery_fee,
    total: order!.total,
    paymentMethod: method,
    customer,
  };
}
