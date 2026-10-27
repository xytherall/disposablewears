import "server-only";
import { DEFAULT_SETTINGS, SEED_PRODUCTS } from "./catalog";
import { isSupabaseConfigured } from "./supabase/config";
import { createPublicClient } from "./supabase/public";
import type { Product, StoreSettings } from "./types";

// Shop data is read from Supabase. Until Supabase is connected, the built-in
// catalogue is shown so the site still works as a preview.

const PRODUCT_SELECT = "*, variants:product_variants(id, name, price, stock, sort)";

function sortVariants(p: Product): Product {
  return { ...p, variants: [...(p.variants ?? [])].sort((a, b) => a.sort - b.sort) };
}

export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) return SEED_PRODUCTS;
  const { data, error } = await createPublicClient()
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("active", true)
    .order("sort")
    .order("name");
  if (error) {
    console.error("getProducts", error.message);
    return [];
  }
  return (data as Product[]).map(sortVariants);
}

export async function getProduct(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured) return SEED_PRODUCTS.find((p) => p.slug === slug) ?? null;
  const { data, error } = await createPublicClient()
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  if (error) console.error("getProduct", error.message);
  return data ? sortVariants(data as Product) : null;
}

export async function getSettings(): Promise<StoreSettings> {
  if (!isSupabaseConfigured) return DEFAULT_SETTINGS;
  const { data, error } = await createPublicClient().from("store_settings").select("*").eq("id", 1).maybeSingle();
  if (error) console.error("getSettings", error.message);
  return { ...DEFAULT_SETTINGS, ...(data ?? {}) };
}
