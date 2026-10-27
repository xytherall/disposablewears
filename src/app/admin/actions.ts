"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CATEGORIES } from "@/lib/catalog";
import { requireAdmin } from "@/lib/admin";

export type ActionState = { error?: string; message?: string };

const text = (form: FormData, key: string, max = 500) => String(form.get(key) ?? "").trim().slice(0, max);
const int = (form: FormData, key: string) => {
  const n = Math.round(Number(String(form.get(key) ?? "").replace(/[^\d.-]/g, "")));
  return Number.isFinite(n) ? n : 0;
};

// Shop pages are cached for a minute; refresh them right away after a change.
function refreshShop() {
  revalidatePath("/", "layout");
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export async function updateOrder(orderId: string, _prev: ActionState, form: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();

  const status = text(form, "status");
  const { error: statusError } = await supabase.rpc("set_order_status", { p_order_id: orderId, p_status: status });
  if (statusError) return { error: statusError.message };

  const { data: order } = await supabase.from("orders").select("subtotal").eq("id", orderId).single();
  const feeRaw = text(form, "delivery_fee");
  const deliveryFee = feeRaw === "" ? null : Math.max(0, int(form, "delivery_fee"));

  const { error } = await supabase
    .from("orders")
    .update({
      payment_status: text(form, "payment_status"),
      delivery_fee: deliveryFee,
      total: (order?.subtotal ?? 0) + (deliveryFee ?? 0),
      admin_notes: text(form, "admin_notes", 2000) || null,
    })
    .eq("id", orderId);
  if (error) return { error: error.message };

  revalidatePath("/admin", "layout");
  return { message: "Order saved." };
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

type VariantInput = { id?: string; name: string; price: number; stock: number };

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const IMAGE_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export async function saveProduct(productId: string | null, _prev: ActionState, form: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();

  const name = text(form, "name", 160);
  const category = text(form, "category");
  if (!name) return { error: "Please enter a product name." };
  if (!CATEGORIES.some((c) => c.slug === category)) return { error: "Please choose a category." };

  let variants: VariantInput[];
  try {
    variants = (JSON.parse(text(form, "variants", 20000)) as VariantInput[])
      .map((v) => ({
        id: v.id || undefined,
        name: String(v.name ?? "").trim().slice(0, 80),
        price: Math.max(0, Math.round(Number(v.price) || 0)),
        stock: Math.max(0, Math.round(Number(v.stock) || 0)),
      }))
      .filter((v) => v.name);
  } catch {
    variants = [];
  }
  if (variants.length === 0) return { error: "Add at least one option with a name and price (e.g. Blue, Rs 300)." };
  if (variants.some((v) => v.price <= 0)) return { error: "Every option needs a price above 0." };

  const fields = {
    name,
    slug: slugify(text(form, "slug", 80) || name),
    category,
    short_description: text(form, "short_description", 300),
    description: text(form, "description", 3000),
    features: text(form, "features", 3000)
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean),
    unit: text(form, "unit", 80) || "1 piece",
    art: text(form, "art", 40) || null,
    featured: form.get("featured") === "on",
    active: form.get("active") === "on",
    sort: int(form, "sort"),
  };
  if (!fields.slug) return { error: "Please enter a product name using English letters or numbers." };

  // Save the product row.
  let id = productId;
  if (id) {
    const { error } = await supabase.from("products").update(fields).eq("id", id);
    if (error) return { error: error.code === "23505" ? "Another product already uses this web address (slug)." : error.message };
  } else {
    const { data, error } = await supabase.from("products").insert(fields).select("id").single();
    if (error) return { error: error.code === "23505" ? "Another product already uses this web address (slug)." : error.message };
    id = data.id as string;
  }

  // Photo: upload a new one, or remove the current one.
  const photo = form.get("photo");
  if (photo instanceof File && photo.size > 0) {
    if (!IMAGE_TYPES[photo.type]) return { error: "The photo must be a JPG, PNG or WebP image." };
    if (photo.size > 3.5 * 1024 * 1024) return { error: "The photo must be under 3.5 MB." };
    const path = `${id}/${randomUUID()}.${IMAGE_TYPES[photo.type]}`;
    const { error } = await supabase.storage.from("product-images").upload(path, photo, { contentType: photo.type });
    if (error) return { error: `Photo upload failed: ${error.message}` };
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    await supabase.from("products").update({ image_url: data.publicUrl }).eq("id", id);
  } else if (form.get("remove_photo") === "on") {
    await supabase.from("products").update({ image_url: null }).eq("id", id);
  }

  // Options (colour / size / pack): update, add and remove to match the form.
  const { data: existing } = await supabase.from("product_variants").select("id").eq("product_id", id);
  const keep = new Set(variants.filter((v) => v.id).map((v) => v.id));
  const removed = (existing ?? []).map((v) => v.id as string).filter((vid) => !keep.has(vid));
  if (removed.length) {
    const { error } = await supabase.from("product_variants").delete().in("id", removed);
    if (error) return { error: error.message };
  }
  for (const [i, v] of variants.entries()) {
    const row = { product_id: id, name: v.name, price: v.price, stock: v.stock, sort: i };
    const { error } = v.id
      ? await supabase.from("product_variants").update(row).eq("id", v.id)
      : await supabase.from("product_variants").insert(row);
    if (error) return { error: error.message };
  }

  refreshShop();
  revalidatePath("/admin", "layout");
  if (!productId) redirect(`/admin/products/${id}?saved=1`);
  return { message: "Product saved. The shop is updated." };
}

export async function deleteProduct(productId: string) {
  const { supabase } = await requireAdmin();
  const { data: files } = await supabase.storage.from("product-images").list(productId);
  if (files?.length) await supabase.storage.from("product-images").remove(files.map((f) => `${productId}/${f.name}`));
  await supabase.from("products").delete().eq("id", productId);
  refreshShop();
  redirect("/admin/products");
}

export async function setProductActive(productId: string, active: boolean) {
  const { supabase } = await requireAdmin();
  await supabase.from("products").update({ active }).eq("id", productId);
  refreshShop();
  revalidatePath("/admin/products");
}

// ---------------------------------------------------------------------------
// Quotes
// ---------------------------------------------------------------------------

export async function setQuoteStatus(quoteId: string, form: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("quote_requests").update({ status: text(form, "status") }).eq("id", quoteId);
  revalidatePath("/admin", "layout");
}

// ---------------------------------------------------------------------------
// Store settings
// ---------------------------------------------------------------------------

const SETTING_TEXT = [
  "whatsapp",
  "phone",
  "email",
  "address",
  "free_delivery_city",
  "bank_name",
  "bank_account_title",
  "bank_account_no",
  "bank_iban",
  "jazzcash_no",
  "jazzcash_name",
  "easypaisa_no",
  "easypaisa_name",
  "facebook_url",
  "instagram_url",
  "announcement",
] as const;

export async function saveSettings(_prev: ActionState, form: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();

  const values: Record<string, string | number> = {};
  for (const key of SETTING_TEXT) values[key] = text(form, key, 300);
  values.whatsapp = String(values.whatsapp).replace(/\D/g, "");
  if (String(values.whatsapp).startsWith("0")) values.whatsapp = `92${String(values.whatsapp).slice(1)}`;
  if (String(values.whatsapp).length < 11) return { error: "Enter the WhatsApp number with country code, e.g. 923001455129." };
  for (const key of ["facebook_url", "instagram_url"] as const) {
    const url = String(values[key]);
    if (url && !/^https?:\/\//.test(url)) values[key] = `https://${url}`;
  }
  values.delivery_fee = Math.max(0, int(form, "delivery_fee"));
  values.free_delivery_min = Math.max(0, int(form, "free_delivery_min"));

  const { error } = await supabase.from("store_settings").update(values).eq("id", 1);
  if (error) return { error: error.message };

  refreshShop();
  return { message: "Settings saved. The shop is updated." };
}

// ---------------------------------------------------------------------------
// Account
// ---------------------------------------------------------------------------

export async function changePassword(_prev: ActionState, form: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const password = String(form.get("password") ?? "");
  const confirm = String(form.get("confirm") ?? "");
  if (password.length < 8) return { error: "Use at least 8 characters." };
  if (password !== confirm) return { error: "The two passwords don't match." };
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  return { message: "Password changed." };
}
